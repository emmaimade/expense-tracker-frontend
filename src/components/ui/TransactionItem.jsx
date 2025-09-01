import { TrendingUp, TrendingDown } from 'lucide-react';

const TransactionItem = ({ transaction }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {transaction.type === 'income' ? (
          <TrendingUp className="w-5 h-5 text-green-600" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-600" />
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900">{transaction.name}</p>
        <p className="text-sm text-gray-500">{transaction.category}</p>
      </div>
    </div>
    <div className="text-right">
      <p className={`font-semibold ${
        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
      }`}>
        {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
      </p>
      <p className="text-sm text-gray-500">{transaction.date}</p>
    </div>
  </div>
);

export default TransactionItem;