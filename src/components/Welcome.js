import React from 'react';

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
      <div className="bg-gray-900 bg-opacity-30 p-10 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700">
        <h1 className="text-4xl font-bold text-white mb-4">Advanced Chatbot UI</h1>
        <p className="max-w-md">
          Select a chat from the sidebar or start a new conversation to begin.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
