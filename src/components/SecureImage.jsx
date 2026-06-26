import React, { useState, useEffect } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';
import api from '../api';

const SecureImage = ({ src, alt, className, style, fallbackIconSize = 48, ...props }) => {
  const [objectUrl, setObjectUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    let isMounted = true;
    setLoading(true);
    setError(false);
    let currentUrl = null;

    const fetchImage = async () => {
      try {
        const response = await api.get(src, { responseType: 'blob' });
        if (isMounted) {
          const url = URL.createObjectURL(response.data);
          currentUrl = url;
          setObjectUrl(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading secure image:', src, err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div 
        className="animate-pulse flex items-center justify-center" 
        style={{ 
          width: '100%', 
          height: '100%', 
          minHeight: '100px',
          background: 'rgba(255, 255, 255, 0.03)', 
          borderRadius: 'inherit',
          ...style 
        }}
      >
        <ImageIcon size={32} style={{ color: 'var(--text-muted)', opacity: 0.15 }} />
      </div>
    );
  }

  if (error || !objectUrl) {
    return (
      <div 
        className="flex flex-col items-center justify-center gap-2 text-danger" 
        style={{ 
          width: '100%', 
          height: '100%', 
          minHeight: '100px',
          background: 'rgba(239, 68, 68, 0.05)', 
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: 'inherit',
          padding: '16px',
          ...style 
        }}
      >
        <AlertCircle size={20} />
        <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Failed to Load</span>
      </div>
    );
  }

  return (
    <img 
      src={objectUrl} 
      alt={alt || "Secured Asset"} 
      className={className} 
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', ...style }}
      {...props}
    />
  );
};

export default SecureImage;
