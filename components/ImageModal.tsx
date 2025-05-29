'use client';

import { useState } from 'react';
import { X, ZoomIn, Download } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'generated-image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>
        
        <button
          onClick={handleDownload}
          className="absolute top-10 -right-2 bg-purple-600 text-white rounded-full p-2 hover:bg-purple-700 transition-colors z-10"
        >
          <Download className="h-5 w-5" />
        </button>
        
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
}

interface ExpandableImageProps {
  src: string;
  alt: string;
  className?: string;
  previewSize?: 'small' | 'medium' | 'large';
}

export function ExpandableImage({ 
  src, 
  alt, 
  className = '', 
  previewSize = 'medium' 
}: ExpandableImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  return (
    <>
      <div className="relative group cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[previewSize]} rounded-lg object-cover ${className}`}
          onClick={() => setIsModalOpen(true)}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <ZoomIn className="h-6 w-6 text-white" />
        </div>
      </div>
      
      <ImageModal
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}