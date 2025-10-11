import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Plus, Save, Trash2 } from 'lucide-react';
import { Card, Button, Input, Modal, Badge, ImageUpload } from '../../../components/ui';
import toast from 'react-hot-toast';
import {
  useContentSections,
  useCreateContentSection,
  useUpdateContentSection,
  useDeleteContentSection,
} from '../../../hooks/useContent';
import { ContentSection } from '../../../types';

// Helper to create a URL-friendly slug from a title
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Templates for different content types
const contentTypeTemplates = {
  hero: {
    title: "Transform Your Ideas into Reality with CodeApsTech",
    subtitle:
      "Empowering businesses and individuals through cutting-edge web and app development solutions. From concept to deployment, we turn your vision into digital success with innovative design, seamless functionality, and unmatched performance.",
    cta: {
      text: "Get Started Today",
    },
    highlight: "Trusted by 500+ startups and enterprises across India",
  },
  banner: {
    title: "Unlock Exclusive Benefits with Our Special Seasonal Offer!",
    badge: "🔥 Limited Time Deal – Don’t Miss Out!",
    description:
      "Experience the ultimate upgrade with our exclusive banner offer designed just for you. For a limited period, enjoy massive discounts, early access to new features, and personalized rewards that elevate your entire experience. Whether you’re a long-time supporter or a new visitor, this is your chance to save big and make the most of our premium offerings. Hurry up—once the countdown ends, this opportunity disappears!",
    cta: {
      text: "Learn More & Claim Offer",
      subtext: "Click to explore full details and start saving today!",
    },
    terms:
      "Offer valid for a limited time only. Discounts and benefits may vary by region. Terms and conditions apply.",
  },
  text: {
    heading: "Informational Section",
    body: "Start writing your content here. You can include details, features, or any other information.",
  },
  faq: {
    items: [
      {
        question: "What is the first frequently asked question?",
        answer: "This is the answer.",
      },
      { question: "What about the second one?", answer: "Here is the answer for the second question." },
    ],
  },
  testimonial: {
    items: [
      {
        name: "Alex Johnson",
        feedback: "I'm very satisfied with the service. Highly recommended!",
        avatar: "/assets/avatars/alex.png",
      },
      {
        name: "Maria Garcia",
        feedback: "Excellent experience from start to finish.",
        avatar: "/assets/avatars/maria.png",
      },
    ],
  },
};

