import { useMutation } from '@apollo/client';
import { SEND_MESSAGE_TO_CHATBOT } from '../graphql/mutations';
import { isValidUUID } from '../utils/validation';

export const useChatbot = () => {
  const [sendToChatbot, { loading, error }] = useMutation(SEND_MESSAGE_TO_CHATBOT, {
    errorPolicy: 'all',
  });

  const triggerChatbot = async (chatId, message) => {
    if (!chatId || !message) {
      throw new Error('Chat ID and message are required');
    }

    // Validate UUID format
    if (!isValidUUID(chatId)) {
      throw new Error('Invalid chat ID format');
    }

    try {
      const result = await sendToChatbot({
        variables: {
          chatId,
          message,
        },
      });

      const response = result.data?.sendMessageToChatbot;
      
      if (!response) {
        throw new Error('No response from chatbot service');
      }
      
      if (!response.success) {
        throw new Error(response?.error || 'Chatbot service returned an error');
      }

      return response;
    } catch (error) {
      // Re-throw with more specific error message
      if (error.graphQLErrors?.length > 0) {
        throw new Error(`GraphQL Error: ${error.graphQLErrors[0].message}`);
      } else if (error.networkError) {
        throw new Error(`Network Error: ${error.networkError.message}`);
      } else {
        throw error;
      }
    }
  };

  return {
    triggerChatbot,
    loading,
    error,
  };
};