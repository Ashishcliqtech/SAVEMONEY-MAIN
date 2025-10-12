import React from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import { Card, Button } from '../../../components/ui';
import { ROUTES } from '../../../constants';
import { useNavigate } from 'react-router-dom';

export const StillNeedHelp: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Card className="mt-12 bg-gradient-to-br from-purple-50 to-blue-50 text-center">
      <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Still Need Help?</h3>
      <p className="text-gray-600 mb-6">
        Can't find what you're looking for? Our support team is available 24/7.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="primary" icon={MessageCircle} onClick={() => navigate(ROUTES.LIVE_CHAT)}>
          Start Live Chat
        </Button>
        <Button variant="outline" icon={Mail} onClick={() => (window.location.href = 'mailto:support@savemoney.com')}>
          Send Email
        </Button>
      </div>
    </Card>
  );
};
