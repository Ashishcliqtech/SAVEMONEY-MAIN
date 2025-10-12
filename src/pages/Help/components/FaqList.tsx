import React from 'react';
import { Badge } from '../../../components/ui';
import { FaqItem } from './FaqItem';
import { HelpCircle } from 'lucide-react';
import { Card, Button } from '../../../components/ui';

export const FaqList: React.FC<any> = ({ faqs, activeCategory, categories, expandedFaq, setExpandedFaq, searchQuery, clearSearch }) => {
  if (faqs.length === 0) {
    return (
      <Card className="text-center py-12">
        <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your search terms or browse other categories</p>
        <Button variant="primary" onClick={clearSearch}>Clear Search</Button>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {categories.find(cat => cat.id === activeCategory)?.name} FAQ
        </h2>
        <Badge variant="info" size="md">{faqs.length} articles</Badge>
      </div>

      <div className="space-y-4">
        {faqs.map((faq: any, index: number) => (
          <FaqItem key={faq.id} faq={faq} expanded={expandedFaq === faq.id} onToggle={setExpandedFaq} index={index} />
        ))}
      </div>
    </>
  );
};
