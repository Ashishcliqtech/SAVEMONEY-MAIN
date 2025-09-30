import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOffers, useStores } from '../../hooks/useApi';
import { Card, LoadingSpinner, Button } from '../../components/ui';
import { Offer } from '../../types';
import { ArrowLeft } from 'lucide-react';

export const StorePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: offers, isLoading: isLoadingOffers } = useOffers();
  const { data: stores, isLoading: isLoadingStores } = useStores();

  const store = stores?.find(s => s.id === id);

  const filteredOffers = offers?.filter((offer: Offer) => offer.store_id === id) || [];

  if (isLoadingOffers || isLoadingStores) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Loading offers..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
       <section className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/stores" className="flex items-center space-x-2 text-cyan-200 hover:text-white mb-4">
            <ArrowLeft size={20} />
            <span>Back to Stores</span>
          </Link>
          <div className="flex items-center space-x-6">
            <img src={store?.logo} alt={store?.name} className="w-24 h-24 rounded-xl bg-white p-2 object-contain" />
            <div>
                <h1 className="text-4xl font-bold">{store?.name}</h1>
                <p className="text-xl text-cyan-100 mt-2">{store?.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Offers from {store?.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer: Offer) => (
                <Card key={offer.id} className="h-full">
                    <img src={offer.image} alt={offer.title} className="w-full h-40 object-cover rounded-t-lg" />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">{offer.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{offer.description}</p>
                        <div className="mt-4">
                            <span className="text-lg font-bold text-green-600">{offer.cashback_amount}</span>
                        </div>
                    </div>
                </Card>
            ))
          ) : (
            <p>No offers found for this store.</p>
          )}
        </div>
      </div>
    </div>
  );
};
