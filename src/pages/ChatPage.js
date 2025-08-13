import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChatList from '../components/ChatList';
import ChatView from '../components/ChatView';

const ChatPage = () => {
  const { user, signOut } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleNewChat = (newChat) => {
    setSelectedChat(newChat);
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Chats</h3>
          <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
            Welcome, {user?.email}
          </p>
          <button 
            onClick={handleSignOut}
            style={{ 
              marginTop: '1rem', 
              padding: '0.5rem 1rem', 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Sign Out
          </button>
        </div>
        
        <ChatList 
          selectedChatId={selectedChat?.id}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />
      </div>
      
      <ChatView chat={selectedChat} />
    </div>
  );
};

export default ChatPage;