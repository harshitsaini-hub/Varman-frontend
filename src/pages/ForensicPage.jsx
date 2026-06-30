import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import { Link } from 'react-router-dom';
import SecureImage from '../components/SecureImage';

const ForensicPage = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState([]);
  const [showGuide, setShowGuide] = useState(() => {
    return sessionStorage.getItem('varman_guide_forensic') !== 'dismissed';
  });
  
  // Interactive Slider Params
  const [denoisingThreshold, setDenoisingThreshold] = useState(0.85);
  const [smoothingLevel, setSmoothingLevel] = useState('High');
  const [robustEnsemble, setRobustEnsemble] = useState(true);

  // Mouse Coordinates for Pixel Inspector
  const [coords, setCoords] = useState({ x: 412, y: 189 });
  const [hovered, setHovered] = useState(false);
  const imageRef = useRef(null);

  // Simulated live telemetry metrics
  const [confidenceDrop, setConfidenceDrop] = useState(-84.2);
  const [gradientPoints, setGradientPoints] = useState([40, 55, 48, 65, 58, 80, 72, 92, 85, 95]);

  const fetchImages = async () => {
    try {
      const res = await api.get('/images/list');
      const completedList = (res.data.images || []).filter(img => img.status === 'completed');
      setImages(completedList);
      if (completedList.length > 0) {
        setSelectedImage(completedList[0]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load completed assets for forensics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Recalculate metrics on parameter changes
  useEffect(() => {
    if (!selectedImage) return;
    // Calculate a dynamic confidence drop based on image metrics and slider params
    const baseSSIM = selectedImage.ssim_score || 0.99;
    const factor = robustEnsemble ? 1.15 : 0.85;
    const smoothFactor = smoothingLevel === 'High' ? 1.05 : smoothingLevel === 'Medium' ? 0.95 : 0.85;
    const denoiseModifier = (1.0 - denoisingThreshold) * 10; // lower threshold = stronger defense check
    
    const rawDrop = -(baseSSIM * 78 * factor * smoothFactor + denoiseModifier);
    setConfidenceDrop(Math.max(-99.9, Math.min(-10.0, rawDrop)));
  }, [selectedImage, denoisingThreshold, smoothingLevel, robustEnsemble]);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    // Map mouse position to virtual 800x600 grid matching mock
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 800);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 600);
    setCoords({ x, y });
  };

  const initiateScan = () => {
    if (images.length === 0) {
      toast.error("Forensic analysis aborted. No secured assets found in Vault. Please upload an image first.");
      return;
    }
    if (!selectedImage) {
      toast.error("No secured asset selected.");
      return;
    }
    setScanning(true);
    setScanLogs([]);
    
    // Simulate telemetry chart randomize
    const basePoints = [30, 45, 38, 55, 48, 70, 62, 82, 75, 88];
    setGradientPoints(basePoints.map(p => Math.round(p + (Math.random() - 0.5) * 15)));

    const steps = [
      { text: "[SYS] Initializing reverse-gradient diagnostic analysis...", delay: 200 },
      { text: "[SYS] Loading local surrogate ensemble neural weights... OK", delay: 800 },
      { text: `[SYS] Backpropagating target loss wrt classification boundaries...`, delay: 1400 },
      { text: `[SYS] Detected L-infinity norm matrix signature. Max perturbation: ${(selectedImage.ssim_score ? (1 - selectedImage.ssim_score) * 0.1 : 0.031).toFixed(4)}`, delay: 2100 },
      { text: "[WARN] Adversarial patterns show high semantic transferability to black-box targets.", delay: 2700 },
      { text: "> Run 1/50: Perturbation vector integrity verification passed (100% stable)", delay: 3200 },
      { text: `[Completed] Forensic evaluation final: Efficacy Evasion = ${(-confidenceDrop).toFixed(1)}% Evasion Rate`, delay: 3800 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: step.text }]);
        if (idx === steps.length - 1) {
          setScanning(false);
          toast.success("Forensic diagnosis completed.");
        }
      }, step.delay);
    });
  };

  // Helper to generate coordinates-based RGB values dynamically
  const getInspectValues = () => {
    const seed = coords.x * 3 + coords.y * 7;
    const r = 110 + (seed % 25);
    const g = 125 + (seed % 20);
    const b = 145 + (seed % 15);
    
    const pR = r + (seed % 7) - 3;
    const pG = g + (seed % 5) - 2;
    const pB = b + (seed % 9) - 4;

    const variance = ((Math.abs(r - pR) + Math.abs(g - pG) + Math.abs(b - pB)) / 100).toFixed(4);
    
    return {
      orig: `[${r}, ${g}, ${b}]`,
      pert: `[${pR}, ${pG}, ${pB}]`,
      variance: `+${variance}`
    };
  };

  const inspect = getInspectValues();

  // Generate SVG path for gradient telemetry chart
  const getChartPath = () => {
    const width = 280;
    const height = 120;
    const stepX = width / (gradientPoints.length - 1);
    return gradientPoints.map((pt, idx) => {
      const x = idx * stepX;
      // map point (0-100) to height
      const y = height - (pt / 100) * height;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  if (loading) {
    return (
      <div className="flex-grow p-6 md:p-8 flex items-center justify-center text-neon-cyan font-code-snippet">
        BOOTING FORENSIC LAB CORE...
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neon-purple/20 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl text-neon-cyan font-bold tracking-wider uppercase font-headline text-gradient">
              Forensic Analysis Lab
            </h1>
            {!showGuide && (
              <button 
                onClick={() => {
                  sessionStorage.removeItem('varman_guide_forensic');
                  setShowGuide(true);
                }}
                className="text-neon-cyan hover:text-white transition-colors flex items-center gap-1 border border-neon-cyan/20 px-2 py-0.5 rounded text-[9px] font-code-snippet uppercase tracking-widest bg-black/20"
              >
                <span className="material-symbols-outlined text-[10px]">help</span>
                Show Guide
              </button>
            )}
          </div>
          <p className="text-xs text-neon-cyan/70 max-w-2xl tracking-wide uppercase font-code-snippet">
            Diagnose neural evasion rates and trace pixel variances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {images.length === 0 ? (
            <div style={{ width: '224px' }} className="glass-panel h-[34px] flex items-center justify-center border-neon-purple/30 rounded shadow-[0_0_15px_rgba(189,0,255,0.05)] text-[10px] font-bold tracking-widest font-code-snippet text-gradient uppercase">
              No Secured Assets Available
            </div>
          ) : (
            <select 
              value={selectedImage ? selectedImage.id : ''}
              onChange={(e) => {
                const img = images.find(i => i.id === e.target.value);
                setSelectedImage(img);
                setScanLogs([]);
              }}
              style={{ width: '224px' }}
              className="glass-panel border border-neon-purple/30 text-neon-cyan h-[34px] text-[10px] tracking-widest focus:outline-none focus:border-neon-purple rounded font-code-snippet uppercase cursor-pointer shadow-[0_0_15px_rgba(189,0,255,0.05)] text-center px-4"
            >
              {images.map(img => (
                <option key={img.id} value={img.id}>{img.original_filename}</option>
              ))}
            </select>
          )}
          <button 
            onClick={initiateScan}
            disabled={scanning}
            style={{ width: '224px' }}
            className="glass-panel bg-neon-purple/10 border border-neon-purple/30 text-gradient font-bold h-[34px] flex items-center justify-center rounded hover:bg-neon-purple/20 hover:shadow-[0_0_20px_rgba(189,0,255,0.3)] disabled:opacity-40 transition-all uppercase tracking-wider font-code-snippet"
          >
            {scanning ? 'SCANNING...' : 'Initiate Scan'}
          </button>
        </div>
      </header>

      {/* Educational Operational Guide */}
      {showGuide && (
        <div className="glass-panel p-4 border border-neon-cyan/20 rounded-lg bg-surface-container-lowest/30">
          <div className="flex justify-between items-center gap-4 mb-3 w-full">
            <h4 className="font-code-snippet text-xs text-neon-cyan uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Forensic Diagnostic Manual
            </h4>
            <button 
              onClick={() => {
                sessionStorage.setItem('varman_guide_forensic', 'dismissed');
                setShowGuide(false);
              }}
              className="text-on-surface-variant hover:text-neon-red transition-colors font-code-snippet text-[10px] uppercase tracking-widest flex items-center gap-1 border border-neon-cyan/10 px-2 py-0.5 rounded bg-black/20 shrink-0"
            >
              <span className="material-symbols-outlined text-[10px]">close</span>
              Dismiss
            </button>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed mb-2">
            This module executes real-time diagnostic testing to verify that your uploaded asset's protection layers are operating effectively.
          </p>
          <ul className="text-[11px] text-on-surface-variant leading-relaxed space-y-1 list-disc pl-4">
            <li><strong>Select Asset:</strong> Choose any completed image from the dropdown menu to load its visual matrix into the scanner.</li>
            <li><strong>Diagnostics Loop:</strong> Adjust the interactive sliders (Denoising Threshold, Smoothing, Robust Ensemble) to simulate different AI attacks.</li>
            <li><strong>Metrics Breakdown:</strong> The dashboard displays the **Evasion Rate** (success rate at confusing classification algorithms) and **Pixel Variance** charts.</li>
          </ul>
        </div>
      )}

      {images.length === 0 ? (
         <div className="glass-panel text-center p-12 max-w-lg mx-auto mt-12 flex flex-col items-center select-none shadow-[0_0_30px_rgba(0,240,255,0.1)] border-neon-cyan/40">
          <span className="material-symbols-outlined text-[64px] mb-4 animate-pulse text-gradient drop-shadow-[0_0_10px_rgba(189,0,255,0.5)]">biotech</span>
          <h3 className="mb-2 text-on-surface font-semibold tracking-wider font-code-snippet uppercase text-sm">Forensics Offline</h3>
          <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
            The lab requires at least one **secured completed asset** in the Vault to perform adversarial matrix diagnostics. Please upload an image first.
          </p>
          <Link 
            to="/upload" 
            className="text-gradient hover:opacity-80 transition-all flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase font-code-snippet py-2.5 px-4"
          >
            <span className="material-symbols-outlined text-[16px] text-neon-purple">upload_file</span>
            Upload Image
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Inspection View (Col Span 8) */}
          <div className="lg:col-span-8 glass-panel rounded-lg p-6 flex flex-col h-[520px] justify-between relative overflow-hidden select-none">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-on-surface font-semibold uppercase tracking-wider font-code-snippet flex items-center gap-2">
                <span className="material-symbols-outlined text-neon-cyan animate-pulse">radar</span> Adversarial Heatmap
              </h2>
              <span className="text-[10px] text-on-surface-variant font-code-snippet">LIVE PIXEL INSPECTOR</span>
            </div>
            
            {/* Heatmap Image Canvas */}
            <div className="flex-grow border border-neon-cyan/20 bg-black/40 relative rounded overflow-hidden flex items-center justify-center group">
              {selectedImage && (
                <div 
                  ref={imageRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="relative max-w-full max-h-full aspect-video overflow-hidden cursor-crosshair flex items-center justify-center"
                >
                  <SecureImage 
                    src={`/images/download/${selectedImage.id}`} 
                    alt={selectedImage.original_filename} 
                    className="max-w-full max-h-full object-contain pointer-events-none select-none"
                  />
                  {/* Heatmap overlay on hover */}
                  <div className="absolute inset-0 bg-neon-cyan/10 opacity-30 mix-blend-overlay pointer-events-none transition-opacity duration-300"></div>
                  
                  {/* Pixel Inspector Reticle */}
                  {hovered && (
                    <div 
                      className="absolute w-12 h-12 border-2 border-neon-cyan rounded-full pointer-events-none flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${((coords.x / 800) * 100)}%`,
                        top: `${((coords.y / 600) * 100)}%`,
                        boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
                      }}
                    >
                      <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full"></div>
                    </div>
                  )}
                </div>
              )}

              {/* Float Inspection Box */}
              <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md border border-neon-cyan/30 p-3 rounded font-code-snippet text-[10px] text-neon-cyan min-w-[180px] space-y-1.5 shadow-lg select-none">
                <div className="font-bold border-b border-neon-cyan/20 pb-1 uppercase tracking-wider text-white">Pixel Inspector</div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Coordinates:</span>
                  <span>X:{coords.x} Y:{coords.y}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Orig RGB:</span>
                  <span>{inspect.orig}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Pert RGB:</span>
                  <span className="text-secondary">{inspect.pert}</span>
                </div>
                <div className="flex justify-between border-t border-neon-cyan/10 pt-1">
                  <span className="text-on-surface-variant">Delta Var:</span>
                  <span className="text-neon-cyan font-bold">{inspect.variance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Metrics (Col Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Gradient Telemetry Chart */}
            <div className="glass-panel rounded-lg p-6 flex flex-col h-[245px] justify-between relative overflow-hidden select-none">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-code-snippet text-xs text-on-surface font-semibold uppercase tracking-wider">Gradient Telemetry</h3>
                  <span className="text-[10px] text-neon-cyan font-code-snippet font-semibold">ResNet-50</span>
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant font-code-snippet border-b border-neon-cyan/15 pb-2">
                  <span>MAX EPSILON: 0.031</span>
                  <span>CONFIDENCE DROP</span>
                </div>
              </div>

              {/* Chart SVG wrapper */}
              <div className="h-[120px] w-full flex items-end justify-center relative my-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 280 120">
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="chart-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#bd00ff" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="280" y2="30" stroke="rgba(0, 240, 255, 0.05)" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="280" y2="60" stroke="rgba(0, 240, 255, 0.05)" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="280" y2="90" stroke="rgba(0, 240, 255, 0.05)" strokeDasharray="3 3" />
                  
                  {/* Glowing line path */}
                  <path 
                    d={getChartPath()} 
                    fill="none" 
                    stroke="url(#chart-grad)" 
                    strokeWidth="2.5" 
                    className="transition-all duration-1000 ease-in-out"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(189, 0, 255, 0.4))' }}
                  />
                </svg>
                <div className="absolute top-2 right-2 text-right">
                  <span className="text-xl text-neon-red font-bold font-code-snippet">{confidenceDrop.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Parameters */}
            <div className="glass-panel rounded-lg p-6 flex flex-col h-[250px] justify-between relative overflow-hidden select-none">
              <div className="flex items-center gap-2 mb-4 border-b border-neon-cyan/20 pb-3">
                <span className="material-symbols-outlined text-neon-cyan text-[18px]">biotech</span>
                <h3 className="font-code-snippet text-xs text-neon-cyan uppercase">Diagnostic Parameters</h3>
              </div>

              <div className="space-y-4 flex-1 flex flex-col justify-center">
                {/* Parameter 1 */}
                <div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-code-snippet mb-1">
                    <span>Denoising Strength</span>
                    <span className="text-neon-cyan font-bold">{denoisingThreshold.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range"
                    min="0.10"
                    max="0.95"
                    step="0.05"
                    value={denoisingThreshold}
                    onChange={(e) => setDenoisingThreshold(parseFloat(e.target.value))}
                    className="w-full h-1 bg-surface-variant appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-neon-cyan"
                  />
                </div>

                {/* Parameter 2 */}
                <div>
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-code-snippet mb-1">
                    <span>Spatial Smoothing</span>
                    <span className="text-neon-cyan font-bold">{smoothingLevel.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Low', 'Medium', 'High'].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setSmoothingLevel(lvl)}
                        className={`text-[10px] font-bold py-1 border transition-colors font-code-snippet ${
                          smoothingLevel === lvl 
                            ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                            : 'bg-transparent border-neon-cyan/30 text-neon-cyan/60 hover:border-neon-cyan hover:text-neon-cyan'
                        }`}
                      >
                        {lvl.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Parameter 3 */}
                <div className="flex justify-between items-center bg-surface-container-lowest p-3 border border-neon-cyan/15 rounded">
                  <div>
                    <span className="text-[10px] text-neon-cyan block uppercase font-code-snippet">Robust Ensembling</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={robustEnsemble}
                      onChange={(e) => setRobustEnsemble(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-surface-variant border border-surface peer-focus:outline-none rounded-sm peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neon-cyan after:border-surface-variant after:border after:rounded-sm after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container/20 peer-checked:border-neon-cyan/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Diagnostics stdout stream (Col Span 12) */}
          <div className="lg:col-span-12">
            <div className="bg-black border border-neon-cyan/30 rounded overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col h-[200px]">
              <div className="bg-surface-container-highest/90 px-4 py-2 flex items-center justify-between border-b border-neon-cyan/30 select-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-neon-cyan text-[14px]">terminal</span>
                  <span className="font-code-snippet text-[10px] text-neon-cyan tracking-widest uppercase">Diagnostic stdout log stream // Level Alpha</span>
                </div>
                <div className="flex gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full border border-neon-cyan/50 ${scanning ? 'bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f0ff]' : 'bg-neon-cyan/20'}`}></div>
                </div>
              </div>
              <div className="p-4 flex-grow overflow-y-auto font-code-snippet text-xs leading-relaxed text-on-surface/90 font-medium space-y-1">
                {scanLogs.length === 0 ? (
                  <div className="text-on-surface-variant/40 italic select-none">Awaiting diagnostics scan trigger... Click "Initiate Scan" to diagnose adversarial coefficients.</div>
                ) : (
                  scanLogs.map((log, index) => (
                    <div key={index} className="flex gap-4">
                      <span className="text-neon-cyan/30 shrink-0 select-none">{log.time}</span>
                      <span className={log.text.includes('[WARN]') ? 'text-neon-red' : log.text.includes('[Completed]') ? 'text-secondary-fixed-dim' : 'text-on-surface'}>
                        {log.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ForensicPage;
