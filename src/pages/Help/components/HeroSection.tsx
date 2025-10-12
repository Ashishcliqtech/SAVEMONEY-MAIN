// src/pages/Help/components/HeroSection.tsx
import React from 'react';
import { SearchBar } from '../../../components/ui';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => (
  <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl lg:text-5xl font-bold mb-4">How Can We Help You?</h1>
      <p className="text-xl text-indigo-100 mb-8">
        Find answers to common questions or contact our support team
      </p>
      <div className="max-w-2xl mx-auto">
        <SearchBar placeholder="Search for help articles..." onSearch={onSearch} />
      </div>
    </div>
  </section>
);
