import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cloudinary, CLOUDINARY_FOLDERS, CLOUDINARY_TRANSFORMATIONS } from '../../../lib/cloudinary';
import { Button } from '../Button';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (imageUrl: string, publicId: string) => void;
  folder?: keyof typeof CLOUDINARY_FOLDERS;
  transformation?: keyof typeof CLOUDINARY_TRANSFORMATIONS;
  currentImage?: string;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  folder = 'content',
  transformation = 'thumbnail',
  currentImage,
  placeholder = 'Click to upload image',
  className = '',
  multiple = false,
  maxFiles = 5,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    currentImage ? [currentImage] : []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please select only image files (JPEG, PNG, WebP, GIF)');
      return;
    }

    // Validate file sizes (max 10MB each)
    const oversizedFiles = fileArray.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Check max files limit
    if (multiple && uploadedImages.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    uploadFiles(fileArray);
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    
    try {
      const uploadPromises = files.map(file => 
        cloudinary.uploadImage(file, {
          folder: CLOUDINARY_FOLDERS[folder],
          transformation: CLOUDINARY_TRANSFORMATIONS[transformation],
          tags: [folder, 'savemoney'],
        })
      );

      const results = await Promise.all(uploadPromises);
      
      if (multiple) {
        const newImages = results.map(result => result.secure_url);
        setUploadedImages(prev => [...prev, ...newImages]);
        results.forEach(result => onUpload(result.secure_url, result.public_id));
      } else {
        const result = results[0];
        setUploadedImages([result.secure_url]);
        onUpload(result.secure_url, result.public_id);
      }

      toast.success(`${results.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
          dragOver
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="text-center">
          {uploading ? (
            <div className="space-y-4">
              <Loader className="w-12 h-12 text-purple-600 mx-auto animate-spin" />
              <p className="text-gray-600">Uploading image(s)...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600 font-medium">{placeholder}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports: JPEG, PNG, WebP, GIF (max 10MB each)
                  {multiple && ` • Max ${maxFiles} files`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Images Preview */}
      <AnimatePresence>
        {uploadedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-gray-700">
              Uploaded Images ({uploadedImages.length})
            </h4>
            <div className={`grid gap-3 ${
              multiple ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
            }`}>
              {uploadedImages.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Another Button (for multiple uploads) */}
      {multiple && uploadedImages.length > 0 && uploadedImages.length < maxFiles && (
        <Button
          variant="outline"
          size="sm"
          icon={Upload}
          onClick={openFileDialog}
          disabled={uploading}
        >
          Upload Another Image
        </Button>
      )}
    </div>
  );
};