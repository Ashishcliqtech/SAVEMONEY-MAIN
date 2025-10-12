import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, Button } from '../../../components/ui';

export const FaqItem: React.FC<any> = ({ faq, expanded, onToggle, index }) => (
  <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
    <Card>
      <button onClick={() => onToggle(faq.id)} className="w-full flex items-center justify-between text-left">
        <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
        {expanded ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
      </button>
      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500 mr-4">Was this helpful?</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">👍 Yes</Button>
              <Button variant="outline" size="sm">👎 No</Button>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  </motion.div>
);
