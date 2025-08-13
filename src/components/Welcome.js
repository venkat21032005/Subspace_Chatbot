import React from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-800">
      <FiMessageSquare className="w-24 h-24 mb-4 text-gray-600" />
      <h2 className="text-2xl font-semibold text-gray-300">Welcome to your AI Chatbot!</h2>
      <p className="text-gray-400">Select a chat or create a new one to start a conversation.</p>
    </div>
  );
};

export default Welcome;
