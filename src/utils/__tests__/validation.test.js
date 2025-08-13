import {
  validateEmail,
  validatePassword,
  validateMessage,
  sanitizeHtml,
  sanitizeInput,
  isValidUUID,
} from '../validation';

describe('Validation utilities', () => {
  describe('validateEmail', () => {
    test('returns null for valid email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name+tag@domain.co.uk')).toBeNull();
    });

    test('returns error for invalid email', () => {
      expect(validateEmail('')).toBe('Email is required');
      expect(validateEmail('invalid-email')).toBe('Please enter a valid email address');
      expect(validateEmail('test@')).toBe('Please enter a valid email address');
      expect(validateEmail('@example.com')).toBe('Please enter a valid email address');
    });

    test('returns error for too long email', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(validateEmail(longEmail)).toBe('Email is too long');
    });
  });

  describe('validatePassword', () => {
    test('returns null for valid password', () => {
      expect(validatePassword('password123')).toBeNull();
      expect(validatePassword('securePass!')).toBeNull();
    });

    test('returns error for invalid password', () => {
      expect(validatePassword('')).toBe('Password is required');
      expect(validatePassword('12345')).toBe('Password must be at least 6 characters long');
      expect(validatePassword('a'.repeat(129))).toBe('Password is too long (max 128 characters)');
    });
  });

  describe('validateMessage', () => {
    test('returns null for valid message', () => {
      expect(validateMessage('Hello world')).toBeNull();
      expect(validateMessage('A'.repeat(1000))).toBeNull();
    });

    test('returns error for invalid message', () => {
      expect(validateMessage('')).toBe('Message is required');
      expect(validateMessage('   ')).toBe('Message cannot be empty');
      expect(validateMessage('A'.repeat(1001))).toBe('Message is too long (max 1000 characters)');
    });
  });

  describe('sanitizeHtml', () => {
    test('escapes HTML characters', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
      expect(sanitizeHtml('Hello & goodbye')).toBe('Hello &amp; goodbye');
      expect(sanitizeHtml("It's a test")).toBe('It&#x27;s a test');
    });

    test('handles non-string input', () => {
      expect(sanitizeHtml(null)).toBe('');
      expect(sanitizeHtml(undefined)).toBe('');
      expect(sanitizeHtml(123)).toBe('');
    });
  });

  describe('sanitizeInput', () => {
    test('removes control characters and normalizes whitespace', () => {
      expect(sanitizeInput('Hello\x00\x08world')).toBe('Helloworld');
      expect(sanitizeInput('  Multiple   spaces  ')).toBe('Multiple spaces');
      expect(sanitizeInput('\t\nTab and newline\t\n')).toBe('Tab and newline');
    });

    test('handles non-string input', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
      expect(sanitizeInput(123)).toBe('');
    });
  });

  describe('isValidUUID', () => {
    test('returns true for valid UUIDs', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    test('returns false for invalid UUIDs', () => {
      expect(isValidUUID('not-a-uuid')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456')).toBe(false);
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID(null)).toBe(false);
    });
  });
});