import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from '../../../components/ui';

export const ContactOptions: React.FC<{ options: any[] }> = ({ options }) => (
  <section className="mb-16">
    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get Instant Help</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {options.map((option, i) => (
        <motion.div key={option.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <Card className="text-center flex flex-col h-full" hover>
            <div className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <option.icon className={`w-8 h-8 ${option.color}`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
            <p className="text-gray-600 mb-4 flex-1">{option.description}</p>
            <div className="text-sm text-gray-500 mb-4">{option.availability}</div>
            <Button variant="primary" size="sm" fullWidth onClick={option.onClick}>
              {option.action}
            </Button>
          </Card>
        </motion.div>
      ))}
    </div>
  </section>
);
