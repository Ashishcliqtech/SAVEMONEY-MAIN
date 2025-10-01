
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storesApi } from '../../api/stores';
import { Store, Offer } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card } from '../../components/ui/Card/Card';

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
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    if (!store) {
        return <ErrorState message="Store not found." />;
    }

    return (
        <div className="store-page">
            <div className="store-header">
                {store.banner_url && <img src={store.banner_url} alt={`${store.name} banner`} className="store-banner" />}
                <div className="store-info">
                    {store.logo && <img src={store.logo} alt={`${store.name} logo`} className="store-logo" />}
                    <h1>{store.name}</h1>
                    <p>{store.description}</p>
                    <p>Cashback Rate: {store.cashback_rate}%</p>
                </div>
            </div>

            <div className="store-offers">
                <h2>Offers from {store.name}</h2>
                <div className="offer-grid">
                    {offers.map(offer => (
                        <Card key={offer.id}>
                            <img src={offer.imageUrl} alt={offer.title} />
                            <h3>{offer.title}</h3>
                            <p>{offer.description}</p>
                            {offer.couponCode && <p>Coupon: {offer.couponCode}</p>}
                            <a href={offer.url} target="_blank" rel="noopener noreferrer">Go to offer</a>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StorePage;
