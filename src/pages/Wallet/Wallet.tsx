import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Wallet as WalletIcon,
  TrendingUp,
  Clock,
} from 'lucide-react';
import {
  LoadingSpinner,
  EmptyState,
  ErrorState,
} from '../../components/ui';
import { walletApi, RequestWithdrawalPayload } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Transaction, Wallet as WalletType } from '../../types';
import {
    BalanceCard,
    WithdrawalMethods,
    WalletSummary,
    TransactionsList,
    WithdrawalModal,
} from './component/Index';

export const Wallet: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State Management
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [initialWithdrawMethod, setInitialWithdrawMethod] = useState('');

  // Fetch data on user change
  useEffect(() => {
    if (user) {
      fetchWalletData();
    } else {
        setIsLoading(false);
        setError("You need to be logged in to view your wallet.");
    }
  }, [user]);

  const fetchWalletData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [walletDetails, transactionHistory] = await Promise.all([
        walletApi.getWalletDetails(),
        walletApi.getTransactionHistory(),
      ]);
      setWallet(walletDetails);
      setTransactions(transactionHistory);
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast.error(t('errors.fetchWalletFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || typeof amount === 'undefined') return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Event Handlers
  const handleWithdrawRequest = async (payload: RequestWithdrawalPayload) => {
    try {
      const response = await walletApi.requestWithdrawal(payload);
      toast.success(response.msg || t('wallet.withdrawalSuccess'));
      setShowWithdrawModal(false);
      fetchWalletData(); // Refresh data after withdrawal
    } catch (err: any) {
      toast.error(err.message || t('errors.withdrawalFailed'));
    }
  };

  const openWithdrawModal = (methodId = '') => {
    setInitialWithdrawMethod(methodId);
    setShowWithdrawModal(true);
  };
  
  // Render Logic
  if (isLoading) {
    return <LoadingSpinner size="xl" text={t('wallet.loading')} fullScreen color="text-primary" />;
  }

  if (error) {
    return <ErrorState title={t('errors.loadWalletErrorTitle')} message={error} onRetry={fetchWalletData} fullScreen />;
  }
  
  if (!user) {
     return <EmptyState title="Authentication Required" message="Please log in to see your wallet details." />;
  }

  const walletStats = [
    { label: t('wallet.available'), value: formatCurrency(wallet?.availableCashback), icon: WalletIcon, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: t('wallet.pending'), value: formatCurrency(wallet?.pendingCashback), icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-100' },
    { label: t('wallet.withdrawn'), value: formatCurrency(wallet?.withdrawnCashback), icon: TrendingUp, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t('wallet.title')}</h1>
          <p className="text-md text-gray-600">{t('wallet.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column */}
          <aside className="lg:col-span-1 space-y-8">
            <BalanceCard 
              totalCashback={wallet?.totalCashback}
              availableCashback={wallet?.availableCashback}
              onWithdrawClick={() => openWithdrawModal()}
              formatCurrency={formatCurrency}
            />
            <WithdrawalMethods onMethodClick={openWithdrawModal} />
          </aside>

          {/* Right Column */}
          <section className="lg:col-span-2 space-y-8">
            <WalletSummary stats={walletStats} />
            <TransactionsList transactions={transactions} />
          </section>
        </div>

        {/* Withdrawal Modal */}
        <WithdrawalModal 
            isOpen={showWithdrawModal}
            onClose={() => setShowWithdrawModal(false)}
            onWithdraw={handleWithdrawRequest}
            initialMethod={initialWithdrawMethod}
            wallet={wallet}
        />
      </main>
    </div>
  );
};

