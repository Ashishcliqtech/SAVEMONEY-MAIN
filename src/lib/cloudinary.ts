// Cloudinary configuration and upload utilities
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.warn('Cloudinary environment variables not found. Image uploads will not work.');
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

export interface UploadOptions {
  folder?: string;
  transformation?: string;
  tags?: string[];
  context?: Record<string, string>;
}

export class CloudinaryService {
  private cloudName: string;
  private uploadPreset: string;

  constructor() {
    this.cloudName = CLOUDINARY_CLOUD_NAME || '';
    this.uploadPreset = CLOUDINARY_UPLOAD_PRESET || '';
  }

  async uploadImage(
    file: File, 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    if (!this.cloudName || !this.uploadPreset) {
      throw new Error('Cloudinary not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    
    if (options.transformation) {
      formData.append('transformation', options.transformation);
    }
    
    if (options.tags) {
      formData.append('tags', options.tags.join(','));
    }
    
    if (options.context) {
      formData.append('context', Object.entries(options.context).map(([k, v]) => `${k}=${v}`).join('|'));
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  async uploadMultipleImages(
    files: File[], 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, options));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<void> {
    // Note: Deletion requires server-side implementation with API key
    // This would typically be handled by your backend
    console.warn('Image deletion requires server-side implementation');
  }

  getOptimizedUrl(
    publicId: string, 
    transformation: string = 'f_auto,q_auto'
  ): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformation}/${publicId}`;
  }

  getTransformedUrl(
    publicId: string,
    width?: number,
    height?: number,
    crop: string = 'fill',
    quality: string = 'auto',
    format: string = 'auto'
  ): string {
    const transformations = [];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    
    const transformString = transformations.join(',');
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformString}/${publicId}`;
  }
}

export const cloudinary = new CloudinaryService();

// Predefined transformations for different use cases
export const CLOUDINARY_TRANSFORMATIONS = {
  avatar: 'w_200,h_200,c_fill,f_auto,q_auto',
  storeLogo: 'w_400,h_400,c_fit,f_auto,q_auto',
  storeBanner: 'w_1200,h_400,c_fill,f_auto,q_auto',
  offerImage: 'w_800,h_400,c_fill,f_auto,q_auto',
  categoryImage: 'w_600,h_300,c_fill,f_auto,q_auto',
  thumbnail: 'w_150,h_150,c_fill,f_auto,q_auto',
  hero: 'w_1920,h_800,c_fill,f_auto,q_auto',
};

// Folder structure for organized uploads
export const CLOUDINARY_FOLDERS = {
  avatars: 'savemoney/avatars',
  stores: 'savemoney/stores',
  offers: 'savemoney/offers',
  categories: 'savemoney/categories',
  banners: 'savemoney/banners',
  content: 'savemoney/content',
  support: 'savemoney/support',
};