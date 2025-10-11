import React from 'react';
import { Button, Card, Badge, Alert } from '../../../components/ui';
import { format } from 'date-fns';
import { MessageSquarePlus, Ticket } from 'lucide-react';
import { SupportTicket } from '../../../types/support';

interface SupportTicketsProps {
  tickets: SupportTicket[];
  onViewTicket: (id: string) => void;
  onCreateNew: () => void;
}

export const SupportTickets: React.FC<SupportTicketsProps> = ({ tickets, onViewTicket, onCreateNew }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'warning';
      case 'closed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Support Tickets</h2>
          <Button onClick={onCreateNew} icon={MessageSquarePlus}>
            New Ticket
          </Button>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No support tickets found.</h3>
            <p className="mt-1 text-sm text-gray-500">Click the button above to create a new one.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <li
                key={ticket._id}
                onClick={() => onViewTicket(ticket._id)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-md font-semibold text-gray-900 truncate">{ticket.subject}</p>
                    <p className="text-sm text-gray-500">Ticket #{ticket._id.substring(0, 8)}</p>
                  </div>
                  <div className="flex items-center space-x-4 ml-4">
                    <Badge variant={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    <p className="text-sm text-gray-500 text-right min-w-[120px]">
                      {format(new Date(ticket.updated_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
};
