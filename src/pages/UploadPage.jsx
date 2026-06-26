import React, { useState, useEffect, useRef } from 'react';
import { Upload, AlertTriangle, CheckCircle, Shield, Image as ImageIcon, Clock, Activity, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import ImageCompare from '../components/ImageCompare';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [protectedUrl, setProtectedUrl] = useState(null);
  const [strength, setStrength] = useState(0.5);
  const [watermark, setWatermark] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Polling states
  const [status, setStatus] = useState(null); // 'pending' | 'processing' | 'completed' | 'failed'
  const [resultData, setResultData] = useState(null);
  const pollInterval = useRef(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (protectedUrl) URL.revokeObjectURL(protectedUrl);
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [previewUrl, protectedUrl]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      processSelectedFile(selectedFile);
    }
  };

  const processSelectedFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast.error("Invalid file format. Please select an image.");
      return;
    }
    
    // Revoke previous URLs
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (protectedUrl) URL.revokeObjectURL(protectedUrl);

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setProtectedUrl(null);
    setJobId(null);
    setStatus(null);
    setResultData(null);
  };

  const triggerReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (protectedUrl) URL.revokeObjectURL(protectedUrl);
    setFile(null);
    setPreviewUrl(null);
    setProtectedUrl(null);
    setJobId(null);
    setStatus(null);
    setResultData(null);
    setUploading(false);
    if (pollInterval.current) clearInterval(pollInterval.current);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    toast.loading("Uploading asset to defense core...", { id: "upload-status" });

    const formData = new FormData();
    formData.append('files', file);
    formData.append('protection_strength', strength);
    formData.append('watermark_enabled', watermark);

    try {
      const res = await api.post('/api/images/protect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newImageId = res.data[0].id;
      setJobId(newImageId);
      setStatus('pending');
      toast.success("Asset uploaded. Enqueuing protection job...", { id: "upload-status" });
      startPolling(newImageId);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Upload failed", { id: "upload-status" });
      setUploading(false);
    }
  };

  const startPolling = (id) => {
    if (pollInterval.current) clearInterval(pollInterval.current);
    
    pollInterval.current = setInterval(async () => {
      try {
        const res = await api.get(`/api/images/status/${id}`);
        const currentStatus = res.data.status;
        setStatus(currentStatus);
        
        if (currentStatus === 'completed' || currentStatus === 'failed') {
          clearInterval(pollInterval.current);
          setResultData(res.data);
          
          if (currentStatus === 'completed') {
            toast.success("Optimizing process completed!");
          } else {
            toast.error("Gradients optimization failed visual quality thresholds.");
          }

          // Fetch the protected image file using Axios (expects Bearer token) and construct Blob URL
          try {
            const imgRes = await api.get(`/api/images/download/${id}`, { responseType: 'blob' });
            const blobUrl = URL.createObjectURL(imgRes.data);
            setProtectedUrl(blobUrl);
          } catch (err) {
            console.error("Failed to download protected blob url", err);
            toast.error("Security optimization applied, but image retrieval failed.");
          } finally {
            setUploading(false);
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 2000);
  };

  return (
    <div className="main-content">
      <h2 className="mb-8 text-gradient">Inject Protection</h2>

      <div className="flex gap-6 flex-wrap">
        {/* Left Col: Upload & Config */}
        <div className="glass-panel flex-1" style={{ minWidth: '320px' }}>
          
          {file ? (
            <div className="flex flex-col items-center">
              {previewUrl && (
                <div 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    aspectRatio: '16/10', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>
              )}
              <p style={{ color: '#fff', fontWeight: 500, wordBreak: 'break-all', textAlign: 'center' }}>{file.name}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button 
                className="btn btn-secondary mb-6" 
                onClick={triggerReset}
                disabled={uploading || status === 'pending' || status === 'processing'}
              >
                Change File
              </button>
            </div>
          ) : (
            <div 
              className={`drag-drop-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ marginBottom: '24px' }}
            >
              <Upload size={48} color={isDragging ? "var(--accent-cyan)" : "var(--text-muted)"} style={{ margin: '0 auto 16px', transition: 'all 0.3s' }} />
              <p style={{ color: '#fff', fontWeight: 500, marginBottom: '8px' }}>Drag & drop or select an image</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>PNG, JPG, or WEBP up to 10MB</p>
              <input type="file" id="file-upload" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
              <label htmlFor="file-upload" className="btn btn-secondary cursor-pointer">Browse Files</label>
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label style={{ fontWeight: 500, color: '#fff' }}>Protection Strength (Epsilon)</label>
              <span className="badge badge-processing">{strength.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0.05" max="1.0" step="0.05" 
              value={strength} 
              onChange={(e) => setStrength(parseFloat(e.target.value))} 
              disabled={uploading || status === 'pending' || status === 'processing'}
            />
            <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Higher strength degrades visual quality but increases deepfake resistance.</p>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <label className="switch-label">
              <div className="switch">
                <input 
                  type="checkbox" 
                  id="watermark" 
                  checked={watermark} 
                  onChange={(e) => setWatermark(e.target.checked)}
                  disabled={uploading || status === 'pending' || status === 'processing'}
                />
                <span className="slider-switch"></span>
              </div>
              <span style={{ fontWeight: 500, color: '#fff' }}>Embed DWT-DCT Blind Watermark</span>
            </label>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', gap: '10px' }} 
            onClick={handleUpload} 
            disabled={!file || uploading || status === 'pending' || status === 'processing'}
          >
            <Shield size={18} />
            {uploading ? 'Initiating Pipeline...' : 'Deploy Protection'}
          </button>
        </div>

        {/* Right Col: Polling Status & Results */}
        <div className="glass-panel flex-1" style={{ minWidth: '320px', display: 'flex', flexDirection: 'column' }}>
          <h3 className="mb-4 text-gradient">Defense Execution</h3>
          
          {!status ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ color: 'var(--text-muted)', minHeight: '200px' }}>
              <Shield size={36} style={{ marginBottom: '12px', opacity: 0.3 }} />
              Awaiting target payload...
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              
              {status === 'pending' && (
                <div style={{ padding: '24px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid var(--warning)', borderRadius: '8px', textAlign: 'center' }}>
                  <Clock size={40} color="var(--warning)" style={{ margin: '0 auto 16px' }} />
                  <h4 style={{ color: 'var(--warning)', margin: 0, fontWeight: 600 }}>Waiting in Queue</h4>
                  <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#fff' }}>
                    The processor is busy with another security operation.<br/>Your payload is held securely in queue.
                  </p>
                </div>
              )}

              {status === 'processing' && (
                <div style={{ padding: '24px', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid var(--accent-cyan)', borderRadius: '8px', textAlign: 'center' }}>
                  <Activity size={40} color="var(--accent-cyan)" style={{ margin: '0 auto 16px', animation: 'pulse 1.5s infinite' }} />
                  <h4 style={{ color: 'var(--accent-cyan)', margin: 0, fontWeight: 600 }}>Applying Perturbations</h4>
                  <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>
                    Optimizing Protection... This may take up to 60 seconds.
                  </p>
                </div>
              )}

              {(status === 'completed' || status === 'failed') && resultData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {status === 'failed' ? (
                    <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid var(--danger)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <AlertTriangle size={28} color="var(--danger)" />
                      <div>
                        <h4 style={{ color: 'var(--danger)', margin: 0 }}>Protection Failed</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>{resultData?.error_message || "Visual similarity constraint violated."}</p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid var(--success)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle size={28} color="var(--success)" />
                      <div>
                        <h4 style={{ color: 'var(--success)', margin: 0 }}>Payload Secured</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>
                          SSIM: {resultData.ssim_score?.toFixed(4)} | PSNR: {resultData.psnr_score?.toFixed(1)}dB
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Before/After Comparison */}
                  {previewUrl && protectedUrl && (
                    <div style={{ width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                      <ImageCompare 
                        originalUrl={previewUrl} 
                        protectedUrl={protectedUrl} 
                      />
                    </div>
                  )}

                  {protectedUrl && (
                    <a 
                      href={protectedUrl} 
                      download={`varman_${file.name}`}
                      className={status === 'failed' ? "btn btn-secondary" : "btn btn-primary"} 
                      style={{ 
                        textAlign: 'center', 
                        borderColor: status === 'failed' ? 'var(--danger)' : undefined, 
                        color: status === 'failed' ? 'var(--danger)' : undefined,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Upload size={16} style={{ transform: 'rotate(180deg)' }} />
                      <span>Download {status === 'failed' ? 'Failed' : 'Shielded'} Payload</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
