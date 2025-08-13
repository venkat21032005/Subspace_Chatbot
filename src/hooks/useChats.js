import { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { GET_USER_CHATS } from '../graphql/queries';
import { CREATE_CHAT, UPDATE_CHAT_TITLE, DELETE_CHAT } from '../graphql/mutations';

export const useChats = () => {
  const { user } = useAuth();

  // Fetch chats for the logged-in user
  const { data, loading, error, refetch } = useQuery(GET_USER_CHATS, {
    variables: { userId: user?.id },
    skip: !user, // Skip query if user is not loaded
    fetchPolicy: 'cache-and-network',
  });

  // Memoize the chats array to prevent unnecessary re-renders
  const chats = useMemo(() => data?.chats || [], [data]);

  // Mutation for creating a new chat
  const [createChatMutation] = useMutation(CREATE_CHAT, {
    // Refetch the user's chats after a new one is created
    refetchQueries: [
      { query: GET_USER_CHATS, variables: { userId: user?.id } },
    ],
  });

  // Mutations for updating and deleting chats
  const [updateChatTitleMutation] = useMutation(UPDATE_CHAT_TITLE);
  const [deleteChatMutation] = useMutation(DELETE_CHAT);

  // Wrapper function for creating a chat that injects the user_id
  const createChat = (variables) => {
    if (!user?.id) {
      console.error('Authentication error: Cannot create chat without user ID.');
      return Promise.reject(new Error('User is not authenticated.'));
    }
    return createChatMutation({
      variables: {
        ...variables,
        user_id: user.id, // Ensure user_id is always included
      },
    });
  };

  // Wrapper for updating a chat title
  const updateChatTitle = (chatId, title) => {
    return updateChatTitleMutation({ variables: { chatId, title } });
  };

  // Wrapper for deleting a chat
  const deleteChat = (chatId) => {
    return deleteChatMutation({ 
      variables: { chatId },
      // Optimistically update the cache to remove the chat immediately
      update: (cache) => {
        cache.modify({
          fields: {
            chats(existingChats = [], { readField }) {
              return existingChats.filter(
                (chatRef) => chatId !== readField('id', chatRef)
              );
            },
          },
        });
      },
    });
  };

  return {
    chats,
    loading,
    error,
    refetch,
    createChat,
    updateChatTitle,
    deleteChat,
  };
};