import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  Wallet as WalletIcon,
} from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  Input,
  Modal,
  Pagination,
  LoadingSpinner,
  EmptyState,
  Alert,
} from '../../../components/ui';
import { usePendingTransactions, useApproveTransaction, useRejectTransaction, useManuallyAddCashback } from '../../../hooks/useAdminCashback';
import { AdminTransaction, ManualCreditPayload } from '../../../api/adminCashback';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// --- Sub-Components ---

// Form for Manually Adding Cashback
interface ManualCreditFormProps {
  onCredit: (payload: ManualCreditPayload) => void;
  isLoading: boolean;
}

const ManualCreditForm: React.FC<ManualCreditFormProps> = ({ onCredit, isLoading }) => {
    const [form, setForm] = useState<ManualCreditPayload>({ userId: '', amount: 0, description: '' });

    const handleCredit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.userId || form.amount <= 0 || !form.description) {
            toast.error('Please fill all fields and ensure amount is positive.');
            return;
        }
        onCredit(form);
        setForm({ userId: '', amount: 0, description: '' });
    };

    return (
        <Card className="p-6 h-full bg-indigo-50 border-indigo-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Manually Credit Cashback
            </h3>
            <form onSubmit={handleCredit} className="space-y-4">
                <Input
                    label="User ID"
                    placeholder="Enter MongoDB User ID (e.g., 60c72b3f...)"
                    value={form.userId}
                    onChange={(e) => setForm({ ...form, userId: e.target.value })}
                    required
                />
                <Input
                    label="Amount (₹)"
                    type="number"
                    min="1"
                    placeholder="e.g., 150.50"
                    value={form.amount || ''}
                    onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                    required
                />
                <Input
                    label="Reason/Description"
                    placeholder="e.g., Customer Loyalty Bonus"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                />
                <Button 
                    type="submit" 
                    variant="success" 
                    icon={DollarSign} 
                    fullWidth 
                    loading={isLoading}
                    className="mt-4 bg-green-600 hover:bg-green-700"
                >
                    {isLoading ? 'Adding...' : 'Add Confirmed Cashback'}
                </Button>
            </form>
        </Card>
    );
};

// Modal for Rejecting a Transaction with Reason Input
interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: AdminTransaction | null;
    onReject: (id: string, reason: string) => void;
    isLoading: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onClose, transaction, onReject, isLoading }) => {
    const [reason, setReason] = useState('');

    const handleReject = () => {
        if (!reason.trim()) {
            toast.error('Please provide a rejection reason.');
            return;
        }
        if (transaction) {
            onReject(transaction._id, reason);
            setReason('');
        }
    };
    
    // Reset reason when modal opens/closes
    React.useEffect(() => {
        if (!isOpen) setReason('');
    }, [isOpen]);

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Reject Cashback for #${transaction?._id.substring(0, 8)}...`}
            size="md"
        >
            {transaction && (
                <div className="space-y-4">
                    <Alert variant="warning" title="Warning: Irreversible Action">
                        You are rejecting a cashback request of **₹{transaction.amount}** from **{transaction.user.name}**. 
                        This amount will be permanently removed from their pending balance.
                    </Alert>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason (Required)</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            placeholder="State the clear reason for rejection (e.g., 'Order Cancelled', 'Violation of Terms')..."
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
                        <Button 
                            variant="danger" 
                            onClick={handleReject} 
                            loading={isLoading}
                            icon={XCircle}
                        >
                            Confirm Rejection
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

// --- Main Component ---
export const CashbackManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<AdminTransaction | null>(null);

  const { data: transactionsData, isLoading, error, refetch } = usePendingTransactions({
    page: currentPage,
    limit: 15,
  });

  const approveMutation = useApproveTransaction();
  const rejectMutation = useRejectTransaction();
  const manualCreditMutation = useManuallyAddCashback();

  const transactions = transactionsData?.transactions || [];
  const totalPages = transactionsData?.totalPages || 1;
  const totalPending = transactionsData?.total || 0;

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    const lowercasedQuery = searchQuery.toLowerCase();
    return transactions.filter(
        (tx) =>
            tx._id?.toLowerCase().includes(lowercasedQuery) ||
            (tx.user as { name: string, email: string }).name?.toLowerCase().includes(lowercasedQuery) ||
            (tx.user as { name: string, email: string }).email?.toLowerCase().includes(lowercasedQuery) ||
            tx.description?.toLowerCase().includes(lowercasedQuery)
    );
  }, [transactions, searchQuery]);
  
  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      refetch(); // Refresh list immediately
    } catch (err) {
      // Error toast handled by hook
    }
  };

  const openRejectModal = (transaction: AdminTransaction) => {
    setSelectedTransaction(transaction);
    setRejectModalOpen(true);
  };

  const handleManualCredit = async (payload: ManualCreditPayload) => {
      try {
          await manualCreditMutation.mutateAsync(payload);
          refetch(); // Refresh list immediately
      } catch (err) {
          // Error toast handled by hook
      }
  };
  
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cashback Approval Center
          </h1>
          <p className="text-gray-600">
            Review, approve, or reject pending cashback transactions.
          </p>
        </div>

        {/* Stats and Manual Credit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="text-center p-6 bg-yellow-50 border-yellow-200 lg:col-span-1">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalPending}</div>
              <div className="text-gray-600">Pending Requests</div>
            </Card>
            <div className='lg:col-span-2'>
                <ManualCreditForm onCredit={handleManualCredit} isLoading={manualCreditMutation.isPending} />
            </div>
        </div>

        {/* Search & Filter */}
        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by User Name, Email, or Transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full shadow-inner"
            />
          </div>
        </Card>

        {/* Pending Transactions Table */}
        <Card>
          <div className="overflow-x-auto">
            {isLoading ? (
              <LoadingSpinner text="Loading pending transactions..." />
            ) : filteredTransactions.length > 0 ? (
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">User</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Amount</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Description</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx: AdminTransaction, index: number) => (
                    <motion.tr
                      key={tx._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{(tx.user as any)?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{(tx.user as any)?.email || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-green-600">
                          {formatCurrency(tx.amount)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                          <div className="text-sm text-gray-900 truncate">{tx.description}</div>
                          <div className="text-xs text-gray-500">ID: {tx._id.substring(0, 8)}...</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="warning" size="sm">
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            icon={CheckCircle}
                            onClick={() => handleApprove(tx._id)}
                            loading={approveMutation.isPending && selectedTransaction?._id === tx._id}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={XCircle}
                            onClick={() => openRejectModal(tx)}
                            loading={rejectMutation.isPending && selectedTransaction?._id === tx._id}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState
                title="Queue Empty"
                message="No pending cashback transactions requiring approval right now. Great job!"
                icon={WalletIcon}
              />
            )}
          </div>
        </Card>

        {/* Pagination */}
        {totalPending > filteredTransactions.length && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
        
        <RejectModal
            isOpen={rejectModalOpen}
            onClose={() => setRejectModalOpen(false)}
            transaction={selectedTransaction}
            onReject={async (id, reason) => {
                try {
                    setSelectedTransaction(null); // Clear selected transaction to reset loading state
                    await rejectMutation.mutateAsync({ id, reason });
                } catch (err) {
                    // Handled by hook
                }
            }}
            isLoading={rejectMutation.isPending}
        />
        
      </div>
    </div>
  );
};

