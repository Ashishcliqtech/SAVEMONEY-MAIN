import React, { useState } from 'react';
import { useGetSupportTicketById, useAddMessageToTicket } from '../../../hooks/useSupport';
import { LoadingSpinner, Alert, Card, Button, Badge } from '../../../components/ui';
import { Send, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface SupportTicketViewProps {
  ticketId: string;
  onBack: () => void;
}

export const SupportTicketView: React.FC<SupportTicketViewProps> = ({ ticketId, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const { data, isLoading, isError, error } = useGetSupportTicketById(ticketId);
  const addMessageMutation = useAddMessageToTicket();

  const ticket = data?.ticket;
  const messages = data?.messages;

  const handleAddMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await addMessageMutation.mutateAsync({ id: ticketId, data: { message: newMessage } });
      setNewMessage('');
      toast.success('Message sent successfully!');
    } catch (err) {
      toast.error('Failed to send message.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'warning';
      case 'closed': return 'success';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <Alert variant="error" title="Error loading ticket">
        {error ? (error instanceof Error ? error.message : 'An unknown error occurred') : 'Ticket not found.'}
      </Alert>
    );
  }

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tickets
      </Button>
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{ticket.subject}</h2>
              <p className="text-sm text-gray-500">Ticket #{ticket._id.substring(0, 8)}</p>
            </div>
            <Badge variant={getStatusColor(ticket.status)}>{ticket.status}</Badge>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h3>
            <div className="space-y-6">
              {messages?.map((message) => (
                <div key={message._id} className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-lg p-4 rounded-lg ${
                      message.sender_type === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-2 text-right ${
                        message.sender_type === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {message.sender_name} • {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Reply</h3>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Type your message here..."
            />
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleAddMessage} 
                disabled={addMessageMutation.isLoading}
                icon={Send}
              >
                {addMessageMutation.isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
