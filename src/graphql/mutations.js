import { gql } from '@apollo/client';

// Chat Mutations
export const CREATE_CHAT = gql`
  mutation CreateChat($title: String!, $user_id: uuid!) {
    insert_chats_one(object: { title: $title, user_id: $user_id }) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`;

export const UPDATE_CHAT_TITLE = gql`
  mutation UpdateChatTitle($chatId: uuid!, $title: String!) {
    update_chats_by_pk(pk_columns: { id: $chatId }, _set: { title: $title }) {
      id
      title
      updated_at
    }
  }
`;

export const DELETE_CHAT = gql`
  mutation DeleteChat($chatId: uuid!) {
    delete_chats_by_pk(id: $chatId) {
      id
    }
  }
`;

// Message Mutations
export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: uuid!, $content: String!) {
    insert_messages_one(object: { 
      chat_id: $chatId, 
      content: $content, 
      is_bot: false 
    }) {
      id
      content
      is_bot
      created_at
      chat_id
    }
  }
`;

export const INSERT_BOT_MESSAGE = gql`
  mutation InsertBotMessage($chatId: uuid!, $content: String!) {
    insert_messages_one(object: { 
      chat_id: $chatId, 
      content: $content, 
      is_bot: true 
    }) {
      id
      content
      is_bot
      created_at
      chat_id
    }
  }
`;

// Hasura Action for Chatbot
export const SEND_MESSAGE_TO_CHATBOT = gql`
  mutation SendMessageToChatbot($chatId: uuid!, $message: String!) {
    sendMessageToChatbot(chatId: $chatId, message: $message) {
      success
      message
      error
    }
  }
`;