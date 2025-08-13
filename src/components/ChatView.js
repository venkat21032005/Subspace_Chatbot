import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useMessages } from '../hooks/useMessages';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const ChatView = React.memo(({ chat }) => {
  const { messages, loading, error, sendMessage, sendingMessage } = useMessages(chat?.id);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  // Memoize messages to prevent unnecessary re-renders
  const memoizedMessages = useMemo(() => messages, [messages]);

  // Auto-scroll to bottom when new messages arrive, but only if user is at bottom
  useEffect(() => {
    if (shouldAutoScrollRef.current && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [memoizedMessages]);

  // Track if user is scrolled to bottom
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      shouldAutoScrollRef.current = isAtBottom;
    }
  }, []);

  const handleSendMessage = async (content) => {
    try {
      await sendMessage(content);
      // The message will appear via subscription
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  if (!chat) {
    return (
      <div className="chat-main">
        <div className="chat-header">
          <h2>Chatbot Application</h2>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            Select a chat or create a new one to start chatting
          </p>
        </div>
        <div className="chat-messages">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#666',
            textAlign: 'center',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ fontSize: '3rem', opacity: 0.3 }}>💬</div>
            <div>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Welcome to your AI Chatbot!</h3>
              <p>Create a new chat or select an existing one to start a conversation.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-main">
      <div className="chat-header">
        <h2>{chat.title}</h2>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Chat with AI Assistant • {messages.length} messages
        </p>
      </div>
      
      <div 
        className="chat-messages"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {loading && messages.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <div>Loading messages...</div>
          </div>
        ) : error ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#e74c3c'
          }}>
            <div>Error loading messages: {error.message}</div>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            color: '#666',
            textAlign: 'center',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            <div style={{ fontSize: '2rem', opacity: 0.3 }}>🤖</div>
            <div>
              <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Start a conversation!</h4>
              <p>Send your first message to begin chatting with the AI assistant.</p>
            </div>
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
      
      <div className="chat-input">
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