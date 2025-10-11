import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const SupportFAQ: React.FC<{ faqs: FAQ[] }> = ({ faqs }) => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search frequently asked questions..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {faqs.map((faq, index) => (
        <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
          <Card>
            <button onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)} className="w-full flex items-center justify-between text-left">
              <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
              {expandedFaq === faq.id ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
            </button>
            {expandedFaq === faq.id && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
