import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../../components/ui';
import { Transaction } from '../../../types';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
  index: number;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, index }) => {
    const isCredit = transaction.type === 'credit';
    const statusVariant = transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'danger';
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
      >
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-4 ${isCredit ? 'bg-green-100' : 'bg-red-100'}`}>
          {isCredit ? (
            <ArrowDownLeft className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          ) : (
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 truncate">{transaction.description}</p>
          <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="text-right ml-4">
            <p className={`font-bold text-base ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString()}
            </p>
             <Badge variant={statusVariant} size="sm" className="mt-1 hidden sm:inline-flex">
                {transaction.status}
            </Badge>
        </div>
      </motion.div>
    );
};
