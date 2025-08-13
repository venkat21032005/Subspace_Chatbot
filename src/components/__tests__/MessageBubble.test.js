import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageBubble from '../MessageBubble';

describe('MessageBubble', () => {
  const mockUserMessage = {
    id: '1',
    content: 'Hello, this is a user message',
    is_bot: false,
    created_at: '2023-01-01T12:00:00Z',
  };

  const mockBotMessage = {
    id: '2',
    content: 'Hello, this is a bot response',
    is_bot: true,
    created_at: '2023-01-01T12:01:00Z',
  };

  test('renders user message correctly', () => {
    render(<MessageBubble message={mockUserMessage} />);
    
    expect(screen.getByText('Hello, this is a user message')).toBeInTheDocument();
    expect(screen.getByText('12:00 PM')).toBeInTheDocument();
    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument();
  });

  test('renders bot message correctly', () => {
    render(<MessageBubble message={mockBotMessage} />);
    
    expect(screen.getByText('Hello, this is a bot response')).toBeInTheDocument();
    expect(screen.getByText('12:01 PM')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  test('applies correct styling for user messages', () => {
    const { container } = render(<MessageBubble message={mockUserMessage} />);
    const messageContainer = container.firstChild;
    
    expect(messageContainer).toHaveStyle('justify-content: flex-end');
  });

  test('applies correct styling for bot messages', () => {
    const { container } = render(<MessageBubble message={mockBotMessage} />);
    const messageContainer = container.firstChild;
    
    expect(messageContainer).toHaveStyle('justify-content: flex-start');
  });
});