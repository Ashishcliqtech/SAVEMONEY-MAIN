
import React, { useState } from 'react';
import { SupportHeader } from './components/SupportHeader';
import { QuickContactCards } from './components/QuickContactCards';
import { SupportTabs } from './components/SupportTabs';
import { SupportFAQ } from './components/SupportFAQ';
import { SupportContactForm } from './components/SupportContactForm';
import { SupportTickets } from './components/SupportTickets';
import { SupportTicketView } from './components/SupportTicketView';
import { useGetUserSupportTickets } from '../../hooks/useSupport';
import { LoadingSpinner, Alert } from '../../components/ui';

export const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets'>('faq');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState({ subject: '', message: '', priority: 'medium' });

  const { data: tickets, isLoading, isError, error } = useGetUserSupportTickets();

  const faqs = [
    {
      question: 'How does cashback work?',
      answer:
        'Cashback is a reward program where you get a percentage of your spending back. When you shop at our partner stores through our platform, we receive a commission, and we share a portion of it with you as cashback.',
    },
    {
      question: 'How do I track my cashback?',
      answer:
        'You can track your cashback status in the "Cashback History" section of your account. It will show pending, confirmed, and paid cashback amounts.',
    },
    {
      question: 'When will I receive my cashback?',
      answer:
        'Cashback is usually credited to your account within 2-3 business days after your purchase is verified by the store. However, it may take up to 90 days depending on the store\'s policy.',
    },
    {
      question: 'What is the minimum payout amount?',
      answer:
        'The minimum payout amount is $10. Once your confirmed cashback balance reaches this amount, you can request a payout to your bank account or PayPal.',
    },
    {
      question: 'Do you have a mobile app?',
      answer:
        'Yes, we have a mobile app for both Android and iOS devices. You can download it from the App Store or Google Play Store to shop and earn cashback on the go.',
    },
  ];

  const handleViewTicket = (id: string) => {
    setSelectedTicketId(id);
  };

  const handleBackToTickets = () => {
    setSelectedTicketId(null);
  };

  const renderContent = () => {
    if (selectedTicketId) {
      return <SupportTicketView ticketId={selectedTicketId} onBack={handleBackToTickets} />;
    }

    switch (activeTab) {
      case 'faq':
        return <SupportFAQ faqs={faqs} />;
      case 'contact':
        return (
          <SupportContactForm
            ticketForm={ticketForm}
            setTicketForm={setTicketForm}
          />
        );
      case 'tickets':
        if (isLoading) {
          return (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          );
        }
        if (isError) {
          return (
            <Alert variant="error" title="Error loading tickets">
              {error instanceof Error ? error.message : 'There was a problem fetching your support tickets.'}
            </Alert>
          );
        }
        return (
          <SupportTickets
            tickets={tickets || []}
            onViewTicket={handleViewTicket}
            onCreateNew={() => setActiveTab('contact')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SupportHeader />
        <QuickContactCards />
        <SupportTabs activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-8 max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
