// Cloudinary configuration and URL transformation utilities
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

if (!CLOUDINARY_CLOUD_NAME) {
  console.warn('Cloudinary cloud name not found. Image URLs might not work correctly.');
}

export class CloudinaryService {
  private cloudName: string;

  constructor() {
    this.cloudName = CLOUDINARY_CLOUD_NAME || '';
  }

  getOptimizedUrl(
    publicId: string, 
    transformation = 'f_auto,q_auto'
  ): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformation}/${publicId}`;
  }

  getTransformedUrl(
    publicId: string,
    width?: number,
    height?: number,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
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