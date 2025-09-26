import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Send,
  Users,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Target,
  MessageSquare,
  Mail,
  Smartphone,
  Globe,
} from 'lucide-react';
import { Card, Button, Input, Modal, Badge, Pagination } from '../../../components/ui';
import toast from 'react-hot-toast';

interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
  type: 'deal' | 'cashback' | 'withdrawal' | 'referral' | 'support' | 'system';
  targetAudience: 'all' | 'active' | 'inactive' | 'premium' | 'new';
  channels: ('push' | 'email' | 'sms' | 'in-app')[];
  status: 'draft' | 'scheduled' | 'sent';
  scheduledDate?: string;
  sentCount?: number;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
}

export const NotificationManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationTemplate[]>([
    {
      id: '1',
      title: 'Flash Sale Alert - 70% Off Fashion',
      message: 'Don\'t miss out! Myntra flash sale is live now with up to 70% off + 20% cashback.',
      type: 'deal',
      targetAudience: 'all',
      channels: ['push', 'email', 'in-app'],
      status: 'sent',
      sentCount: 2847,
      openRate: 68,
      clickRate: 24,
      createdAt: '2025-01-22T10:30:00Z',
    },
    {
      id: '2',
      title: 'Cashback Credited - ₹150',
      message: 'Great news! Your cashback of ₹150 from Amazon has been credited to your wallet.',
      type: 'cashback',
      targetAudience: 'active',
      channels: ['push', 'in-app'],
      status: 'sent',
      sentCount: 156,
      openRate: 89,
      clickRate: 45,
      createdAt: '2025-01-22T08:15:00Z',
    },
    {
      id: '3',
      title: 'Weekend Special Offers',
      message: 'This weekend only! Extra 25% cashback on all electronics purchases.',
      type: 'deal',
      targetAudience: 'premium',
      channels: ['email', 'push', 'sms'],
      status: 'scheduled',
      scheduledDate: '2025-01-25T09:00:00Z',
      createdAt: '2025-01-21T16:45:00Z',
    },
    {
      id: '4',
      title: 'Welcome to SaveMoney!',
      message: 'Welcome aboard! Here\'s your ₹100 welcome bonus. Start shopping and earning cashback today.',
      type: 'system',
      targetAudience: 'new',
      channels: ['email', 'in-app'],
      status: 'draft',
      createdAt: '2025-01-21T14:20:00Z',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'deal' as const,
    targetAudience: 'all' as const,
    channels: ['push'] as ('push' | 'email' | 'sms' | 'in-app')[],
    scheduledDate: '',
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error('Please fill all required fields');
      return;
    }

    const notification: NotificationTemplate = {
      id: Date.now().toString(),
      ...newNotification,
      status: newNotification.scheduledDate ? 'scheduled' : 'sent',
      sentCount: newNotification.scheduledDate ? undefined : Math.floor(Math.random() * 3000),
      openRate: newNotification.scheduledDate ? undefined : Math.floor(Math.random() * 100),
      clickRate: newNotification.scheduledDate ? undefined : Math.floor(Math.random() * 50),
      createdAt: new Date().toISOString(),
    };

    setNotifications([notification, ...notifications]);
    setNewNotification({
      title: '',
      message: '',
      type: 'deal',
      targetAudience: 'all',
      channels: ['push'],
      scheduledDate: '',
    });
    setShowModal(false);
    toast.success(newNotification.scheduledDate ? 'Notification scheduled successfully!' : 'Notification sent successfully!');
  };

  const handleEdit = (notification: NotificationTemplate) => {
    setSelectedNotification(notification);
    setNewNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      targetAudience: notification.targetAudience,
      channels: notification.channels,
      scheduledDate: notification.scheduledDate || '',
    });
    setShowModal(true);
  };

  const handleDelete = (notificationId: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
      toast.success('Notification deleted successfully!');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deal': return 'warning';
      case 'cashback': return 'success';
      case 'withdrawal': return 'info';
      case 'referral': return 'secondary';
      case 'support': return 'danger';
      case 'system': return 'primary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'success';
      case 'scheduled': return 'warning';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'push': return Bell;
      case 'email': return Mail;
      case 'sms': return Smartphone;
      case 'in-app': return MessageSquare;
      default: return Bell;
    }
  };

  const audienceOptions = [
    { value: 'all', label: 'All Users', count: '2,847' },
    { value: 'active', label: 'Active Users', count: '2,156' },
    { value: 'inactive', label: 'Inactive Users', count: '691' },
    { value: 'premium', label: 'Premium Users', count: '456' },
    { value: 'new', label: 'New Users (7 days)', count: '89' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notification Center
            </h1>
            <p className="text-gray-600">
              Send and manage notifications to your users
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
            Create Notification
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">1,247</div>
            <div className="text-gray-600">Total Sent</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">72%</div>
            <div className="text-gray-600">Open Rate</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">34%</div>
            <div className="text-gray-600">Click Rate</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="text-gray-600">Scheduled</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="deal">Deal Alerts</option>
                <option value="cashback">Cashback</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="referral">Referrals</option>
                <option value="support">Support</option>
                <option value="system">System</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4 mb-8">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <Badge variant={getTypeColor(notification.type)} size="sm">
                        {notification.type}
                      </Badge>
                      <Badge variant={getStatusColor(notification.status)} size="sm">
                        {notification.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{notification.targetAudience}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {notification.channels.map((channel) => {
                          const IconComponent = getChannelIcon(channel);
                          return (
                            <IconComponent key={channel} className="w-4 h-4" />
                          );
                        })}
                      </div>

                      {notification.status === 'sent' && (
                        <>
                          <div>Sent: {notification.sentCount?.toLocaleString()}</div>
                          <div>Open: {notification.openRate}%</div>
                          <div>Click: {notification.clickRate}%</div>
                        </>
                      )}

                      {notification.status === 'scheduled' && notification.scheduledDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(notification.scheduledDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEdit(notification)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(notification.id)}
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredNotifications.length / 10)}
          onPageChange={setCurrentPage}
        />

        {/* Create/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedNotification ? 'Edit Notification' : 'Create Notification'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Notification Title"
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                placeholder="Enter notification title"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="deal">Deal Alert</option>
                  <option value="cashback">Cashback</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="referral">Referral</option>
                  <option value="support">Support</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Enter notification message..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={newNotification.targetAudience}
                  onChange={(e) => setNewNotification({...newNotification, targetAudience: e.target.value as any})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {audienceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} ({option.count})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Schedule Date (Optional)"
                type="datetime-local"
                value={newNotification.scheduledDate}
                onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Channels
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'push', label: 'Push', icon: Bell },
                  { id: 'email', label: 'Email', icon: Mail },
                  { id: 'sms', label: 'SMS', icon: Smartphone },
                  { id: 'in-app', label: 'In-App', icon: MessageSquare },
                ].map((channel) => {
                  const IconComponent = channel.icon;
                  return (
                    <label
                      key={channel.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        newNotification.channels.includes(channel.id as any)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newNotification.channels.includes(channel.id as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNotification({
                              ...newNotification,
                              channels: [...newNotification.channels, channel.id as any]
                            });
                          } else {
                            setNewNotification({
                              ...newNotification,
                              channels: newNotification.channels.filter(c => c !== channel.id)
                            });
                          }
                        }}
                        className="sr-only"
                      />
                      <IconComponent className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">{channel.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                icon={Send}
                onClick={handleSendNotification}
              >
                {newNotification.scheduledDate ? 'Schedule' : 'Send'} Notification
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};