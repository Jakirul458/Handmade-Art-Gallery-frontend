// Utility function to clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Authentication data cleared');
};

// Utility function to check authentication status
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Auth Status Check:');
  console.log('Token exists:', !!token);
  console.log('User exists:', !!user);
  
  if (token) {
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 20) + '...');
  }
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('User data:', userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  return { token, user };
}; 