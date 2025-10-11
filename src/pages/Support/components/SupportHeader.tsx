import React from 'react';
import { useTranslation } from 'react-i18next';

export const SupportHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {t('support.title')}
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        We're here to help! Find answers to common questions or get in touch with our support team.
      </p>
    </div>
  );
};
