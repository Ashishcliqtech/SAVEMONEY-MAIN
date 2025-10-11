import React from 'react';
import { HelpCircle, MessageCircle, Clock } from 'lucide-react';

interface SupportTabsProps {
  activeTab: 'faq' | 'contact' | 'tickets';
  onChange: (tab: 'faq' | 'contact' | 'tickets') => void;
}

export const SupportTabs: React.FC<SupportTabsProps> = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contact', icon: MessageCircle },
    { id: 'tickets', label: 'My Tickets', icon: Clock },
  ];

  return (
    <div className="flex space-x-1 bg-gray-200 rounded-lg p-1 mb-8 max-w-md mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id as any)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
            activeTab === tab.id
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
