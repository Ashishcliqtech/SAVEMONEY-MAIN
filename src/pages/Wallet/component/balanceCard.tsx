import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, Download } from 'lucide-react';
import { Card, Button } from '../../../components/ui';

interface BalanceCardProps {
  totalCashback: number | null | undefined;
  availableCashback: number | null | undefined;
  onWithdrawClick: () => void;
  formatCurrency: (amount: number | null | undefined) => string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ totalCashback, availableCashback, onWithdrawClick, formatCurrency }) => {
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <Card className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white shadow-lg p-6">
        <div className="flex flex-col items-center text-center">
          <WalletIcon className="w-16 h-16 mb-4 opacity-80" />
          <span className="text-sm font-medium opacity-80">{t('wallet.totalBalance')}</span>
          <h2 className="text-4xl md:text-5xl font-bold my-2">{formatCurrency(totalCashback)}</h2>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            icon={Download}
            onClick={onWithdrawClick}
            disabled={!availableCashback || availableCashback < 10}
            className="mt-6 bg-black text-indigo-600 hover:bg-gray-100 shadow-md transform hover:scale-105 transition-transform"
          >
            {t('wallet.withdrawButton')}
          </Button>
          {availableCashback && availableCashback < 10 && (
            <p className="text-xs opacity-70 mt-2">{t('wallet.minWithdrawalInfo', { amount: 10 })}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
