# Hasura Setup Instructions

## 1. Database Connection
1. Connect your Hasura instance to your Nhost PostgreSQL database
2. Use the connection string from your Nhost dashboard
3. Apply the database schema from `database-schema.sql`

## 2. Track Tables
Track the following tables in Hasura Console:
- `chats`
- `messages`
- `auth.users` (from Nhost)

## 3. Create Relationships

### Chats Table Relationships
- **user**: Object relationship to `auth.users` via `user_id -> id`
- **messages**: Array relationship to `messages` via `id -> chat_id`

### Messages Table Relationships  
- **chat**: Object relationship to `chats` via `chat_id -> id`
- **user**: Object relationship to `auth.users` via `user_id -> id`

## 4. Configure Permissions

### User Role Permissions for Chats Table

**Select Permission:**
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  },
  "allow_aggregations": true
}
```

**Insert Permission:**
```json
{
  "check": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  },
  "set": {
    "user_id": "X-Hasura-User-Id"
  }
}
```

**Update Permission:**
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  }
}
```

**Delete Permission:**
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  }
}
```

### User Role Permissions for Messages Table

**Select Permission:**
```json
{
  "filter": {
    "_or": [
      {
        "user_id": {
          "_eq": "X-Hasura-User-Id"
        }
      },
      {
        "chat": {
          "user_id": {
            "_eq": "X-Hasura-User-Id"
          }
        }
      }
    ]
  }
}
```

**Insert Permission:**
```json
{
  "check": {
    "_and": [
      {
        "user_id": {
          "_eq": "X-Hasura-User-Id"
        }
      },
      {
        "chat": {
          "user_id": {
            "_eq": "X-Hasura-User-Id"
          }
        }
      }
    ]
  },
  "set": {
    "user_id": "X-Hasura-User-Id"
  }
}
```

**Update Permission:**
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  }
}
```

**Delete Permission:**
```json
{
  "filter": {
    "user_id": {
      "_eq": "X-Hasura-User-Id"
    }
  }
}
```

## 5. Create Hasura Action for Chatbot

### Action Definition
**Action Name:** `sendMessageToChatbot`

**Type:** `Mutation`

**Definition:**
```graphql
type Mutation {
  sendMessageToChatbot(chatId: uuid!, message: String!): ChatbotResponse
}
```

**Custom Types:**
```graphql
type ChatbotResponse {
  success: Boolean!
  message: String
  error: String
}
```

**Handler:** Your n8n webhook URL (e.g., `https://your-n8n-instance.app/webhook/chatbot`)

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

### Action Permissions
**Role:** `user`
**Permission:** Allow with no additional restrictions

## 6. Environment Variables
Set these environment variables in your Hasura instance:
- `NHOST_JWT_SECRET`: Your Nhost JWT secret
- `NHOST_WEBHOOK_SECRET`: For webhook authentication

## 7. Authentication
Configure Nhost JWT authentication in Hasura:
1. Go to Settings > Env vars
2. Add `HASURA_GRAPHQL_JWT_SECRET` with your Nhost JWT configuration
3. The JWT secret format should match Nhost's configuration
#
# 8. Testing the Setup

### Test Database Connection
1. Verify tables are created and tracked in Hasura Console
2. Test row-level security by creating test users and data
3. Verify relationships are working correctly

### Test GraphQL Operations
Use the Hasura Console GraphiQL interface to test:

**Create a chat:**
```graphql
mutation CreateChat {
  insert_chats_one(object: { title: "Test Chat" }) {
    id
    title
    created_at
  }
}
```

**Send a message:**
```graphql
mutation SendMessage {
  insert_messages_one(object: { 
    chat_id: "your-chat-id", 
    content: "Hello!", 
    is_bot: false 
  }) {
    id
    content
    created_at
  }
}
```

**Test the Action:**
```graphql
mutation TestChatbot {
  sendMessageToChatbot(chatId: "your-chat-id", message: "Hello AI!") {
    success
    message
    error
  }
}
```

### Troubleshooting
- Ensure JWT secret is correctly configured
- Verify database connection string
- Check that RLS policies are applied
- Confirm webhook URL is accessible from Hasura
- Test permissions with different user tokens