import React, { useState, useRef, useEffect, useCallback } from 'react';

const ImageCompare = ({ originalUrl, protectedUrl }) => {
  const [mode, setMode] = useState('split'); // 'split' | 'heatmap' | 'lens'
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [amplification, setAmplification] = useState(15);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [heatmapLoaded, setHeatmapLoaded] = useState(false);
  
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const origImgRef = useRef(null);
  const protImgRef = useRef(null);

  // Handle Dragging for Split Slider
  const handleMove = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    
    setSliderPosition((x / rect.width) * 100);
    setLensPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const onMouseMove = (e) => {
    if (mode === 'lens') {
      handleMove(e.clientX, e.clientY);
    } else if (isDragging) {
      handleMove(e.clientX, e.clientY);
    }
  };

  const onTouchMove = (e) => {
    if (mode === 'lens') {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    } else if (isDragging) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging || mode === 'lens') {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, mode]);

  // Compute Heatmap on Offscreen Canvas
  const generateHeatmap = useCallback(() => {
    if (!originalUrl || !protectedUrl || !canvasRef.current) return;

    const img1 = new Image();
    const img2 = new Image();
    img1.crossOrigin = 'Anonymous';
    img2.crossOrigin = 'Anonymous';

    let loadedCount = 0;
    const onImgLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        renderDifferenceCanvas(img1, img2);
      }
    };

    img1.onload = onImgLoad;
    img2.onload = onImgLoad;
    img1.src = originalUrl;
    img2.src = protectedUrl;
  }, [originalUrl, protectedUrl, amplification]);

  const renderDifferenceCanvas = (img1, img2) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Draw images to hidden canvases to extract ImageData
    const c1 = document.createElement('canvas');
    const c2 = document.createElement('canvas');
    c1.width = width; c1.height = height;
    c2.width = width; c2.height = height;

    const ctx1 = c1.getContext('2d');
    const ctx2 = c2.getContext('2d');
    if (!ctx1 || !ctx2) return;

    ctx1.drawImage(img1, 0, 0, width, height);
    ctx2.drawImage(img2, 0, 0, width, height);

    const data1 = ctx1.getImageData(0, 0, width, height).data;
    const data2 = ctx2.getImageData(0, 0, width, height).data;
    const heatmapData = ctx.createImageData(width, height);
    const out = heatmapData.data;

    for (let i = 0; i < data1.length; i += 4) {
      const dr = Math.abs(data1[i] - data2[i]);
      const dg = Math.abs(data1[i + 1] - data2[i + 1]);
      const db = Math.abs(data1[i + 2] - data2[i + 2]);

      // Calculate perturbation intensity
      const diffSum = (dr + dg + db) / 3;
      const ampDiff = Math.min(255, diffSum * amplification);

      if (ampDiff < 5) {
        // Dark background for zero noise
        out[i] = 10;
        out[i + 1] = 12;
        out[i + 2] = 22;
        out[i + 3] = 255;
      } else {
        // Cyberpunk heatmap gradient: Neon Cyan -> Purple -> Yellow
        const norm = ampDiff / 255;
        out[i] = Math.floor(norm * 255);                     // R (Red/Magenta)
        out[i + 1] = Math.floor((1 - Math.abs(norm - 0.5) * 2) * 240); // G (Neon Green/Cyan)
        out[i + 2] = Math.floor((1 - norm) * 255);           // B (Cyan/Blue)
        out[i + 3] = 255;                                    // Alpha
      }
    }

    ctx.putImageData(heatmapData, 0, 0);
    setHeatmapLoaded(true);
  };

  useEffect(() => {
    generateHeatmap();
  }, [generateHeatmap]);

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl mx-auto">
      {/* Mode Controls Toolbar */}
      <div className="flex items-center justify-between bg-surface-container-high/80 backdrop-blur-md p-1.5 rounded-lg border border-outline-variant/40 font-code-snippet text-xs">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              mode === 'split'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">split_scene</span>
            Split Slider
          </button>

          <button
            type="button"
            onClick={() => setMode('heatmap')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              mode === 'heatmap'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">equalizer</span>
            Adversarial Heatmap
          </button>

          <button
            type="button"
            onClick={() => setMode('lens')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              mode === 'lens'
                ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'text-on-surface-variant hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">search</span>
            Noise Lens
          </button>
        </div>

        {/* Amplification Slider (Visible in Heatmap & Lens mode) */}
        {mode !== 'split' && (
          <div className="flex items-center gap-2 px-2 text-[11px] text-neon-cyan">
            <span>Amp: {amplification}x</span>
            <input
              type="range"
              min="5"
              max="40"
              value={amplification}
              onChange={(e) => setAmplification(Number(e.target.value))}
              className="w-16 accent-neon-cyan cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          if (mode === 'split') {
            setIsDragging(true);
            handleMove(e.clientX, e.clientY);
          }
        }}
        onTouchStart={(e) => {
          if (mode === 'split') {
            setIsDragging(true);
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onMouseMove={(e) => {
          if (mode === 'lens') {
            handleMove(e.clientX, e.clientY);
          }
        }}
        className="relative w-full aspect-square overflow-hidden rounded-xl border border-outline-variant/50 select-none shadow-2xl bg-surface-container-dark"
        style={{ cursor: mode === 'split' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair' }}
      >
        {/* Hidden Compute Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* MODE 1: Split Slider */}
        {mode === 'split' && (
          <>
            {/* Background: Original Image */}
            <img
              ref={origImgRef}
              src={originalUrl}
              alt="Original"
              className="absolute inset-0 w-full h-full object-cover block"
              draggable={false}
            />
            <div className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm border border-outline/30 px-2.5 py-1 rounded text-[11px] font-code-snippet z-10 text-on-surface">
              Original Payload
            </div>

            {/* Foreground: Protected Image */}
            <img
              ref={protImgRef}
              src={protectedUrl}
              alt="Protected"
              className="absolute inset-0 w-full h-full object-cover block z-10"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
              }}
              draggable={false}
            />
            <div className="absolute top-3 left-3 bg-primary-container/90 border border-neon-cyan px-2.5 py-1 rounded text-[11px] font-code-snippet z-20 text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              Varman Protected
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-neon-cyan z-30 shadow-[0_0_12px_#00f0ff]"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-container-high border-2 border-neon-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                <span className="material-symbols-outlined text-neon-cyan text-sm">unfold_more</span>
              </div>
            </div>
          </>
        )}

        {/* MODE 2: Full Adversarial Heatmap */}
        {mode === 'heatmap' && (
          <div className="relative w-full h-full">
            <img
              src={canvasRef.current ? canvasRef.current.toDataURL() : protectedUrl}
              alt="Adversarial Noise Heatmap"
              className="w-full h-full object-cover block animate-fade-in"
            />
            <div className="absolute top-3 left-3 bg-surface-container-high/90 border border-secondary px-2.5 py-1 rounded text-[11px] font-code-snippet z-20 text-secondary shadow-[0_0_10px_rgba(189,0,255,0.3)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Adversarial Perturbation Map ({amplification}x Amp)
            </div>
          </div>
        )}

        {/* MODE 3: Interactive Noise Lens */}
        {mode === 'lens' && (
          <div className="relative w-full h-full">
            {/* Base Image: Protected */}
            <img
              src={protectedUrl}
              alt="Protected Base"
              className="w-full h-full object-cover block"
              draggable={false}
            />

            {/* Circular Magnifier Lens Overlay displaying Heatmap */}
            <div
              className="absolute w-36 h-36 rounded-full border-2 border-neon-cyan shadow-[0_0_25px_rgba(0,240,255,0.6)] pointer-events-none z-30 overflow-hidden"
              style={{
                top: `${lensPos.y}%`,
                left: `${lensPos.x}%`,
                transform: 'translate(-50%, -50%)',
                backgroundImage: `url(${canvasRef.current ? canvasRef.current.toDataURL() : originalUrl})`,
                backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                backgroundSize: '400px 400px'
              }}
            >
              <div className="absolute inset-0 bg-neon-cyan/10 pointer-events-none"></div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-code-snippet text-neon-cyan tracking-widest uppercase">
                Noise Delta
              </div>
            </div>

            <div className="absolute top-3 left-3 bg-surface-container-high/90 border border-outline-variant px-2.5 py-1 rounded text-[11px] font-code-snippet z-20 text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs text-neon-cyan">ads_click</span>
              Hover / Drag cursor to inspect pixel delta
            </div>
          </div>
        )}
      </div>

      {/* Legend / Status Footer */}
      <div className="flex items-center justify-between text-[11px] font-code-snippet text-on-surface-variant/70 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-cyan"></span>
          <span>L∞ Bound Clamp ($\epsilon = 0.0313$)</span>
        </div>
        <div>
          {mode === 'heatmap' ? 'Heatmap: Amplified |Original - Protected|' : mode === 'lens' ? 'Lens: Realtime Spectral Noise Inspection' : 'Slide to compare human visual fidelity'}
        </div>
      </div>
    </div>
  );
};

export default ImageCompare;
