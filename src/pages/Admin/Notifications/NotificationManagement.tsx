import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Plus,
  Eye,
  Target,
  Users,
} from 'lucide-react';
import { Card, Button, Input, Modal, ErrorState, LoadingSpinner } from '../../../components/ui';
import { useNotificationStats, useCreateNotification } from '../../../hooks/useSupabase';
import { NotificationData } from '../../../types';
import toast from 'react-hot-toast';

export const NotificationManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: stats, isLoading, isError, error } = useNotificationStats();
  const createNotificationMutation = useCreateNotification();

  const [newNotification, setNewNotification] = useState<NotificationData>({
    recipient: '',
    title: '',
    message: '',
    type: 'system',
    actionUrl: '',
  });

  const handleSendNotification = () => {
    if (!newNotification.recipient || !newNotification.title || !newNotification.message) {
      toast.error('Recipient, Title, and Message are required fields.');
      return;
    }

    createNotificationMutation.mutate(newNotification, {
      onSuccess: () => {
        setShowModal(false);
        setNewNotification({
          recipient: '',
          title: '',
          message: '',
          type: 'system',
          actionUrl: '',
        });
      },
    });
  };
  
  const openCreateModal = () => {
    setNewNotification({
      recipient: '',
      title: '',
      message: '',
      type: 'system',
      actionUrl: '',
    });
    setShowModal(true);
  }

  const renderStats = () => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="text-center flex justify-center items-center h-32">
                        <LoadingSpinner />
                    </Card>
                ))}
            </div>
        );
    }

    if (isError) {
      return <ErrorState title="Failed to load stats" message={error?.message || 'An unexpected error occurred.'} />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalSent ?? 0}</div>
              <div className="text-gray-600">Total Sent</div>
          </Card>
          <Card className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{`${stats?.openRate ?? 0}%`}</div>
              <div className="text-gray-600">Open Rate</div>
          </Card>
          <Card className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{`${stats?.clickRate ?? 0}%`}</div>
              <div className="text-gray-600">Click Rate</div>
          </Card>
          <Card className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalOpens ?? 0}</div>
              <div className="text-gray-600">Total Opens</div>
          </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Notification Center
            </h1>
            <p className="text-gray-600">
              Send and manage notifications to your users
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={openCreateModal}>
            Create Notification
          </Button>
        </div>

        {renderStats()}

        <Card className='text-center'>
          <p className='text-gray-600'>Notification history for individual users can be viewed on their respective profile pages. This dashboard provides aggregate statistics for all notifications.</p>
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={'Create Notification'}
          size="xl"
        >
          <div className="space-y-6">
              <Input
                label="Recipient User ID"
                value={newNotification.recipient}
                onChange={(e) => setNewNotification({...newNotification, recipient: e.target.value})}
                placeholder="Enter the User ID or 'all' for everyone"
              />
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
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value as NotificationData['type']})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="system">System</option>
                  <option value="offer">Offer</option>
                  <option value="wallet">Wallet</option>
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
            <Input
                label="Action URL (Optional)"
                value={newNotification.actionUrl}
                onChange={(e) => setNewNotification({...newNotification, actionUrl: e.target.value})}
                placeholder="e.g., /offers/offer-id-123"
              />

            <div className="flex space-x-4 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowModal(false)}
                disabled={createNotificationMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                icon={Send}
                onClick={handleSendNotification}
                disabled={createNotificationMutation.isLoading}
              >
                {createNotificationMutation.isLoading ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};