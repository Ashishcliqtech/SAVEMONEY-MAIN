import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Search, Plus, Trash2, Eye, Clock, Copy, AlertTriangle } from 'lucide-react';
import { Card, Button, Badge, Input, Modal, Pagination, ImageUpload, EmptyState, LoadingSpinner } from '../../../components/ui';
import { useOffers, useStores, useCategories, useCreateOffer, useUpdateOffer, useDeleteOffer } from '../../../hooks/useApi';
import toast from 'react-hot-toast';
import { Offer, Store, Category } from '../../../types';

const initialFormState = {
  title: '',
  description: '',
  url: '', // <-- Added URL field here
  store: '',
  category: '',
  cashbackRate: 0,
  originalPrice: 0,
  discountedPrice: 0,
  couponCode: '',
  offerType: 'deal' as 'cashback' | 'coupon' | 'deal',
  imageUrl: '',
  terms: [],
  minOrderValue: 0,
  expiryDate: '',
  isExclusive: false,
  isTrending: false,
  isFeatured: false,
};

export const OfferManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [offerForm, setOfferForm] = useState<Partial<Offer>>(initialFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);

  const { data: offersData, isLoading: isLoadingOffers } = useOffers({
    search: searchQuery,
    offerType: typeFilter !== 'all' ? typeFilter : undefined,
    page: currentPage,
    limit: 9,
  });

  const { data: storesData, isLoading: isLoadingStores } = useStores({ limit: 500 });
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  
  const offers = offersData?.offers || [];
  const totalPages = offersData?.totalPages || 1;
  const stores = storesData?.stores || [];

  const createOfferMutation = useCreateOffer();
  const updateOfferMutation = useUpdateOffer();
  const deleteOfferMutation = useDeleteOffer();

  const handleEditOffer = (offer: Offer) => {
    setSelectedOfferId(offer._id || offer.id);
    setOfferForm({
        ...offer,
        store: typeof offer.store === 'object' ? (offer.store as Store)?._id : offer.store,
        category: typeof offer.category === 'object' ? (offer.category as Category)?._id : offer.category,
        expiryDate: offer.expiryDate ? new Date(offer.expiryDate).toISOString().split('T')[0] : '',
    });
    setImageFile(null);
    setShowOfferModal(true);
  };

  const handleAddOffer = () => {
    setSelectedOfferId(null);
    setOfferForm(initialFormState);
    setImageFile(null);
    setShowOfferModal(true);
  };
  
  const handleConfirmDelete = () => {
    if (offerToDelete) {
      const idToDelete = offerToDelete._id || offerToDelete.id;
      if (idToDelete) {
        deleteOfferMutation.mutate(idToDelete);
      } else {
        toast.error("Could not delete offer: ID is missing.");
      }
      setOfferToDelete(null);
    }
  };

  const handleSaveOffer = () => {
    const formData = new FormData();
    
    Object.entries(offerForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'terms' && Array.isArray(value)) {
            value.forEach(term => formData.append('terms', term));
        } else {
            formData.append(key, String(value));
        }
      }
    });

    if (imageFile) {
        formData.append('imageUrl', imageFile);
    }

    if (selectedOfferId) {
      updateOfferMutation.mutate({ id: selectedOfferId, updates: formData });
    } else {
      createOfferMutation.mutate(formData);
    }
    setShowOfferModal(false);
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  const getOfferTypeColor = (type: string) => {
    switch (type) {
      case 'cashback': return 'success';
      case 'coupon': return 'warning';
      case 'deal': return 'info';
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
              Offer Management
            </h1>
            <p className="text-gray-600">
              Create and manage cashback offers and deals
            </p>
          </div>
          <Button variant="primary" icon={Plus} onClick={handleAddOffer}>
            Add New Offer
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
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full sm:w-64"
                />
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="cashback">Cashback</option>
                <option value="coupon">Coupon</option>
                <option value="deal">Deal</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {offers.length} of {offersData?.total || 0} offers
            </div>
          </div>
        </Card>

        {/* Offers Grid */}
        {isLoadingOffers ? <LoadingSpinner /> : (
          offers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {offers.map((offer: Offer, index: number) => (
                <motion.div
                  key={offer._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col" hover>
                    <div className="relative mb-4">
                      <img
                        src={offer.imageUrl || 'https://placehold.co/400x200/eee/ccc?text=Offer+Image'}
                        alt={offer.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        {offer.isExclusive && (
                          <Badge variant="danger" size="sm">
                            Exclusive
                          </Badge>
                        )}
                        {offer.isTrending && (
                          <Badge variant="warning" size="sm">
                            🔥 Trending
                          </Badge>
                        )}
                        <Badge variant={getOfferTypeColor(offer.offerType)} size="sm">
                          {offer.offerType}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                        {offer.cashbackRate}% back
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={offer.store?.logo || 'https://placehold.co/40x40/eee/ccc?text=Logo'}
                          alt={offer.store?.name || 'Store'}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-600">
                          {offer.store?.name || 'Unknown Store'}
                        </span>
                      </div>


                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {offer.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                        {offer.description}
                      </p>

                      {offer.originalPrice && offer.discountedPrice && (
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{offer.discountedPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{offer.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center text-sm text-orange-600 mb-4">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Valid till {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : 'No expiry'}</span>
                      </div>

                      {offer.couponCode && (
                        <div className="flex items-center space-x-2 mb-4">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {offer.couponCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={Copy}
                            onClick={() => handleCopyCode(offer.couponCode!)}
                          />
                        </div>
                      )}

                      <div className="flex space-x-2 mt-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          onClick={() => handleEditOffer(offer)}
                          className="flex-1"
                        >
                          View/Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setOfferToDelete(offer)}
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
              title="No offers found"
              message="Try adjusting your search or filter criteria, or add a new offer to get started."
              icon={Tag}
            />
          )
        )}
        
        {/* Pagination */}
        {offers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        {/* Offer Modal */}
        <Modal
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
          title={selectedOfferId ? 'Edit Offer' : 'Add Offer'}
          size="xl"
        >
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Offer Title"
                value={offerForm.title || ''}
                onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter offer title"
              />
              {/* NEW INPUT FIELD FOR OFFER URL */}
              <Input
                label="Offer URL"
                value={offerForm.url || ''}
                onChange={(e) => setOfferForm(prev => ({...prev, url: e.target.value }))}
                placeholder="https://example.com/product-deal"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store
                </label>
                <select
                  value={offerForm.store as string || ''}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, store: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isLoadingStores}
                >
                  <option value="">Select Store</option>
                  {stores?.map((store: Store) => (
                    <option key={store._id} value={store._id}>{store.name}</option>
                  ))}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={offerForm.category as string || ''}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isLoadingCategories}
                >
                  <option value="">Select Category</option>
                  {categories?.map((category: Category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Cashback Rate (%)"
                type="number"
                value={offerForm.cashbackRate || 0}
                onChange={(e) => setOfferForm(prev => ({ ...prev, cashbackRate: parseFloat(e.target.value) || 0 }))}
                placeholder="15"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Type
                </label>
                <select
                  value={offerForm.offerType}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, offerType: e.target.value as 'cashback' | 'coupon' | 'deal' }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="deal">Deal</option>
                  <option value="coupon">Coupon</option>
                  <option value="cashback">Cashback</option>
                </select>
              </div>
              <Input
                label="Coupon Code"
                value={offerForm.couponCode || ''}
                onChange={(e) => setOfferForm(prev => ({ ...prev, couponCode: e.target.value }))}
                placeholder="SAVE50"
                disabled={offerForm.offerType !== 'coupon'}
              />
              <Input
                label="Original Price"
                type="number"
                value={offerForm.originalPrice || 0}
                onChange={(e) => setOfferForm(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                placeholder="50000"
              />
              <Input
                label="Discounted Price"
                type="number"
                value={offerForm.discountedPrice || 0}
                onChange={(e) => setOfferForm(prev => ({ ...prev, discountedPrice: parseFloat(e.target.value) || 0 }))}
                placeholder="25000"
              />
               <Input
                label="Minimum Order Value"
                type="number"
                value={offerForm.minOrderValue || 0}
                onChange={(e) => setOfferForm(prev => ({ ...prev, minOrderValue: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
              <Input
                label="Expiry Date"
                type="date"
                value={offerForm.expiryDate || ''}
                onChange={(e) => setOfferForm(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Image
              </label>
              <ImageUpload
                onFileSelect={setImageFile}
                currentImage={offerForm.imageUrl}
                placeholder="Upload offer image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={offerForm.description || ''}
                onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Enter offer description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Terms (comma-separated)
              </label>
              <Input
                value={(offerForm.terms || []).join(', ')}
                onChange={(e) => setOfferForm(prev => ({ ...prev, terms: e.target.value.split(',').map(t => t.trim()) }))}
                placeholder="e.g., New users only, One time use"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isExclusive"
                  checked={offerForm.isExclusive || false}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, isExclusive: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isExclusive" className="ml-2 text-sm text-gray-700">
                  Exclusive
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isTrending"
                  checked={offerForm.isTrending || false}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, isTrending: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isTrending" className="ml-2 text-sm text-gray-700">
                  Trending
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={offerForm.isFeatured || false}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                  Featured
                </label>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowOfferModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleSaveOffer}
                loading={createOfferMutation.isPending || updateOfferMutation.isPending}
              >
                {selectedOfferId ? 'Update Offer' : 'Create Offer'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!offerToDelete}
          onClose={() => setOfferToDelete(null)}
          title="Confirm Deletion"
          size="md"
        >
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Offer
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the offer "{offerToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setOfferToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                loading={deleteOfferMutation.isPending}
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
