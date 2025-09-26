import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Mail,
  Database,
  Users,
  Save,
  RefreshCw,
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../../components/ui';
import toast from 'react-hot-toast';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'SaveMoney',
    siteDescription: 'Your trusted partner for saving money on every online purchase',
    supportEmail: 'support@savemoney.com',
    minWithdrawal: 10,
    maxCashback: 25,
    referralBonus: 100,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    autoApproveWithdrawals: false,
  });

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Database },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      toast.success('Settings reset to default values');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            System Settings
          </h1>
          <p className="text-gray-600">
            Configure your platform settings and preferences
          </p>
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <Card>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:w-3/4">
            <Card>
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    General Settings
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Site Name"
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    />
                    <Input
                      label="Support Email"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Minimum Withdrawal (₹)"
                      type="number"
                      value={settings.minWithdrawal}
                      onChange={(e) => setSettings({...settings, minWithdrawal: parseInt(e.target.value)})}
                    />
                    <Input
                      label="Maximum Cashback (%)"
                      type="number"
                      value={settings.maxCashback}
                      onChange={(e) => setSettings({...settings, maxCashback: parseInt(e.target.value)})}
                    />
                    <Input
                      label="Referral Bonus (₹)"
                      type="number"
                      value={settings.referralBonus}
                      onChange={(e) => setSettings({...settings, referralBonus: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Payment Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">UPI Payments</div>
                        <div className="text-sm text-gray-500">Enable UPI withdrawal method</div>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Bank Transfer</div>
                        <div className="text-sm text-gray-500">Enable bank transfer withdrawals</div>
                      </div>
                      <Badge variant="success">Enabled</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Auto-approve Withdrawals</div>
                        <div className="text-sm text-gray-500">Automatically approve withdrawal requests under ₹1000</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoApproveWithdrawals}
                          onChange={(e) => setSettings({...settings, autoApproveWithdrawals: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Notification Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Email Notifications</div>
                        <div className="text-sm text-gray-500">Send email notifications to users</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">SMS Notifications</div>
                        <div className="text-sm text-gray-500">Send SMS notifications to users</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Security Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-green-600 mr-2" />
                        <div className="font-medium text-green-800">SSL Certificate</div>
                      </div>
                      <div className="text-sm text-green-700 mt-1">Active and valid</div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <Database className="w-5 h-5 text-blue-600 mr-2" />
                        <div className="font-medium text-blue-800">Database Backup</div>
                      </div>
                      <div className="text-sm text-blue-700 mt-1">Last backup: 2 hours ago</div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-yellow-600 mr-2" />
                        <div className="font-medium text-yellow-800">Two-Factor Authentication</div>
                      </div>
                      <div className="text-sm text-yellow-700 mt-1">Recommended for admin accounts</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    System Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Maintenance Mode</div>
                        <div className="text-sm text-gray-500">Put the site in maintenance mode</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900 mb-2">System Version</div>
                        <div className="text-sm text-gray-600">v2.1.0</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900 mb-2">Last Updated</div>
                        <div className="text-sm text-gray-600">January 20, 2025</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
                <Button
                  variant="outline"
                  icon={RefreshCw}
                  onClick={handleReset}
                >
                  Reset to Default
                </Button>
                <Button
                  variant="primary"
                  icon={Save}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};