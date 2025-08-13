import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '../hooks/useMessages';
import ChatMessage from './ChatMessage'; // Import the new message component

const ChatView = ({ chatId }) => {
  const { chat, loading, error, sendMessage } = useMessages(chatId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }); // Use 'auto' for instant scroll
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setNewMessage(''); // Clear input immediately for better UX
      await sendMessage(newMessage);
    } catch (err) {
      console.error('Failed to send message:', err);
      setNewMessage(newMessage); // Restore message on error
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading conversation...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-400">Error: {error.message}</div>;
  }

  if (!chat) {
    return <div className="flex items-center justify-center h-full text-gray-400">Select a chat to begin.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-black bg-opacity-20 backdrop-blur-sm">
      {/* Chat Header */}
      <header className="flex-shrink-0 p-4 border-b border-gray-700 bg-black bg-opacity-30">
        <h2 className="text-lg font-semibold text-white truncate">{chat.title}</h2>
      </header>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {chat.messages && chat.messages.length > 0 ? (
            chat.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          ) : (
            <div className="text-center text-gray-500">No messages in this chat yet.</div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-6 border-t border-gray-800 bg-black bg-opacity-20">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center bg-gray-800 rounded-xl p-2 border border-gray-700 focus-within:ring-2 focus-within:ring-blue-500">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-transparent focus:outline-none text-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
              disabled={!newMessage.trim() || loading}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatView;