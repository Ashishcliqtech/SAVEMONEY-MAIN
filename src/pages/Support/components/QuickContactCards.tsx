import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import { Card, Button } from '../../../components/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants';

export const QuickContactCards: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: <MessageCircle className="w-8 h-8 text-green-600" />,
      title: 'Live Chat',
      desc: 'Get instant help from our support team',
      button: { label: 'Start Chat', variant: 'primary', action: () => navigate(ROUTES.LIVE_CHAT) },
      color: 'bg-green-100',
      delay: 0.1,
    },
    {
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      title: 'Email Support',
      desc: "Send us an email and we'll respond within 24 hours",
      button: { label: 'Send Email', variant: 'outline', action: () => {} },
      color: 'bg-blue-100',
      delay: 0.2,
    },
    {
      icon: <Phone className="w-8 h-8 text-purple-600" />,
      title: 'Phone Support',
      desc: 'Call us for urgent issues (Mon–Fri, 9AM–6PM)',
      button: { label: 'Call Now', variant: 'outline', action: () => {} },
      color: 'bg-purple-100',
      delay: 0.3,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay }}
        >
          <Card className="text-center h-full" hover>
            <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-600 mb-4">{card.desc}</p>
            <Button variant={card.button.variant} size="sm" fullWidth onClick={card.button.action}>
              {card.button.label}
            </Button>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
