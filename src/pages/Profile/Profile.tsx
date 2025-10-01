import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Settings, Bell, Shield, Globe, CreditCard as Edit, Save, Camera } from 'lucide-react';
import { Card, Button, Input, Badge, LoadingSpinner, ErrorState } from '../../components/ui';
import { useLanguage } from '../../hooks';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { userApi } from '../../api';
import { User as UserType, NotificationPreferences } from '../../types';

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { user, loading: authLoading, error: authError } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [notifications, setNotifications] = useState<NotificationPreferences>({ email: true, push: true, sms: false });
  const [profile, setProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const userProfile = await userApi.getProfile();
      setProfile(userProfile);
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
      });
      setNotifications(userProfile.notificationPreferences || { email: true, push: true, sms: false });
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await userApi.updateProfile({ name: formData.name, phone: formData.phone });
      await fetchProfile(); // Refetch to get the latest data
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = async (type: keyof NotificationPreferences, value: boolean) => {
    const updatedPrefs = { ...notifications, [type]: value };
    setNotifications(updatedPrefs);
    try {
      await userApi.updateNotificationPreferences(updatedPrefs);
      toast.success('Notification preferences updated!');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      setIsLoading(true);
      try {
        await userApi.deleteAccount();
        toast.success('Account deleted successfully.');
        // Handle logout or redirect here
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (authLoading || isLoading) {
    return <LoadingSpinner size="xl" text="Loading your profile..." fullScreen />;
  }

  if (authError || error) {
    return <ErrorState title="Failed to Load Profile" message={authError || error} onRetry={fetchProfile} fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile.title')}</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={profile?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                    alt={profile?.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile?.name}</h2>
                <p className="text-gray-600 mb-4">{profile?.email}</p>
                <div className="space-y-2">
                  <Badge variant="primary" size="md">Premium Member</Badge>
                  <div className="text-sm text-gray-500">
                    Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      ₹{profile?.totalCashback?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-500">Total Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{profile?.referralCode || 'N/A'}</div>
                    <div className="text-sm text-gray-500">Referral Code</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  {t('profile.personalInfo')}
                </h3>
                <Button
                  variant={isEditing ? 'primary' : 'outline'}
                  size="sm"
                  icon={isEditing ? Save : Edit}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={isLoading}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </div>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing || isLoading}
                  icon={User}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  disabled
                  icon={Mail}
                />
                <Input
                  label="Phone Number"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!isEditing || isLoading}
                  icon={Phone}
                />
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                {t('profile.preferences')}
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    {t('profile.language')}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => changeLanguage(e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    {t('profile.notifications')}
                  </label>
                  <div className="space-y-3">
                    {[
                      { key: 'email', label: 'Email Notifications', description: 'Receive deal alerts and updates via email' },
                      { key: 'push', label: 'Push Notifications', description: 'Get instant notifications on your device' },
                      { key: 'sms', label: 'SMS Notifications', description: 'Receive important updates via SMS' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof NotificationPreferences]}
                            onChange={(e) => handleNotificationChange(item.key as keyof NotificationPreferences, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-red-600 mb-6">Danger Zone</h3>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="font-medium text-gray-900 mb-2">Delete Account</div>
                  <div className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </div>
                  <Button variant="danger" size="sm" onClick={handleDeleteAccount} disabled={isLoading}>
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};