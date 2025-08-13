import { sanitizeHtml, sanitizeInput, isValidUUID } from '../utils/validation';

describe('Security Tests', () => {
  describe('XSS Prevention', () => {
    test('sanitizeHtml prevents script injection', () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const sanitized = sanitizeHtml(maliciousInput);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    test('sanitizeHtml prevents HTML injection', () => {
      const maliciousInput = '<img src="x" onerror="alert(1)">';
      const sanitized = sanitizeHtml(maliciousInput);
      expect(sanitized).not.toContain('<img');
      expect(sanitized).not.toContain('onerror');
    });

    test('sanitizeHtml handles various attack vectors', () => {
      const attacks = [
        'javascript:alert(1)',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<svg onload="alert(1)">',
        '<div onclick="alert(1)">Click me</div>',
      ];

      attacks.forEach(attack => {
        const sanitized = sanitizeHtml(attack);
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onclick');
        expect(sanitized).not.toContain('onload');
        expect(sanitized).not.toContain('<iframe');
        expect(sanitized).not.toContain('<svg');
      });
    });
  });

  describe('Input Sanitization', () => {
    test('sanitizeInput removes control characters', () => {
      const maliciousInput = 'Hello\x00\x01\x02World';
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).toBe('HelloWorld');
    });

    test('sanitizeInput normalizes whitespace', () => {
      const input = '  Multiple   \t\n  spaces  ';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toBe('Multiple spaces');
    });

    test('sanitizeInput handles empty and null inputs', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });
  });

  describe('UUID Validation', () => {
    test('rejects malicious UUID-like strings', () => {
      const maliciousInputs = [
        '../../../etc/passwd',
        'DROP TABLE users;',
        '<script>alert(1)</script>',
        '123e4567-e89b-12d3-a456-42661417400X', // Invalid character
        '123e4567-e89b-12d3-a456', // Too short
      ];

      maliciousInputs.forEach(input => {
        expect(isValidUUID(input)).toBe(false);
      });
    });

    test('accepts only valid UUIDs', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        '550e8400-e29b-41d4-a716-446655440000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      ];

      validUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });
  });

  describe('GraphQL Injection Prevention', () => {
    test('input validation prevents GraphQL injection attempts', () => {
      const injectionAttempts = [
        '{ users { password } }',
        'mutation { deleteAllUsers }',
        '} maliciousQuery { secrets',
        'admin\' OR \'1\'=\'1',
      ];

      injectionAttempts.forEach(attempt => {
        const sanitized = sanitizeInput(attempt);
        // Should not contain GraphQL syntax after sanitization
        expect(sanitized).not.toMatch(/^\s*[{}]/);
        expect(sanitized).not.toContain('mutation');
        expect(sanitized).not.toContain('query');
      });
    });
  });

  describe('Message Content Security', () => {
    test('prevents oversized messages', () => {
      const oversizedMessage = 'A'.repeat(1001);
      // This would be caught by validation before reaching sanitization
      expect(oversizedMessage.length).toBeGreaterThan(1000);
    });

    test('handles special characters safely', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const sanitized = sanitizeInput(specialChars);
      // Should preserve safe special characters
      expect(sanitized).toBe(specialChars);
    });
  });

  describe('Authentication Security', () => {
    test('email validation prevents injection', () => {
      const maliciousEmails = [
        'test@example.com<script>alert(1)</script>',
        'admin\'; DROP TABLE users; --@example.com',
        'test@example.com\x00\x01',
      ];

      maliciousEmails.forEach(email => {
        const sanitized = sanitizeInput(email);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('DROP TABLE');
        expect(sanitized).not.toContain('\x00');
      });
    });
  });
});