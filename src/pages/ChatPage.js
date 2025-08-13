import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import ChatView from '../components/ChatView';
import Welcome from '../components/Welcome';
import { useAuth } from '../contexts/AuthContext';

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [selectedChatId, setSelectedChatId] = useState(chatId);

  useEffect(() => {
    setSelectedChatId(chatId);
  }, [chatId]);

  const handleSelectChat = (id) => {
    navigate(`/chat/${id}`);
  };

  const handleNewChat = (newChat) => {
    if (newChat?.id) {
      navigate(`/chat/${newChat.id}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-4 flex flex-col shadow-lg">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Chats</h1>
          {user && <p className="text-sm text-gray-400 truncate">Welcome, {user.email}</p>}
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
          <ChatList
            selectedChatId={selectedChatId}
            onChatSelect={handleSelectChat}
            onNewChat={handleNewChat}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-3/4 flex flex-col">
        {selectedChatId ? (
          <ChatView key={selectedChatId} chatId={selectedChatId} />
        ) : (
          <Welcome />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
