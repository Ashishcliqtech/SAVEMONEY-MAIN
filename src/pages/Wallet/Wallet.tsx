import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Wallet as WalletIcon,
  TrendingUp,
  Clock,
  Download,
  CreditCard,
  Smartphone,
  Building,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from 'lucide-react';
import { Card, Button, Badge, Modal, Input, LoadingSpinner } from '../../components/ui';
import { useWallet, useTransactions, useCreateWithdrawal } from '../../hooks/useSupabase';
import { useAuth } from '../../hooks/useAuth';
import { WITHDRAWAL_METHODS } from '../../constants';
import toast from 'react-hot-toast';

export const Wallet: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    method: '',
    accountDetails: '',
  });
  const [transactionFilter, setTransactionFilter] = useState('all');

  const { data: walletData, isLoading: walletLoading } = useWallet(user?.id);
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions(user?.id);
  const withdrawMutation = useCreateWithdrawal();

  const handleWithdraw = async () => {
    if (!withdrawalData.amount || !withdrawalData.method || !withdrawalData.accountDetails) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await withdrawMutation.mutateAsync({
        userId: user!.id,
        withdrawData: {
        amount: parseFloat(withdrawalData.amount),
        method: withdrawalData.method as any,
        accountDetails: withdrawalData.accountDetails,
        }
      });
      toast.success('Withdrawal request submitted successfully!');
      setShowWithdrawModal(false);
      setWithdrawalData({ amount: '', method: '', accountDetails: '' });
    } catch (error) {
      toast.error('Failed to submit withdrawal request');
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'upi': return Smartphone;
      case 'bank': return Building;
      case 'paytm': return WalletIcon;
      case 'voucher': return Gift;
      default: return CreditCard;
    }
  };

  const stats = [
    {
      label: t('wallet.available'),
      value: `₹${walletData?.availableCashback?.toLocaleString() || '0'}`,
      icon: WalletIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: t('wallet.pending'),
      value: `₹${walletData?.pendingCashback?.toLocaleString() || '0'}`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: t('wallet.withdrawn'),
      value: `₹${walletData?.withdrawnCashback?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  if (walletLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('wallet.title')}
          </h1>
          <p className="text-gray-600">
            Manage your cashback earnings and withdrawals
          </p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center" hover>
                <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Wallet Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-purple-600 to-teal-600 text-white">
              <div className="text-center">
                <WalletIcon className="w-16 h-16 mx-auto mb-4 opacity-90" />
                <div className="text-sm opacity-90 mb-2">Total Balance</div>
                <div className="text-3xl font-bold mb-6">
                  ₹{walletData?.totalCashback?.toLocaleString() || '0'}
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  icon={Download}
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={!walletData?.availableCashback || walletData.availableCashback < 10}
                >
                  {t('wallet.withdrawButton')}
                </Button>
                {walletData?.availableCashback && walletData.availableCashback < 10 && (
                  <p className="text-sm opacity-75 mt-2">
                    Minimum withdrawal amount is ₹10
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Withdrawal Methods */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t('wallet.withdrawalMethods')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {WITHDRAWAL_METHODS.map((method) => {
                  const IconComponent = getMethodIcon(method.id);
                  return (
                    <div
                      key={method.id}
                      className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-purple-300 transition-colors cursor-pointer"
                      onClick={() => {
                        setWithdrawalData(prev => ({ ...prev, method: method.id }));
                        setShowWithdrawModal(true);
                      }}
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{method.label}</div>
                        <div className="text-sm text-gray-500">
                          {t('wallet.minAmount')}: ₹{method.minAmount}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('wallet.transactions')}
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Transactions</option>
                <option value="cashback">Cashback Earned</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
            </div>
          </div>

          {transactionsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="space-y-4">
              {transactionsData?.transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm">
                    {transaction.cashbackEarned > 0 ? (
                      <ArrowDownLeft className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  
                  <img
                    src={transaction.store.logo}
                    alt={transaction.store.name}
                    className="w-10 h-10 rounded-lg object-cover mr-4"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {transaction.store.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Order #{transaction.orderId}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ₹{transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      +₹{transaction.cashbackEarned}
                    </div>
                    <Badge
                      variant={
                        transaction.status === 'confirmed' ? 'success' :
                        transaction.status === 'pending' ? 'warning' : 'danger'
                      }
                      size="sm"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}

              {(!transactionsData?.transactions || transactionsData.transactions.length === 0) && (
                <div className="text-center py-12">
                  <WalletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t('wallet.noTransactions')}
                  </h3>
                  <p className="text-gray-500">
                    Your transaction history will appear here
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Withdrawal Modal */}
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          title="Withdraw Money"
          size="md"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('wallet.selectMethod')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {WITHDRAWAL_METHODS.map((method) => {
                  const IconComponent = getMethodIcon(method.id);
                  return (
                    <button
                      key={method.id}
                      onClick={() => setWithdrawalData(prev => ({ ...prev, method: method.id }))}
                      className={`flex items-center p-3 border rounded-lg transition-colors ${
                        withdrawalData.method === method.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              label={t('wallet.enterAmount')}
              type="number"
              value={withdrawalData.amount}
              onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Enter amount to withdraw"
            />

            <Input
              label={t('wallet.accountDetails')}
              value={withdrawalData.accountDetails}
              onChange={(e) => setWithdrawalData(prev => ({ ...prev, accountDetails: e.target.value }))}
              placeholder="Enter account details (UPI ID, Account Number, etc.)"
            />

            <div className="flex space-x-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowWithdrawModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleWithdraw}
                loading={withdrawMutation.isPending}
              >
                {t('wallet.processWithdrawal')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};