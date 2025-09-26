import React from 'react';
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
import { Card, Button, Badge } from '../../components/ui';
import { useWallet, useTransactions } from '../../hooks/useSupabase';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: walletData } = useWallet(user?.id);
  const { data: transactionsData } = useTransactions(user?.id, 1, 5);

  const quickActions = [
    {
      icon: Wallet,
      label: t('dashboard.viewWallet'),
      href: ROUTES.WALLET,
      color: 'bg-purple-500',
    },
    {
      icon: ShoppingBag,
      label: t('dashboard.browseOffers'),
      href: ROUTES.OFFERS,
      color: 'bg-teal-500',
    },
    {
      icon: Users,
      label: t('dashboard.invite'),
      href: ROUTES.REFERRALS,
      color: 'bg-orange-500',
    },
    {
      icon: Gift,
      label: t('dashboard.support'),
      href: ROUTES.SUPPORT,
      color: 'bg-green-500',
    },
  ];

  const stats = [
    {
      label: t('dashboard.totalEarnings'),
      value: `₹${walletData?.totalCashback?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: t('dashboard.availableCashback'),
      value: `₹${walletData?.availableCashback?.toLocaleString() || '0'}`,
      icon: Wallet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: t('dashboard.pendingCashback'),
      value: `₹${walletData?.pendingCashback?.toLocaleString() || '0'}`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcome')}, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your cashback summary and recent activity
          </p>
        </div>

        {/* Stats Cards */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t('dashboard.quickActions')}
              </h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={action.href}>
                      <div className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer">
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mr-4`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                            {action.label}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('dashboard.recentActivity')}
                </h2>
                <Link to={ROUTES.WALLET}>
                  <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {transactionsData?.transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl"
                  >
                    <img
                      src={transaction.store.logo}
                      alt={transaction.store.name}
                      className="w-12 h-12 rounded-xl object-cover mr-4"
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
                  <div className="text-center py-8">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No transactions yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Start shopping to see your cashback activity here
                    </p>
                    <Link to={ROUTES.OFFERS}>
                      <Button variant="primary">
                        Browse Offers
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Featured Offers */}
        <div className="mt-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recommended for You
              </h2>
              <Link to={ROUTES.OFFERS}>
                <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-purple-500 to-teal-500 rounded-xl p-6 text-white relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2">
                    <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  </div>
                  <div className="mb-4">
                    <div className="text-sm opacity-90 mb-1">Amazon</div>
                    <div className="text-lg font-semibold mb-2">
                      Flat 50% Off + 15% Cashback
                    </div>
                    <div className="text-sm opacity-90">
                      On electronics and gadgets
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Shop Now
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};