import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Reply,
  Archive,
  Star,
  Flag,
} from 'lucide-react';
import { Card, Button, Badge, Input, Modal, Pagination } from '../../../components/ui';
import toast from 'react-hot-toast';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  userId: string;
  userName: string;
  userEmail: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  category: 'cashback' | 'withdrawal' | 'account' | 'technical' | 'general';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  responses: number;
}

export const SupportManagement: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-001',
      subject: 'Cashback not credited for Amazon order',
      message: 'I made a purchase on Amazon 3 days ago but haven\'t received my cashback yet. Order ID: AMZ123456789',
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      priority: 'high',
      status: 'open',
      category: 'cashback',
      createdAt: '2025-01-22T10:30:00Z',
      updatedAt: '2025-01-22T10:30:00Z',
      responses: 0,
    },
    {
      id: 'TKT-002',
      subject: 'Unable to withdraw money',
      message: 'Getting error when trying to withdraw ₹2000 to my UPI. Please help.',
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      priority: 'medium',
      status: 'in-progress',
      category: 'withdrawal',
      assignedTo: 'Support Agent 1',
      createdAt: '2025-01-21T14:15:00Z',
      updatedAt: '2025-01-22T09:20:00Z',
      responses: 2,
    },
    {
      id: 'TKT-003',
      subject: 'Account verification issue',
      message: 'Cannot verify my phone number. Not receiving OTP.',
      userId: '3',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      priority: 'low',
      status: 'resolved',
      category: 'account',
      assignedTo: 'Support Agent 2',
      createdAt: '2025-01-20T11:45:00Z',
      updatedAt: '2025-01-21T16:30:00Z',
      responses: 3,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleStatusChange = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
        : ticket
    ));
    toast.success(`Ticket ${newStatus} successfully!`);
  };

  const handleAssignTicket = (ticketId: string, agent: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, assignedTo: agent, status: 'in-progress', updatedAt: new Date().toISOString() }
        : ticket
    ));
    toast.success('Ticket assigned successfully!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'warning';
      case 'in-progress': return 'info';
      case 'resolved': return 'success';
      case 'closed': return 'secondary';
      default: return 'secondary';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cashback': return 'success';
      case 'withdrawal': return 'info';
      case 'account': return 'warning';
      case 'technical': return 'danger';
      case 'general': return 'secondary';
      default: return 'secondary';
    }
  };

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    avgResponseTime: '2.4 hours',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Support Management
          </h1>
          <p className="text-gray-600">
            Manage customer support tickets and inquiries
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{ticketStats.total}</div>
            <div className="text-gray-600">Total Tickets</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{ticketStats.open}</div>
            <div className="text-gray-600">Open</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{ticketStats.inProgress}</div>
            <div className="text-gray-600">In Progress</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{ticketStats.resolved}</div>
            <div className="text-gray-600">Resolved</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{ticketStats.avgResponseTime}</div>
            <div className="text-gray-600">Avg Response</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              <option value="cashback">Cashback</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="account">Account</option>
              <option value="technical">Technical</option>
              <option value="general">General</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredTickets.length} of {tickets.length} tickets
            </div>
          </div>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4 mb-8">
          {filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ticket.subject}
                      </h3>
                      <Badge variant={getPriorityColor(ticket.priority)} size="sm">
                        {ticket.priority}
                      </Badge>
                      <Badge variant={getStatusColor(ticket.status)} size="sm">
                        {ticket.status}
                      </Badge>
                      <Badge variant={getCategoryColor(ticket.category)} size="sm">
                        {ticket.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {ticket.message}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{ticket.userName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>Ticket ID: {ticket.id}</div>
                      {ticket.assignedTo && (
                        <div>Assigned to: {ticket.assignedTo}</div>
                      )}
                      <div>{ticket.responses} responses</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Reply}
                      onClick={() => handleViewTicket(ticket)}
                    >
                      Reply
                    </Button>
                    {ticket.status === 'open' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusChange(ticket.id, 'in-progress')}
                      >
                        Take
                      </Button>
                    )}
                    {ticket.status === 'in-progress' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleStatusChange(ticket.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTickets.length / 10)}
          onPageChange={setCurrentPage}
        />

        {/* Ticket Detail Modal */}
        <Modal
          isOpen={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          title={`Ticket ${selectedTicket?.id}`}
          size="xl"
        >
          {selectedTicket && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Badge variant={getPriorityColor(selectedTicket.priority)} size="sm">
                  {selectedTicket.priority}
                </Badge>
                <Badge variant={getStatusColor(selectedTicket.status)} size="sm">
                  {selectedTicket.status}
                </Badge>
                <Badge variant={getCategoryColor(selectedTicket.category)} size="sm">
                  {selectedTicket.category}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedTicket.subject}
                </h3>
                <div className="text-sm text-gray-500 mb-4">
                  From: {selectedTicket.userName} ({selectedTicket.userEmail})
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedTicket.message}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Type your reply..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">Select Agent</option>
                    <option value="agent1">Support Agent 1</option>
                    <option value="agent2">Support Agent 2</option>
                    <option value="agent3">Support Agent 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Status
                  </label>
                  <select 
                    value={selectedTicket.status}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowTicketModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  icon={Reply}
                >
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};