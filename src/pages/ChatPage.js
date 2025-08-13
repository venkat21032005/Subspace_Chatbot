import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatView from '../components/ChatView';
import ChatLayout from '../components/ChatLayout';
import Welcome from '../components/Welcome';

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const handleSelectChat = (id) => {
    navigate(`/chat/${id}`);
  };

  const handleNewChat = (newChat) => {
    if (newChat?.id) {
      navigate(`/chat/${newChat.id}`);
    }
  };

  return (
    <ChatLayout
      sidebar={
        <ChatList
          selectedChatId={chatId}
          onChatSelect={handleSelectChat}
          onNewChat={handleNewChat}
        />
      }
      chatWindow={
        chatId ? <ChatView chatId={chatId} key={chatId} /> : <Welcome />
      }
    />
  );
};

export default ChatPage;
