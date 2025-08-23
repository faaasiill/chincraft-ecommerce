const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

export const cloudinaryService = {
  async uploadImage(file, folder = 'products') {
    try {
      // Validate file
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid or missing file');
      }

      // Validate environment variables
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration missing: Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', folder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to upload image: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
      };
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  },

  async deleteImage(publicId) {
    try {
      if (!publicId) {
        throw new Error('Missing publicId for deletion');
      }

      if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        console.warn('Cloudinary API credentials not configured for deletion');
        return false;
      }

      // Generate timestamp
      const timestamp = Math.round(Date.now() / 1000);

      // Create signature for authenticated request
      const signature = await this.generateSignature({
        public_id: publicId,
        timestamp: timestamp
      });

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', CLOUDINARY_API_KEY);
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete image: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      return result.result === 'ok';
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      // Don't throw error for deletion failures to avoid blocking other operations
      return false;
    }
  },

  // Note: This is a simplified signature generation for client-side use
  // In production, signature generation should be done on the server side for security
  async generateSignature(params) {
    if (!CLOUDINARY_API_SECRET) {
      throw new Error('API secret required for signature generation');
    }

    // Sort parameters
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    const stringToSign = `${sortedParams}${CLOUDINARY_API_SECRET}`;
    
    // Simple hash function (in production, use proper SHA-1)
    // This is a placeholder - you should implement proper SHA-1 hashing or do this server-side
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  },

  getOptimizedUrl(url, options = {}) {
    if (!url) return '';
    
    const {
      width = 400,
      height = 500,
      quality = 'auto',
      format = 'auto',
      crop = 'fill'
    } = options;

    // Check if it's a Cloudinary URL
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    try {
      const parts = url.split('/');
      const uploadIndex = parts.findIndex(part => part === 'upload');
      if (uploadIndex === -1) return url;

      const beforeUpload = parts.slice(0, uploadIndex + 1);
      const afterUpload = parts.slice(uploadIndex + 1);
      const transformations = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;

      return [...beforeUpload, transformations, ...afterUpload].join('/');
    } catch (error) {
      console.error('Error generating optimized URL:', error);
      return url;
    }
  },

  // Utility function to extract public ID from Cloudinary URL
  extractPublicId(url) {
    if (!url || !url.includes('cloudinary.com')) {
      return null;
    }

    try {
      const parts = url.split('/');
      const uploadIndex = parts.findIndex(part => part === 'upload');
      if (uploadIndex === -1) return null;

      // Get everything after upload, removing transformations and file extension
      const afterUpload = parts.slice(uploadIndex + 1);
      let publicIdParts = [];
      
      for (const part of afterUpload) {
        // Skip transformation parameters (contain commas or start with specific prefixes)
        if (part.includes(',') || part.startsWith('w_') || part.startsWith('h_') || 
            part.startsWith('c_') || part.startsWith('q_') || part.startsWith('f_')) {
          continue;
        }
        publicIdParts.push(part);
      }
      
      // Join parts and remove file extension
      const publicIdWithExt = publicIdParts.join('/');
      const lastDotIndex = publicIdWithExt.lastIndexOf('.');
      
      return lastDotIndex > 0 ? publicIdWithExt.substring(0, lastDotIndex) : publicIdWithExt;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }
};