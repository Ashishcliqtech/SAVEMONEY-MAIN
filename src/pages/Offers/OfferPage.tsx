import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { offers } from '../../api';
import { ErrorState } from '../../components/ui';
import { Button } from '../../components/ui/Button';
import OfferPageSkeleton from './OfferPageSkeleton';

const OfferPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: offer, isLoading, isError } = useQuery({
    queryKey: ['offer', id],
    queryFn: () => offers.getOfferById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return <OfferPageSkeleton />;
  }

  if (isError || !offer) {
    return <ErrorState message="Sorry, we couldn't find this offer." />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{offer.title}</h1>
        <p className="text-gray-600 mb-4">{offer.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary-500">
            Cashback: {offer.cashback_amount}
          </span>
          <a href={offer.offer_url} target="_blank" rel="noopener noreferrer">
            <Button>Go to Store</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;