const availablePages = [
  'homepage',
  'stores',
  'categories',
  'offers',
  'how-it-works',
  'blog',
  'help',
  'support',
  'about-us',
  'contact-us',
  'terms-of-service',
  'privacy-policy',
];

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
      setSelectedSection((prev) => ({
        ...prev,
        title: newTitle,
        slug: createSlug(newTitle),
      }));
    } else {
      setSelectedSection((prev) => ({ ...prev, title: newTitle }));
    }
  };

  const handleContentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newContentType = e.target.value as keyof typeof contentTypeTemplates;
    setSelectedSection((prev) => {
      const isNew = !prev?.id;
      const isContentEmpty =
        prev?.content && typeof prev.content === 'object' && Object.keys(prev.content).length === 0;

      return {
        ...prev,
        contentType: newContentType,
        content: isNew || isContentEmpty ? contentTypeTemplates[newContentType] : prev.content,
      };
    });
  };

  const handleSave = () => {
    if (
      !selectedSection ||
      !selectedSection.title ||
      !selectedSection.slug ||
      !selectedSection.content ||
      !selectedSection.page ||
      !selectedSection.contentType
    ) {
      toast.error('Please fill out all required fields.');
      return;
    }

    let parsedContent;
    const contentValue = selectedSection.content;

    if (typeof contentValue === 'string') {
      try {
        parsedContent = contentValue.trim() === '' ? {} : JSON.parse(contentValue);
      } catch {
        toast.error('Invalid JSON in content field.');
        return;
      }
    } else {
      parsedContent = contentValue;
    }

    const formData = new FormData();
    formData.append('title', selectedSection.title);
    formData.append('slug', selectedSection.slug);
    formData.append('page', selectedSection.page);
    formData.append('contentType', selectedSection.contentType);
    formData.append('status', selectedSection.status || 'draft');
    formData.append('content', JSON.stringify(parsedContent, null, 2));

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
      case 'hero':
        return 'primary';
      case 'banner':
        return 'info';
      case 'text':
        return 'secondary';
      case 'faq':
        return 'success';
      case 'testimonial':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setSelectedSection({
                title: '',
                slug: '',
                contentType: 'text',
                status: 'draft',
                page: 'homepage',
                content: contentTypeTemplates.text,
              });
              setImageFile(null);
              setShowModal(true);
            }}
          >
            Add Section
          </Button>
        </div>

        {/* Loading/Error */}
        {isLoading && <div>Loading content...</div>}
        {error && <div className="text-red-500">Error loading content: {error.message}</div>}

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!isLoading &&
            sections.map((section) => (
              <motion.div key={section.id || section._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="h-full flex flex-col">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-800">{section.title}</h3>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge variant={getTypeColor(section.contentType)} size="sm">
                          {section.contentType}
                        </Badge>
                        <Badge variant={getStatusColor(section.status)} size="sm">
                          {section.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">/{section.slug}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Page: <span className="font-medium text-gray-700">{section.page}</span>
                    </p>

                    {section.imageUrl && (
                      <img src={section.imageUrl} alt={section.title} className="w-full h-32 object-cover rounded-md mb-4" />
                    )}

                    <pre className="text-xs bg-gray-100 p-2 rounded-md overflow-x-auto max-h-24">
                      <code>{JSON.stringify(section.content, null, 2)}</code>
                    </pre>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Edit}
                        onClick={() => {
                          setSelectedSection(section);
                          setImageFile(null);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        className="text-red-500"
                        onClick={() => handleDelete(section.id || section._id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="text-xs text-gray-400">
                      Updated: {new Date(section.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={selectedSection?.id ? 'Edit Content Section' : 'Add Content Section'}
          size="2xl"
        >
          <div className="space-y-4">
            <Input label="Title" value={selectedSection?.title || ''} onChange={handleTitleChange} required />
            <Input
              label="Slug"
              value={selectedSection?.slug || ''}
              onChange={(e) => setSelectedSection((prev) => ({ ...prev, slug: e.target.value }))}
              required
            />

            {/* Page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
              <select
                value={selectedSection?.page || 'homepage'}
                onChange={(e) => setSelectedSection((prev) => ({ ...prev, page: e.target.value }))}
                className="w-full p-2 border rounded-md"
              >
                {availablePages.map((page) => (
                  <option key={page} value={page}>
                    {page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Type & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                <select
                  value={selectedSection?.contentType || 'text'}
                  onChange={handleContentTypeChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="hero">Hero</option>
                  <option value="banner">Banner</option>
                  <option value="text">Text</option>
                  <option value="faq">FAQ</option>
                  <option value="testimonial">Testimonial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedSection?.status || 'draft'}
                  onChange={(e) =>
                    setSelectedSection((prev) => ({ ...prev, status: e.target.value as ContentSection['status'] }))
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <ImageUpload onFileSelect={setImageFile} />

            {/* Dynamic Content Fields */}
            <div className="space-y-3 border rounded-md p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-700 mb-2">
                Content — {selectedSection?.contentType?.toUpperCase()}
              </h3>

              {/* Hero */}
              {selectedSection?.contentType === 'hero' && (
                <>
                  <Input
                    label="Hero Title"
                    value={selectedSection?.content?.title || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: { ...prev?.content, title: e.target.value },
                      }))
                    }
                  />
                  <Input
                    label="Hero Subtitle"
                    value={selectedSection?.content?.subtitle || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: { ...prev?.content, subtitle: e.target.value },
                      }))
                    }
                  />
                  <Input
                    label="Highlight"
                    value={selectedSection?.content?.highlight || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: { ...prev?.content, highlight: e.target.value },
                      }))
                    }
                  />
                  <Input
                    label="CTA Text"
                    value={selectedSection?.content?.cta?.text || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: { ...prev?.content, cta: { ...prev?.content?.cta, text: e.target.value } },
                      }))
                    }
                  />
                </>
              )}

              {/* Banner */}
              {selectedSection?.contentType === 'banner' && (
                <>
                  <Input
                    label="Banner Title"
                    value={selectedSection?.content?.title || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: { ...prev?.content, title: e.target.value },
                      }))
                    }
                  />
                  <Input
                    label="Badge"
                    value={selectedSection?.content?.badge || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: { ...prev?.content, badge: e.target.value },
                      }))
                    }
                  />
                  <textarea
                    className="w-full p-2 border rounded-md text-sm"
                    rows={4}
                    placeholder="Banner description..."
                    value={selectedSection?.content?.description || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: { ...prev?.content, description: e.target.value },
                      }))
                    }
                  />
                  <Input
                    label="CTA Text"
                    value={selectedSection?.content?.cta?.text || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: {
                          ...prev?.content,
                          cta: { ...prev?.content?.cta, text: e.target.value },
                        },
                      }))
                    }
                  />
                  <Input
                    label="CTA Subtext"
                    value={selectedSection?.content?.cta?.subtext || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: {
                          ...prev?.content,
                          cta: { ...prev?.content?.cta, subtext: e.target.value },
                        },
                      }))
                    }
                  />
                  <Input
                    label="Terms & Conditions"
                    value={selectedSection?.content?.terms || ''}
                    onChange={(e) =>
                      setSelectedSection((prev) => ({
                        ...prev,
                        content: { ...prev?.content, terms: e.target.value },
                      }))
                    }
                  />
                </>
              )}

              {/* JSON fallback */}
              {selectedSection?.contentType !== 'hero' &&
                selectedSection?.contentType !== 'banner' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content (JSON)
                    </label>
                    <textarea
                      value={
                        typeof selectedSection?.content === 'string'
                          ? selectedSection.content
                          : JSON.stringify(selectedSection?.content || {}, null, 2)
                      }
                      onChange={(e) =>
                        setSelectedSection((prev) => ({ ...prev, content: e.target.value }))
                      }
                      rows={10}
                      className="w-full p-2 border rounded-md font-mono text-sm"
                    />
                  </div>
                )}
            </div>

            {/* Save/Cancel */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                icon={Save}
                onClick={handleSave}
                loading={createMutation.isPending || updateMutation.isPending}
              >
                Save
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
