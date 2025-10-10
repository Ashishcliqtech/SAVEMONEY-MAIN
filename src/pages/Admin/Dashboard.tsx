import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Store,
  Tag,
  Wallet,
  TrendingUp,
  ArrowRight,
  Bell,
  Settings,
  BarChart3,
  Globe,
  Shield,
  CreditCard,
  Briefcase,
  GitMerge,
  GitPullRequest,
  UserCheck,
} from 'lucide-react';
import { Card, StatsCard, Button, Badge, LoadingSpinner } from '../../components/ui';
import { Link } from 'react-router-dom';
import { useDashboardStats, useRecentActivities } from '../../hooks/useApi';
import { Activity } from '../../types';

const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} years ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return `${Math.floor(seconds)} seconds ago`;
};

export const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: recentActivities, isLoading: isLoadingActivities } = useRecentActivities();

  const activityIconMap: { [key: string]: React.FC<any> } = {
    user: UserCheck,
    offer: Tag,
    transaction: Wallet,
    store: Store,
    withdrawal: CreditCard,
  };

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles & permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
      count: `${stats?.users || 0} users`,
    },
    {
      title: 'Store Management',
      description: 'Add, edit partner stores & categories',
      icon: Store,
      href: '/admin/stores',
      color: 'bg-green-500',
      count: `${stats?.stores || 0} stores`,
    },
    {
      title: 'Offer Management',
      description: 'Create & manage cashback offers',
      icon: Tag,
      href: '/admin/offers',
      color: 'bg-purple-500',
      count: `${stats?.offers || 0} offers`,
    },
    {
      title: 'Withdrawal Processing',
      description: 'Process & approve withdrawals',
      icon: CreditCard,
      href: '/admin/withdrawals',
      color: 'bg-orange-500',
      count: '47 pending',
    },
    {
      title: 'Content Management',
      description: 'Manage homepage content & features',
      icon: Globe,
      href: '/admin/content',
      color: 'bg-indigo-500',
      count: '12 sections',
    },
    {
      title: 'Notification Center',
      description: 'Send & manage notifications',
      icon: Bell,
      href: '/admin/notifications',
      color: 'bg-pink-500',
      count: '156 sent',
    },
    {
      title: 'Analytics & Reports',
      description: 'View detailed analytics & reports',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-teal-500',
      count: '24 reports',
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
      count: '8 modules',
    },
  ];

  const statsList = [
    {
      title: 'Total Users',
      value: stats?.users?.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Stores',
      value: stats?.stores?.toLocaleString() || '0',
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Offers',
      value: stats?.offers?.toLocaleString() || '0',
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Cashback Paid',
      value: `₹${stats?.totalCashback?.toLocaleString() || '0'}`,
      icon: Wallet,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Clicks',
      value: stats?.clicks?.toLocaleString() || '0',
      icon: GitMerge,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Transactions',
      value: stats?.transactions?.toLocaleString() || '0',
      icon: Briefcase,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
     {
      title: 'Referrals',
      value: stats?.referrals?.toLocaleString() || '0',
      icon: GitPullRequest,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Monthly Revenue',
      value: '₹2.8L',
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      trend: { value: '+18%', isPositive: true },
    },
  ]

  const isLoading = isLoadingStats || isLoadingActivities;

  if (isLoading) {
    return <LoadingSpinner size="xl" text="Loading Admin Dashboard..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="success" size="md">
              <Shield className="w-4 h-4 mr-1" />
              System Healthy
            </Badge>
            <Button variant="primary" size="sm">Quick Actions</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsList.map((stat, index) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
              trend={stat.trend}
              delay={index * 0.1}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Management Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={action.href}>
                      <div className="flex items-center p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer border border-gray-200 h-full">
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mr-4`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">{action.title}</div>
                          <div className="text-sm text-gray-500 mb-1">{action.description}</div>
                          <div className="text-xs text-gray-400">{action.count}</div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {recentActivities?.map((activity: Activity, index: number) => {
                  const Icon = activityIconMap[activity.type] || Bell;
                  return (
                    <motion.div
                      key={activity._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 leading-relaxed">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{timeAgo(activity.createdAt)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
