// Media handling and encryption utilities
import { encryptFile, decryptFile } from './security.js';

export class MediaHandler {
  static async handleFileUpload(file, isPrivate = false) {
    if (!file) return null;
    
    // Validate file type and size
    if (!this.validateFile(file)) {
      throw new Error('Invalid file type or size');
    }

    // Create secure URL
    const secureUrl = await this.processFile(file, isPrivate);
    return {
      url: secureUrl,
      type: file.type,
      name: file.name,
      isPrivate,
      timestamp: Date.now()
    };
  }

  static validateFile(file) {
    const maxSize = 50 * 1024 * 1024; // 50MB limit
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/webm'
    ];

    return file.size <= maxSize && allowedTypes.includes(file.type);
  }

  static async processFile(file, isPrivate) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const processedData = isPrivate ? 
          await encryptFile(arrayBuffer) : 
          arrayBuffer;
        
        // Create secure blob URL
        const blob = new Blob([processedData], { type: file.type });
        const url = URL.createObjectURL(blob);
        resolve(url);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  static createMediaElement(mediaData) {
    const container = document.createElement('div');
    container.className = 'media-container';
    
    const element = mediaData.type.startsWith('image/') ? 
      document.createElement('img') : 
      document.createElement('video');
      
    element.className = 'media-content';
    element.src = mediaData.url;
    
    if (element.tagName === 'VIDEO') {
      element.controls = true;
    }

    container.appendChild(element);
    return container;
  }
}