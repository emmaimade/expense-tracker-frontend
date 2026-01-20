// useDashboard.js - Updated without activeTab state
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { expenseService } from '../../../services/expenseService';

export const useDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name || '');
  const userId = user?.id;

  // Update date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      setCurrentDateTime(now.toLocaleDateString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!userId) {
      console.warn('No user ID available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const transactions = await expenseService.getRecentTransactions();
      
      const formattedTransactions = Array.isArray(transactions)
        ? transactions.map((tx) => ({
            id: tx._id || tx.id,
            name: tx.name || 'Unknown',
            category: tx.category || 'Uncategorized',
            amount: tx.amount || 0,
            date: tx.date || new Date().toISOString(),
            type: tx.type || 'expense',
          }))
        : [];

      setRecentTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setRecentTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  // Refresh data
  const refreshData = () => {
    fetchDashboardData();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    user,
    userId,
    isSidebarOpen,
    setIsSidebarOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    currentDateTime,
    initials,
    recentTransactions,
    isLoading,
    dropdownRef,
    handleLogout,
    refreshData,
  };
};