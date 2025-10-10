
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storesApi } from '../../api/stores';
import { Store, Offer } from '../../types';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card } from '../../components/ui/Card/Card';
import { Button } from '../../components/ui';
import { ExternalLink, Copy, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import StorePageSkeleton from './StorePageSkeleton';

const StorePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [store, setStore] = useState<Store | null>(null);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStoreData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await storesApi.getStoreById(id);
                setStore(response.store);
                setOffers(response.offers);
            } catch (err) {
                setError('Failed to fetch store data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [id]);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('Coupon code copied!');
    };


    if (loading) {
        return <StorePageSkeleton />;
    }

    if (error) {
        return <ErrorState title="Error" message={error} />;
    }

    if (!store) {
        return <ErrorState title="Not Found" message="Store not found." />;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Store Header */}
            <section className="relative bg-white">
                <div className="h-48 md:h-64 bg-gray-200">
                    {store.banner_url && (
                        <img
                            src={store.banner_url}
                            alt={`${store.name} banner`}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-24 space-y-4 md:space-y-0 md:space-x-8">
                        <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-lg border-4 border-white bg-white shadow-lg flex items-center justify-center p-2">
                             <img
                                src={store.logo}
                                alt={`${store.name} logo`}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="text-center md:text-left py-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{store.name}</h1>
                            <p className="mt-2 text-gray-600 max-w-2xl">{store.description}</p>
                            <div className="mt-4 flex justify-center md:justify-start items-center gap-4">
                               <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-base font-bold">
                                    Upto {store.cashback_rate}% Cashback
                                </div>
                                <span className="text-sm text-gray-500 font-medium">
                                    {offers.length} offers available
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Offers Section */}
            <main className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                        Offers from {store.name}
                    </h2>
                    {offers.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {offers.map(offer => (
                                <Card key={offer.id} className="group overflow-hidden h-full flex flex-col" hover padding="sm">
                                    <div className="relative mb-4">
                                        <img
                                            src={offer.imageUrl}
                                            alt={offer.title}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                                            {offer.cashbackRate}% back
                                        </div>
                                    </div>
                                    <div className="space-y-3 flex-1 flex flex-col">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base leading-tight">
                                                {offer.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-3 h-16">
                                                {offer.description}
                                            </p>
                                        </div>
                                        {offer.expiryDate && (
                                            <div className="flex items-center text-sm text-orange-600 mb-4">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>Valid till {new Date(offer.expiryDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        <div className="space-y-2 mt-auto">
                                            {offer.couponCode ? (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        icon={Copy}
                                                        onClick={() => handleCopyCode(offer.couponCode!)}
                                                        className="flex-1 text-xs min-w-0"
                                                    >
                                                        {offer.couponCode}
                                                    </Button>
                                                    <a href={offer.url} target="_blank" rel="noopener noreferrer" className="w-full">
                                                        <Button variant="primary" size="sm" icon={ExternalLink} fullWidth>
                                                            Shop Now
                                                        </Button>
                                                    </a>
                                                </div>
                                            ) : (
                                                 <a href={offer.url} target="_blank" rel="noopener noreferrer" className="w-full">
                                                    <Button variant="primary" size="sm" fullWidth icon={ExternalLink}>
                                                        Get Offer
                                                    </Button>
                                                 </a>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-16">
                             <h3 className="text-xl font-semibold text-gray-800">No Offers Available</h3>
                            <p className="text-gray-500 mt-2">There are currently no active offers for this store. Please check back later.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StorePage;
