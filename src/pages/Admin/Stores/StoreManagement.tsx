import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store as StoreIcon, Search, Plus, Trash2, Eye, Star, AlertTriangle } from 'lucide-react';
import { Card, Button, Badge, Input, Modal, Pagination, ImageUpload, EmptyState, LoadingSpinner } from '../../../components/ui';
import { useStores, useCategories, useCreateStore, useUpdateStore, useDeleteStore } from '../../../hooks/useApi';
import { Store, Category } from '../../../types';
import toast from 'react-hot-toast';

const initialFormState = {
  name: '',
  description: '',
  url: '',
  cashback_rate: 0,
  category: '',
  isPopular: false,
  isFeatured: false,
  logo: '',
  banner_url: '',
};

export const StoreManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [storeForm, setStoreForm] = useState<Partial<Store>>(initialFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [storeToDelete, setStoreToDelete] = useState<Store | null>(null);

  const { data: storesData, isLoading: isLoadingStores } = useStores({
    search: searchQuery,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    page: currentPage,
    limit: 9,
  });

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const stores = storesData?.stores || [];
  const totalPages = storesData?.totalPages || 1;

  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();
  const deleteStoreMutation = useDeleteStore();

  const handleEditStore = (store: Store) => {
    setSelectedStoreId(store._id || store.id);
    setStoreForm({
        ...store,
        category: typeof store.category === 'object' ? (store.category as Category)?._id : store.category,
    });
    setLogoFile(null);
    setBannerFile(null);
    setShowStoreModal(true);
  };

  const handleConfirmDelete = () => {
    if (storeToDelete) {
      const idToDelete = storeToDelete._id || storeToDelete.id;
      if (idToDelete) {
        deleteStoreMutation.mutate(idToDelete);
      } else {
        toast.error("Could not delete store: ID is missing.");
      }
      setStoreToDelete(null);
    }
  };

  const handleAddStore = () => {
    setSelectedStoreId(null);
    setStoreForm(initialFormState);
    setLogoFile(null);
    setBannerFile(null);
    setShowStoreModal(true);
  };

  const handleSaveStore = () => {
    if (!storeForm.name || !storeForm.category) {
      toast.error("Name and category are required.");
      return;
    }

    const formData = new FormData();

    Object.entries(storeForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (logoFile) formData.append('logo', logoFile);
    if (bannerFile) formData.append('banner_url', bannerFile);

    if (selectedStoreId) {
      updateStoreMutation.mutate({ id: selectedStoreId, updates: formData });
    } else {
      createStoreMutation.mutate(formData);
    }
    setShowStoreModal(false);
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
                disabled={isLoadingCategories}
              >
                <option value="all">All Categories</option>
                {categories?.map((category: Category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {stores.length} of {storesData?.totalStores || 0} stores
            </div>
          </div>
        </Card>

        {/* Stores Grid */}
        {isLoadingStores ? <LoadingSpinner /> : (
          stores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stores.map((store: Store, index: number) => (
                <motion.div
                  key={store._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col" hover>
                    <div className="relative mb-4">
                      <img
                        src={store.logo || 'https://placehold.co/400x200/eee/ccc?text=Store+Logo'}
                        alt={store.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      {store.isPopular && (
                        <Badge variant="warning" size="sm" className="absolute top-2 left-2">
                          🔥 Popular
                        </Badge>
                      )}
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        {store.cashback_rate}% back
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
                          {store.totalOffers || 0} offers
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
                          icon={Trash2}
                          onClick={() => setStoreToDelete(store)}
                          className="text-red-600 hover:text-red-700"
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No stores found"
              message="Try adjusting your search or filter criteria, or add a new store to get started."
              icon={StoreIcon}
            />
          )
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
          title={selectedStoreId ? 'Edit Store' : 'Add Store'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Store Name"
                value={storeForm.name || ''}
                onChange={(e) => setStoreForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter store name"
              />
              <Input
                label="Website URL"
                value={storeForm.url || ''}
                onChange={(e) => setStoreForm(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com"
              />
              <Input
                label="Cashback Rate (%)"
                type="number"
                value={storeForm.cashback_rate || 0}
                onChange={(e) => setStoreForm(prev => ({ ...prev, cashback_rate: parseFloat(e.target.value) || 0 }))}
                placeholder="5"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={storeForm.category as string || ''}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Category</option>
                  {categories?.map((category: Category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPopular"
                  checked={storeForm.isPopular || false}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, isPopular: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isPopular" className="ml-2 text-sm text-gray-700">
                  Mark as Popular
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={storeForm.isFeatured || false}
                  onChange={(e) => setStoreForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                  Mark as Featured
                </label>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Logo
              </label>
              <ImageUpload
                onFileSelect={setLogoFile}
                currentImage={storeForm.logo}
                placeholder="Upload store logo"
              />
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Banner (Optional)
              </label>
              <ImageUpload
                onFileSelect={setBannerFile}
                currentImage={storeForm.banner_url}
                placeholder="Upload store banner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={storeForm.description || ''}
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
                {selectedStoreId ? 'Update Store' : 'Create Store'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!storeToDelete}
          onClose={() => setStoreToDelete(null)}
          title="Confirm Deletion"
          size="md"
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Store
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the store "{storeToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setStoreToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                loading={deleteStoreMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

