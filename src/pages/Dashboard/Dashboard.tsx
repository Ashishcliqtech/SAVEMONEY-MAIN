import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  Clock,
  Gift,
  Users,
  ShoppingBag,
  ArrowRight,
  Star,
} from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  LoadingSpinner,
  EmptyState,
  ErrorState,
} from '../../components/ui';
import { walletApi, offersApi, Transaction } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { Offer, Wallet as WalletType } from '../../types';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // State management
  const [walletData, setWalletData] = useState<WalletType | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [wallet, transactions, offers] = await Promise.all([
        walletApi.getWalletDetails(),
        walletApi.getTransactionHistory({ page: 1, limit: 5 }),
        offersApi.getFeaturedOffers(),
      ]);
      setWalletData(wallet);
      setTransactions(transactions);
      setOffers(offers);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || typeof amount === 'undefined') {
      return 'N/A';
    }
    return `₹${amount.toLocaleString()}`;
  };
  
  const quickActions = [
    { icon: Wallet, label: t('dashboard.viewWallet'), href: ROUTES.WALLET, color: 'bg-purple-500' },
    { icon: ShoppingBag, label: t('dashboard.browseOffers'), href: ROUTES.OFFERS, color: 'bg-teal-500' },
    { icon: Users, label: t('dashboard.invite'), href: ROUTES.REFERRALS, color: 'bg-orange-500' },
    { icon: Gift, label: t('dashboard.support'), href: ROUTES.SUPPORT, color: 'bg-green-500' },
  ];

  const stats = [
    { label: t('dashboard.totalEarnings'), value: formatCurrency(walletData?.totalCashback), icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: t('dashboard.availableCashback'), value: formatCurrency(walletData?.availableCashback), icon: Wallet, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: t('dashboard.pendingCashback'), value: formatCurrency(walletData?.pendingCashback), icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ];

  if (isLoading) {
    return <LoadingSpinner size="xl" text="Loading your dashboard..." fullScreen color="text-orange-500" />;
  }

  if (error) {
    return <ErrorState title="Failed to Load Dashboard" message={error} fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.welcome')}, {user?.name || 'User'}! 👋</h1>
          <p className="text-gray-600">Here's your cashback summary and recent activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="text-center" hover>
                <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.quickActions')}</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.div key={action.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <Link to={action.href}>
                      <div className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mr-4`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1"><div className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">{action.label}</div></div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.recentActivity')}</h2>
                <Link to={ROUTES.WALLET}><Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">View All</Button></Link>
              </div>
              <div className="space-y-4">
                {transactions.length > 0 ? transactions.map((transaction: Transaction, index: number) => (
                  <motion.div key={transaction.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </div>
                      <Badge variant={transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'danger'} size="sm">{transaction.status}</Badge>
                    </div>
                  </motion.div>
                )) : <EmptyState message="No recent activity to show."/>}
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
              <Link to={ROUTES.OFFERS}><Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">View All</Button></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.length > 0 ? offers.map((offer: Offer, index: number) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-2 right-2"><Star className="w-5 h-5 text-yellow-300 fill-current" /></div>
                  <div className="mb-4">
                    <div className="text-sm opacity-90 mb-1">{offer.store.name}</div>
                    <div className="text-lg font-semibold mb-2">{offer.title}</div>
                    <div className="text-sm opacity-90">{offer.description}</div>
                  </div>
                  <Button variant="secondary" size="sm">Shop Now</Button>
                </motion.div>
              )) : <EmptyState message="No recommended offers are available."/>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
