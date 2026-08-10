import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Split, Eye, Activity, Search, Shield, Sliders } from 'lucide-react';

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

  const handleMove = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    setSliderPosition((x / rect.width) * 100);
    setLensPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const onMouseMove = (e) => {
    if (mode === 'lens' || isDragging) {
      handleMove(e.clientX, e.clientY);
    }
  };

  const onTouchMove = (e) => {
    if (mode === 'lens' || isDragging) {
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

    const c1 = document.createElement('canvas');
    const c2 = document.createElement('canvas');
    c1.width = width;
    c1.height = height;
    c2.width = width;
    c2.height = height;

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

      const diffSum = (dr + dg + db) / 3;
      const ampDiff = Math.min(255, diffSum * amplification);

      if (ampDiff < 5) {
        out[i] = 248;
        out[i + 1] = 250;
        out[i + 2] = 252;
        out[i + 3] = 255;
      } else {
        const norm = ampDiff / 255;
        out[i] = Math.floor(norm * 220);
        out[i + 1] = Math.floor((1 - Math.abs(norm - 0.5) * 2) * 180);
        out[i + 2] = Math.floor((1 - norm) * 200);
        out[i + 3] = 255;
      }
    }

    ctx.putImageData(heatmapData, 0, 0);
    setHeatmapLoaded(true);
  };

  useEffect(() => {
    generateHeatmap();
  }, [generateHeatmap]);

  return (
    <div className="flex flex-col gap-3 w-full max-w-xl mx-auto font-sans">
      {/* Mode Controls Toolbar */}
      <div className="flex items-center justify-between bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm text-xs">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'split'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            Split Slider
          </button>

          <button
            type="button"
            onClick={() => setMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'heatmap'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Difference Heatmap
          </button>

          <button
            type="button"
            onClick={() => setMode('lens')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'lens'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Noise Lens
          </button>
        </div>

        {mode !== 'split' && (
          <div className="flex items-center gap-2 px-2 text-xs font-semibold text-slate-700">
            <span>Amp: {amplification}x</span>
            <input
              type="range"
              min="5"
              max="40"
              value={amplification}
              onChange={(e) => setAmplification(Number(e.target.value))}
              className="w-16 accent-emerald-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Main Stage */}
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
        className="relative w-full aspect-square overflow-hidden rounded-2xl border border-slate-200 select-none shadow-md bg-slate-900"
        style={{ cursor: mode === 'split' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair' }}
      >
        <canvas ref={canvasRef} className="hidden" />

        {/* MODE 1: Split Slider */}
        {mode === 'split' && (
          <>
            <img
              ref={origImgRef}
              src={originalUrl}
              alt="Original"
              className="absolute inset-0 w-full h-full object-cover block"
              draggable={false}
            />
            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-lg text-xs font-semibold z-10 text-white shadow-sm">
              Original Photo
            </div>

            <img
              ref={protImgRef}
              src={protectedUrl}
              alt="Protected"
              className="absolute inset-0 w-full h-full object-cover block z-10"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
              draggable={false}
            />
            <div className="absolute top-3 left-3 bg-emerald-600 border border-emerald-500 px-3 py-1 rounded-lg text-xs font-bold z-20 text-white shadow-md">
              Varman Protected
            </div>

            {/* Split Divider */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-emerald-500 z-30 shadow-lg"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center shadow-lg text-emerald-400">
                ↔
              </div>
            </div>
          </>
        )}

        {/* MODE 2: Heatmap */}
        {mode === 'heatmap' && (
          <div className="relative w-full h-full">
            <img
              src={canvasRef.current ? canvasRef.current.toDataURL() : protectedUrl}
              alt="Adversarial Noise Heatmap"
              className="w-full h-full object-cover block"
            />
            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-lg text-xs font-semibold z-20 text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Perturbation Delta ({amplification}x Amp)
            </div>
          </div>
        )}

        {/* MODE 3: Lens */}
        {mode === 'lens' && (
          <div className="relative w-full h-full">
            <img
              src={protectedUrl}
              alt="Protected Base"
              className="w-full h-full object-cover block"
              draggable={false}
            />

            <div
              className="absolute w-36 h-36 rounded-full border-2 border-emerald-500 shadow-xl pointer-events-none z-30 overflow-hidden"
              style={{
                top: `${lensPos.y}%`,
                left: `${lensPos.x}%`,
                transform: 'translate(-50%, -50%)',
                backgroundImage: `url(${canvasRef.current ? canvasRef.current.toDataURL() : originalUrl})`,
                backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                backgroundSize: '400px 400px',
              }}
            >
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none"></div>
            </div>

            <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-lg text-xs font-semibold z-20 text-white">
              Drag cursor to inspect sub-pixel noise
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCompare;
