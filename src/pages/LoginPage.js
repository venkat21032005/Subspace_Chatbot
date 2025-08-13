import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return <LoginForm key={Date.now()} />;
};

export default LoginPage;