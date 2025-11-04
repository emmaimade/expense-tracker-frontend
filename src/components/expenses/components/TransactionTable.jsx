import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingOverlay from '../../common/LoadingOverlay';

const TransactionTable = ({
  transactions = [],
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  onEdit,
  onDelete,
  onDateRangeClick,
  loading = false,
  onClearDateRange,
  isUsingCustomRange,
  categories = [],
  itemsPerPage = 10,
  onItemsPerPageChange,
  onClearFilters,
}) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(itemsPerPage);

  // Detect controlled vs uncontrolled
  const isControlled = typeof onItemsPerPageChange === 'function';
  const effectiveItemsPerPage = isControlled ? itemsPerPage : internalItemsPerPage;

  // Reset current page when filters, search, or itemsPerPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterBy, transactions.length, effectiveItemsPerPage]);

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date);
        bValue = new Date(b.date);
        break;
      case 'amount':
        aValue = Math.abs(a.amount);
        bValue = Math.abs(b.amount);
        break;
      case 'name':
        aValue = (a.description || a.name || '').toLowerCase();
        bValue = (b.description || b.name || '').toLowerCase();
        break;
      case 'category':
        const aCat = typeof a.category === 'object' ? a.category?.name : a.category;
        const bCat = typeof b.category === 'object' ? b.category?.name : b.category;
        aValue = (aCat || '').toLowerCase();
        bValue = (bCat || '').toLowerCase();
        break;
      default:
        return 0;
    }

    return sortOrder === 'asc'
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1;
  });

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / effectiveItemsPerPage);
  const startIndex = (currentPage - 1) * effectiveItemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + effectiveItemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    if (isControlled) {
      onItemsPerPageChange(newItemsPerPage);
    } else {
      setInternalItemsPerPage(newItemsPerPage);
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <div className="w-4 h-4" />;
    return (
      <div className="w-4 h-4 flex items-center justify-center">
        <div className={`text-xs ${sortOrder === 'asc' ? 'text-indigo-600' : 'text-gray-400'}`}>
          ▲
        </div>
      </div>
    );
  };

  const categoryOptions = ['all', ...categories.map(cat => cat.name)];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">All Transactions</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Button */}
          <button
            onClick={onDateRangeClick}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            disabled={loading}
          >
            <Calendar className="w-4 h-4 text-gray-400" />
            Filter by Date
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + effectiveItemsPerPage, sortedTransactions.length)} of{" "}
          {sortedTransactions.length} transactions
          {searchTerm && (
            <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
              Filtered by: "{searchTerm}"
            </span>
          )}
          {filterBy !== "all" && (
            <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
              Category: {filterBy}
            </span>
          )}
        </div>

        {(searchTerm || filterBy !== "all" || isUsingCustomRange) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterBy("all");
              if (onClearDateRange) onClearDateRange();
              if (isControlled) {
                onItemsPerPageChange(10);
              } else {
                setInternalItemsPerPage(10);
              }
              setCurrentPage(1);
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th
                className="text-left py-3 px-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon field="date" />
                </div>
              </th>
              <th
                className="text-left py-3 px-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Description
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                className="text-left py-3 px-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-1">
                  Category
                  <SortIcon field="category" />
                </div>
              </th>
              <th
                className="text-right py-3 px-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-1 justify-end">
                  Amount
                  <SortIcon field="amount" />
                </div>
              </th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction.id || transaction._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2 text-sm text-gray-700">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-700">
                    {transaction.description || transaction.name || '—'}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-700">
                    {typeof transaction.category === 'object'
                      ? transaction.category?.name
                      : transaction.category || 'Uncategorized'}
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span
                      className={`font-medium ${
                        transaction.type === "expense" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {transaction.type === "expense" ? "-" : "+"}$
                      {Math.abs(transaction.amount || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onEdit(transaction)}
                        disabled={loading}
                        title="Edit transaction"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onDelete(transaction.id || transaction._id)}
                        disabled={loading}
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-gray-400">
                      <Calendar className="w-12 h-12" />
                    </div>
                    <p className="text-gray-600 font-medium">No transactions found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchTerm || filterBy !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "Start by adding your first expense"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={effectiveItemsPerPage}
              onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const showPages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
                let endPage = Math.min(totalPages, startPage + showPages - 1);

                if (endPage - startPage + 1 < showPages) {
                  startPage = Math.max(1, endPage - showPages + 1);
                }

                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(<span key="ellipsis1" className="px-2 text-gray-500">...</span>);
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        i === currentPage
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(<span key="ellipsis2" className="px-2 text-gray-500">...</span>);
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default TransactionTable;