import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Search, Plus, CreditCard as Edit, Trash2, Eye, Clock, Copy, ExternalLink, Calendar } from 'lucide-react';
import { Card, Button, Badge, Input, Modal, Pagination, ImageUpload } from '../../../components/ui';
import { useOffers, useStores, useCategories, useCreateOffer, useUpdateOffer, useDeleteOffer } from '../../../hooks/useSupabase';
import toast from 'react-hot-toast';

export const OfferManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    store_id: '',
    category_id: '',
    cashback_rate: 0,
    original_price: 0,
    discounted_price: 0,
    coupon_code: '',
    offer_type: 'deal' as 'cashback' | 'coupon' | 'deal',
    image_url: '',
    terms: [] as string[],
    min_order_value: 0,
    expiry_date: '',
    is_exclusive: false,
    is_trending: false,
    is_featured: false,
  });

  const offerTypes = ['cashback', 'coupon', 'deal'];

  const { data: offersData, isLoading } = useOffers({
    search: searchQuery,
    offerType: typeFilter !== 'all' ? typeFilter : undefined,
    page: currentPage,
    limit: 9,
  });
  
  const { data: stores } = useStores({ limit: 100 });
  const { data: categories } = useCategories();
  const createOfferMutation = useCreateOffer();
  const updateOfferMutation = useUpdateOffer();
  const deleteOfferMutation = useDeleteOffer();

  const offers = offersData?.offers || [];
  const totalPages = offersData?.totalPages || 1;

  const handleEditOffer = (offer: any) => {
    setSelectedOffer(offer);
    setOfferForm({
      title: offer.title,
      description: offer.description || '',
      store_id: offer.store_id,
      category_id: offer.category_id || '',
      cashback_rate: offer.cashback_rate,
      original_price: offer.original_price || 0,
      discounted_price: offer.discounted_price || 0,
      coupon_code: offer.coupon_code || '',
      offer_type: offer.offer_type,
      image_url: offer.image_url || '',
      terms: offer.terms || [],
      min_order_value: offer.min_order_value || 0,
      expiry_date: offer.expiry_date ? offer.expiry_date.split('T')[0] : '',
      is_exclusive: offer.is_exclusive,
      is_trending: offer.is_trending,
      is_featured: offer.is_featured,
    });
    setShowOfferModal(true);
  };

  const handleDeleteOffer = (offerId: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      deleteOfferMutation.mutate(offerId);
    }
  };

  const handleAddOffer = () => {
    setSelectedOffer(null);
    setOfferForm({
      title: '',
      description: '',
      store_id: '',
      category_id: '',
      cashback_rate: 0,
      original_price: 0,
      discounted_price: 0,
      coupon_code: '',
      offer_type: 'deal',
      image_url: '',
      terms: [],
      min_order_value: 0,
      expiry_date: '',
      is_exclusive: false,
      is_trending: false,
      is_featured: false,
    });
    setShowOfferModal(true);
  };

  const handleSaveOffer = () => {
    const offerData = {
      ...offerForm,
      expiry_date: offerForm.expiry_date ? new Date(offerForm.expiry_date).toISOString() : null,
    };

    if (selectedOffer) {
      updateOfferMutation.mutate({ id: selectedOffer.id, updates: offerData });
    } else {
      createOfferMutation.mutate(offerData);
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
                {offerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {offers.length} of {offersData?.total || 0} offers
            </div>
          </div>
        </Card>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col" hover>
                <div className="relative mb-4">
                  <img
                    src={offer.image_url || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'}
                    alt={offer.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {offer.is_exclusive && (
                      <Badge variant="danger" size="sm">
                        Exclusive
                      </Badge>
                    )}
                    {offer.is_trending && (
                      <Badge variant="warning" size="sm">
                        🔥 Trending
                      </Badge>
                    )}
                    <Badge variant={getOfferTypeColor(offer.offer_type)} size="sm">
                      {offer.offer_type}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    {offer.cashback_rate}% back
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={offer.store?.logo_url || 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'}
                      alt={offer.store.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-600">
                      {offer.store.name}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {offer.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                    {offer.description}
                  </p>

                  {offer.original_price && offer.discounted_price && (
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{offer.discounted_price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{offer.original_price.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-orange-600 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Valid till {offer.expiry_date ? new Date(offer.expiry_date).toLocaleDateString() : 'No expiry'}</span>
                  </div>

                  {offer.coupon_code && (
                    <div className="flex items-center space-x-2 mb-4">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {offer.coupon_code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Copy}
                        onClick={() => handleCopyCode(offer.coupon_code!)}
                      />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleEditOffer(offer)}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEditOffer(offer)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {offers.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No offers found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="primary" onClick={handleAddOffer}>
              Add First Offer
            </Button>
          </Card>
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
          title={selectedOffer ? 'Edit Offer' : 'Add Offer'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Offer Title"
                value={offerForm.title}
                onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter offer title"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store
                </label>
                <select
                  value={offerForm.store_id}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, store_id: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Store</option>
                  {stores?.stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Cashback Rate (%)"
                type="number"
                value={offerForm.cashback_rate}
                onChange={(e) => setOfferForm(prev => ({ ...prev, cashback_rate: parseFloat(e.target.value) || 0 }))}
                placeholder="15"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Type
                </label>
                <select
                  value={offerForm.offer_type}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, offer_type: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Type</option>
                  {offerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Original Price"
                type="number"
                value={offerForm.original_price}
                onChange={(e) => setOfferForm(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))}
                placeholder="50000"
              />
              <Input
                label="Discounted Price"
                type="number"
                value={offerForm.discounted_price}
                onChange={(e) => setOfferForm(prev => ({ ...prev, discounted_price: parseFloat(e.target.value) || 0 }))}
                placeholder="25000"
              />
              <Input
                label="Coupon Code"
                value={offerForm.coupon_code}
                onChange={(e) => setOfferForm(prev => ({ ...prev, coupon_code: e.target.value }))}
                placeholder="SAVE50"
              />
              <Input
                label="Expiry Date"
                type="date"
                value={offerForm.expiry_date}
                onChange={(e) => setOfferForm(prev => ({ ...prev, expiry_date: e.target.value }))}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Image
              </label>
              <ImageUpload
                onUpload={(imageUrl) => setOfferForm(prev => ({ ...prev, image_url: imageUrl }))}
                folder="offers"
                transformation="offerImage"
                currentImage={offerForm.image_url}
                placeholder="Upload offer image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={offerForm.description}
                onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Enter offer description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isExclusive"
                  checked={offerForm.is_exclusive}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, is_exclusive: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isExclusive" className="ml-2 text-sm text-gray-700">
                  Mark as Exclusive
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isTrending"
                  checked={offerForm.is_trending}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, is_trending: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isTrending" className="ml-2 text-sm text-gray-700">
                  Mark as Trending
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={offerForm.is_featured}
                  onChange={(e) => setOfferForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                  Mark as Featured
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
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
                {selectedOffer ? 'Update Offer' : 'Create Offer'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};