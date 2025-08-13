import { useQuery, useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { GET_CHAT_DETAILS } from '../graphql/queries';
import { SEND_MESSAGE } from '../graphql/mutations';
import { useChatbot } from './useChatbot';

export const useMessages = (chatId) => {
  const { data, loading, error, refetch } = useQuery(GET_CHAT_DETAILS, {
    variables: { chatId },
    skip: !chatId,
    fetchPolicy: 'cache-and-network',
  });

  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    // Refetch the entire chat details query after sending a message
    // This ensures both the user's message and the bot's response appear
    refetchQueries: [
      { query: GET_CHAT_DETAILS, variables: { chatId } },
    ],
  });

  const { triggerChatbot, loading: chatbotLoading } = useChatbot();

  const sendMessage = useCallback(async (content) => {
    if (!chatId || !content.trim()) {
      throw new Error('Chat ID and message content are required');
    }

    try {
      // Send the user's message. The refetch will handle UI updates.
      await sendMessageMutation({
        variables: {
          chatId,
          content: content.trim(),
        },
      });

      // Trigger the chatbot in the background
      await triggerChatbot(chatId, content.trim());

      // Manually refetch one more time after the bot has likely responded
      setTimeout(() => refetch(), 1200); // A small delay to catch the bot's message

    } catch (err) {
      console.error('Error in sendMessage flow:', err);
      throw err;
    }
  }, [chatId, sendMessageMutation, triggerChatbot, refetch]);

  const chat = data?.chats_by_pk;
  const messages = chat?.messages || [];

  return {
    chat,
    messages,
    loading,
    error,
    sendMessage,
    sendingMessage: sendingMessage || chatbotLoading,
  };
};