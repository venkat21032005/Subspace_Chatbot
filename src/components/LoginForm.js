import React, { useState } from 'react';
import { useSignInEmailPassword } from '@nhost/react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, sanitizeInput } from '../utils/validation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const { signInEmailPassword, isLoading, error } = useSignInEmailPassword();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const sanitizedEmail = sanitizeInput(email);
      const result = await signInEmailPassword(sanitizedEmail, password);
      
      console.log('Login result:', result); // Debug log
      
      if (result.isSuccess) {
        navigate('/', { replace: true });
      } else if (result.isError) {
        console.error('Login error:', result.error);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Sign In
        </h2>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationErrors.email) {
                setValidationErrors(prev => ({ ...prev, email: null }));
              }
            }}
            required
            placeholder="Enter your email"
          />
          {validationErrors.email && (
            <div className="error">{validationErrors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors(prev => ({ ...prev, password: null }));
              }
            }}
            required
            placeholder="Enter your password"
          />
          {validationErrors.password && (
            <div className="error">{validationErrors.password}</div>
          )}
        </div>

        {error && (
          <div className="error">
            {error.error === 'unverified-user' ? (
              <div>
                <strong>Email verification required!</strong>
                <br />
                Please check your email and click the verification link, or disable email verification in your Nhost project settings.
              </div>
            ) : (
              error.message || 'An error occurred during sign in'
            )}
          </div>
        )}

        <button 
          type="submit" 
          className="btn" 
          disabled={isLoading || !email || !password}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#667eea', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;