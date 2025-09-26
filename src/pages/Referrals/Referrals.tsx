import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Users,
  Share2,
  Copy,
  MessageCircle,
  Mail,
  Gift,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const Referrals: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [shareMethod, setShareMethod] = useState<'whatsapp' | 'email' | 'copy'>('copy');
  
  // Mock referral data - will be replaced with real Supabase data
  const referralData = {
    totalEarnings: 2500,
    totalReferrals: 12,
    pendingEarnings: 400,
    referralCode: user?.referralCode || 'SAVE123',
    referralLink: `https://savemoney.com/ref/${user?.referralCode || 'SAVE123'}`,
    recentReferrals: [],
  };

  const handleCopyLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      toast.success('Referral link copied!');
    }
  };

  const handleShare = (method: 'whatsapp' | 'email') => {
    if (!referralData?.referralLink) return;

    const message = `Join SaveMoney and start earning cashback on every purchase! Use my referral link: ${referralData.referralLink}`;
    
    if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    } else if (method === 'email') {
      window.open(`mailto:?subject=Join SaveMoney&body=${encodeURIComponent(message)}`);
    }
  };

  const stats = [
    {
      label: t('referrals.totalEarnings'),
      value: `₹${referralData?.totalEarnings?.toLocaleString() || '0'}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: t('referrals.totalReferrals'),
      value: referralData?.totalReferrals?.toString() || '0',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: t('referrals.pendingEarnings'),
      value: `₹${referralData?.pendingEarnings?.toLocaleString() || '0'}`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: t('referrals.step1'),
      description: 'Share your unique referral link with friends and family',
      icon: Share2,
    },
    {
      step: 2,
      title: t('referrals.step2'),
      description: 'They create an account and make their first purchase',
      icon: Users,
    },
    {
      step: 3,
      title: t('referrals.step3'),
      description: 'You both receive bonus cashback rewards',
      icon: Gift,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('referrals.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('referrals.subtitle')}
          </p>
        </div>

        {/* Stats */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Referral Link Section */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('referrals.inviteFriends')}
            </h2>

            {/* Referral Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('referrals.yourReferralCode')}
              </label>
              <div className="flex">
                <Input
                  value={referralData?.referralCode || 'SAVE123'}
                  readOnly
                  className="flex-1 rounded-r-none"
                />
                <Button
                  variant="outline"
                  icon={Copy}
                  onClick={() => {
                    navigator.clipboard.writeText(referralData?.referralCode || 'SAVE123');
                    toast.success('Referral code copied!');
                  }}
                  className="rounded-l-none border-l-0"
                />
              </div>
            </div>

            {/* Referral Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('referrals.referralLink')}
              </label>
              <div className="flex">
                <Input
                  value={referralData?.referralLink || 'https://savemoney.com/ref/SAVE123'}
                  readOnly
                  className="flex-1 rounded-r-none text-sm"
                />
                <Button
                  variant="outline"
                  icon={Copy}
                  onClick={handleCopyLink}
                  className="rounded-l-none border-l-0"
                />
              </div>
            </div>

            {/* Share Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={MessageCircle}
                onClick={() => handleShare('whatsapp')}
                className="bg-green-600 hover:bg-green-700"
              >
                {t('referrals.shareViaWhatsApp')}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                fullWidth
                icon={Mail}
                onClick={() => handleShare('email')}
              >
                {t('referrals.shareViaEmail')}
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                icon={Copy}
                onClick={handleCopyLink}
              >
                {t('referrals.copyLink')}
              </Button>
            </div>
          </Card>

          {/* How It Works */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t('referrals.howItWorks')}
            </h2>

            <div className="space-y-6">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Step {step.step}: {step.title}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {step.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bonus Info */}
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <Gift className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    Earn ₹100 for each referral!
                  </div>
                  <div className="text-sm text-gray-600">
                    Plus your friend gets ₹50 welcome bonus
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Referrals */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t('referrals.recentReferrals')}
          </h2>

          <div className="space-y-4">
            {referralData?.recentReferrals?.map((referral, index) => (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{referral.name}</div>
                    <div className="text-sm text-gray-500">{referral.email}</div>
                    <div className="text-sm text-gray-500">
                      {t('referrals.joinedOn')} {new Date(referral.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    +₹{referral.earnings}
                  </div>
                  <Badge
                    variant={referral.status === 'completed' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {referral.status}
                  </Badge>
                </div>
              </motion.div>
            ))}

            {(!referralData?.recentReferrals || referralData.recentReferrals.length === 0) && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No referrals yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start inviting friends to see your referral activity here
                </p>
                <Button
                  variant="primary"
                  icon={Share2}
                  onClick={handleCopyLink}
                >
                  Share Your Link
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};