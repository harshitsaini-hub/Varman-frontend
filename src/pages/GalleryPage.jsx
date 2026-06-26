import React, { useState, useEffect } from 'react';
import { Download, Trash2, ImageIcon, Upload, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import SecureImage from '../components/SecureImage';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await api.get('/api/images/list');
      setImages(res.data.images || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load gallery assets.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (id, filename) => {
    const downloadToast = toast.loading("Preparing secure download...");
    try {
      const res = await api.get(`/api/images/download/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || `protected_${id}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download started.", { id: downloadToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to download image.", { id: downloadToast });
    }
  };

  const deleteImage = async (id) => {
    const previousImages = [...images];
    // Optimistic UI update
    setImages(images.filter(img => img.id !== id));
    toast.success("Asset deleted securely.");

    try {
      await api.delete(`/api/images/${id}`);
    } catch (error) {
      console.error("Delete request failed:", error);
      toast.error("Failed to delete asset from secure storage.");
      // Rollback
      setImages(previousImages);
    }
  };

  if (loading) {
    return (
      <div className="main-content flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <div className="badge badge-processing" style={{ animation: 'pulse 1.5s infinite', padding: '8px 16px' }}>
          Loading Secure Vault...
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h2 className="mb-8 text-gradient">Protected Asset Gallery</h2>

      {images.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '60px', color: 'var(--text-muted)', maxWidth: '500px', margin: '40px auto' }}>
          <ImageIcon size={64} color="var(--accent-cyan)" style={{ margin: '0 auto 20px', opacity: 0.8 }} />
          <h3 style={{ marginBottom: '12px', color: '#fff', fontSize: '1.6rem' }}>Gallery Vault Empty</h3>
          <p style={{ margin: '0 0 24px', lineHeight: '1.6', fontSize: '0.95rem' }}>
            Hey! You need to upload an image first to see the gallery. Once you secure an asset, it will be displayed here.
          </p>
          <Link to="/upload" className="btn btn-primary" style={{ gap: '8px' }}>
            <Upload size={16} />
            <span>Upload Image</span>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {images.map(img => (
            <div key={img.id} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <div 
                style={{ 
                  width: '100%', 
                  aspectRatio: '1/1', 
                  background: 'rgba(0,0,0,0.5)', 
                  borderRadius: '8px', 
                  marginBottom: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--border-color)'
                }}
              >
                {img.status === 'completed' || img.status === 'failed' ? (
                  <SecureImage 
                    src={`/api/images/download/${img.id}`} 
                    alt={img.original_filename}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <span className={`badge badge-${img.status}`}>{img.status}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>GPU optimization pending</span>
                  </div>
                )}
                {img.status === 'failed' && (
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      background: 'rgba(239, 68, 68, 0.9)', 
                      color: '#fff', 
                      padding: '4px', 
                      textAlign: 'center', 
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    QUALITY COMPROMISED
                  </div>
                )}
              </div>
              
              <div className="flex-1" style={{ marginBottom: '16px' }}>
                <p style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {img.original_filename}
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {img.status === 'completed' && (
                    <>
                      <p>SSIM: <span style={{ color: 'var(--success)', fontWeight: 500 }}>{img.ssim_score?.toFixed(4)}</span></p>
                      <p>PSNR: <span style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>{img.psnr_score?.toFixed(1)} dB</span></p>
                      <p>Time: {img.processing_time_ms ? (img.processing_time_ms / 1000).toFixed(1) : '0.0'}s</p>
                    </>
                  )}
                  {img.status === 'failed' && (
                    <p className="text-danger">Epsilon threshold exceeded visual limit constraint</p>
                  )}
                  {img.status !== 'completed' && img.status !== 'failed' && (
                    <p>Protection enqueued...</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2" style={{ marginTop: 'auto' }}>
                {(img.status === 'completed' || img.status === 'failed') && (
                  <button 
                    className="btn btn-primary flex-1" 
                    onClick={() => downloadImage(img.id, img.original_filename)}
                    style={{ 
                      padding: '8px 12px', 
                      fontSize: '0.85rem',
                      borderColor: img.status === 'failed' ? 'var(--danger)' : undefined, 
                      color: img.status === 'failed' ? 'var(--danger)' : undefined,
                      background: img.status === 'failed' ? 'rgba(239, 68, 68, 0.05)' : undefined 
                    }}
                  >
                    <Download size={14} /> 
                    <span>Get File</span>
                  </button>
                )}
                
                <button 
                  className="btn btn-secondary text-danger" 
                  onClick={() => deleteImage(img.id)}
                  style={{ 
                    padding: '8px', 
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    background: 'rgba(239, 68, 68, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Purge Secure Asset"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
