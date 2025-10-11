import React, { useState } from 'react';
import { User, Reply } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  useGetAdminSupportTicketById,
  useAddAdminMessageToTicket,
} from '../../../../hooks/useSupport';
import {
  LoadingSpinner,
  Alert,
  Badge,
  Button,
} from '../../../../components/ui';

interface TicketDetailViewProps {
  ticketId: string;
  onClose: () => void;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({ ticketId, onClose }) => {
  const { data: ticket, isLoading, isError } = useGetAdminSupportTicketById(ticketId);
  const addMessageMutation = useAddAdminMessageToTicket();
  const [replyMessage, setReplyMessage] = useState('');

  const handleSendReply = async () => {
    // Guard against empty messages
    if (!replyMessage.trim()) return;

    try {
      // CRITICAL FIX: Use the stable `ticketId` from props, not the potentially
      // undefined `ticket._id` from the fetched data. This prevents sending
      // "undefined" to the backend and causing the ObjectId cast error.
      await addMessageMutation.mutateAsync({ id: ticketId, data: { message: replyMessage } });
      setReplyMessage('');
      toast.success('Reply sent successfully!');
    } catch (err) {
      toast.error('Failed to send reply.');
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  if (isError || !ticket) return <Alert variant="error">Failed to load ticket details.</Alert>;

  const getStatusVariant = (status?: string): 'warning' | 'success' | 'secondary' => {
    switch (status?.toLowerCase()) {
        case 'open': return 'warning';
        case 'closed': return 'success';
        default: return 'secondary';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{ticket.subject || 'No Subject'}</h3>
          <div className="text-sm text-gray-500">
            From: {ticket.user?.name || 'Unknown User'} ({ticket.user?.email || 'No email provided'})
          </div>
        </div>
        <Badge variant={getStatusVariant(ticket.status)}>{ticket.status || 'N/A'}</Badge>
      </div>

      <div className="border-t border-b -mx-6 px-6 py-4 max-h-[400px] overflow-y-auto bg-gray-50 rounded">
        {/*
          DEFINITIVE FIX: The API has been observed to be unreliable (returning 503s)
          and can send malformed data within the messages array (e.g., null entries,
          or objects missing critical properties).

          To prevent crashes, we now apply a strict filter. A message will only be
          rendered if it is a valid object with an `_id`, a `user` object, and a `created_at` timestamp.
          This hardens the component against backend data inconsistencies.
        */}
        {(ticket.messages && ticket.messages.length > 0) 
          ? ticket.messages
              .filter(message => message && message._id && message.user && message.created_at)
              .map((message) => (
              <div key={message._id} className="py-4 flex space-x-4">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${message.user._id !== ticket.user?._id ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  <User size={20} />
                </div>
                <div>
                  <div className="flex items-baseline space-x-3">
                    <h4 className="font-semibold text-gray-800">{message.user.name || 'System'}</h4>
                    <p className="text-xs text-gray-500">{format(new Date(message.created_at), 'PPpp')}</p>
                  </div>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>
            ))
          : (
            <div className="text-center py-8 text-gray-500">No messages in this ticket yet.</div>
          )
        }
      </div>

      <div>
        <label htmlFor="reply-message" className="block text-sm font-medium text-gray-700 mb-2">Add a Reply</label>
        <textarea
          id="reply-message"
          rows={4}
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Type your reply..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          icon={Reply}
          onClick={handleSendReply}
          disabled={addMessageMutation.isPending || !replyMessage.trim()}
        >
          {addMessageMutation.isPending ? 'Sending...' : 'Send Reply'}
        </Button>
      </div>
    </div>
  );
};
