import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  currentImage?: string;
  placeholder?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  currentImage,
  placeholder = 'Click to upload image',
  className = '',
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB.');
      return;
    }

    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const removeImage = () => {
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {preview ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <div
          className="relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer border-gray-300 hover:border-purple-400 hover:bg-gray-50"
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-600 font-medium mt-2">{placeholder}</p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or click to browse
            </p>
          </div>
        </div>
      )}
    </div>
  );
};