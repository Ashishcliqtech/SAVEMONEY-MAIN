import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Input, Button } from '../../../components/ui';
import { RequestWithdrawalPayload } from '../../../api';
import { WITHDRAWAL_METHODS } from '../../../constants';
import { CreditCard, Smartphone, Building, Gift, Wallet as WalletIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Wallet as WalletType } from '../../../types';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (payload: RequestWithdrawalPayload) => Promise<void>;
  initialMethod?: string;
  wallet: WalletType | null;
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

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose, onWithdraw, initialMethod = '', wallet }) => {
  const { t } = useTranslation();
  const [withdrawalData, setWithdrawalData] = useState<RequestWithdrawalPayload>({ amount: 0, method: initialMethod, accountDetails: '' });
  
  useEffect(() => {
    if (isOpen) {
        setWithdrawalData({ amount: 0, method: initialMethod, accountDetails: '' });
    }
  }, [isOpen, initialMethod]);

  const handleWithdrawRequest = () => {
    if (withdrawalData.amount <= 0 || !withdrawalData.method || !withdrawalData.accountDetails) {
      toast.error(t('wallet.fillAllFieldsError'));
      return;
    }
     if (wallet && withdrawalData.amount > (wallet.availableCashback || 0)) {
        toast.error(t('wallet.insufficientBalanceError'));
        return;
    }
    onWithdraw(withdrawalData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('wallet.withdrawModalTitle')} size="md">
      <div className="space-y-6 p-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('wallet.selectMethod')}</label>
          <div className="grid grid-cols-2 gap-3">
            {WITHDRAWAL_METHODS.map((method) => {
              const Icon = getMethodIcon(method.id);
              return (
                <button
                  key={method.id}
                  onClick={() => setWithdrawalData(prev => ({ ...prev, method: method.id }))}
                  className={`flex items-center justify-center p-3 border rounded-lg transition-all duration-200 ${
                    withdrawalData.method === method.id ? 'border-primary bg-primary/10 ring-2 ring-primary' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2 text-gray-700" />
                  <span className="text-sm font-medium text-gray-800">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <Input
          label={t('wallet.enterAmount')}
          type="number"
          value={withdrawalData.amount || ''}
          onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
          placeholder={t('wallet.amountPlaceholder')}
          min="10"
        />
        <Input
          label={t('wallet.accountDetails')}
          value={withdrawalData.accountDetails}
          onChange={(e) => setWithdrawalData(prev => ({ ...prev, accountDetails: e.target.value }))}
          placeholder={t('wallet.detailsPlaceholder')}
        />
        <div className="pt-2 flex flex-col-reverse sm:flex-row sm:space-x-4 gap-3 sm:gap-0">
          <Button variant="outline" fullWidth onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" fullWidth onClick={handleWithdrawRequest}>
            {t('wallet.processWithdrawal')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
