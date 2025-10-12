import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { ContactOptions } from './components/ContactOptions';
import { CategorySidebar } from './components/CategorySidebar';
import { FaqList } from './components/FaqList';
import { StillNeedHelp } from './components/StillNeedHelp';
import { useHelpData } from './hooks/useHelpData';
import { Card } from '../../components/ui/Card';
import { ResourcesSection } from './components/ResourcesSection';
import { ContactForm } from './components/ContactForm';


export const Help: React.FC = () => {
  const navigate = useNavigate();
  const { categories, faqs, resources, contactOptions } = useHelpData(navigate);

  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentFaqs = faqs[activeCategory] || [];
  const filteredFaqs = currentFaqs.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection onSearch={setSearchQuery} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ContactOptions options={contactOptions} />
        <div className="lg:flex lg:gap-12">
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <CategorySidebar categories={categories} active={activeCategory} onSelect={setActiveCategory} />
            <Card className="mt-6">
              <ResourcesSection resources={resources} />
            </Card>
          </div>
          <div className="lg:w-3/4">
            {/* <FaqList
              faqs={filteredFaqs}
              activeCategory={activeCategory}
              categories={categories}
              expandedFaq={expandedFaq}
              setExpandedFaq={setExpandedFaq}
              searchQuery={searchQuery}
              clearSearch={() => setSearchQuery('')}
            /> */}
            {/* <StillNeedHelp /> */}
            <Card className="mt-8 p-6 bg-white rounded-lg shadow-md">
 <ContactForm /> 
 </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
