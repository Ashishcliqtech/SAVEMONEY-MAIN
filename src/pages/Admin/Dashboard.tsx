import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Store,
  Tag,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingBag,
  UserCheck,
  Activity,
  ArrowRight,
  Bell,
  Settings,
  BarChart3,
  Globe,
  Shield,
} from 'lucide-react';
import { Card, StatsCard, Button, Badge } from '../../components/ui';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: { value: '+12%', isPositive: true },
    },
    {
      title: 'Active Stores',
      value: '524',
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: { value: '+8', isPositive: true },
    },
    {
      title: 'Total Offers',
      value: '1,293',
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: { value: '+23', isPositive: true },
    },
    {
      title: 'Cashback Paid',
      value: '₹12.4L',
      icon: Wallet,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: { value: '+15%', isPositive: true },
    },
    {
      title: 'Pending Withdrawals',
      value: '47',
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      trend: { value: '-5', isPositive: true },
    },
    {
      title: 'Monthly Revenue',
      value: '₹2.8L',
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      trend: { value: '+18%', isPositive: true },
    },
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles & permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
      count: '2,847 users',
    },
    {
      title: 'Store Management',
      description: 'Add, edit partner stores & categories',
      icon: Store,
      href: '/admin/stores',
      color: 'bg-green-500',
      count: '524 stores',
    },
    {
      title: 'Offer Management',
      description: 'Create & manage cashback offers',
      icon: Tag,
      href: '/admin/offers',
      color: 'bg-purple-500',
      count: '1,293 offers',
    },
    {
      title: 'Withdrawal Processing',
      description: 'Process & approve withdrawals',
      icon: Wallet,
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

  const recentActivities = [
    {
      id: '1',
      type: 'user',
      message: 'New user registration: john.doe@example.com',
      time: '2 minutes ago',
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      id: '2',
      type: 'withdrawal',
      message: 'Withdrawal request approved: ₹5,000',
      time: '15 minutes ago',
      icon: CheckCircle,
      color: 'text-blue-600',
    },
    {
      id: '3',
      type: 'store',
      message: 'New store added: TechMart Electronics',
      time: '1 hour ago',
      icon: Store,
      color: 'text-purple-600',
    },
    {
      id: '4',
      type: 'offer',
      message: 'Featured offer updated: Amazon 25% cashback',
      time: '2 hours ago',
      icon: Tag,
      color: 'text-orange-600',
    },
    {
      id: '5',
      type: 'notification',
      message: 'Bulk notification sent to 1,200 users',
      time: '3 hours ago',
      icon: Bell,
      color: 'text-pink-600',
    },
  ];

  const systemAlerts = [
    {
      type: 'warning',
      message: 'Server CPU usage is above 80%',
      action: 'Monitor',
    },
    {
      type: 'info',
      message: 'Database backup completed successfully',
      action: 'View',
    },
    {
      type: 'success',
      message: 'SSL certificate renewed automatically',
      action: 'Details',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening with your platform.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="success" size="md">
              <Shield className="w-4 h-4 mr-1" />
              System Healthy
            </Badge>
            <Button variant="primary" size="sm">
              Quick Actions
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
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

        {/* System Alerts */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  alert.type === 'success' ? 'bg-green-50 border border-green-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'success' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-sm text-gray-900">{alert.message}</span>
                </div>
                <Button variant="ghost" size="sm">
                  {alert.action}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Management Modules
              </h2>
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
                          <div className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                            {action.title}
                          </div>
                          <div className="text-sm text-gray-500 mb-1">
                            {action.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            {action.count}
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

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Activities
                </h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Platform Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Uptime</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium text-blue-600">245ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <span className="text-sm font-medium text-purple-600">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Size</span>
                <span className="text-sm font-medium text-orange-600">2.4 GB</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Today's Signups</span>
                <span className="text-sm font-medium text-green-600">+47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Today's Orders</span>
                <span className="text-sm font-medium text-blue-600">234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Today's Cashback</span>
                <span className="text-sm font-medium text-purple-600">₹45,230</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Support Tickets</span>
                <span className="text-sm font-medium text-orange-600">12 open</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};