import React from 'react';
import { Card } from '../../../components/ui';

interface CategorySidebarProps {
  categories: any[];
  active: string;
  onSelect: (id: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, active, onSelect }) => (
  <Card>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Help Categories</h3>
    <div className="space-y-2">
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`w-full flex items-center p-3 rounded-lg text-left ${
            active === cat.id ? 'bg-purple-50 border border-purple-200 text-purple-700' : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <div className={`w-10 h-10 ${cat.bgColor} rounded-lg flex items-center justify-center mr-3`}>
            <cat.icon className={`w-5 h-5 ${cat.color}`} />
          </div>
          <div>
            <div className="font-medium">{cat.name}</div>
            <div className="text-sm text-gray-500">{cat.count} articles</div>
          </div>
        </button>
      ))}
    </div>
  </Card>
);
