import React, { createContext, useContext, useState, useEffect } from 'react';
import { nhost } from '../config/nhost';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = nhost.auth.onAuthStateChanged((event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await nhost.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    // isAuthenticated is true if the user object is not null
    isAuthenticated: !!user,
    isLoading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;