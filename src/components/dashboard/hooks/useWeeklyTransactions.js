import { useState, useEffect } from 'react';
import { expenseService } from '../../../services/expenseService';

const useWeeklyTransactions = () => {
  const [weeklyTransactions, setWeeklyTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const fetchWeeklyTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      setFallbackUsed(false);
      console.log('Fetching weekly transactions...');
      
      try {
        const transformedData = await expenseService.getTransactionsByDateRange('weekly');
        console.log('Weekly transactions data:', transformedData);
        setWeeklyTransactions(transformedData);
      } catch (err) {
        // Handle the specific case where API returns 404 for "No expenses found"
        if (err.message === 'No expenses found') {
          console.log('No weekly expenses found - trying fallback to monthly data');
          
          try {
            // Fallback 1: Try monthly data
            const monthlyData = await expenseService.getTransactionsByDateRange('monthly');
            if (monthlyData.length > 0) {
              // Take the most recent transactions from monthly data
              const recentTransactions = monthlyData
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5); // Get last 5 transactions
              
              setWeeklyTransactions(recentTransactions);
              setFallbackUsed(true);
              console.log('Using recent monthly transactions as fallback');
            } else {
              // Fallback 2: No data at all
              setWeeklyTransactions([]);
            }
          } catch (fallbackErr) {
            console.log('Fallback also failed, showing empty state');
            setWeeklyTransactions([]);
          }
          
          setError(null); // Clear error since this is expected behavior
        } else {
          throw err; // Re-throw other errors
        }
      }
      
    } catch (err) {
      console.error('Error fetching weekly transactions:', err);
      setError(err.message);
      setWeeklyTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyTransactions();
  }, []);

  return {
    weeklyTransactions,
    loading,
    error,
    fallbackUsed, // Indicates if fallback data is being used
    refetch: fetchWeeklyTransactions
  };
};

export default useWeeklyTransactions;