import { useState, useMemo } from 'react';

export const useFilterAndSearch = (transactions) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const filteredTransactions = useMemo(() => {
    // Guard against invalid transactions array
    if (!Array.isArray(transactions)) {
      return [];
    }

    return transactions.filter(transaction => {
      // Guard against null/undefined transaction
      if (!transaction) return false;

      // Safely extract name (handle string, object, or undefined)
      const getName = (trans) => {
        if (typeof trans.name === 'string') return trans.name;
        if (trans.name?.name) return trans.name.name; // nested object
        return '';
      };

      // Safely extract category (handle string, object, array, or undefined)
      const getCategory = (trans) => {
        if (typeof trans.category === 'string') return trans.category;
        if (trans.category?.name) return trans.category.name; // object with name
        if (trans.category?._id) return trans.category._id; // object with _id
        if (Array.isArray(trans.category) && trans.category[0]) {
          return typeof trans.category[0] === 'string' 
            ? trans.category[0] 
            : trans.category[0].name || '';
        }
        return '';
      };

      const name = getName(transaction).toLowerCase();
      const category = getCategory(transaction).toLowerCase();
      
      const matchesSearch = searchTerm.trim() === '' || name.includes(searchTerm.toLowerCase());
      const matchesCategory = filterBy === 'all' || category === filterBy.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, filterBy]);

  return {
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    filterBy,
    setFilterBy,
  };
};