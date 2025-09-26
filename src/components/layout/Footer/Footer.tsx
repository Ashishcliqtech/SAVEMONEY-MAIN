import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
} from 'lucide-react';
import { Button, Input } from '../../ui';
import { ROUTES } from '../../../constants';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { href: ROUTES.STORES, label: t('navigation.stores') },
    { href: ROUTES.CATEGORIES, label: t('navigation.categories') },
    { href: ROUTES.OFFERS, label: t('navigation.offers') },
    { href: '#', label: t('navigation.howItWorks') },
    { href: '#', label: t('footer.aboutUs') },
    { href: '#', label: t('footer.careers') },
  ];

  const supportLinks = [
    { href: ROUTES.SUPPORT, label: t('navigation.help') },
    { href: '#', label: t('support.faq') },
    { href: '#', label: t('support.contactUs') },
    { href: '#', label: t('support.liveChat') },
  ];

  const legalLinks = [
    { href: '#', label: t('footer.privacyPolicy') },
    { href: '#', label: t('footer.termsOfService') },
  ];

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SaveMoney</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.support')}</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.newsletter')}</h3>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.newsletterText')}
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder={t('footer.enterEmail')}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button
                variant="primary"
                size="md"
                fullWidth
                icon={Mail}
              >
                {t('footer.subscribe')}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 SaveMoney. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};