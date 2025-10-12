import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Search,
  Clock,
  CheckCircle,
  User,
  Calendar,
  Reply,
} from 'lucide-react';
import {
  useGetAllSupportTickets,
  useUpdateSupportTicket,
} from '../../../hooks/useSupport';
import { LoadingSpinner, Card, Button, Badge, Modal, Pagination, Alert } from '../../../components/ui';
import toast from 'react-hot-toast';
import { AdminSupportTicketWithMessages } from '../../../types/support';
import { format } from 'date-fns';
import { TicketDetailView } from './components/TicketDetailView';
import { ContactInquiries } from './components/ContactInquiries';

type TicketInList = Omit<AdminSupportTicketWithMessages, 'messages'>;

export const SupportManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useGetAllSupportTickets({
    status: statusFilter === 'all' ? undefined : statusFilter,
    page: currentPage,
    limit: 10,
  });

  const updateTicketMutation = useUpdateSupportTicket();

  const filteredTickets = useMemo(() => {
    if (!data?.tickets) return [];
    const tickets: TicketInList[] = data.tickets;
    if (!searchQuery) return tickets;

    const lowercasedQuery = searchQuery.toLowerCase();

    return tickets.filter(
      (ticket) =>
        (ticket.subject && ticket.subject.toLowerCase().includes(lowercasedQuery)) ||
        (ticket.user && ticket.user.name && ticket.user.name.toLowerCase().includes(lowercasedQuery)) ||
        (ticket._id && ticket._id.toLowerCase().includes(lowercasedQuery))
    );
  }, [data, searchQuery]);

  const handleViewTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setShowTicketModal(true);
  };
  
  const handleCloseModal = () => {
    setShowTicketModal(false);
    setSelectedTicketId(null);
  };

  const handleStatusChange = async (ticketId: string, status: 'open' | 'closed') => {
    try {
      await updateTicketMutation.mutateAsync({ id: ticketId, data: { status } });
      toast.success(`Ticket status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update ticket status.');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'warning';
      case 'closed': return 'success';
      default: return 'secondary';
    }
  };

  const ticketStats = {
    total: data?.total_tickets ?? 0,
    open: data?.open_tickets ?? 0,
    closed: data?.closed_tickets ?? 0,
    avgResponseTime: 'N/A',
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner size="lg" /></div>;
  }

  if (isError) {
    return <div className="p-4"><Alert variant="error">{(error as Error)?.message || 'An error occurred while fetching tickets.'}</Alert></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Management</h1>
          <p className="text-gray-600">Manage customer support tickets and inquiries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6"><MessageCircle className="w-6 h-6 text-blue-600 mx-auto mb-3" /><div className="text-2xl font-bold">{ticketStats.total}</div><div className="text-gray-600">Total Tickets</div></Card>
          <Card className="text-center p-6"><Clock className="w-6 h-6 text-yellow-600 mx-auto mb-3" /><div className="text-2xl font-bold">{ticketStats.open}</div><div className="text-gray-600">Open</div></Card>
          <Card className="text-center p-6"><CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-3" /><div className="text-2xl font-bold">{ticketStats.closed}</div><div className="text-gray-600">Closed</div></Card>
          <Card className="text-center p-6"><Clock className="w-6 h-6 text-teal-600 mx-auto mb-3" /><div className="text-2xl font-bold">{ticketStats.avgResponseTime}</div><div className="text-gray-600">Avg Response</div></Card>
        </div>

        <Card className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative md:col-span-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 w-full" /></div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'closed')} className="w-full"><option value="all">All Status</option><option value="open">Open</option><option value="closed">Closed</option></select>
            <div className="text-sm text-gray-600 text-right">Showing {filteredTickets.length} of {data?.total_tickets} tickets</div>
          </div>
        </Card>

        <div className="space-y-4 mb-8">
          {filteredTickets.length > 0 ? filteredTickets.map((ticket, index) => (
            <motion.div key={ticket._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-start justify-between">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer" onClick={() => handleViewTicket(ticket._id)}>{ticket.subject}</h3>
                      <Badge variant={getStatusColor(ticket.status)} size="sm">{ticket.status || 'N/A'}</Badge>
                    </div>
                    <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1"><User className="w-4 h-4" /><span>{ticket.user?.name || 'Unknown User'}</span></div>
                      <div className="flex items-center space-x-1"><Calendar className="w-4 h-4" /><span>{format(new Date(ticket.created_at), 'PP')}</span></div>
                      <div>ID: {ticket._id.substring(0, 8)}...</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-0 sm:ml-4">
                    <Button variant="ghost" size="sm" icon={Reply} onClick={() => handleViewTicket(ticket._id)}>View & Reply</Button>
                    {ticket.status?.toLowerCase() === 'open' && <Button variant="success" size="sm" onClick={() => handleStatusChange(ticket._id, 'closed')} disabled={updateTicketMutation.isPending}>Close Ticket</Button>}
                    {ticket.status?.toLowerCase() === 'closed' && <Button variant="warning" size="sm" onClick={() => handleStatusChange(ticket._id, 'open')} disabled={updateTicketMutation.isPending}>Re-open</Button>}
                  </div>
                </div>
              </Card>
            </motion.div>
          )) : (
            <Card className="text-center p-8"><h3 className="text-lg font-semibold">No tickets found</h3><p className="text-gray-500 mt-2">Try adjusting your filters.</p></Card>
          )}
        </div>

        {data && data.total_pages > 1 && <Pagination currentPage={currentPage} totalPages={data.total_pages} onPageChange={setCurrentPage} />}

        <Modal isOpen={showTicketModal} onClose={handleCloseModal} title={selectedTicketId ? `Ticket #${selectedTicketId.substring(0, 8)}...` : ''} size="2xl">
            {selectedTicketId && 
                <TicketDetailView 
                    ticketId={selectedTicketId} 
                    onClose={handleCloseModal}
                />
            }
        </Modal>
        
          <ContactInquiries />
        
      </div>
    </div>
  );
};
