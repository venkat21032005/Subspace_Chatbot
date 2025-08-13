import React, { useState, useEffect, useRef } from 'react';
import { useChats } from '../hooks/useChats';
import { useMessages } from '../hooks/useMessages';
import ChatMessage from '../components/ChatMessage';

export default function ChatPage() {
  const { chats, createChat, loading: chatsLoading } = useChats();
  const [activeChatId, setActiveChatId] = useState(null);

  const { 
    chat: activeChat,
    loading: messagesLoading,
    error: messagesError,
    sendMessage 
  } = useMessages(activeChatId);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleNewChat = async () => {
    try {
      const res = await createChat({ title: 'New Conversation' });
      if (res?.id) {
        setActiveChatId(res.id);
      }
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChatId) return;
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div 
      className="flex h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/motherboard.png')" }}
    >
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 bg-black bg-opacity-50 backdrop-blur-md flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={handleNewChat}
            className="w-full px-4 py-2 text-lg font-semibold bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200"
            disabled={chatsLoading}
          >
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chatsLoading ? (
            <p className="text-gray-400">Loading chats...</p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer truncate transition-colors duration-200 ${
                  activeChatId === chat.id
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-800'
                }`}
                onClick={() => setActiveChatId(chat.id)}
              >
                {chat.title || 'Untitled Chat'}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-black bg-opacity-30 backdrop-blur-sm">
        {activeChatId ? (
          <>
            <header className="flex-shrink-0 p-4 border-b border-gray-700 bg-black bg-opacity-30">
              <h2 className="text-lg font-semibold text-white truncate">
                {activeChat?.title || 'Chat'}
              </h2>
            </header>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                {messagesLoading && <p className="text-gray-400">Loading messages...</p>}
                {messagesError && <p className="text-red-400">Error: {messagesError.message}</p>}
                {activeChat?.messages?.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="flex-shrink-0 p-6 border-t border-gray-800 bg-black bg-opacity-20">
              <form onSubmit={handleSendMessage} className="flex items-center bg-gray-800 rounded-xl p-2 border border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 bg-transparent focus:outline-none text-white placeholder-gray-400"
                  disabled={messagesLoading}
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
                  disabled={!newMessage.trim() || messagesLoading}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-semibold text-gray-300">Welcome to the Chat</h2>
            <p className="text-gray-500 mt-2">Select a conversation or start a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
