import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Save,
  Image,
  Type,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react';
import { Card, Button, Input, Modal, Badge } from '../../../components/ui';
import toast from 'react-hot-toast';

interface ContentSection {
  id: string;
  name: string;
  type: 'hero' | 'featured' | 'highlighted' | 'banner' | 'testimonial';
  status: 'active' | 'inactive' | 'scheduled';
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
  };
  position: number;
  devices: ('desktop' | 'tablet' | 'mobile')[];
  scheduledDate?: string;
  lastModified: string;
}

export const ContentManagement: React.FC = () => {
  const [sections, setSections] = useState<ContentSection[]>([
    {
      id: '1',
      name: 'Hero Section',
      type: 'hero',
      status: 'active',
      content: {
        title: 'Save Money on Every Purchase',
        subtitle: 'Get cashback and exclusive deals from top brands',
        buttonText: 'Start Saving Now',
        buttonLink: '/offers',
        imageUrl: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
      },
      position: 1,
      devices: ['desktop', 'tablet', 'mobile'],
      lastModified: '2025-01-22T10:30:00Z',
    },
    {
      id: '2',
      name: 'Featured Deals Section',
      type: 'featured',
      status: 'active',
      content: {
        title: 'Featured Deals',
        description: 'Limited time exclusive offers just for you',
      },
      position: 2,
      devices: ['desktop', 'tablet', 'mobile'],
      lastModified: '2025-01-21T14:15:00Z',
    },
    {
      id: '3',
      name: 'Highlighted Stores',
      type: 'highlighted',
      status: 'active',
      content: {
        title: 'Top Stores',
        description: 'Shop from your favorite brands and earn cashback',
      },
      position: 3,
      devices: ['desktop', 'tablet'],
      lastModified: '2025-01-20T09:45:00Z',
    },
    {
      id: '4',
      name: 'Special Banner',
      type: 'banner',
      status: 'scheduled',
      content: {
        title: 'Festival Sale Coming Soon!',
        subtitle: 'Get ready for the biggest sale of the year',
        imageUrl: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop',
      },
      position: 4,
      devices: ['desktop', 'tablet', 'mobile'],
      scheduledDate: '2025-02-01T00:00:00Z',
      lastModified: '2025-01-19T16:20:00Z',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleEdit = (section: ContentSection) => {
    setSelectedSection(section);
    setShowModal(true);
  };

  const handleSave = () => {
    toast.success('Content section updated successfully!');
    setShowModal(false);
    setSelectedSection(null);
  };

  const handleStatusChange = (sectionId: string, newStatus: 'active' | 'inactive') => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, status: newStatus } : section
    ));
    toast.success(`Section ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'primary';
      case 'featured': return 'warning';
      case 'highlighted': return 'success';
      case 'banner': return 'info';
      case 'testimonial': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'scheduled': return 'warning';
      default: return 'secondary';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return Monitor;
      case 'tablet': return Tablet;
      case 'mobile': return Smartphone;
      default: return Monitor;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Content Management
            </h1>
            <p className="text-gray-600">
              Manage homepage sections, featured content, and promotional banners
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
              {['desktop', 'tablet', 'mobile'].map((device) => {
                const IconComponent = getDeviceIcon(device);
                return (
                  <button
                    key={device}
                    onClick={() => setPreviewDevice(device as any)}
                    className={`p-2 rounded-md transition-colors ${
                      previewDevice === device
                        ? 'bg-purple-100 text-purple-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
            <Button variant="primary" icon={Plus}>
              Add Section
            </Button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getTypeColor(section.type)} size="sm">
                      {section.type}
                    </Badge>
                    <Badge variant={getStatusColor(section.status)} size="sm">
                      {section.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Pos: {section.position}
                  </div>
                </div>

                {/* Content Preview */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {section.name}
                  </h3>
                  
                  {section.content.imageUrl && (
                    <img
                      src={section.content.imageUrl}
                      alt={section.content.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  {section.content.title && (
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {section.content.title}
                    </div>
                  )}
                  
                  {section.content.subtitle && (
                    <div className="text-sm text-gray-600 mb-2">
                      {section.content.subtitle}
                    </div>
                  )}
                  
                  {section.content.description && (
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {section.content.description}
                    </div>
                  )}
                </div>

                {/* Device Support */}
                <div className="flex items-center space-x-2 mb-4">
                  {section.devices.map((device) => {
                    const IconComponent = getDeviceIcon(device);
                    return (
                      <div
                        key={device}
                        className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center"
                      >
                        <IconComponent className="w-3 h-3 text-gray-600" />
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit}
                      onClick={() => handleEdit(section)}
                    >
                      Edit
                    </Button>
                  </div>
                  
                  <Button
                    variant={section.status === 'active' ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => handleStatusChange(
                      section.id, 
                      section.status === 'active' ? 'inactive' : 'active'
                    )}
                  >
                    {section.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>

                {/* Last Modified */}
                <div className="text-xs text-gray-400 mt-2">
                  Modified: {new Date(section.lastModified).toLocaleDateString()}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedSection ? 'Edit Content Section' : 'Add Content Section'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Section Name"
                value={selectedSection?.name || ''}
                placeholder="Enter section name"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Type
                </label>
                <select
                  value={selectedSection?.type || 'featured'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="hero">Hero Section</option>
                  <option value="featured">Featured Section</option>
                  <option value="highlighted">Highlighted Section</option>
                  <option value="banner">Banner</option>
                  <option value="testimonial">Testimonial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title"
                value={selectedSection?.content.title || ''}
                placeholder="Enter title"
              />
              <Input
                label="Subtitle"
                value={selectedSection?.content.subtitle || ''}
                placeholder="Enter subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={selectedSection?.content.description || ''}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Enter description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Image URL"
                value={selectedSection?.content.imageUrl || ''}
                placeholder="https://example.com/image.jpg"
              />
              <Input
                label="Button Text"
                value={selectedSection?.content.buttonText || ''}
                placeholder="Call to action text"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Button Link"
                value={selectedSection?.content.buttonLink || ''}
                placeholder="/offers"
              />
              <Input
                label="Position"
                type="number"
                value={selectedSection?.position || 1}
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Device Support
              </label>
              <div className="flex space-x-4">
                {['desktop', 'tablet', 'mobile'].map((device) => {
                  const IconComponent = getDeviceIcon(device);
                  return (
                    <label key={device} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedSection?.devices.includes(device as any) || false}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <IconComponent className="w-4 h-4 ml-2 mr-1" />
                      <span className="text-sm text-gray-700 capitalize">{device}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                icon={Save}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};