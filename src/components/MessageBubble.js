import React from 'react';

const MessageBubble = React.memo(({ message }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isBot = message.is_bot;

  return (
    <div
      role="listitem"
      aria-label={isBot ? 'Bot message' : 'Your message'}
      style={{
        display: 'flex',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        marginBottom: '1rem',
      }}
    >
      <div className={`message ${isBot ? 'bot' : 'user'}`}>
        <div>{message.content}</div>
        <div className="message-meta" aria-hidden="true">
          {formatTime(message.created_at)}
        </div>
        {isBot && (
          <div className="message-submeta" aria-hidden="true">
            AI Assistant
          </div>
        )}
      </div>
    </div>
  );
});

export default MessageBubble;