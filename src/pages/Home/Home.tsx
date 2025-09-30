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
import { useFeaturedOffers, usePopularStores, useTrendingOffers, useCategories } from '../../hooks/useApi';
import { savingsAppImage } from '../../lib/image';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  const { data: featuredOffers, error: featuredError } = useFeaturedOffers(4);
  const { data: trendingOffers, error: trendingError } = useTrendingOffers();
  const { data: popularStores, error: popularError } = usePopularStores();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

 const finalFeaturedOffers = !featuredError && featuredOffers ? featuredOffers : [];
const finalTrendingOffers = !trendingError && trendingOffers ? trendingOffers : [];
const finalPopularStores = !popularError && popularStores ? popularStores : [];
const finalCategories = !categoriesError && categories ? categories : [];


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
      <section id="recommended-offers" style={{ textAlign: 'center', padding: '20px 10px' }}>
  <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 'bold', marginBottom: '20px' }}>
    Best Offers Recommended
  </h2>
  <RecommendedOffersCarousel offers={finalFeaturedOffers} />
</section>


            {/* Stats Section */}
      <section className="relative bg-gradient-to-br from-purple-50 to-teal-50 py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Header */}
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
        {t('home.topStores')}
      </h2>
      <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
        Shop from your favorite brands and earn cashback instantly
      </p>
    </div>

    {/* Store Carousel */}
    <StoreCarousel stores={finalPopularStores} />

    {/* Button Section */}
    {!popularError && (
      <div className="flex justify-center mt-10">
        <Link to={ROUTES.STORES} className="w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            disabled={!finalPopularStores.length} // disabled when loading
            className="w-full sm:w-auto rounded-2xl px-8 py-4 font-semibold shadow-lg 
                       bg-gradient-to-r from-purple-600 to-teal-500 text-white 
                       hover:from-purple-700 hover:to-teal-600 
                       transition-all duration-300 transform hover:scale-105 
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            View All Stores
          </Button>
        </Link>
      </div>
    )}
  </div>

  {/* Decorative Background Elements */}
  <div className="absolute top-0 left-0 w-40 h-40 bg-purple-300/30 rounded-full blur-3xl -z-10"></div>
  <div className="absolute bottom-0 right-0 w-52 h-52 bg-teal-300/30 rounded-full blur-3xl -z-10"></div>
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
        <OfferGrid offers={finalFeaturedOffers} />
      </section>

     

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{t('home.popularCategories')}</h2>
          <p className="text-gray-600 mt-2">Discover deals across all categories</p>
        </div>
        <CategoryGrid categories={finalCategories} isLoading={categoriesLoading} />
      </section>

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
          <OfferGrid offers={finalTrendingOffers} />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 text-gray-900 py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold mb-4">How SaveMoney Works</h2>
      <p className="text-gray-600 text-lg">Start earning cashback in 3 simple steps</p>
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
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <step.icon className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
              {step.step}
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
          <p className="text-gray-600">{step.description}</p>
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

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-6 sm:px-10 lg:px-20 overflow-hidden
  py-16 lg:py-20 rounded-3xl shadow-2xl">
  {/* Decorative glowing orbs */}
  <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-500/30 rounded-full blur-3xl animate-pulse delay-200"></div>

  <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
    {/* Left: Text Content */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="text-center lg:text-left"
    >
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
        Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-300">Saving Smarter</span> Today
      </h2>

      <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
        Join <span className="font-bold text-white">2M+ smart shoppers</span> already earning cashback on every purchase.  
        Get an instant <span className="font-extrabold text-teal-300">₹100 welcome bonus</span> when you sign up!
      </p>

      <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
        <Link to={ROUTES.SIGNUP}>
          <Button
            size="lg"
            className="bg-gradient-to-r from-teal-400 to-purple-500 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
          >
            🚀 Get Started Free
          </Button>
        </Link>

        
      </div>
    </motion.div>

    {/* Right: Illustration / Mockup */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="flex justify-center lg:justify-end"
    >
      <img
  src={savingsAppImage}
  alt="SaveMoney App Preview"
  className="w-full max-w-md lg:max-w-lg drop-shadow-2xl rounded-3xl h-64 lg:h-80 object-contain"
/>

    </motion.div>
  </div>
</section>



    </div>
  );
};
