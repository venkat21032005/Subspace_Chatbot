import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { useEffect, useRef, useCallback } from 'react';
import { GET_CHAT_MESSAGES, SUBSCRIBE_TO_MESSAGES } from '../graphql/queries';
import { SEND_MESSAGE } from '../graphql/mutations';
import { useChatbot } from './useChatbot';
import { useAuth } from '../contexts/AuthContext';

export const useMessages = (chatId) => {
  const subscriptionRef = useRef(null);
  const { user } = useAuth();
  
  // Query for initial messages with pagination
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Subscription for real-time updates with cleanup
  const { data: subscriptionData } = useSubscription(SUBSCRIBE_TO_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
    onSubscriptionData: ({ subscriptionData }) => {
      // Optimize subscription updates
      if (subscriptionData?.data?.messages) {
        subscriptionRef.current = subscriptionData.data.messages;
      }
    },
  });

  // Mutation for sending messages - removed optimistic updates to fix cache issue
  const [sendMessageMutation, { loading: sendingMessage }] = useMutation(SEND_MESSAGE, {
    errorPolicy: 'all',
    // Removed optimistic response to prevent Apollo Client cache issues
    // The message will appear when the server responds or via subscription
    refetchQueries: [
      {
        query: GET_CHAT_MESSAGES,
        variables: { chatId },
      },
    ],
  });

  // Chatbot integration
  const { triggerChatbot, loading: chatbotLoading } = useChatbot();

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current = null;
      }
    };
  }, []);

  const sendMessage = useCallback(async (content) => {
    if (!chatId || !content.trim()) {
      throw new Error('Chat ID and message content are required');
    }

    try {
      // First, send the user message
      const result = await sendMessageMutation({
        variables: {
          chatId,
          content: content.trim(),
        },
      });

      const userMessage = result.data?.insert_messages_one;

      // Then trigger the chatbot response (non-blocking)
      if (userMessage) {
        // Use setTimeout to make chatbot call non-blocking
        setTimeout(async () => {
          try {
            console.log('🤖 Triggering chatbot...');
            await triggerChatbot(chatId, content.trim());
            console.log('✅ Chatbot responded successfully, refetching messages...');
            
            // Refetch messages after chatbot responds to ensure we see the bot message
            setTimeout(() => {
              refetch();
            }, 1000); // Wait 1 second for the bot message to be saved
            
          } catch (chatbotError) {
            console.error('Chatbot failed to respond:', chatbotError);
          }
        }, 100); // Small delay to ensure user message is saved
      }

      return userMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [chatId, sendMessageMutation, triggerChatbot, user?.id, refetch]);

  // Use subscription data if available, otherwise use query data
  const messages = subscriptionData?.messages || data?.messages || [];
  
  // Debug logging
  useEffect(() => {
    console.log('📊 Messages updated:', {
      subscriptionMessages: subscriptionData?.messages?.length || 0,
      queryMessages: data?.messages?.length || 0,
      totalMessages: messages.length,
      chatId
    });
  }, [messages.length, subscriptionData, data, chatId]);

  // Memoize the return object to prevent unnecessary re-renders
  return {
    messages,
    loading,
    error,
    sendMessage,
    sendingMessage: sendingMessage || chatbotLoading,
    fetchMore, // For pagination
  };
};