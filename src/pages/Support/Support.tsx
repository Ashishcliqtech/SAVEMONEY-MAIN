import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  Send,
  Paperclip,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

export const Support: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    message: '',
    priority: 'medium',
  });

  const faqs = [
    {
      id: '1',
      question: 'How do I earn cashback?',
      answer: 'To earn cashback, simply click on any offer or store link from our website, complete your purchase on the merchant\'s website, and cashback will be credited to your account within 24-48 hours.',
    },
    {
      id: '2',
      question: 'When will I receive my cashback?',
      answer: 'Cashback is typically credited within 24-48 hours for most stores. However, some stores may take up to 7-14 days to confirm the transaction.',
    },
    {
      id: '3',
      question: 'What is the minimum withdrawal amount?',
      answer: 'The minimum withdrawal amount varies by payment method: UPI - ₹10, Bank Transfer - ₹50, Paytm - ₹10, Gift Vouchers - ₹100.',
    },
    {
      id: '4',
      question: 'How does the referral program work?',
      answer: 'Share your unique referral link with friends. When they sign up and make their first purchase, you both earn bonus cashback. You earn ₹100 for each successful referral.',
    },
    {
      id: '5',
      question: 'Why was my cashback declined?',
      answer: 'Cashback may be declined if you used external coupon codes, didn\'t complete the purchase through our link, or if the purchase was returned/cancelled.',
    },
    {
      id: '6',
      question: 'Can I use other coupon codes with cashback offers?',
      answer: 'Using external coupon codes may void your cashback eligibility. We recommend using only the codes provided on our platform to ensure cashback is tracked.',
    },
  ];

  const tickets = [
    {
      id: 'TKT-001',
      subject: 'Cashback not credited for Amazon order',
      status: 'open',
      priority: 'high',
      createdAt: '2025-01-20T10:30:00Z',
      lastUpdate: '2025-01-21T14:15:00Z',
    },
    {
      id: 'TKT-002',
      subject: 'Unable to withdraw money',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2025-01-18T09:20:00Z',
      lastUpdate: '2025-01-19T16:45:00Z',
    },
    {
      id: 'TKT-003',
      subject: 'Referral bonus not received',
      status: 'in-progress',
      priority: 'low',
      createdAt: '2025-01-15T11:10:00Z',
      lastUpdate: '2025-01-20T08:30:00Z',
    },
  ];

  const handleSubmitTicket = () => {
    if (!ticketForm.subject || !ticketForm.message) {
      toast.error('Please fill all required fields');
      return;
    }
    
    toast.success('Support ticket submitted successfully!');
    setTicketForm({ subject: '', message: '', priority: 'medium' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in-progress': return 'info';
      case 'resolved': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('support.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help! Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center h-full" hover>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Get instant help from our support team</p>
              <Button variant="primary" size="sm" fullWidth>
                Start Chat
              </Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center h-full" hover>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
              <Button variant="outline" size="sm" fullWidth>
                Send Email
              </Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center h-full" hover>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">Call us for urgent issues (Mon-Fri, 9AM-6PM)</p>
              <Button variant="outline" size="sm" fullWidth>
                Call Now
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-8 max-w-md mx-auto">
          {[
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'contact', label: 'Contact', icon: MessageCircle },
            { id: 'tickets', label: 'My Tickets', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedFaq === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Support Ticket</h2>
                
                <div className="space-y-6">
                  <Input
                    label="Subject"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={ticketForm.message}
                      onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Please provide detailed information about your issue..."
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      icon={Paperclip}
                    >
                      Attach File
                    </Button>
                    <span className="text-sm text-gray-500">
                      Max file size: 10MB
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    icon={Send}
                    onClick={handleSubmitTicket}
                    fullWidth
                  >
                    Submit Ticket
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'tickets' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {ticket.subject}
                          </h3>
                          <Badge variant={getStatusColor(ticket.status)} size="sm">
                            {ticket.status}
                          </Badge>
                          <Badge variant={getPriorityColor(ticket.priority)} size="sm">
                            {ticket.priority}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Ticket ID: {ticket.id}</span>
                          <span>•</span>
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Last update: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {ticket.status === 'resolved' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {tickets.length === 0 && (
                <Card className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No support tickets
                  </h3>
                  <p className="text-gray-500 mb-4">
                    You haven't submitted any support tickets yet.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setActiveTab('contact')}
                  >
                    Create New Ticket
                  </Button>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};