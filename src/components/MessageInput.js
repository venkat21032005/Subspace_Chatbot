import React, { useState } from 'react';
import { validateMessage, sanitizeInput } from '../utils/validation';

const MessageInput = ({ onSendMessage, disabled = false, placeholder = 'Type your message...' }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const sanitizedMessage = sanitizeInput(message);
    const validationError = validateMessage(sanitizedMessage);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError('');
      await onSendMessage(sanitizedMessage);
      setMessage(''); // Clear input after successful send
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div>
      {error && (
        <div role="alert" className="error" style={{ backgroundColor: 'rgba(239,68,68,0.12)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.35)', marginBottom: '0.5rem' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="message-input" aria-label="Send message">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError(''); // Clear error when user starts typing
          }}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={1000}
          aria-label="Message input"
          aria-invalid={!!error}
          aria-describedby={error ? 'message-error' : undefined}
        />
        <button 
          type="submit" 
          disabled={disabled || !message.trim()}
          aria-label="Send message"
        >
          {disabled ? '...' : 'Send'}
        </button>
      </form>
      
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem', textAlign: 'right' }}>
        {message.length}/1000 characters
      </div>
    </div>
  );
};

export default MessageInput;