import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, EmptyState } from '../../../components/ui';
import { Transaction } from '../../../types';
import { TransactionItem } from './transactionItem';

interface TransactionsListProps {
  transactions: Transaction[];
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const { t } = useTranslation();
  const [transactionFilter, setTransactionFilter] = useState('all');

  const filteredTransactions = useMemo(() =>
    transactions.filter(tx => {
      if (transactionFilter === 'cashback') return tx.type === 'credit';
      if (transactionFilter === 'withdrawal') return tx.type === 'debit';
      return true;
    }), [transactions, transactionFilter]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h3 className="text-lg font-semibold text-gray-800">{t('wallet.transactions')}</h3>
          {/* Desktop Filter */}
          <div className="hidden sm:flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            {['all', 'cashback', 'withdrawal'].map(filter => (
              <button key={filter} onClick={() => setTransactionFilter(filter)} className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${transactionFilter === filter ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
                {t(`wallet.filters.${filter}`)}
              </button>
            ))}
          </div>
          {/* Mobile Filter */}
          <div className="sm:hidden">
            <select
              value={transactionFilter}
              onChange={(e) => setTransactionFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">{t('wallet.filters.all')}</option>
              <option value="cashback">{t('wallet.filters.cashback')}</option>
              <option value="withdrawal">{t('wallet.filters.withdrawal')}</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction, index) => (
                <TransactionItem key={transaction.id} transaction={transaction} index={index} />
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <EmptyState title={t('wallet.noTransactionsTitle')} message={t('wallet.noTransactionsMessage')} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};
