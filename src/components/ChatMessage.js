import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      style={atomDark}
      language={match[1]}
      PreTag="div"
      {...props}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

const ChatMessage = ({ message }) => {
  const { content, is_bot } = message;

  return (
    <div className={`message ${is_bot ? 'bot' : 'user'}`}>
      <ReactMarkdown components={{ code: CodeBlock }}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ChatMessage;
