import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { GET_USER_CHATS, GET_CHAT_MESSAGES } from '../graphql/queries';
import { CREATE_CHAT, SEND_MESSAGE } from '../graphql/mutations';

// Mock Nhost hooks
jest.mock('@nhost/react', () => ({
  NhostProvider: ({ children }) => children,
  useAuthenticationStatus: () => ({ isAuthenticated: true, isLoading: false }),
  useUserData: () => ({ id: 'user-1', email: 'test@example.com' }),
  useSignOut: () => ({ signOut: jest.fn() }),
  useSignInEmailPassword: () => ({
    signInEmailPassword: jest.fn().mockResolvedValue({ isSuccess: true }),
    isLoading: false,
    error: null,
  }),
  useSignUpEmailPassword: () => ({
    signUpEmailPassword: jest.fn().mockResolvedValue({ isSuccess: true }),
    isLoading: false,
    error: null,
  }),
}));

jest.mock('@nhost/react-apollo', () => ({
  NhostApolloProvider: ({ children }) => children,
}));

const mockChats = [
  {
    id: 'chat-1',
    title: 'Test Chat 1',
    created_at: '2023-01-01T10:00:00Z',
    updated_at: '2023-01-01T10:00:00Z',
    messages_aggregate: { aggregate: { count: 2 } },
  },
  {
    id: 'chat-2',
    title: 'Test Chat 2',
    created_at: '2023-01-01T11:00:00Z',
    updated_at: '2023-01-01T11:00:00Z',
    messages_aggregate: { aggregate: { count: 0 } },
  },
];

const mockMessages = [
  {
    id: 'msg-1',
    content: 'Hello!',
    is_bot: false,
    created_at: '2023-01-01T10:00:00Z',
    user: { id: 'user-1', email: 'test@example.com' },
  },
  {
    id: 'msg-2',
    content: 'Hi there! How can I help you?',
    is_bot: true,
    created_at: '2023-01-01T10:01:00Z',
    user: { id: 'user-1', email: 'test@example.com' },
  },
];

const mocks = [
  {
    request: {
      query: GET_USER_CHATS,
    },
    result: {
      data: {
        chats: mockChats,
      },
    },
  },
  {
    request: {
      query: GET_CHAT_MESSAGES,
      variables: { chatId: 'chat-1' },
    },
    result: {
      data: {
        messages: mockMessages,
      },
    },
  },
  {
    request: {
      query: CREATE_CHAT,
      variables: { title: 'New Chat' },
    },
    result: {
      data: {
        insert_chats_one: {
          id: 'chat-3',
          title: 'New Chat',
          created_at: '2023-01-01T12:00:00Z',
          updated_at: '2023-01-01T12:00:00Z',
        },
      },
    },
  },
  {
    request: {
      query: SEND_MESSAGE,
      variables: { chatId: 'chat-1', content: 'Test message' },
    },
    result: {
      data: {
        insert_messages_one: {
          id: 'msg-3',
          content: 'Test message',
          is_bot: false,
          created_at: '2023-01-01T10:02:00Z',
          chat_id: 'chat-1',
        },
      },
    },
  },
];

const renderApp = () => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MockedProvider>
  );
};

describe('Integration Tests', () => {
  test('renders chat application with authentication', async () => {
    renderApp();

    // Should show the main chat interface
    await waitFor(() => {
      expect(screen.getByText('Chats')).toBeInTheDocument();
      expect(screen.getByText('Welcome, test@example.com')).toBeInTheDocument();
    });
  });

  test('displays chat list and allows chat selection', async () => {
    renderApp();

    // Wait for chats to load
    await waitFor(() => {
      expect(screen.getByText('Test Chat 1')).toBeInTheDocument();
      expect(screen.getByText('Test Chat 2')).toBeInTheDocument();
    });

    // Click on first chat
    fireEvent.click(screen.getByText('Test Chat 1'));

    // Should show chat messages
    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument();
      expect(screen.getByText('Hi there! How can I help you?')).toBeInTheDocument();
    });
  });

  test('allows creating new chat', async () => {
    renderApp();

    // Wait for UI to load
    await waitFor(() => {
      expect(screen.getByText('+ New Chat')).toBeInTheDocument();
    });

    // Click new chat button
    fireEvent.click(screen.getByText('+ New Chat'));

    // Should create new chat (mocked)
    await waitFor(() => {
      // The new chat would be selected and shown
      expect(screen.getByText('New Chat')).toBeInTheDocument();
    });
  });

  test('handles message sending flow', async () => {
    renderApp();

    // Wait for chats to load and select first chat
    await waitFor(() => {
      expect(screen.getByText('Test Chat 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Test Chat 1'));

    // Wait for messages to load
    await waitFor(() => {
      expect(screen.getByText('Hello!')).toBeInTheDocument();
    });

    // Find message input and send button
    const messageInput = screen.getByPlaceholderText(/Type your message/);
    const sendButton = screen.getByText('Send');

    // Type and send message
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Message should be sent (mocked)
    await waitFor(() => {
      expect(messageInput.value).toBe(''); // Input should be cleared
    });
  });

  test('shows proper error states', async () => {
    const errorMocks = [
      {
        request: {
          query: GET_USER_CHATS,
        },
        error: new Error('Network error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MockedProvider>
    );

    // Should show error state
    await waitFor(() => {
      expect(screen.getByText(/Error loading chats/)).toBeInTheDocument();
    });
  });

  test('responsive design elements are present', () => {
    renderApp();

    // Check for responsive classes and structure
    const chatContainer = document.querySelector('.chat-container');
    const chatSidebar = document.querySelector('.chat-sidebar');
    const chatMain = document.querySelector('.chat-main');

    expect(chatContainer).toBeInTheDocument();
    expect(chatSidebar).toBeInTheDocument();
    expect(chatMain).toBeInTheDocument();
  });
});