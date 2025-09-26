import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Gift, Shield, Zap, Users, Award, Smartphone, CreditCard, Headphones as HeadphonesIcon } from 'lucide-react';
import { Button, Card, Badge, StatsCard, FeatureCard, TestimonialCard } from '../../components/ui';
import { HeroSection } from './components/HeroSection';
import { StoreCarousel } from './components/StoreCarousel';
import { CategoryGrid } from './components/CategoryGrid';
import { OfferGrid } from './components/OfferGrid';
import { RecommendedOffersCarousel } from './components/RecommendedOffersCarousel';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  // Mock data
  const featuredStats = [
    { 
      value: '2M+', 
      label: 'Happy Users', 
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: { value: '+12% this month', isPositive: true }
    },
    { 
      value: '500+', 
      label: 'Partner Stores', 
      icon: Gift,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      trend: { value: '+8 new stores', isPositive: true }
    },
    { 
      value: '25%', 
      label: 'Max Cashback', 
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: { value: 'Industry leading', isPositive: true }
    },
  ];

  const features = [
    {
      title: 'Instant Cashback',
      description: 'Get cashback credited instantly to your wallet after every purchase.',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Secure Payments',
      description: 'Bank-level security with encrypted transactions and data protection.',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Mobile App',
      description: 'Shop on the go with our mobile app available on iOS and Android.',
      icon: Smartphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Multiple Payment Options',
      description: 'Withdraw your cashback via UPI, bank transfer, or gift vouchers.',
      icon: CreditCard,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: '24/7 Support',
      description: 'Get help anytime with our dedicated customer support team.',
      icon: HeadphonesIcon,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      title: 'Rewards Program',
      description: 'Earn bonus rewards and exclusive offers as a loyal member.',
      icon: Award,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5,
      comment: 'I\'ve saved over ₹15,000 in just 3 months! The cashback is instant and the offers are amazing.',
      savings: '₹15,240',
    },
    {
      name: 'Rahul Kumar',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5,
      comment: 'Best cashback platform in India. Easy to use and genuine cashback on every purchase.',
      savings: '₹8,950',
    },
    {
      name: 'Anjali Patel',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      rating: 5,
      comment: 'The referral program is fantastic! I earned ₹2000 just by inviting my friends.',
      savings: '₹12,300',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Recommended Offers Carousel */}
      <section id="recommended-offers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RecommendedOffersCarousel />
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featuredStats.map((stat, index) => (
            <StatsCard
              key={stat.label}
              title={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
              trend={stat.trend}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Featured Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t('home.featuredDeals')}</h2>
            <p className="text-gray-600 mt-2">Limited time exclusive offers just for you</p>
          </div>
          <Link to={ROUTES.OFFERS}>
            <Button variant="outline" icon={ArrowRight} iconPosition="right">
              {t('common.seeAll')}
            </Button>
          </Link>
        </div>
        <OfferGrid featured />
      </section>

      {/* Top Stores */}
      <section className="bg-gradient-to-br from-purple-50 to-teal-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('home.topStores')}</h2>
            <p className="text-gray-600 mt-2">Shop from your favorite brands and earn cashback</p>
          </div>
          <StoreCarousel />
          <div className="text-center mt-8">
            <Link to={ROUTES.STORES}>
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                View All Stores
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{t('home.popularCategories')}</h2>
          <p className="text-gray-600 mt-2">Discover deals across all categories</p>
        </div>
        <CategoryGrid />
      </section>

      {/* How It Works */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How SaveMoney Works</h2>
            <p className="text-gray-300 text-lg">Start earning cashback in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up & Browse',
                description: 'Create your free account and browse thousands of offers from top brands.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Shop & Earn',
                description: 'Click through our links to shop at your favorite stores and earn cashback.',
                icon: Gift,
              },
              {
                step: '03',
                title: 'Get Paid',
                description: 'Withdraw your earnings via UPI, bank transfer, or gift vouchers.',
                icon: CreditCard,
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SaveMoney?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're committed to helping you save money with the best cashback rates and user experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              color={feature.color}
              bgColor={feature.bgColor}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Trending Offers */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{t('home.trendingOffers')}</h2>
                <p className="text-gray-600">What's hot right now</p>
              </div>
            </div>
            <Badge variant="warning" size="md">
              🔥 Hot Deals
            </Badge>
          </div>
          <OfferGrid trending />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-purple-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 text-lg">Join millions of happy users who are saving money every day</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                name={testimonial.name}
                avatar={testimonial.avatar}
                rating={testimonial.rating}
                comment={testimonial.comment}
                savings={testimonial.savings}
                delay={index * 0.1}
              />
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
              Ready to Start Saving Money?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join over 2 million users who are already earning cashback on every purchase. 
              Sign up today and get ₹100 welcome bonus!
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
                Download App
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};