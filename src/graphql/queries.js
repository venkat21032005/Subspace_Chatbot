import { gql } from '@apollo/client';

// Chat Queries
export const GET_USER_CHATS = gql`
  query GetUserChats {
    chats(order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      messages(order_by: { created_at: desc }, limit: 1) {
        id
        content
      }
    }
  }
`;

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`;

// Message Subscriptions
export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription SubscribeToMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      content
      is_bot
      created_at
      user_id
    }
  }
`;

export const GET_CHAT_DETAILS = gql`
  query GetChatDetails($chatId: uuid!) {
    chats_by_pk(id: $chatId) {
      id
      title
      created_at
      updated_at
      messages(order_by: { created_at: asc }) {
        id
        content
        is_bot
        created_at
        user_id
      }
    }
  }
`;