import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMessages } from '../hooks/useMessages';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import Welcome from './Welcome'; // Assuming Welcome component exists for the initial screen

const ChatView = React.memo(({ chatId }) => {
  const { messages, chat, loading, error, sendMessage, sendingMessage } = useMessages(chatId);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const memoizedMessages = useMemo(() => messages, [messages]);

  useEffect(() => {
    if (shouldAutoScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [memoizedMessages]);

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      shouldAutoScrollRef.current = isAtBottom;
    }
  }, []);

  const handleSendMessage = async (content) => {
    try {
      await sendMessage(content);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  // Case: Navigated to a chat ID but data is not loaded yet
  if (loading && !chat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Loading chat...</p>
      </div>
    );
  }

  // Case: No chat selected at all
  if (!chatId || !chat) {
    return <Welcome />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="p-4 border-b border-gray-700 shadow-md">
        <h2 className="text-xl font-bold">{chat.title}</h2>
        <p className="text-sm text-gray-400">{memoizedMessages.length} messages</p>
      </div>

      <div
        className="flex-grow p-4 overflow-y-auto"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {memoizedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-4xl mb-4">ðŸ¤–</div>
            <h3 className="text-lg font-semibold">Start a conversation!</h3>
            <p>Send your first message to begin chatting.</p>
          </div>
        ) : (
          <>
            {memoizedMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={sendingMessage}
          placeholder={sendingMessage ? 'Sending...' : 'Type your message...'}
        />
      </div>
    </div>
  );
});

export default ChatView;