import React, { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_CHATS } from '../graphql/queries';
import { CREATE_CHAT, UPDATE_CHAT_TITLE, DELETE_CHAT } from '../graphql/mutations';

export const useChats = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_CHATS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error('Error fetching chats:', error);
    },
  });

  // Transform the data to ensure it's always in the expected format
  const chats = useMemo(() => {
    if (!data?.chats) return [];
    return data.chats.map(chat => ({
      ...chat,
      // Add a default messages array if not present
      messages: chat.messages || [],
      // Add a messageCount based on the messages array
      messageCount: chat.messages?.length || 0
    }));
  }, [data]);

  const [createChatMutation] = useMutation(CREATE_CHAT, {
    refetchQueries: [{ query: GET_USER_CHATS }],
    errorPolicy: 'all',
  });

  const [updateChatTitleMutation] = useMutation(UPDATE_CHAT_TITLE, {
    errorPolicy: 'all',
  });

  const [deleteChatMutation] = useMutation(DELETE_CHAT, {
    refetchQueries: [{ query: GET_USER_CHATS }],
    errorPolicy: 'all',
  });

  const createChat = async (title = 'New Chat') => {
    try {
      const result = await createChatMutation({
        variables: { title },
      });
      return result.data?.insert_chats_one;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  };

  const updateChatTitle = async (chatId, title) => {
    try {
      const result = await updateChatTitleMutation({
        variables: { chatId, title },
      });
      return result.data?.update_chats_by_pk;
    } catch (error) {
      console.error('Error updating chat title:', error);
      throw error;
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const result = await deleteChatMutation({
        variables: { chatId },
      });
      return result.data?.delete_chats_by_pk;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  };

  return {
    chats: data?.chats || [],
    loading,
    error,
    refetch,
    createChat,
    updateChatTitle,
    deleteChat,
  };
};