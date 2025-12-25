import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useDashboard = () => {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [initials, setInitials] = useState('JD');
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef(null);

  // ———— Helpers ————
  const getInitials = (name) => {
    if (!name) return 'JD';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return name.slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  };

  // ———— Effects ————
  useEffect(() => {
    if (user) {
      setInitials(getInitials(user.fullName || user.name));
    }
  }, [user]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        })
      );
    };
    updateDateTime();
    const id = setInterval(updateDateTime, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ———— Data Fetching ————
  const fetchTransactions = useCallback(async () => {
  const token = localStorage.getItem('authToken');
  if (!token) return setRecentTransactions([]);

  try {
    setIsLoading(true);
    const res = await fetch('https://expense-tracker-api-hvss.onrender.com/expense/', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Failed to fetch');

    const data = await res.json();
    const expenses = data.data?.expenses || [];
    
    // NORMALIZE DATA HERE - convert everything to strings
    const normalizedExpenses = expenses.map(expense => {
        // Handle category normalization
        let categoryObj;
        if (typeof expense.category === 'string') {
          categoryObj = { name: expense.category };
        } else if (expense.category?.name) {
          categoryObj = expense.category;
        } else {
          categoryObj = { name: expense.category?._id || 'Uncategorized' };
        }

        // Handle description
        const name = typeof expense.description === 'string' 
          ? expense.description 
          : expense.name?.name || expense.name || 'Unnamed';

        return {
          ...expense,
          name,
          category: categoryObj,
          amount: Math.abs(expense.amount || 0),
          date: expense.date || new Date().toISOString(),
          type: expense.type || 'expense',
        };
      });
    
    const sorted = normalizedExpenses.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
      
    setRecentTransactions(sorted);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    setRecentTransactions([]);
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ———— Actions ————
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    console.log(`Active tab set to: ${tab}`);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    authLogout();
  };

  const refreshData = () => fetchTransactions();

  return {
    user,
    userId: user?.id || user?._id,
    activeTab,
    setActiveTab: handleSetActiveTab,
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