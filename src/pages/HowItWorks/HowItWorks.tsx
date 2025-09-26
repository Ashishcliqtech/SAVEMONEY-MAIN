import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  CreditCard,
  Users,
  Gift,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Smartphone,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      step: 1,
      title: 'Sign Up & Browse',
      description: 'Create your free account and browse thousands of offers from top brands and stores.',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      details: [
        'Quick 2-minute registration',
        'Email or social login options',
        'Browse 500+ partner stores',
        'No hidden fees or charges'
      ]
    },
    {
      step: 2,
      title: 'Shop & Earn',
      description: 'Click through our links to shop at your favorite stores and automatically earn cashback.',
      icon: ShoppingBag,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      details: [
        'Click on any store or offer',
        'Shop normally on merchant site',
        'Cashback tracked automatically',
        'Up to 25% cashback rates'
      ]
    },
    {
      step: 3,
      title: 'Get Paid',
      description: 'Withdraw your earnings via UPI, bank transfer, or gift vouchers once you reach minimum threshold.',
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      details: [
        'Multiple withdrawal options',
        'Minimum ₹10 for UPI',
        'Fast processing times',
        'Secure payment methods'
      ]
    },
  ];

  const features = [
    {
      title: 'Instant Tracking',
      description: 'Your cashback is tracked instantly when you make a purchase',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Secure Payments',
      description: 'Bank-level security with encrypted transactions',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Mobile App',
      description: 'Shop on the go with our mobile app',
      icon: Smartphone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Referral Bonus',
      description: 'Earn extra by inviting friends to join',
      icon: Gift,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const faqs = [
    {
      question: 'How long does it take to receive cashback?',
      answer: 'Cashback is typically credited within 24-48 hours for most stores. Some stores may take up to 7-14 days to confirm the transaction.'
    },
    {
      question: 'Is there a minimum withdrawal amount?',
      answer: 'Yes, minimum withdrawal amounts vary by method: UPI - ₹10, Bank Transfer - ₹50, Paytm - ₹10, Gift Vouchers - ₹100.'
    },
    {
      question: 'Can I use other coupon codes?',
      answer: 'Using external coupon codes may void your cashback eligibility. We recommend using only the codes provided on our platform.'
    },
    {
      question: 'How does the referral program work?',
      answer: 'Share your unique referral link with friends. When they sign up and make their first purchase, you both earn bonus cashback.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                How SaveMoney Works
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                Start earning cashback in 3 simple steps. Join over 2 million users who are already saving money on every purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={ROUTES.SIGNUP}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              3 Simple Steps to Start Earning
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our platform makes it incredibly easy to earn cashback on every purchase
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-6">
                    <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mr-4`}>
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <div className="text-4xl font-bold text-gray-300">
                      0{step.step}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    {step.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1 max-w-md">
                  <Card className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <div className="text-center">
                      <div className={`w-24 h-24 ${step.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
                        <step.icon className={`w-12 h-12 ${step.color}`} />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Step {step.step}
                      </h4>
                      <p className="text-gray-600">
                        {step.title}
                      </p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SaveMoney?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We're committed to providing the best cashback experience with industry-leading features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="text-center h-full flex flex-col" hover>
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 flex-1">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Got questions? We've got answers to help you get started
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Earning Cashback?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join millions of users who are already saving money on every purchase. 
              Sign up today and get ₹100 welcome bonus!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.SIGNUP}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Get Started Now
                </Button>
              </Link>
              <Link to={ROUTES.OFFERS}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Browse Offers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};