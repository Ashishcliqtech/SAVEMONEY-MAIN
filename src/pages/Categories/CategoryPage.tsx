import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOffers, useStores, useCategories } from '../../hooks/useApi';
import { Card, LoadingSpinner, Button } from '../../components/ui';
import { Store, Offer } from '../../types';
import { ArrowLeft } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: offers, isLoading: isLoadingOffers } = useOffers();
  const { data: stores, isLoading: isLoadingStores } = useStores();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const category = categories?.find(c => c.id === id);

  const filteredOffers = offers?.filter((offer: Offer) => offer.category_id === id) || [];
  const filteredStores = stores?.filter((store: Store) => store.category_id === id) || [];

  if (isLoadingOffers || isLoadingStores || isLoadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/categories" className="flex items-center space-x-2 text-indigo-200 hover:text-white mb-4">
            <ArrowLeft size={20} />
            <span>Back to Categories</span>
          </Link>
          <h1 className="text-4xl font-bold">{category?.name || 'Category'}</h1>
          <p className="text-xl text-indigo-100 mt-2">{category?.description || 'Explore offers and stores in this category.'}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Stores in {category?.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.length > 0 ? (
              filteredStores.map((store: Store) => (
                <Link to={`/stores/${store.id}`} key={store.id}>
                  <Card hover className="h-full">
                    <div className="flex items-center space-x-4">
                      <img src={store.logo} alt={store.name} className="w-16 h-16 rounded-lg object-contain" />
                      <div>
                        <h3 className="text-lg font-semibold">{store.name}</h3>
                        <p className="text-sm text-gray-500">{store.offerCount} offers</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <p>No stores found for this category.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Offers in {category?.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredOffers.length > 0 ? (
              filteredOffers.map((offer: Offer) => (
                <Card key={offer.id} className="h-full">
                    <img src={offer.image} alt={offer.title} className="w-full h-40 object-cover rounded-t-lg" />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">{offer.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{offer.store?.name}</p>
                        <div className="mt-4">
                            <span className="text-lg font-bold text-green-600">{offer.cashback_amount}</span>
                        </div>
                    </div>
                </Card>
              ))
            ) : (
              <p>No offers found for this category.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
