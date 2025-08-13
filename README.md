# AI Chat Assistant - Professional Chatbot Application

A production-ready, enterprise-grade chatbot application built with modern web technologies. This application demonstrates advanced full-stack development skills including authentication, real-time messaging, GraphQL integration, and AI chatbot capabilities.

##  Features

### Core Functionality
- **User Authentication**: Secure email-based sign-up/sign-in using Nhost Auth
- **Real-time Chat**: Live messaging with GraphQL subscriptions
- **AI Integration**: OpenAI-powered chatbot responses via n8n workflows
- **Responsive Design**: Modern, mobile-first UI built with Material-UI
- **TypeScript**: Full type safety and modern JavaScript features

### Technical Highlights
- **GraphQL Only**: All backend communication uses GraphQL (no REST APIs)
- **Row-Level Security**: Proper database permissions and user isolation
- **Hasura Actions**: Secure webhook integration with n8n
- **Real-time Updates**: Live message synchronization across devices
- **Professional UI/UX**: Enterprise-grade design patterns and accessibility

##  Architecture

```
Frontend (React + TypeScript)
     GraphQL
Hasura GraphQL Engine
     Actions
n8n Workflow Engine
     API
OpenRouter (AI Models)
     Response
Database (PostgreSQL)
```

### Technology Stack
- **Frontend**: React 18, TypeScript, Material-UI
- **Backend**: Hasura GraphQL, Nhost (PostgreSQL + Auth)
- **Workflow**: n8n for AI integration and business logic
- **AI**: OpenRouter API for multiple AI model support
- **Real-time**: GraphQL subscriptions for live updates

##  Prerequisites

- Node.js 18+ and npm
- Nhost account and project
- n8n instance (self-hosted or cloud)
- OpenRouter API key
- Netlify account (for deployment)

##  Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Nhost Configuration
REACT_APP_NHOST_SUBDOMAIN=your-nhost-subdomain
REACT_APP_NHOST_REGION=your-nhost-region

# Hasura Configuration
REACT_APP_HASURA_GRAPHQL_URL=https://your-nhost-subdomain.hasura.app/v1/graphql
REACT_APP_HASURA_WS_URL=wss://your-nhost-subdomain.hasura.app/v1/graphql

# OpenRouter API Configuration
REACT_APP_OPENROUTER_API_KEY=your-openrouter-api-key
REACT_APP_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# n8n Webhook URL
REACT_APP_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chatbot
```

### 2. Database Schema Setup

Run these SQL commands in your Hasura console:

```sql
-- Create chats table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in own chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_chats_updated_at ON chats(updated_at DESC);
```

### 3. Hasura Action Setup

Create a custom action in Hasura:

```yaml
# Action: sendMessage
Name: sendMessage
Type: mutation
Arguments:
  - chat_id: uuid!
  - message_content: String!
Return Type: sendMessageOutput

# Custom Type: sendMessageOutput
Name: sendMessageOutput
Fields:
  - success: Boolean!
  - message: String
  - response: String
```

### 4. n8n Workflow Setup

Create an n8n workflow with these nodes:

1. **Webhook Trigger**: Receives requests from Hasura Actions
2. **HTTP Request**: Validates user ownership of chat_id
3. **OpenRouter API**: Calls AI model for response generation
4. **Hasura GraphQL**: Saves AI response to database
5. **Respond to Webhook**: Returns response to Hasura Action

### 5. Install Dependencies

```bash
npm install
```

### 6. Start Development Server

```bash
npm start
```

##  Deployment

### Netlify Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   ```bash
   npm run deploy
   ```

3. **Configure environment variables** in Netlify dashboard

### Manual Deployment

1. Build the application: `npm run build`
2. Upload `build/` folder to your hosting provider
3. Configure environment variables
4. Set up custom domain (optional)

##  Security Features

- **Authentication**: JWT-based auth with Nhost
- **Authorization**: Row-level security for data isolation
- **Input Validation**: Client and server-side validation
- **HTTPS Only**: Secure communication protocols
- **CORS Protection**: Proper cross-origin restrictions

##  Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Progressive Enhancement**: Works on all screen sizes
- **Touch Friendly**: Optimized touch interactions
- **Accessibility**: WCAG 2.1 AA compliance

##  Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

##  Performance

- **Code Splitting**: Lazy-loaded components
- **GraphQL Optimization**: Efficient data fetching
- **Real-time Updates**: Minimal network overhead
- **Caching**: Apollo Client caching strategies

##  Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App
- `npm run codegen` - Generate GraphQL types
- `npm run deploy` - Deploy to Netlify

### Project Structure

```
src/
 components/          # React components
    AuthPage.tsx    # Authentication interface
    ChatApp.tsx     # Main chat application
    ChatMessage.tsx # Individual message component
    Header.tsx      # Application header
 graphql/            # GraphQL queries and mutations
    queries.ts      # All GraphQL operations
 lib/                # Utility libraries
    nhost.ts        # Nhost client configuration
 App.tsx             # Main application component
 index.tsx           # Application entry point
```

##  Advanced Features

### Real-time Messaging
- GraphQL subscriptions for live updates
- Optimistic UI updates for better UX
- Message delivery confirmation

### AI Integration
- Multiple AI model support via OpenRouter
- Context-aware conversations
- Response streaming capabilities

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Automatic retry mechanisms

##  Monitoring & Analytics

- **Performance Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Usage pattern analysis
- **Health Checks**: Application health monitoring

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

##  Roadmap

- [ ] Voice message support
- [ ] File sharing capabilities
- [ ] Multi-language support
- [ ] Advanced AI models
- [ ] Team collaboration features
- [ ] Mobile app development

---

**Built with  using modern web technologies**
