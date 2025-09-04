import { useState } from 'react';
import { Plus, Filter, Calendar, Download, Upload, Search, Edit, Trash2, X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpensesContent = ({ recentTransactions = [], topCategories = [], onDataChange }) => {
  const [filterBy, setFilterBy] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newExpense, setNewExpense] = useState({
    name: '',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Function to filter transactions based on date range
  const getDateFilteredTransactions = (range) => {
    const now = new Date();
    let startDate;

    switch (range) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStartMonth, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return recentTransactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= now;
    });
  };

  // Validate if a date is not in the future
  const isDateValid = (dateString) => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    return selectedDate <= today;
  };

  // Debug function to log API details
  const logApiCall = (method, url, body = null) => {
    console.log('=== API Call Debug ===');
    console.log('Method:', method);
    console.log('URL:', url);
    console.log('Headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken') ? '[TOKEN_EXISTS]' : '[NO_TOKEN]'}`,
    });
    if (body) {
      console.log('Body:', JSON.stringify(body, null, 2));
    }
    console.log('===================');
  };

  // Set date range for quick-select options
  const setQuickDateRange = (rangeType) => {
    const today = new Date(); // Current date
    let startDate, endDate;

    switch (rangeType) {
      case 'weekly':
        endDate = today;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7); // Last 7 days
        break;
      case 'monthly':
        endDate = today;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30); // Last 30 days
        break;
      case 'three-months':
        endDate = today;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 90); // Last 90 days
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate());
    }

    // Validate dates - ensure end date is not in the future
    if (endDate > today) {
      endDate = today;
    }

    if (startDate > endDate) {
      toast.error('Start date cannot be after end date.');
      setError('Start date cannot be after end date.');
      return;
    }

    setCustomDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    setError(null); // Clear any previous errors
    fetchCustomDateRangeTransactions(rangeType);
  };

  // Fetch transactions for custom or quick-select date range
  const fetchCustomDateRangeTransactions = async (rangeType = 'custom') => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Authentication token not found. Please log in again.');
      setError('Authentication token not found. Please log in again.');
      return;
    }

    let url;
    let effectiveStartDate, effectiveEndDate;

    if (rangeType === 'custom') {
      const { startDate, endDate } = customDateRange;
      if (!startDate || !endDate) {
        toast.error('Please select both start and end dates.');
        setError('Please select both start and end dates.');
        return;
      }
      
      // Validate that dates are not in the future
      if (!isDateValid(startDate)) {
        toast.error('Start date cannot be in the future.');
        setError('Start date cannot be in the future.');
        return;
      }
      
      if (!isDateValid(endDate)) {
        toast.error('End date cannot be in the future.');
        setError('End date cannot be in the future.');
        return;
      }
      
      if (new Date(startDate) > new Date(endDate)) {
        toast.error('Start date must be before or equal to end date.');
        setError('Start date must be before or equal to end date.');
        return;
      }
      effectiveStartDate = startDate;
      effectiveEndDate = endDate;
      url = `https://expense-tracker-api-hvss.onrender.com/expense/custom?startDate=${startDate}&endDate=${endDate}`;
    } else if (rangeType === 'reset') {
      // Default 6-month range
      const today = new Date();
      effectiveStartDate = new Date(today.getFullYear(), today.getMonth() - 5, 1).toISOString().split('T')[0];
      effectiveEndDate = new Date(today.getFullYear(), today.getMonth(), new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()).toISOString().split('T')[0];
      url = `https://expense-tracker-api-hvss.onrender.com/expense/custom?startDate=${effectiveStartDate}&endDate=${effectiveEndDate}`;
    } else {
      switch (rangeType) {
        case 'weekly':
          url = 'https://expense-tracker-api-hvss.onrender.com/expense/weekly';
          effectiveStartDate = customDateRange.startDate;
          effectiveEndDate = customDateRange.endDate;
          break;
        case 'monthly':
          url = 'https://expense-tracker-api-hvss.onrender.com/expense/monthly';
          effectiveStartDate = customDateRange.startDate;
          effectiveEndDate = customDateRange.endDate;
          break;
        case 'three-months':
          url = 'https://expense-tracker-api-hvss.onrender.com/expense/three-months';
          effectiveStartDate = customDateRange.startDate;
          effectiveEndDate = customDateRange.endDate;
          break;
        default:
          toast.error('Invalid range type.');
          setError('Invalid range type.');
          return;
      }
    }

    setLoading(true);
    setError(null); // Clear previous errors
    logApiCall('GET', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Fetched data:', data);

      // Transform data to match expected format
      const transformTransaction = (tx) => ({
        id: tx._id || null,
        name: tx.description || 'Unknown',
        category: tx.category || 'Uncategorized',
        amount: tx.amount || 0,
        date: tx.date || new Date().toISOString(),
        type: tx.type || 'expense',
      });

      let transformedData = [];
      if (Array.isArray(data.expenses)) {
        if (data.expenses.length === 0) {
          toast.info(`No transactions found for ${rangeType === 'custom' ? 'the selected date range' : rangeType === 'reset' ? 'the default range' : rangeType.replace('-', ' ')}.`);
          transformedData = [];
        } else {
          transformedData = data.expenses.map(transformTransaction);
        }
      } else {
        toast.error('Invalid response from server. Please try again.');
        setError('Invalid response from server. Please try again.');
        transformedData = [];
      }

      console.log('Transformed transactions:', transformedData);

      // Update parent component's transactions
      if (onDataChange) {
        onDataChange(transformedData);
      }

      // Clear customDateRange for reset
      if (rangeType === 'reset') {
        setCustomDateRange({ startDate: '', endDate: '' });
      }

      setIsDateRangeModalOpen(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(`Failed to fetch transactions: ${error.message}`);
      setError(`Failed to fetch transactions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate category data for pie chart based on selected date range
  const categoryData = getDateFilteredTransactions(dateRange)
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      const existing = acc.find(item => item.name === tx.category);
      if (existing) {
        existing.value += Math.abs(tx.amount);
      } else {
        acc.push({ name: tx.category, value: Math.abs(tx.amount) });
      }
      return acc;
    }, []);

  // Colors for pie chart
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Calculate monthly spending data from real transactions
  const calculateMonthlyData = () => {
    const monthlyTotals = {};
    let startDate, endDate;

    if (customDateRange.startDate && customDateRange.endDate) {
      startDate = new Date(customDateRange.startDate);
      endDate = new Date(customDateRange.endDate);
    } else {
      // Default to last 6 months from current date
      const currentDate = new Date();
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate());
    }

    // Ensure startDate is before endDate and endDate is not in future
    const today = new Date();
    if (endDate > today) {
      endDate = today;
    }
    
    if (startDate > endDate) {
      console.warn('Invalid date range: startDate after endDate');
      return [];
    }

    // Initialize months in the date range
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    while (currentDate <= endDate) {
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });
      monthlyTotals[monthKey] = {
        month: monthName,
        amount: 0,
        year: currentDate.getFullYear()
      };
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Sum up expenses by month
    recentTransactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        const transactionDate = new Date(tx.date);
        const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyTotals[monthKey]) {
          monthlyTotals[monthKey].amount += Math.abs(tx.amount);
        }
      });

    // Convert to array and sort by date
    return Object.keys(monthlyTotals)
      .sort()
      .map(key => ({
        month: monthlyTotals[key].month,
        amount: Math.round(monthlyTotals[key].amount)
      }));
  };

  const monthlyData = calculateMonthlyData();

  // Filter transactions based on search and category
  const filteredTransactions = recentTransactions.filter(transaction => {
    const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterBy === 'all' || transaction.category.toLowerCase() === filterBy.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Handle adding a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    if (!newExpense.name || !newExpense.category || !newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      toast.error('Please fill all fields with valid values.');
      return;
    }

    // Validate that the expense date is not in the future
    if (!isDateValid(newExpense.date)) {
      toast.error('Expense date cannot be in the future.');
      return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Authentication token not found. Please log in again.');
      return;
    }

    setLoading(true);
    
    const requestBody = {
      description: newExpense.name,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      type: 'expense'
    };

    try {
      logApiCall('POST', 'https://expense-tracker-api-hvss.onrender.com/expense/', requestBody);

      const response = await fetch('https://expense-tracker-api-hvss.onrender.com/expense/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
        throw new Error(errorMessage);
      }

      toast.success('Expense added successfully!');
      setIsAddModalOpen(false);
      setNewExpense({
        name: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error(`Failed to add expense: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setNewExpense({
      name: transaction.name,
      category: transaction.category,
      amount: Math.abs(transaction.amount).toString(),
      date: transaction.date.split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    
    if (!newExpense.name || !newExpense.category || !newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      toast.error('Please fill all fields with valid values.');
      return;
    }

    // Validate that the expense date is not in the future
    if (!isDateValid(newExpense.date)) {
      toast.error('Expense date cannot be in the future.');
      return;
    }

    if (!selectedTransaction?.id) {
      toast.error('No transaction selected for update.');
      return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Authentication token not found. Please log in again.');
      return;
    }

    setLoading(true);

    const requestBody = {
      description: newExpense.name,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      type: 'expense'
    };

    try {
      const url = `https://expense-tracker-api-hvss.onrender.com/expense/${selectedTransaction.id}`;
      logApiCall('PATCH', url, requestBody);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Update response status:', response.status);
      const responseText = await response.text();
      console.log('Update response text:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
        throw new Error(errorMessage);
      }

      toast.success('Expense updated successfully!');
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
      setNewExpense({
        name: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error(`Failed to update expense: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!transactionId) {
      toast.error('Invalid transaction ID.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Authentication token not found. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const url = `https://expense-tracker-api-hvss.onrender.com/expense/${transactionId}`;
      logApiCall('DELETE', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      console.log('Delete response status:', response.status);
      const responseText = await response.text();
      console.log('Delete response text:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.detail || errorData.error || errorMessage;
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
        }
        throw new Error(errorMessage);
      }

      toast.success('Transaction deleted successfully!');
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(`Failed to delete transaction: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }) => {
    const RADIS = outerRadius + 25;
    const x = cx + RADIS * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + RADIS * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="black"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          <tspan x={x} dy="-0.5em" fontWeight="medium">{`${name}`}</tspan>
          <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
        </text>
      </g>
    );
  };

  const handleDateRangeClick = () => {
    setIsDateRangeModalOpen(true);
  };

  // Get readable label for date range
  const getDateRangeLabel = (range) => {
    switch (range) {
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'quarter':
        return 'This Quarter';
      case 'year':
        return 'This Year';
      default:
        return 'This Month';
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      {/* Loading indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <p className="text-gray-900">Processing request...</p>
            </div>
          </div>
        </div>
      )}

      {/* Date Range Modal */}
      {isDateRangeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Date Range
              </h3>
              <button
                onClick={() => {
                  setIsDateRangeModalOpen(false);
                  setError(null); // Clear error on close
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Quick-Select Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setQuickDateRange("weekly")}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDateRange("monthly")}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Last Month
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDateRange("three-months")}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Last 3 Months
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => {
                    setCustomDateRange({
                      ...customDateRange,
                      startDate: e.target.value,
                    });
                    setError(null); // Clear error on input change
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => {
                    setCustomDateRange({
                      ...customDateRange,
                      endDate: e.target.value,
                    });
                    setError(null); // Clear error on input change
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsDateRangeModalOpen(false);
                    setError(null); // Clear error on cancel
                  }}
                  className="flex-1 px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => fetchCustomDateRangeTransactions("custom")}
                  className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Fetching..." : "Apply Custom Range"}
                </button>
                <button
                  type="button"
                  onClick={() => fetchCustomDateRangeTransactions("reset")}
                  className="flex-1 px-3 py-1.5 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="text-gray-600 mt-1">Manage and track your spending</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spending by Category Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Spending by Category
            </h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="h-80">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={85}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, "Amount"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <p className="text-center">
                  No expense data available for {getDateRangeLabel(dateRange).toLowerCase()}
                </p>
                <p className="text-sm text-center mt-2">
                  Try selecting a different time period or adding some expenses
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Spending Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Monthly Spending Trends
            </h2>
            <div className="text-sm text-gray-500">
              {customDateRange.startDate && customDateRange.endDate
                ? `${new Date(customDateRange.startDate).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )} - ${new Date(customDateRange.endDate).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}`
                : "Last 6 months"}
            </div>
          </div>
          <div className="h-80">
            {monthlyData.length > 0 &&
            monthlyData.some((month) => month.amount > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Amount"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="amount" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <p className="text-center">
                  No monthly spending data available
                </p>
                <p className="text-sm text-center mt-2">
                  Start adding expenses to see trends
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Budget Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Category Budgets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryData.length > 0 ? (
            categoryData.map((category, index) => {
              const budget = 500; // Mock budget (replace with API data)
              const spent = category.value;
              const percentage = Math.min((spent / budget) * 100, 100);
              const remaining = Math.max(budget - spent, 0);

              return (
                <div
                  key={category.name}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      ${spent.toFixed(0)} / ${budget}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        percentage > 100 ? "bg-red-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {percentage.toFixed(0)}% used • ${remaining.toFixed(0)}{" "}
                    remaining
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600">
              No category data available for {getDateRangeLabel(dateRange).toLowerCase()}
            </p>
          )}
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Transactions
          </h2>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Leisure">Leisure</option>
              <option value="Electronics">Electronics</option>
              <option value="Utilities">Utilities</option>
              <option value="Clothing">Clothing</option>
              <option value="Healthcare">Health</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>
            </select>
            <button
              onClick={handleDateRangeClick}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Date Range</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                  Transaction
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="font-medium text-gray-900">
                        {transaction.name}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span
                        className={`font-medium ${
                          transaction.type === "expense"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {transaction.type === "expense" ? "-" : "+"}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                          onClick={() => handleEditTransaction(transaction)}
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-600">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing 1 to {filteredTransactions.length} of{" "}
            {filteredTransactions.length} transactions
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Expense
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Name
                </label>
                <input
                  type="text"
                  required
                  value={newExpense.name}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Grocery Shopping"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  required
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Healthcare">Health</option>
                  <option value="Education">Education</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Expense
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedTransaction(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleUpdateExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Name
                </label>
                <input
                  type="text"
                  required
                  value={newExpense.name}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Grocery Shopping"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  required
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                >
                  <option value="">Select a category</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Leisure">Leisure</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Healthcare">Health</option>
                  <option value="Education">Education</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedTransaction(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesContent;