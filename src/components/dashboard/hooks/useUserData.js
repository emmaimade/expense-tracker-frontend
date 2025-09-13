import { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';

const useUserData = () => {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);
      const userData = userService.getCurrentUser();
      
      if (userData) {
        setUser(userData);
        setUserName(userData.name || '');
      }
    } catch (err) {
      console.error('Error retrieving user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    userName,
    user,
    loading,
    error,
    refreshUser: () => {
      try {
        const userData = userService.getCurrentUser();
        setUser(userData);
        setUserName(userData?.name || '');
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };
};

export default useUserData;