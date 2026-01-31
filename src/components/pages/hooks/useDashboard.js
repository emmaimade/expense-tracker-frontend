// useDashboard.js - Refactored to focus on UI & Auth State
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const useDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  
  const dropdownRef = useRef(null);
  const userId = user?.id;

  // Helper: Get user initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(user?.name || '');

  // Effect: Update date and time for the header
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

  // Effect: Handle clicks outside the profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Action: Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    user,
    userId,
    initials,
    isSidebarOpen,
    setIsSidebarOpen,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    currentDateTime,
    handleLogout
  };
};