import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Plus, Save, Trash2 } from 'lucide-react';
import { Card, Button, Input, Modal, Badge, ImageUpload } from '../../../components/ui';
import toast from 'react-hot-toast';
import { 
  useContentSections, 
  useCreateContentSection, 
  useUpdateContentSection, 
  useDeleteContentSection 
} from '../../../hooks/useContent';
import { ContentSection } from '../../../types';

// Helper to create a URL-friendly slug from a title
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-');        // Remove duplicate hyphens
};

export const ContentManagement: React.FC = () => {
  const { data: sections = [], isLoading, error } = useContentSections({});

  const createMutation = useCreateContentSection();
  const updateMutation = useUpdateContentSection();
  const deleteMutation = useDeleteContentSection();

  const [showModal, setShowModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Partial<ContentSection> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!selectedSection?.id || !selectedSection?.slug) {
        setSelectedSection(prev => ({ 
            ...prev, 
            title: newTitle,
            slug: createSlug(newTitle)
        }));
    } else {
        setSelectedSection(prev => ({ ...prev, title: newTitle }));
    }
  };

  const handleSave = () => {
    if (!selectedSection || !selectedSection.title || !selectedSection.slug || !selectedSection.content || !selectedSection.page || !selectedSection.contentType) {
        toast.error("Please fill out all required fields.");
        return;
    }

    const formData = new FormData();
    formData.append('title', selectedSection.title);
    formData.append('slug', selectedSection.slug);
    formData.append('page', selectedSection.page);
    formData.append('contentType', selectedSection.contentType);
    formData.append('status', selectedSection.status || 'draft');

    const contentString = typeof selectedSection.content === 'string' 
        ? selectedSection.content 
        : JSON.stringify(selectedSection.content, null, 2);
    formData.append('content', contentString);
    
    if (imageFile) {
        formData.append('imageUrl', imageFile);
    }

    if (selectedSection.id) {
        updateMutation.mutate({ id: selectedSection.id, formData });
    } else {
        createMutation.mutate(formData);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'hero': return 'primary';
      case 'banner': return 'info';
      case 'text': return 'secondary';
      case 'faq': return 'success';
      case 'testimonial': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <Button variant="primary" icon={Plus} onClick={() => {
                setSelectedSection({
                    title: '',
                    slug: '',
                    contentType: 'text',
                    status: 'draft',
                    page: 'homepage',
                    content: {},
                });
                setImageFile(null);
                setShowModal(true);
            }}>
                Add Section
            </Button>
        </div>

        {isLoading && <div>Loading content...</div>}
        {error && <div className="text-red-500">Error loading content: {error.message}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!isLoading && sections.map((section) => (
              <motion.div key={section.id || section._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="h-full flex flex-col">
                  <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg text-gray-800">{section.title}</h3>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                              <Badge variant={getTypeColor(section.contentType)} size="sm">{section.contentType}</Badge>
                              <Badge variant={getStatusColor(section.status)} size="sm">{section.status}</Badge>
                          </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">/{section.slug}</p>
                      <p className="text-sm text-gray-500 mb-4">Page: <span className="font-medium text-gray-700">{section.page}</span></p>

                      {section.imageUrl && (
                          <img src={section.imageUrl} alt={section.title} className="w-full h-32 object-cover rounded-md mb-4"/>
                      )}
                      
                      <pre className="text-xs bg-gray-100 p-2 rounded-md overflow-x-auto max-h-24">
                        <code>{JSON.stringify(section.content, null, 2)}</code>
                      </pre>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t">
                      <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" icon={Edit} onClick={() => { setSelectedSection(section); setImageFile(null); setShowModal(true); }}>Edit</Button>
                          <Button variant="ghost" size="sm" icon={Trash2} className="text-red-500" onClick={() => handleDelete(section.id || section._id)}>Delete</Button>
                      </div>
                      <div className="text-xs text-gray-400">
                          Updated: {new Date(section.updatedAt).toLocaleDateString()}
                      </div>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedSection?.id ? 'Edit Content Section' : 'Add Content Section'} size="2xl">
            <div className="space-y-4">
                <Input label="Title" value={selectedSection?.title || ''} onChange={handleTitleChange} placeholder="e.g., Homepage Hero Banner" required />
                <Input label="Slug" value={selectedSection?.slug || ''} onChange={(e) => setSelectedSection(prev => ({...prev, slug: e.target.value}))} placeholder="e.g., homepage-hero-banner" required />
                <Input label="Page" value={selectedSection?.page || ''} onChange={(e) => setSelectedSection(prev => ({...prev, page: e.target.value}))} placeholder="e.g., homepage" required />
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                        <select value={selectedSection?.contentType || 'text'} onChange={(e) => setSelectedSection(prev => ({ ...prev, contentType: e.target.value as ContentSection['contentType'] }))} className="w-full p-2 border rounded-md">
                            <option value="hero">Hero</option>
                            <option value="banner">Banner</option>
                            <option value="text">Text</option>
                            <option value="faq">FAQ</option>
                            <option value="testimonial">Testimonial</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={selectedSection?.status || 'draft'} onChange={(e) => setSelectedSection(prev => ({ ...prev, status: e.target.value as ContentSection['status'] }))} className="w-full p-2 border rounded-md">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <ImageUpload onFileSelect={setImageFile} />
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (JSON)</label>
                    <textarea 
                        value={typeof selectedSection?.content === 'string' ? selectedSection.content : JSON.stringify(selectedSection?.content || {}, null, 2)}
                        onChange={(e) => setSelectedSection(prev => ({ ...prev, content: e.target.value }))}
                        rows={10} 
                        className="w-full p-2 border rounded-md font-mono text-sm"
                        placeholder='{ "title": "Welcome", "subtitle": "Discover amazing deals..." }'
                    />
                </div>
                
                <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button icon={Save} onClick={handleSave} loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
                </div>
            </div>
        </Modal>
      </div>
    </div>
  );
};
