import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Book,
  Video,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Card, Button, Badge, SearchBar } from '../../components/ui';

export const Help: React.FC = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      count: 8,
    },
    {
      id: 'cashback',
      name: 'Cashback & Earnings',
      icon: HelpCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      count: 12,
    },
    {
      id: 'withdrawals',
      name: 'Withdrawals',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      count: 6,
    },
    {
      id: 'account',
      name: 'Account & Profile',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      count: 5,
    },
    {
      id: 'technical',
      name: 'Technical Issues',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      count: 4,
    },
  ];

  const faqs = {
    'getting-started': [
      {
        id: '1',
        question: 'How do I create an account?',
        answer: 'Creating an account is simple! Click on the "Sign Up" button, enter your email address, create a password, and verify your email. You can also sign up using your Google or Facebook account for faster registration.',
      },
      {
        id: '2',
        question: 'Is SaveMoney free to use?',
        answer: 'Yes, SaveMoney is completely free to use. There are no membership fees, subscription charges, or hidden costs. We earn a small commission from partner stores when you make purchases, which allows us to offer cashback to you.',
      },
      {
        id: '3',
        question: 'How do I start earning cashback?',
        answer: 'After creating your account, browse our offers, click on any store or deal, and complete your purchase on the merchant\'s website. Your cashback will be tracked automatically and credited to your account.',
      },
      {
        id: '4',
        question: 'Do I need to download an app?',
        answer: 'While we have a mobile app for convenience, you can use SaveMoney directly through your web browser on any device. The app offers additional features like push notifications for deals.',
      },
    ],
    'cashback': [
      {
        id: '5',
        question: 'How long does it take to receive cashback?',
        answer: 'Cashback is typically credited within 24-48 hours for most stores. However, some stores may take up to 7-14 days to confirm the transaction. You can track the status in your dashboard.',
      },
      {
        id: '6',
        question: 'Why wasn\'t my cashback tracked?',
        answer: 'Cashback might not be tracked if you used external coupon codes, didn\'t complete the purchase through our link, had ad blockers enabled, or if the purchase was returned/cancelled.',
      },
      {
        id: '7',
        question: 'What is the maximum cashback I can earn?',
        answer: 'There\'s no limit to how much cashback you can earn! However, individual stores may have monthly or per-transaction limits. These limits are clearly mentioned on each store\'s page.',
      },
      {
        id: '8',
        question: 'Can I use other coupon codes with cashback offers?',
        answer: 'Using external coupon codes may void your cashback eligibility. We recommend using only the codes provided on our platform to ensure your cashback is tracked properly.',
      },
    ],
    'withdrawals': [
      {
        id: '9',
        question: 'What is the minimum withdrawal amount?',
        answer: 'Minimum withdrawal amounts vary by method: UPI - ₹10, Bank Transfer - ₹50, Paytm - ₹10, Gift Vouchers - ₹100.',
      },
      {
        id: '10',
        question: 'How long do withdrawals take?',
        answer: 'UPI and Paytm withdrawals are processed within 24 hours. Bank transfers take 2-3 business days. Gift vouchers are delivered instantly via email.',
      },
      {
        id: '11',
        question: 'Are there any withdrawal fees?',
        answer: 'No, we don\'t charge any fees for withdrawals. However, your bank or payment provider may charge their own processing fees.',
      },
    ],
    'account': [
      {
        id: '12',
        question: 'How do I change my email address?',
        answer: 'Go to your Profile settings, click on "Personal Information", and update your email address. You\'ll need to verify the new email address before the change takes effect.',
      },
      {
        id: '13',
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
      },
      {
        id: '14',
        question: 'Can I delete my account?',
        answer: 'Yes, you can delete your account from the Profile settings. Please note that this action is irreversible and you\'ll lose all your cashback history and pending earnings.',
      },
    ],
    'technical': [
      {
        id: '15',
        question: 'The website is not loading properly. What should I do?',
        answer: 'Try clearing your browser cache and cookies, disable ad blockers temporarily, or try using a different browser. If the issue persists, contact our support team.',
      },
      {
        id: '16',
        question: 'I\'m not receiving email notifications. How do I fix this?',
        answer: 'Check your spam/junk folder, add our email address to your contacts, and ensure email notifications are enabled in your account settings.',
      },
    ],
  };

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides on how to use SaveMoney',
      icon: Video,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      count: '12 videos',
    },
    {
      title: 'User Guide',
      description: 'Complete documentation on all features',
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      count: '25 articles',
    },
    {
      title: 'Terms & Conditions',
      description: 'Legal terms and conditions of service',
      icon: FileText,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      count: 'Legal docs',
    },
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
    },
    {
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      availability: 'Response within 24h',
      action: 'Send Email',
    },
    {
      title: 'Phone Support',
      description: 'Call us for urgent issues',
      icon: Phone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      availability: 'Mon-Fri, 9AM-6PM',
      action: 'Call Now',
    },
  ];

  const currentFaqs = faqs[activeCategory as keyof typeof faqs] || [];
  const filteredFaqs = currentFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              How Can We Help You?
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Find answers to common questions or get in touch with our support team
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder="Search for help articles..."
                onSearch={setSearchQuery}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Contact Options */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Get Instant Help
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="text-center h-full flex flex-col" hover>
                  <div className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <option.icon className={`w-8 h-8 ${option.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-1">
                    {option.description}
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    {option.availability}
                  </div>
                  <Button variant="primary" size="sm" fullWidth>
                    {option.action}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="lg:flex lg:gap-12">
          {/* FAQ Categories Sidebar */}
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Help Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors text-left ${
                      activeCategory === category.id
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                      <category.icon className={`w-5 h-5 ${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.count} articles</div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Resources */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resources
              </h3>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div key={resource.title} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className={`w-10 h-10 ${resource.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                      <resource.icon className={`w-5 h-5 ${resource.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{resource.title}</div>
                      <div className="text-sm text-gray-500">{resource.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {categories.find(cat => cat.id === activeCategory)?.name} FAQ
              </h2>
              <Badge variant="info" size="md">
                {filteredFaqs.length} articles
              </Badge>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
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
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
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
                        <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                          <span className="text-sm text-gray-500 mr-4">Was this helpful?</span>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              👍 Yes
                            </Button>
                            <Button variant="outline" size="sm">
                              👎 No
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <Card className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search terms or browse other categories
                </p>
                <Button variant="primary" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </Card>
            )}

            {/* Still Need Help */}
            <Card className="mt-12 bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Still Need Help?
                </h3>
                <p className="text-gray-600 mb-6">
                  Can't find what you're looking for? Our support team is here to help you 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="primary" icon={MessageCircle}>
                    Start Live Chat
                  </Button>
                  <Button variant="outline" icon={Mail}>
                    Send Email
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