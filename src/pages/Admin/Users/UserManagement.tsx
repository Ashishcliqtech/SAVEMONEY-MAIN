import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
} from 'lucide-react';
import { Card, Button, Badge, Input, Modal, Pagination } from '../../../components/ui';
import { mockUser } from '../../../data/mockData';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'banned';
  totalCashback: number;
  joinedDate: string;
  lastLogin: string;
  avatar: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91 9876543210',
      status: 'active',
      totalCashback: 15420,
      joinedDate: '2024-01-15',
      lastLogin: '2025-01-22',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91 9876543211',
      status: 'active',
      totalCashback: 8750,
      joinedDate: '2024-02-20',
      lastLogin: '2025-01-21',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+91 9876543212',
      status: 'inactive',
      totalCashback: 2340,
      joinedDate: '2024-03-10',
      lastLogin: '2024-12-15',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'banned') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'banned': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage and monitor user accounts
            </p>
          </div>
          <Button variant="primary" icon={Plus}>
            Add New User
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">User</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Contact</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Cashback</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Joined</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Last Login</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getStatusColor(user.status)} size="sm">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">
                        ₹{user.totalCashback.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(user.joinedDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleEditUser(user)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          onClick={() => handleEditUser(user)}
                        />
                        {user.status === 'active' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Ban}
                            onClick={() => handleStatusChange(user.id, 'banned')}
                            className="text-red-600 hover:text-red-700"
                          />
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={CheckCircle}
                            onClick={() => handleStatusChange(user.id, 'active')}
                            className="text-green-600 hover:text-green-700"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredUsers.length / 10)}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* User Modal */}
        <Modal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          title={selectedUser ? 'Edit User' : 'Add User'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={selectedUser?.name || ''}
                placeholder="Enter full name"
              />
              <Input
                label="Email"
                type="email"
                value={selectedUser?.email || ''}
                placeholder="Enter email address"
              />
              <Input
                label="Phone"
                value={selectedUser?.phone || ''}
                placeholder="Enter phone number"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedUser?.status || 'active'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowUserModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setShowUserModal(false)}
              >
                {selectedUser ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};