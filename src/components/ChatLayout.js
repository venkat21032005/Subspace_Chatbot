import React from 'react';

const ChatLayout = ({ sidebar, chatWindow }) => {
  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 border-r border-gray-800 bg-[#141414]">
        {sidebar}
      </aside>

      {/* Chat Window */}
      <main
        className="flex-1 flex flex-col"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518779578993-ec3579fee39f?fit=crop&w=1950&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {chatWindow}
      </main>
    </div>
  );
};

export default ChatLayout;
