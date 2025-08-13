# Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Nhost project created and configured
- [ ] Hasura Cloud instance connected to Nhost database
- [ ] n8n instance set up and workflow imported
- [ ] OpenRouter API key obtained
- [ ] All environment variables configured

### 2. Database Configuration
- [ ] Database schema applied (`database-schema.sql`)
- [ ] Row-level security policies enabled
- [ ] Tables tracked in Hasura Console
- [ ] Relationships created between tables
- [ ] Permissions configured for `user` role

### 3. Hasura Configuration
- [ ] JWT authentication configured with Nhost
- [ ] GraphQL permissions set for all tables
- [ ] `sendMessageToChatbot` action created
- [ ] Action permissions configured
- [ ] Webhook URL pointing to n8n workflow

### 4. n8n Workflow
- [ ] Workflow imported from `n8n-workflow.json`
- [ ] Environment variables configured:
  - [ ] `HASURA_GRAPHQL_URL`
  - [ ] `HASURA_ADMIN_SECRET`
  - [ ] `OPENROUTER_API_KEY`
  - [ ] `APP_URL`
- [ ] Workflow activated and tested

### 5. Frontend Configuration
- [ ] Environment variables set in `.env`:
  - [ ] `REACT_APP_NHOST_SUBDOMAIN`
  - [ ] `REACT_APP_NHOST_REGION`
  - [ ] `REACT_APP_HASURA_GRAPHQL_URL`
  - [ ] `REACT_APP_HASURA_GRAPHQL_WS_URL`
  - [ ] `REACT_APP_N8N_WEBHOOK_URL`

### 6. Testing
- [ ] All unit tests passing (`npm test`)
- [ ] Integration tests passing
- [ ] Security tests passing
- [ ] Manual testing of complete user flow
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

## Deployment Steps

### 1. Netlify Deployment
1. Connect GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Add environment variables in Netlify dashboard
4. Deploy and verify

### 2. Post-Deployment Verification
- [ ] Application loads without errors
- [ ] Authentication flow works (sign up/sign in)
- [ ] Chat creation and selection works
- [ ] Message sending works
- [ ] Real-time updates work via subscriptions
- [ ] Chatbot responses work
- [ ] Mobile view works correctly
- [ ] All security headers present

### 3. Performance Verification
- [ ] Lighthouse score > 90 for Performance
- [ ] Lighthouse score > 90 for Accessibility
- [ ] Lighthouse score > 90 for Best Practices
- [ ] Lighthouse score > 90 for SEO
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Caching headers configured

## Production Environment Variables

```bash
# Nhost Configuration
REACT_APP_NHOST_SUBDOMAIN=your-production-subdomain
REACT_APP_NHOST_REGION=your-production-region

# Hasura Configuration
REACT_APP_HASURA_GRAPHQL_URL=https://your-production-hasura.hasura.app/v1/graphql
REACT_APP_HASURA_GRAPHQL_WS_URL=wss://your-production-hasura.hasura.app/v1/graphql

# n8n Webhook URL
REACT_APP_N8N_WEBHOOK_URL=https://your-production-n8n.app/webhook/chatbot
```

## Monitoring and Maintenance

### 1. Monitoring Setup
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Database performance monitoring

### 2. Security Monitoring
- [ ] Security headers verified
- [ ] SSL certificate valid
- [ ] CORS configuration correct
- [ ] Rate limiting configured
- [ ] Input validation working

### 3. Backup and Recovery
- [ ] Database backups configured
- [ ] Environment variables backed up
- [ ] Deployment rollback plan documented

## Troubleshooting Guide

### Common Issues

1. **Authentication not working**
   - Check Nhost JWT secret in Hasura
   - Verify environment variables
   - Check CORS settings

2. **GraphQL errors**
   - Verify Hasura permissions
   - Check database connection
   - Validate JWT token format

3. **Chatbot not responding**
   - Check n8n workflow status
   - Verify OpenRouter API key
   - Test webhook connectivity

4. **Real-time updates not working**
   - Check WebSocket connection
   - Verify subscription permissions
   - Test network connectivity

### Performance Issues

1. **Slow loading**
   - Check bundle size
   - Optimize images
   - Enable compression

2. **Memory leaks**
   - Check subscription cleanup
   - Verify component unmounting
   - Monitor memory usage

## Success Criteria

The deployment is successful when:
- [ ] All functionality works as expected
- [ ] Performance metrics meet requirements
- [ ] Security measures are in place
- [ ] User experience is smooth
- [ ] Error handling works correctly
- [ ] Mobile experience is optimized

## Final Submission Format

```
Name: [Your Name]
Contact: [Your Phone Number]
Deployed: [Your Netlify URL]
```

Example:
```
Name: John Doe
Contact: 1234567890
Deployed: https://chatbot-app-assessment.netlify.app/
```