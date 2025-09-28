import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard as Edit, Plus, Save, Smartphone, Monitor, Tablet, Trash2 } from 'lucide-react';
import { Card, Button, Input, Modal, Badge, ImageUpload } from '../../../components/ui';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api';
import { ContentSection } from '../../../types';
import { placeholderContentSections } from '../../../data/placeholderData';

const fetchContentSections = async (): Promise<ContentSection[]> => {
  try {
    const { data } = await apiClient.get('/content');
    return data;
  } catch (error) {
    console.error("Failed to fetch content sections. Using placeholder data.", error);
    return placeholderContentSections;
  }
};

const createContentSection = async (formData: FormData): Promise<ContentSection> => {
  const { data } = await apiClient.post('/content', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const updateContentSection = async ({ id, formData }: { id: string, formData: FormData }): Promise<ContentSection> => {
  const { data } = await apiClient.put(`/content/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const deleteContentSection = async (id: string): Promise<void> => {
  await apiClient.delete(`/content/${id}`);
};

export const ContentManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: sections = [], isLoading, error } = useQuery({ queryKey: ['contentSections'], queryFn: fetchContentSections });

  const createMutation = useMutation({
    mutationFn: createContentSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section created successfully!');
      setShowModal(false);
    },
    onError: () => {
      toast.error('Failed to create content section.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateContentSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section updated successfully!');
      setShowModal(false);
    },
    onError: () => {
      toast.error('Failed to update content section.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContentSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
      toast.success('Content section deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete content section.');
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Partial<ContentSection> | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleEdit = (section: ContentSection) => {
    setSelectedSection(section);
    setShowModal(true);
  };

  const handleSave = () => {
    const formData = new FormData();
    if (selectedSection) {
      Object.entries(selectedSection).forEach(([key, value]) => {
        if (key === 'content') {
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }

    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }

    if (selectedSection && 'id' in selectedSection && selectedSection.id) {
      updateMutation.mutate({ id: selectedSection.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteMutation.mutate(id);
    }
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
                    onClick={() => setPreviewDevice(device as 'desktop' | 'tablet' | 'mobile')}
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
            <Button variant="primary" icon={Plus} onClick={() => {
              setSelectedSection({});
              setShowModal(true);
            }}>
              Add Section
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
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

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleEdit(section)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(section.id)}
                        className="text-red-500"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mt-2">
                    Modified: {new Date(section.lastModified).toLocaleDateString()}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedSection?.id ? 'Edit Content Section' : 'Add Content Section'}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Section Name"
                value={selectedSection?.name || ''}
                onChange={(e) => setSelectedSection(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter section name"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Type
                </label>
                <select
                  value={selectedSection?.type || 'featured'}
                  onChange={(e) => setSelectedSection(prev => ({ ...prev, type: e.target.value as ContentSection['type'] }))}
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
            <ImageUpload onFileSelect={(file) => setImageFile(file)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title"
                value={selectedSection?.content?.title || ''}
                onChange={(e) => setSelectedSection(prev => ({ ...prev, content: { ...prev?.content, title: e.target.value } }))}
                placeholder="Enter title"
              />
              <Input
                label="Subtitle"
                value={selectedSection?.content?.subtitle || ''}
                onChange={(e) => setSelectedSection(prev => ({ ...prev, content: { ...prev?.content, subtitle: e.target.value } }))}
                placeholder="Enter subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={selectedSection?.content?.description || ''}
                onChange={(e) => setSelectedSection(prev => ({ ...prev, content: { ...prev?.content, description: e.target.value } }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Enter description..."
              />
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
                loading={createMutation.isPending || updateMutation.isPending}
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