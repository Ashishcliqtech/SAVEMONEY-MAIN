import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Grid3X3,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingUp,
  Package,
  Shirt,
  Smartphone,
  Plane,
  Utensils,
  Sparkles,
  Home,
  BookOpen,
  Heart,
} from 'lucide-react';
import { Card, Button, Badge, Input, Modal, Pagination } from '../../../components/ui';
import { mockCategories } from '../../../data/mockData';
import toast from 'react-hot-toast';

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const iconOptions = [
    { value: 'shirt', label: 'Fashion', icon: Shirt },
    { value: 'smartphone', label: 'Electronics', icon: Smartphone },
    { value: 'plane', label: 'Travel', icon: Plane },
    { value: 'utensils', label: 'Food', icon: Utensils },
    { value: 'sparkles', label: 'Beauty', icon: Sparkles },
    { value: 'home', label: 'Home', icon: Home },
    { value: 'book-open', label: 'Books', icon: BookOpen },
    { value: 'heart', label: 'Health', icon: Heart },
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      toast.success('Category deleted successfully!');
    }
  };

  const handleSave = () => {
    toast.success('Category saved successfully!');
    setShowModal(false);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Category Management
            </h1>
            <p className="text-gray-600">
              Organize and manage product categories
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
            Add Category
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Grid3X3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-gray-600">Total Categories</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {categories.reduce((sum, cat) => sum + cat.storeCount, 0)}
            </div>
            <div className="text-gray-600">Total Stores</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {categories.reduce((sum, cat) => sum + cat.offerCount, 0)}
            </div>
            <div className="text-gray-600">Total Offers</div>
          </Card>
          
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(categories.reduce((sum, cat) => sum + cat.offerCount, 0) / categories.length)}
            </div>
            <div className="text-gray-600">Avg Offers/Category</div>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
            />
          </div>
        </Card>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredCategories.map((category, index) => {
            const iconOption = iconOptions.find(opt => opt.value === category.icon);
            const IconComponent = iconOption?.icon || Package;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col text-center" hover>
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-purple-600" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                    {category.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {category.storeCount}
                      </div>
                      <div className="text-sm text-gray-500">Stores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {category.offerCount}
                      </div>
                      <div className="text-sm text-gray-500">Offers</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEdit(category)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedCategory ? 'Edit Category' : 'Add Category'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Category Name"
                value={selectedCategory?.name || ''}
                placeholder="Enter category name"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  value={selectedCategory?.icon || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={selectedCategory?.description || ''}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Enter category description..."
              />
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSave}
              >
                {selectedCategory ? 'Update' : 'Create'} Category
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};