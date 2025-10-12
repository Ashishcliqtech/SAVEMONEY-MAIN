import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Eye, Inbox, MessageSquare } from 'lucide-react';
import { useGetContactInquiries, useUpdateContactInquiry } from '../../../../hooks/useContact';
import { Card, Button, Badge, Pagination, LoadingSpinner, EmptyState, Alert } from '../../../../components/ui';
import toast from 'react-hot-toast';
import { ContactInquiry } from '../../../../types/contact';
import { format } from 'date-fns';

// Helper to get initials from name
const getInitials = (name: string) => {
  if (!name) return '??';
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.slice(0, 2).toUpperCase();
};

export const ContactInquiries: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useGetContactInquiries({ page: currentPage, limit: 10 });
  const updateInquiryMutation = useUpdateContactInquiry();

  const responseData = data?.data || data;
  const inquiries = Array.isArray(responseData?.inquiries) ? responseData.inquiries : [];
  const totalPages = responseData?.totalPages || 1;

  const handleMarkAsRead = (inquiryId: string) => {
    updateInquiryMutation.mutate({ id: inquiryId, data: { is_read: true } }, {
      onSuccess: () => toast.success('Inquiry marked as read.'),
      onError: (err) => toast.error(`Failed to update inquiry: ${(err as Error).message}`),
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner size="lg" /></div>;
  }

  if (isError) {
    return <Alert variant="error">{(error as Error)?.message || 'An error occurred while fetching inquiries.'}</Alert>;
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-md mb-4">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-semibold">Customer Inquiries</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Contact Messages Inbox
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          View, manage, and respond to messages submitted through your website’s contact form.
          Stay connected and never miss a customer’s question again.
        </p>
      </motion.div>

      {/* Inquiries List */}
      <div className="space-y-6">
        {inquiries.length > 0 ? (
          inquiries.map((inquiry: ContactInquiry, index: number) => (
            <motion.div
              key={inquiry._id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 1, 0.5, 1] }}
            >
              <Card
                className={`p-0 overflow-hidden transition-all duration-300 ease-in-out border-l-4 
                  ${inquiry.is_read ? 'border-gray-300 bg-white hover:border-gray-400' : 'border-blue-500 bg-gradient-to-br from-blue-50 to-white hover:from-blue-100/60'}
                  hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-lg shadow-inner">
                      {getInitials(inquiry.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{inquiry.name}</p>
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {inquiry.email}
                      </a>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {format(new Date(inquiry.created_at), 'MMM d, yyyy h:mm a')}
                    </span>
                    <Badge
                      variant={inquiry.is_read ? 'success' : 'info'}
                      size="sm"
                      className={`capitalize shadow-sm ${inquiry.is_read ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                    >
                      {inquiry.is_read ? 'Archived' : 'New Inquiry'}
                    </Badge>
                  </div>
                </div>

                {/* Message */}
                <div className="px-5 pb-5 pl-16">
                  <p className="text-gray-700 leading-relaxed border-l-2 border-gray-200 pl-4">
                    {inquiry.message}
                  </p>
                </div>

                {/* Action Button */}
                {!inquiry.is_read && (
                  <div className="flex justify-end px-6 pb-5">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleMarkAsRead(inquiry._id)}
                      disabled={updateInquiryMutation.isLoading}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      Mark as Read
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="pt-10">
            <EmptyState
              title="Inbox Zero!"
              message="You’ve read all the contact inquiries. Great job staying on top of your messages."
              icon={Inbox}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};
