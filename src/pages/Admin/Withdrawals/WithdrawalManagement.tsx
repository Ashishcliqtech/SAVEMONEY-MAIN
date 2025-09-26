import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Calendar,
  User,
  CreditCard,
} from 'lucide-react';
import { Card, Button, Badge, Pagination } from '../../../components/ui';
import { mockWithdrawals } from '../../../data/mockData';

interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: 'upi' | 'bank' | 'paytm' | 'voucher';
  accountDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestDate: string;
  completedDate?: string;
  adminNotes?: string;
}

export const WithdrawalManagement: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([
    {
      id: '1',
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@example.com',
      amount: 5000,
      method: 'upi',
      accountDetails: 'john@paytm',
      status: 'pending',
      requestDate: '2025-01-22T10:30:00Z',
    },
    {
      id: '2',
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      amount: 2500,
      method: 'bank',
      accountDetails: 'HDFC Bank - ****1234',
      status: 'processing',
      requestDate: '2025-01-21T14:15:00Z',
    },
    {
      id: '3',
      userId: '3',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      amount: 1000,
      method: 'paytm',
      accountDetails: '9876543210',
      status: 'completed',
      requestDate: '2025-01-20T09:45:00Z',
      completedDate: '2025-01-21T16:30:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         withdrawal.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         withdrawal.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || withdrawal.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || withdrawal.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleApprove = (withdrawalId: string) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === withdrawalId 
        ? { ...w, status: 'processing' as const }
        : w
    ));
  };

  const handleComplete = (withdrawalId: string) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === withdrawalId 
        ? { ...w, status: 'completed' as const, completedDate: new Date().toISOString() }
        : w
    ));
  };

  const handleReject = (withdrawalId: string) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === withdrawalId 
        ? { ...w, status: 'failed' as const }
        : w
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'completed': return 'success';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'upi': return '📱';
      case 'bank': return '🏦';
      case 'paytm': return '💳';
      case 'voucher': return '🎁';
      default: return '💰';
    }
  };

  const totalPending = withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0);
  const totalProcessing = withdrawals.filter(w => w.status === 'processing').reduce((sum, w) => sum + w.amount, 0);
  const totalCompleted = withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Withdrawal Management
          </h1>
          <p className="text-gray-600">
            Process and manage user withdrawal requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{totalPending.toLocaleString()}
            </div>
            <div className="text-gray-600">Pending</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{totalProcessing.toLocaleString()}
            </div>
            <div className="text-gray-600">Processing</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ₹{totalCompleted.toLocaleString()}
            </div>
            <div className="text-gray-600">Completed</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {withdrawals.length}
            </div>
            <div className="text-gray-600">Total Requests</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search withdrawals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Methods</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
                <option value="paytm">Paytm</option>
                <option value="voucher">Gift Voucher</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredWithdrawals.length} of {withdrawals.length} requests
            </div>
          </div>
        </Card>

        {/* Withdrawals Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Request ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Method</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.map((withdrawal, index) => (
                  <motion.tr
                    key={withdrawal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">#{withdrawal.id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{withdrawal.userName}</div>
                        <div className="text-sm text-gray-500">{withdrawal.userEmail}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">
                        ₹{withdrawal.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getMethodIcon(withdrawal.method)}</span>
                        <div>
                          <div className="font-medium text-gray-900 capitalize">{withdrawal.method}</div>
                          <div className="text-sm text-gray-500">{withdrawal.accountDetails}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusColor(withdrawal.status)} size="sm">
                        {withdrawal.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900">
                        {new Date(withdrawal.requestDate).toLocaleDateString()}
                      </div>
                      {withdrawal.completedDate && (
                        <div className="text-xs text-gray-500">
                          Completed: {new Date(withdrawal.completedDate).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {withdrawal.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={CheckCircle}
                              onClick={() => handleApprove(withdrawal.id)}
                              className="text-green-600 hover:text-green-700"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={XCircle}
                              onClick={() => handleReject(withdrawal.id)}
                              className="text-red-600 hover:text-red-700"
                            />
                          </>
                        )}
                        {withdrawal.status === 'processing' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={CheckCircle}
                            onClick={() => handleComplete(withdrawal.id)}
                            className="text-green-600 hover:text-green-700"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredWithdrawals.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No withdrawal requests found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {filteredWithdrawals.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredWithdrawals.length / 10)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};