import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui';
import { WITHDRAWAL_METHODS } from '../../../constants';
import { CreditCard, Smartphone, Building, Gift, Wallet as WalletIcon } from 'lucide-react';

interface WithdrawalMethodsProps {
  onMethodClick: (methodId: string) => void;
}

const getMethodIcon = (method: string) => {
  const iconMap: { [key: string]: React.ElementType } = {
    upi: Smartphone,
    bank: Building,
    paytm: WalletIcon,
    voucher: Gift,
  };
  return iconMap[method.toLowerCase()] || CreditCard;
};

export const WithdrawalMethods: React.FC<WithdrawalMethodsProps> = ({ onMethodClick }) => {
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('wallet.quickWithdraw')}</h3>
        <div className="space-y-3">
          {WITHDRAWAL_METHODS.map((method) => {
            const Icon = getMethodIcon(method.id);
            return (
              <div
                key={method.id}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-all cursor-pointer"
                onClick={() => onMethodClick(method.id)}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mr-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">{method.label}</p>
                  <p className="text-xs text-gray-500">{t('wallet.minAmount')}: ₹{method.minAmount}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};
