import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/api';
import { clearAuthData, checkAuthStatus } from '../utils/clearAuth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Verify token and get user profile on app start
  useEffect(() => {
    const verifyAuth = async () => {
      console.log('Verifying authentication...');
      checkAuthStatus();
      
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          console.log('Attempting to verify token with backend...');
          // Verify token by calling profile endpoint
          const response = await getProfile();
          if (response.data.success) {
            console.log('Token verification successful');
            setUser(response.data.user);
            setToken(storedToken);
          } else {
            console.log('Token verification failed - invalid response');
            clearAuthData();
            logout();
          }
        } catch (error) {
          console.error('Token verification failed:', error.response?.data || error.message);
          // Token is invalid, clear everything
          clearAuthData();
          logout();
        }
      } else {
        console.log('No stored authentication data found');
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (userData, authToken) => {
    console.log('Login called with:', { 
      userData: { ...userData, _id: userData._id ? '***' : 'null' }, 
      token: authToken ? '***' : 'null' 
    });
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    console.log('Logout called');
    setUser(null);
    setToken(null);
    clearAuthData();
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      updateUser,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 