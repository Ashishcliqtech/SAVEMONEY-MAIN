import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Input } from '../../../components/ui';
import { Send, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateSupportTicket } from '../../../hooks/useSupport';

interface FormState {
  subject: string;
  message: string;
  priority: string;
}

export const SupportContactForm: React.FC<{
  ticketForm: FormState;
  setTicketForm: React.Dispatch<React.SetStateAction<FormState>>;
}> = ({ ticketForm, setTicketForm }) => {
  const createTicketMutation = useCreateSupportTicket();

  const handleSubmit = async () => {
    if (!ticketForm.subject || !ticketForm.message) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await createTicketMutation.mutateAsync({
        subject: ticketForm.subject,
        message: ticketForm.message,
      });
      toast.success('Support ticket submitted successfully!');
      setTicketForm({ subject: '', message: '', priority: 'medium' });
    } catch (error) {
      toast.error('Failed to submit support ticket.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a Support Ticket</h2>
        <div className="space-y-6">
          <Input
            label="Subject"
            value={ticketForm.subject}
            onChange={(e) => setTicketForm((p) => ({ ...p, subject: e.target.value }))}
            placeholder="Brief description of your issue"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={ticketForm.priority}
              onChange={(e) => setTicketForm((p) => ({ ...p, priority: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={ticketForm.message}
              onChange={(e) => setTicketForm((p) => ({ ...p, message: e.target.value }))}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Please provide detailed information..."
              required
            />
          </div>
          
          <Button
            variant="primary"
            size="lg"
            icon={Send}
            onClick={handleSubmit}
            fullWidth
            disabled={createTicketMutation.isLoading}
          >
            {createTicketMutation.isLoading ? 'Submitting...' : 'Submit Ticket'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
