// Input validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return 'Email is required';
  }
  
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  if (email.length > 254) {
    return 'Email is too long';
  }
  
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  if (password.length > 128) {
    return 'Password is too long (max 128 characters)';
  }
  
  return null;
};

export const validateChatTitle = (title) => {
  if (!title) {
    return 'Chat title is required';
  }
  
  if (title.trim().length === 0) {
    return 'Chat title cannot be empty';
  }
  
  if (title.length > 100) {
    return 'Chat title is too long (max 100 characters)';
  }
  
  return null;
};

export const validateMessage = (message) => {
  if (!message) {
    return 'Message is required';
  }
  
  if (message.trim().length === 0) {
    return 'Message cannot be empty';
  }
  
  if (message.length > 1000) {
    return 'Message is too long (max 1000 characters)';
  }
  
  return null;
};

// Sanitization utilities
export const sanitizeHtml = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters and normalize whitespace
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// UUID validation
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};