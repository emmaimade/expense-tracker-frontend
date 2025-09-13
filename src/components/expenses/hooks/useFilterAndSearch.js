import { useState, useMemo } from 'react';

export const useFilterAndSearch = (transactions) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterBy === 'all' || transaction.category.toLowerCase() === filterBy.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, filterBy]);

  return {
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy
  };
};