import React, { useState, useEffect, useContext } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { decryptBlob } from '../utils/cryptoVault';
import { getCachedImage, cacheImage } from '../utils/vaultDB';

/**
 * SecureImage — Vault-aware authenticated image component.
 *
 * Props:
 *   - src:       API path like "/images/download/{id}"
 *   - imageId:   The image UUID (needed for IndexedDB cache lookups)
 *   - encrypted: If true, the blob from the backend is AES-256-GCM encrypted
 *                and needs client-side decryption with the vault key.
 *   - alt, className, style: Standard img props
 */
const SecureImage = ({ src, imageId, encrypted = false, alt, className, style, ...props }) => {
  const [objectUrl, setObjectUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { vaultKey } = useContext(AuthContext);

  useEffect(() => {
    if (!src) return;

    let isMounted = true;
    setLoading(true);
    setError(false);
    let currentUrl = null;

    const fetchImage = async () => {
      try {
        // ── Check IndexedDB cache first (vault-sealed images only) ────
        if (encrypted && imageId) {
          const cached = await getCachedImage(imageId);
          if (cached && isMounted) {
            const url = URL.createObjectURL(cached.blob);
            currentUrl = url;
            setObjectUrl(url);
            setLoading(false);
            return;
          }
        }

        // ── Fetch from backend ────────────────────────────────────────
        const response = await api.get(src, { responseType: 'blob' });

        if (!isMounted) return;

        let displayBlob = response.data;

        // ── Decrypt if vault-sealed ───────────────────────────────────
        if (encrypted && vaultKey) {
          const encBuffer = await response.data.arrayBuffer();
          displayBlob = await decryptBlob(vaultKey, encBuffer);

          // Cache the decrypted blob in IndexedDB for next time
          if (imageId) {
            cacheImage(imageId, displayBlob).catch(() => {});
          }
        }

        const url = URL.createObjectURL(displayBlob);
        currentUrl = url;
        setObjectUrl(url);
        setLoading(false);
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
  }, [src, encrypted, vaultKey, imageId]);

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
