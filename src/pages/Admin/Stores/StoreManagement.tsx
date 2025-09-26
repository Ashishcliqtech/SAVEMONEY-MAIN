import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Search, Plus, CreditCard as Edit, Trash2, Eye, Star, ExternalLink, Image, Percent } from 'lucide-react';
import { Card, Button, Badge, Input, Modal, Pagination, ImageUpload } from '../../../components/ui';
import { useStores, useCategories, useCreateStore, useUpdateStore, useDeleteStore } from '../../../hooks/useSupabase';

export const StoreManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [storeForm, setStoreForm] = useState({
    name: '',
    description: '',
    website_url: '',
    cashback_rate: 0,
    category_id: '',
    is_popular: false,
    logo_url: '',
    banner_url: '',
  });

  const { data: storesData, isLoading } = useStores({
    search: searchQuery,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    page: currentPage,
    limit: 9,
  });
  
  const { data: categories } = useCategories();
  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();
  const deleteStoreMutation = useDeleteStore();

  const stores = storesData?.stores || [];
  const totalPages = storesData?.totalPages || 1;

  const handleEditStore = (store: any) => {
    setSelectedStore(store);
    setStoreForm({
      name: store.name,
      description: store.description || '',
      website_url: store.website_url || '',
      cashback_rate: store.cashback_rate,
      category_id: store.category_id || '',
      is_popular: store.is_popular,
      logo_url: store.logo_url || '',
      banner_url: store.banner_url || '',
    });
    setShowStoreModal(true);
  };

  const handleDeleteStore = (storeId: string) => {
    if (confirm('Are you sure you want to delete this store?')) {
      deleteStoreMutation.mutate(storeId);
    }
  };

  const handleAddStore = () => {
    setSelectedStore(null);
    setStoreForm({
      name: '',
      description: '',
      website_url: '',
      cashback_rate: 0,
      category_id: '',
      is_popular: false,
      logo_url: '',
      banner_url: '',
    });
    setShowStoreModal(true);
  };

  const handleSaveStore = () => {
    const storeData = {
      ...storeForm,
      slug: storeForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };

    if (selectedStore) {
      updateStoreMutation.mutate({ id: selectedStore.id, updates: storeData });
    } else {
      createStoreMutation.mutate(storeData);
    }
    setShowStoreModal(false);
  };

  const handleImageUpload = (field: 'logo_url' | 'banner_url') => (imageUrl: string) => {
    setStoreForm(prev => ({ ...prev, [field]: imageUrl }));
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Store Management
            </h1>
            <p className="text-gray-600">
              Manage partner stores and their offers
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleAddStore}>
            Add New Store
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
                  placeholder="Search stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {stores.length} of {storesData?.total || 0} stores
            </div>
          </div>
        </Card>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col" hover>
                <div className="relative mb-4">
                  <img
                    src={store.logo_url || 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'}
                    alt={store.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {store.isPopular && (
                    <Badge variant="warning" size="sm" className="absolute top-2 left-2">
                      🔥 Popular
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {store.cashbackRate}% back
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{store.category?.name}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                    {store.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.5</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {store.total_offers} offers
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleEditStore(store)}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEditStore(store)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteStore(store.id)}
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {stores.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No stores found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="primary" onClick={handleAddStore}>
              Add First Store
            </Button>
          </Card>
        )}

        {/* Pagination */}
        {stores.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        {/* Store Modal */}
        <Modal
          isOpen={showStoreModal}
          onClose={() => setShowStoreModal(false)}
          title={selectedStore ? 'Edit Store' : 'Add Store'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Store Name"
                value={storeForm.name}
                onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter store name"
              />
              <Input
                label="Website URL"
                value={storeForm.website_url}
                onChange={(e) => setStoreForm(prev => ({ ...prev, website_url: e.target.value }))}
                placeholder="https://example.com"
              />
              <Input
                label="Cashback Rate (%)"
                type="number"
                value={storeForm.cashback_rate}
                onChange={(e) => setStoreForm(prev => ({ ...prev, cashback_rate: parseFloat(e.target.value) || 0 }))}
                placeholder="5"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={storeForm.category_id}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  {categories?.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={storeForm.is_popular}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, is_popular: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isPopular" className="ml-2 text-sm text-gray-700">
                  Mark as Popular
                </label>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Logo
              </label>
              <ImageUpload
                onUpload={handleImageUpload('logo_url')}
                folder="stores"
                transformation="storeLogo"
                currentImage={storeForm.logo_url}
                placeholder="Upload store logo"
              />
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Banner (Optional)
              </label>
              <ImageUpload
                onUpload={handleImageUpload('banner_url')}
                folder="stores"
                transformation="storeBanner"
                currentImage={storeForm.banner_url}
                placeholder="Upload store banner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={storeForm.description}
                onChange={(e) => setStoreForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Enter store description..."
              />
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowStoreModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSaveStore}
                loading={createStoreMutation.isPending || updateStoreMutation.isPending}
              >
                {selectedStore ? 'Update Store' : 'Create Store'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};