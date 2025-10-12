// src/pages/Help/hooks/useHelpData.ts
import {
    HelpCircle,
    MessageCircle,
    Phone,
    Mail,
    Book,
    Video,
    FileText,
    Users,
    Clock,
    AlertCircle,
  } from 'lucide-react';
  import { ROUTES } from '../../../constants';
  
  export const useHelpData = (navigate: any) => {
    const categories = [
      { id: 'getting-started', name: 'Getting Started', icon: Users, color: 'text-green-600', bgColor: 'bg-green-100', count: 8 },
      { id: 'cashback', name: 'Cashback & Earnings', icon: HelpCircle, color: 'text-purple-600', bgColor: 'bg-purple-100', count: 12 },
      { id: 'withdrawals', name: 'Withdrawals', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', count: 6 },
      { id: 'account', name: 'Account & Profile', icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-100', count: 5 },
      { id: 'technical', name: 'Technical Issues', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', count: 4 },
    ];
  
    const faqs = { /* same FAQ JSON as before */ };
  
    const resources = [
      { title: 'Video Tutorials', description: 'Watch step-by-step guides', icon: Video, color: 'text-red-600', bgColor: 'bg-red-100', count: '12 videos' },
      { title: 'User Guide', description: 'Complete documentation', icon: Book, color: 'text-blue-600', bgColor: 'bg-blue-100', count: '25 articles' },
      { title: 'Terms & Conditions', description: 'Legal service terms', icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100', count: 'Legal docs' },
    ];
  
    const contactOptions = [
      {
        title: 'Live Chat',
        description: 'Get instant help from our support team',
        icon: MessageCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        availability: 'Available 24/7',
        action: 'Start Chat',
        onClick: () => navigate(ROUTES.LIVE_CHAT),
      },
      {
        title: 'Email Support',
        description: 'Send us an email within 24 hours',
        icon: Mail,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        availability: 'Response within 24h',
        action: 'Send Email',
        onClick: () => (window.location.href = 'mailto:support@savemoney.com'),
      },
      {
        title: 'Phone Support',
        description: 'Call us for urgent issues',
        icon: Phone,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        availability: 'Mon–Fri, 9AM–6PM',
        action: 'Call Now',
        onClick: () => (window.location.href = 'tel:+1234567890'),
      },
    ];
  
    return { categories, faqs, resources, contactOptions };
  };
  