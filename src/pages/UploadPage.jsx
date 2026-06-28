import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import ImageCompare from '../components/ImageCompare';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [protectedUrl, setProtectedUrl] = useState(null);
  const [strength, setStrength] = useState(0.05);
  const [watermark, setWatermark] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [logs, setLogs] = useState(() => {
    const saved = sessionStorage.getItem('varman_upload_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse logs from sessionStorage", e);
      }
    }
    return [
      { time: new Date().toLocaleTimeString(), text: 'VARMAN v2.0.4a - Kernel Initialized', type: 'system' },
      { time: new Date().toLocaleTimeString(), text: 'Awaiting user input...', type: 'system' }
    ];
  });
  
  // Polling states
  const [status, setStatus] = useState(null); // 'pending' | 'processing' | 'completed' | 'failed'
  const pollInterval = useRef(null);
  const terminalEndRef = useRef(null);

  // Sync logs with sessionStorage whenever state changes
  useEffect(() => {
    sessionStorage.setItem('varman_upload_logs', JSON.stringify(logs));
  }, [logs]);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (protectedUrl) URL.revokeObjectURL(protectedUrl);
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [previewUrl, protectedUrl]);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      text,
      type
    }]);
  };

  const processSelectedFile = (selectedFile) => {
    if (!selectedFile.type.startsWith('image/')) {
      toast.error("Invalid file format. Please select an image.");
      addLog(`[Error] Ingestion failed: Invalid file type ${selectedFile.type}`, 'error');
      return;
    }
    
    // Revoke previous URLs
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (protectedUrl) URL.revokeObjectURL(protectedUrl);

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setProtectedUrl(null);
    setStatus(null);
    
    addLog(`[Ingest] Ingested raw payload: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`, 'success');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const triggerReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (protectedUrl) URL.revokeObjectURL(protectedUrl);
    setFile(null);
    setPreviewUrl(null);
    setProtectedUrl(null);
    setStatus(null);
    setUploading(false);
    if (pollInterval.current) clearInterval(pollInterval.current);
    
    setLogs([
      { time: new Date().toLocaleTimeString(), text: 'VARMAN v2.0.4a - Ingestion Pipeline Reset', type: 'system' },
      { time: new Date().toLocaleTimeString(), text: 'Awaiting user input...', type: 'system' }
    ]);
  };

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
    addLog(`[Init] Establishing connection to protection pipeline...`);

    const formData = new FormData();
    formData.append('files', file);
    formData.append('protection_strength', strength);

    try {
      const res = await api.post('/images/protect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newImageId = res.data[0].id;
      setStatus('pending');
      toast.success("Asset uploaded. Enqueuing protection job...", { id: "upload-status" });
      addLog(`[Queue] Job enqueued successfully. Job ID: ${newImageId}`, 'success');
      startPolling(newImageId);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || "Upload failed";
      toast.error(errMsg, { id: "upload-status" });
      addLog(`[Error] Connection or payload upload failed: ${errMsg}`, 'error');
      setUploading(false);
    }
  };

  const startPolling = (id) => {
    if (pollInterval.current) clearInterval(pollInterval.current);
    addLog(`[Engine] Initiating telemetry monitoring loop for job ${id.substring(0, 8)}...`);
    
    pollInterval.current = setInterval(async () => {
      try {
        const res = await api.get(`/images/status/${id}`);
        const currentStatus = res.data.status;
        setStatus(currentStatus);
        
        if (currentStatus === 'processing') {
          addLog(`[Engine] Optimizing adversarial perturbations (Epsilon = ${strength.toFixed(3)})...`, 'info');
        }

        if (currentStatus === 'completed' || currentStatus === 'failed') {
          clearInterval(pollInterval.current);
          
          if (currentStatus === 'completed') {
            toast.success("Optimizing process completed!");
            addLog(`[Completed] Defense matrix optimization complete. SSIM: ${res.data.ssim_score?.toFixed(4)} | PSNR: ${res.data.psnr_score?.toFixed(2)}dB`, 'success');
          } else {
            toast.error("Gradients optimization failed visual quality thresholds.");
            addLog(`[Failed] Optimization failed: Visual similarity constraint violated`, 'error');
          }

          // Fetch the protected image file using Axios (expects Bearer token) and construct Blob URL
          try {
            addLog(`[Storage] Fetching protected asset from secure directory...`);
            const imgRes = await api.get(`/images/download/${id}`, { responseType: 'blob' });
            const blobUrl = URL.createObjectURL(imgRes.data);
            setProtectedUrl(blobUrl);
            addLog(`[Secured] Output asset loaded in sandbox and ready for download.`, 'success');
          } catch (err) {
            console.error("Failed to download protected blob url", err);
            toast.error("Security optimization applied, but image retrieval failed.");
            addLog(`[Error] Asset download failed: ${err.message}`, 'error');
          } finally {
            setUploading(false);
          }
        }
      } catch (err) {
        console.error("Polling error", err);
        addLog(`[Error] Telemetry connection interrupted. Retrying...`, 'error');
      }
    }, 3000);
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-neon-cyan mb-2 font-bold tracking-wider uppercase font-headline text-gradient">
            Disruptor Core
          </h1>
          <p className="text-xs text-neon-cyan/70 max-w-2xl tracking-wide uppercase font-code-snippet">
            Inject adversarial perturbations to neutralize unauthorized AI processing.
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan font-code-snippet text-[10px] shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_6px_#00f0ff]"></span>
            SYSTEM READY
          </span>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Drag & Drop Zone or Compare Screen (Span 8) */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[400px]">
          {protectedUrl && previewUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 border border-neon-cyan/30 bg-surface-container/20 rounded-md relative">
              <h3 className="font-code-snippet text-xs text-neon-cyan mb-4 uppercase tracking-widest">Adversarial Output Sandbox</h3>
              <div className="w-full max-w-lg mb-6">
                <ImageCompare originalUrl={previewUrl} protectedUrl={protectedUrl} />
              </div>
              <button 
                onClick={triggerReset} 
                className="bg-neon-cyan/20 text-neon-cyan border border-neon-cyan py-2 px-6 hover:bg-neon-cyan hover:text-background transition-colors flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase font-code-snippet"
              >
                Clear Sandbox
              </button>
            </div>
          ) : file ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border border-neon-cyan/30 bg-surface-container/20 rounded-md relative text-center">
              {previewUrl && (
                <div className="w-full max-w-md aspect-video mb-6 border border-neon-cyan/20 overflow-hidden flex items-center justify-center bg-black/40">
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <h3 className="font-code-snippet text-xs text-on-surface mb-1 uppercase tracking-widest">{file.name}</h3>
              <p className="text-[10px] text-on-surface-variant uppercase font-code-snippet mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              
              {status === 'processing' && (
                <div className="flex flex-col items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-neon-cyan text-4xl animate-spin">sync</span>
                  <p className="text-neon-cyan font-code-snippet text-xs uppercase tracking-widest">Optimizing Matrix...</p>
                </div>
              )}

              {status === 'pending' && (
                <div className="flex flex-col items-center gap-2 mb-6 text-secondary">
                  <span className="material-symbols-outlined text-secondary text-4xl animate-pulse">hourglass_empty</span>
                  <p className="font-code-snippet text-xs uppercase tracking-widest">Held in GPU Queue...</p>
                </div>
              )}

              {status === 'failed' && (
                <div className="flex flex-col items-center gap-2 mb-6 text-neon-red">
                  <span className="material-symbols-outlined text-neon-red text-4xl">warning</span>
                  <p className="font-code-snippet text-xs uppercase tracking-widest">Failed Visual Quality threshold</p>
                </div>
              )}

              {!status && (
                <button 
                  onClick={triggerReset} 
                  className="bg-neon-red/10 text-neon-red border border-neon-red/30 py-2 px-6 hover:bg-neon-red hover:text-white transition-colors flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase font-code-snippet"
                >
                  Change Asset
                </button>
              )}
            </div>
          ) : (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
              className={`relative flex-1 group bg-surface-container/40 backdrop-blur-md rounded border transition-all duration-300 flex flex-col items-center justify-center p-12 overflow-hidden cursor-pointer shadow-[inset_0_0_50px_rgba(0,240,255,0.02)] ${
                isDragging ? 'border-neon-cyan shadow-[inset_0_0_50px_rgba(0,240,255,0.1)]' : 'border-neon-cyan/30 hover:border-neon-cyan/70'
              }`}
            >
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-neon-cyan/50"></div>
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-neon-cyan/50"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-neon-cyan/50"></div>
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-neon-cyan/50"></div>
              
              <div className="w-20 h-20 mb-6 rounded bg-surface/80 border border-neon-cyan/30 shadow-[0_0_30px_rgba(0,219,233,0.1)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 group-hover:shadow-[0_0_50px_rgba(0,219,233,0.2)] relative z-10">
                <span className="material-symbols-outlined text-[40px] text-neon-cyan/80 group-hover:text-neon-cyan transition-colors">cloud_upload</span>
              </div>
              <h3 className="font-code-snippet text-xs text-neon-cyan mb-2 z-10 tracking-wide uppercase">Initialize Image Ingestion</h3>
              <p className="font-body-sm text-[11px] text-on-surface-variant text-center max-w-sm mb-6 z-10">
                Drag & drop visual assets here, or click to browse. Supports PNG, JPG, WEBP.
              </p>
              
              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
              
              <div className="font-code-snippet text-[10px] text-neon-cyan/60 flex gap-4 tracking-widest uppercase z-10 bg-surface/50 px-4 py-2 rounded border border-neon-cyan/10">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">done</span> MAX 50MB</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">lock</span> SECURE</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Configuration Panel (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container/80 backdrop-blur-2xl rounded-none border border-neon-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.05)] p-6 relative overflow-hidden h-full flex flex-col bg-mesh">
            {/* Cyber Corner Brackets */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-neon-cyan/40 pointer-events-none"></div>
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-neon-cyan/40 pointer-events-none"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-neon-cyan/40 pointer-events-none"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-neon-cyan/40 pointer-events-none"></div>
            
            {/* Top-Right Cyber Accent */}
            <div className="absolute top-0 right-0 bg-neon-cyan/10 border-b border-l border-neon-cyan/30 px-3 py-1 font-code-snippet text-[10px] text-neon-cyan select-none uppercase tracking-widest pointer-events-none">
              SYS_CTRL
            </div>

            <div className="flex items-center gap-2 mb-6 border-b border-neon-cyan/20 pb-4">
              <span className="material-symbols-outlined text-neon-cyan text-[20px]">tune</span>
              <h2 className="font-code-snippet text-xs text-neon-cyan tracking-tight uppercase">Configuration</h2>
            </div>
            
            {/* Epsilon Slider */}
            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <label className="font-code-snippet text-[10px] text-on-surface-variant uppercase tracking-widest" htmlFor="epsilon-slider">Epsilon Strength</label>
                <span className="font-code-snippet text-[10px] text-neon-cyan bg-surface border border-neon-cyan/40 px-2 py-0.5 rounded-none shadow-[0_0_10px_rgba(0,240,255,0.1)]" id="epsilon-value">
                  {strength.toFixed(2)}
                </span>
              </div>
              <input 
                className="cyber-range cursor-pointer" 
                id="epsilon-slider" 
                max="0.20" 
                min="0.01" 
                step="0.01" 
                type="range" 
                value={strength}
                onChange={(e) => {
                  setStrength(parseFloat(e.target.value));
                }}
                onMouseUp={(e) => {
                  const val = parseFloat(e.target.value);
                  addLog(`[Config] Epsilon strength modified to: ${val.toFixed(2)}`);
                }}
                onTouchEnd={(e) => {
                  const val = parseFloat(e.target.value);
                  addLog(`[Config] Epsilon strength modified to: ${val.toFixed(2)}`);
                }}
                disabled={uploading || status === 'pending' || status === 'processing'}
              />
              <div className="flex justify-between mt-3 font-code-snippet text-[10px] text-neon-cyan/50 tracking-widest uppercase">
                <span>Stealth</span>
                <span>Aggressive</span>
              </div>
            </div>

            {/* Watermark Integration Toggle */}
            <div className="mb-auto">
              <div className="flex items-center justify-between bg-surface-container-lowest/80 p-4 rounded-none border border-neon-cyan/25 shadow-inner">
                <div>
                  <label className="font-code-snippet text-[10px] text-neon-cyan block mb-1 uppercase tracking-wide">Watermark</label>
                  <span className="font-code-snippet text-[10px] text-on-surface-variant/70">Embed blind signature.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={watermark}
                    onChange={(e) => {
                      setWatermark(e.target.checked);
                      addLog(`[Config] Watermark toggle: ${e.target.checked ? 'ENABLED' : 'DISABLED'}`);
                    }}
                    disabled={uploading || status === 'pending' || status === 'processing'}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-surface-variant border border-surface peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neon-cyan after:border-surface-variant after:border after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container/20 peer-checked:border-neon-cyan/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
                </label>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleUpload}
              disabled={!file || uploading || status === 'pending' || status === 'processing'}
              className="w-full mt-6 bg-neon-cyan/10 hover:bg-neon-cyan text-neon-cyan hover:text-background font-code-snippet font-bold text-[11px] py-4 rounded-none hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] disabled:opacity-40 disabled:hover:shadow-none transition-all duration-300 relative overflow-hidden group border border-neon-cyan uppercase tracking-widest"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
                {uploading ? 'PROCESSING CORE...' : 'INITIALIZE PROTECTION'}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Terminal Log (Span 12) */}
        <div className="lg:col-span-12">
          <div className="bg-black border border-neon-cyan/30 rounded overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col h-[220px]">
            {/* Terminal Header */}
            <div className="bg-surface-container-highest/90 px-4 py-2 flex items-center justify-between border-b border-neon-cyan/30">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-neon-cyan text-[14px]">terminal</span>
                <span className="font-code-snippet text-[10px] text-neon-cyan tracking-widest uppercase">Defense Execution Log // STDOUT</span>
              </div>
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-neon-cyan border border-neon-cyan/50 shadow-[0_0_8px_rgba(0,240,255,0.8)] animate-pulse"></div>
              </div>
            </div>
            {/* Terminal Content */}
            <div className="p-4 flex-1 overflow-y-auto font-code-snippet text-[12px] leading-relaxed text-on-surface/90 font-medium space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-4">
                  <span className="text-neon-cyan/40 shrink-0 select-none">{log.time}</span>
                  <span className={
                    log.type === 'success' ? 'text-neon-cyan' : 
                    log.type === 'error' ? 'text-neon-red' : 
                    log.type === 'system' ? 'text-secondary-fixed-dim' : 'text-on-surface-variant'
                  }>
                    {log.text}
                  </span>
                </div>
              ))}
              <div ref={terminalEndRef}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
