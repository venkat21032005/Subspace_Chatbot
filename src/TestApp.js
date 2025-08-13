import React, { useState } from 'react';
import './index.css';

const TestApp = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, content: 'Welcome to the chatbot!', isBot: true },
    { id: 2, content: 'This is a test message', isBot: false },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        content: message,
        isBot: false,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          content: `You said: "${message}". This is a test response!`,
          isBot: true,
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
          <h3>Test Chatbot</h3>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Frontend test version
          </p>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ 
            padding: '0.75rem', 
            background: '#f8f9fa', 
            borderRadius: '5px',
            marginBottom: '0.5rem'
          }}>
            Test Chat 1
          </div>
          <div style={{ 
            padding: '0.75rem', 
            background: '#e9ecef', 
            borderRadius: '5px'
          }}>
            Test Chat 2
          </div>
        </div>
      </div>
      
      <div className="chat-main">
        <div className="chat-header">
          <h2>Test Chat</h2>
          <p style={{ color: '#666', fontSize: '0.875rem' }}>
            Testing frontend functionality
          </p>
        </div>
        
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.isBot ? 'bot' : 'user'}`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        
        <div className="chat-input">
          <form onSubmit={handleSendMessage} className="message-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestApp;