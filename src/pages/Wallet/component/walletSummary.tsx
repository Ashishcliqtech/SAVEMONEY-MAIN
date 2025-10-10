import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui';

interface Stat {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface WalletSummaryProps {
  stats: Stat[];
}

export const WalletSummary: React.FC<WalletSummaryProps> = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('wallet.summary')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 rounded-xl bg-gray-50 flex items-center">
              <div className={`w-10 h-10 ${stat.bgColor} rounded-full flex items-center justify-center mr-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};
