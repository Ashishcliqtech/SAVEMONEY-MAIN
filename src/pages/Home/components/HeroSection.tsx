import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Percent } from 'lucide-react';
import { Button } from '../../../components/ui';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-teal-600 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-400/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                <Percent className="w-4 h-4 mr-2" />
                Up to 25% Cashback
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Save Money on Every Purchase
            </h1>
            
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Get cashback and exclusive deals from 500+ top brands. Join 2M+ happy users!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="secondary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8"
                onClick={() => document.getElementById('recommended-offers')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Saving Now
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-semibold"
              >
                How It Works
              </Button>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">500+ Stores</div>
                  <div className="text-sm text-purple-100">Top brands</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Percent className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold">Up to 25% CB</div>
                  <div className="text-sm text-purple-100">Instant cashback</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              {/* Mock Mobile App Interface */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm mx-auto border-4 border-white/20">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                  <div className="text-xs font-medium opacity-90">🔥 TRENDING NOW</div>
                  <div className="text-xl font-bold">UP TO 25% CASHBACK</div>
                  <div className="text-xs opacity-90">+ EXTRA ₹500 BONUS</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        FK
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">Flipkart</div>
                        <div className="text-xs text-gray-500">Fashion Sale</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">25% BACK</div>
                      <div className="text-xs text-gray-500">Up to ₹2,000</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        A
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">Amazon</div>
                        <div className="text-xs text-gray-500">Electronics</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold">15% BACK</div>
                      <div className="text-xs text-gray-500">Up to ₹1,500</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg text-center">
                    <div className="text-sm font-bold">🎉 WELCOME BONUS</div>
                    <div className="text-xs opacity-90">GET ₹100 ON SIGNUP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-orange-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
            >
              <div className="text-center">
                <div className="text-lg font-bold">25%</div>
                <div className="text-xs">OFF</div>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-4 -left-4 w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
            >
              <div className="text-center">
                <div className="text-sm font-bold">₹500</div>
                <div className="text-xs">CB</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};