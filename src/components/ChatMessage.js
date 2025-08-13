import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// This regex will find code blocks with optional language specification, e.g., ```python
const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/s;

const ChatMessage = ({ message }) => {
  const { content, is_bot } = message;
  const [copied, setCopied] = useState(false);

  const match = content.match(codeBlockRegex);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const renderContent = () => {
    if (!match) {
      // No code block found, render plain text.
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    // A code block was found. Render text before, the code block, and text after.
    const beforeText = content.substring(0, match.index);
    const language = match[1] || 'text';
    const code = match[2].trim();
    const afterText = content.substring(match.index + match[0].length);

    return (
      <>
        {beforeText && <p className="whitespace-pre-wrap">{beforeText}</p>}
        <div className="code-block bg-[#0d1117] rounded-lg my-2 text-sm font-mono">
          <div className="flex justify-between items-center px-4 py-1 bg-gray-700 rounded-t-lg">
            <span className="text-xs text-gray-400 capitalize">{language}</span>
            <CopyToClipboard text={code} onCopy={handleCopy}>
              <button className="text-xs text-gray-400 hover:text-white focus:outline-none">
                {copied ? 'Copied!' : 'Copy code'}
              </button>
            </CopyToClipboard>
          </div>
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            customStyle={{ margin: 0, padding: '1rem', borderRadius: '0 0 0.5rem 0.5rem' }}
            codeTagProps={{ className: 'text-sm' }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        {afterText && <p className="whitespace-pre-wrap">{afterText}</p>}
      </>
    );
  };

  return (
    <div className={`flex my-3 ${!is_bot ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-start gap-3 max-w-3xl">
        {is_bot && (
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
            <span role="img" aria-label="bot">🤖</span>
          </div>
        )}
        <div
          className={`p-4 rounded-2xl shadow-md ${!is_bot
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-[#1e1e1e] text-gray-200 border border-gray-700 rounded-bl-none'
            }`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
