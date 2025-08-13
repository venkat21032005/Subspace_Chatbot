# Chatbot Application

A modern React-based chatbot application built for an intern assessment. Features email authentication, real-time messaging, and AI-powered responses through a secure backend architecture.

## 🚀 Features

- **Email Authentication**: Secure sign-up/sign-in with Nhost Auth
- **Real-time Messaging**: Live chat updates using GraphQL subscriptions
- **AI Chatbot**: Intelligent responses powered by OpenRouter API
- **Secure Architecture**: Row-level security and proper permissions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **GraphQL Only**: Strict GraphQL-only communication pattern

## 🏗️ Architecture

- **Frontend**: React with JavaScript, deployed on Netlify
- **Authentication**: Nhost Auth with email/password
- **Database**: PostgreSQL via Nhost with row-level security
- **GraphQL API**: Hasura GraphQL Engine
- **Workflow Engine**: n8n for chatbot integration
- **AI Service**: OpenRouter API (free model)

## 📋 Prerequisites

Before running this application, you need to set up the following services:

1. **Nhost Account**: For authentication and database
2. **Hasura Cloud**: For GraphQL API
3. **n8n Instance**: For workflow automation
4. **OpenRouter Account**: For AI responses

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd chatbot-application
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and update with your service credentials:

```bash
cp .env.example .env
```

Update the following variables:
- `REACT_APP_NHOST_SUBDOMAIN`: Your Nhost subdomain
- `REACT_APP_NHOST_REGION`: Your Nhost region
- `REACT_APP_HASURA_GRAPHQL_URL`: Your Hasura GraphQL endpoint
- `REACT_APP_HASURA_GRAPHQL_WS_URL`: Your Hasura WebSocket endpoint
- `REACT_APP_N8N_WEBHOOK_URL`: Your n8n webhook URL

### 3. Database Setup

1. Apply the database schema from `database-schema.sql` to your Nhost database
2. The schema includes:
   - `chats` table for chat conversations
   - `messages` table for chat messages
   - Row-level security policies
   - Proper indexes and relationships

### 4. Hasura Configuration

Follow the detailed instructions in `hasura-setup.md`:

1. Connect Hasura to your Nhost database
2. Track tables and create relationships
3. Set up permissions for the `user` role
4. Create the `sendMessageToChatbot` action
5. Configure authentication with Nhost JWT

### 5. n8n Workflow

1. Import the workflow from `n8n-workflow.json`
2. Configure environment variables:
   - `HASURA_GRAPHQL_URL`: Your Hasura endpoint
   - `HASURA_ADMIN_SECRET`: Your Hasura admin secret
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `APP_URL`: Your application URL
3. Activate the workflow

### 6. Run the Application

```bash
# Development
npm start

# Production build
npm run build
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Netlify Deployment

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard
5. Deploy!

The `netlify.toml` file includes:
- Build configuration
- Redirect rules for SPA
- Security headers
- Asset optimization

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   ├── ChatList.js     # Chat list sidebar
│   ├── ChatView.js     # Main chat interface
│   ├── MessageBubble.js # Individual message display
│   ├── MessageInput.js  # Message input form
│   ├── LoginForm.js    # Authentication forms
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── hooks/              # Custom React hooks
│   ├── useChats.js     # Chat management
│   ├── useMessages.js  # Message handling
│   └── useChatbot.js   # Chatbot integration
├── graphql/            # GraphQL queries and mutations
│   ├── queries.js      # GraphQL queries
│   └── mutations.js    # GraphQL mutations
├── utils/              # Utility functions
│   ├── __tests__/      # Utility tests
│   └── validation.js   # Input validation
├── config/             # Configuration files
│   ├── nhost.js        # Nhost client setup
│   └── apollo.js       # Apollo Client setup
└── pages/              # Page components
    ├── LoginPage.js    # Login page
    ├── SignupPage.js   # Signup page
    └── ChatPage.js     # Main chat page
```

## 🔒 Security Features

- **Input Validation**: Client-side and server-side validation
- **XSS Prevention**: HTML sanitization and CSP headers
- **Row-Level Security**: Database-level access control
- **Authentication**: JWT-based authentication with Nhost
- **HTTPS Only**: Secure communication in production
- **Security Headers**: Comprehensive security headers via Netlify

## 🎯 Assignment Requirements

This application fulfills all the specified requirements:

- ✅ Email Sign In/Sign Up using Bolt + Nhost Auth
- ✅ Chat system using Hasura GraphQL queries, mutations, and subscriptions
- ✅ Chatbot powered by n8n connected to Hasura Actions calling OpenRouter
- ✅ Row-Level Security (RLS) for user data protection
- ✅ GraphQL-only communication from frontend
- ✅ Proper permissions for all database operations
- ✅ Real-time updates via GraphQL subscriptions
- ✅ Secure n8n workflow with user validation
- ✅ Professional UI with responsive design
- ✅ Netlify deployment ready

## 🐛 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Nhost configuration in `.env`
   - Verify JWT secret in Hasura

2. **GraphQL errors**
   - Ensure Hasura permissions are set correctly
   - Check database connection

3. **Chatbot not responding**
   - Verify n8n workflow is active
   - Check OpenRouter API key
   - Ensure webhook URL is correct

4. **Real-time updates not working**
   - Check WebSocket URL configuration
   - Verify subscription permissions in Hasura

### Support

For issues related to:
- **Nhost**: Check [Nhost Documentation](https://docs.nhost.io/)
- **Hasura**: Check [Hasura Documentation](https://hasura.io/docs/)
- **n8n**: Check [n8n Documentation](https://docs.n8n.io/)
- **OpenRouter**: Check [OpenRouter Documentation](https://openrouter.ai/docs)

## 📄 License

This project is created for educational purposes as part of an intern assessment.

## 👨‍💻 Developer

Created as part of an intern assessment demonstrating full-stack development skills with modern technologies and best practices.