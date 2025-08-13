import React, { useState } from 'react';
import { useChats } from '../hooks/useChats';
import { useAuth } from '../contexts/AuthContext';

const ChatList = ({ selectedChatId, onChatSelect, onNewChat }) => {
  const { chats = [], loading, error, createChat } = useChats();
  const { user, signOut } = useAuth();
  const [creatingChat, setCreatingChat] = useState(false);

  const handleCreateChat = async () => {
    setCreatingChat(true);
    try {
      const newChat = await createChat({ title: 'New Conversation' });
      if (newChat && onNewChat) {
        onNewChat(newChat);
      }
    } catch (err) {
      console.error('Error creating chat:', err.message);
    } finally {
      setCreatingChat(false);
    }
  };

  const getTruncatedMessage = (messages) => {
    if (!messages || messages.length === 0) return 'No messages yet...';
    const lastMessage = messages[messages.length - 1];
    return lastMessage.content.length > 30
      ? `${lastMessage.content.substring(0, 30)}...`
      : lastMessage.content;
  };

  if (error) return <div className="p-4 text-red-400">Error: {error.message}</div>;

  return (
    <div className="flex flex-col h-full text-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">Chats</h1>
        <button
          onClick={handleCreateChat}
          disabled={creatingChat}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
          title="New Chat"
        >
          {creatingChat ? '...' : '➕'}
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-grow overflow-y-auto">
        {loading && chats.length === 0 ? (
          <div className="p-4 text-center text-gray-400">Loading...</div>
        ) : (
          <ul className="space-y-1 p-2">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 border-l-4 ${selectedChatId === chat.id
                      ? 'bg-gray-700 border-blue-500'
                      : 'border-transparent hover:bg-gray-800'
                    }`}
                >
                  <h2 className="font-semibold truncate">{chat.title}</h2>
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {getTruncatedMessage(chat.messages)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* User/Sign Out Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            {user?.email?.charAt(0).toUpperCase() || 'V'}
          </div>
          <div className="flex-1 truncate">
            <p className="font-semibold">{user?.displayName || 'Venkat C.'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            title="Sign Out"
          >
            <span role="img" aria-label="Sign Out">[←</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
