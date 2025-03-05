// AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Initialize the token from localStorage on component mount
    const storedToken = localStorage.getItem('token');
    return storedToken || undefined;
  });

  //console.log(typeof token, token, "inside auth")

  const setAuthToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const resetAuthToken = (newToken) => {
    setToken(undefined);
    localStorage.removeItem('token', newToken);
  };

  const isAuthenticatedFn = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ token, setAuthToken, isAuthenticatedFn, resetAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
