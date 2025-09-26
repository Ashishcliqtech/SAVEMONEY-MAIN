import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
} from 'lucide-react';
import { Card, Button, Badge } from '../../../components/ui';

export const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [chartType, setChartType] = useState('line');

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹12.4L',
      change: '+18%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'New Users',
      value: '2,847',
      change: '+12%',
      isPositive: true,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Orders',
      value: '8,924',
      change: '+8%',
      isPositive: true,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-2%',
      isPositive: false,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const topStores = [
    { name: 'Amazon', revenue: '₹4.2L', orders: 1234, growth: '+15%' },
    { name: 'Flipkart', revenue: '₹3.8L', orders: 987, growth: '+12%' },
    { name: 'Myntra', revenue: '₹2.1L', orders: 654, growth: '+8%' },
    { name: 'Nykaa', revenue: '₹1.9L', orders: 432, growth: '+22%' },
    { name: 'Zomato', revenue: '₹1.2L', orders: 321, growth: '+5%' },
  ];

  const topCategories = [
    { name: 'Electronics', percentage: 35, color: 'bg-blue-500' },
    { name: 'Fashion', percentage: 28, color: 'bg-purple-500' },
    { name: 'Beauty', percentage: 18, color: 'bg-pink-500' },
    { name: 'Food', percentage: 12, color: 'bg-orange-500' },
    { name: 'Others', percentage: 7, color: 'bg-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Track performance and insights across your platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" icon={Download}>
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center" hover>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 mb-2">{stat.title}</div>
                <div className={`text-sm font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.isPositive ? '↗' : '↘'} {stat.change}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Revenue Trends
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={chartType === 'line' ? 'primary' : 'ghost'}
                    size="sm"
                    icon={LineChart}
                    onClick={() => setChartType('line')}
                  />
                  <Button
                    variant={chartType === 'bar' ? 'primary' : 'ghost'}
                    size="sm"
                    icon={BarChart3}
                    onClick={() => setChartType('bar')}
                  />
                </div>
              </div>
              <div className="h-80 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-600">Revenue chart will be implemented here</p>
                  <p className="text-sm text-gray-500 mt-2">Integration with Chart.js or similar library</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Categories */}
          <div>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Top Categories
              </h3>
              <div className="space-y-4">
                {topCategories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {category.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${category.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Stores */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Top Performing Stores
            </h3>
            <div className="space-y-4">
              {topStores.map((store, index) => (
                <motion.div
                  key={store.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{store.name}</div>
                      <div className="text-sm text-gray-500">{store.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{store.revenue}</div>
                    <div className="text-sm text-green-600">{store.growth}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* User Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              User Activity
            </h3>
            <div className="h-64 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Users className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">User activity chart will be implemented here</p>
                <p className="text-sm text-gray-500 mt-2">Daily/Weekly/Monthly active users</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { action: 'New user registered', user: 'john.doe@example.com', time: '2 minutes ago', type: 'user' },
              { action: 'Withdrawal processed', user: 'jane.smith@example.com', time: '15 minutes ago', type: 'withdrawal' },
              { action: 'New store added', user: 'TechMart Electronics', time: '1 hour ago', type: 'store' },
              { action: 'Offer updated', user: 'Amazon 25% cashback', time: '2 hours ago', type: 'offer' },
              { action: 'High-value transaction', user: '₹50,000 purchase', time: '3 hours ago', type: 'transaction' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'user' ? 'bg-green-500' :
                    activity.type === 'withdrawal' ? 'bg-blue-500' :
                    activity.type === 'store' ? 'bg-purple-500' :
                    activity.type === 'offer' ? 'bg-orange-500' :
                    'bg-teal-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-500">{activity.user}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};