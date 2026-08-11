import React, { useState, useRef, useEffect } from 'react';
import { Shield, Eye, Activity, CheckCircle, Sliders, Zap, AlertTriangle, Lock, MousePointer } from 'lucide-react';

const HeroDemoCard = () => {
  const [preset, setPreset] = useState('Balanced');
  const [viewMode, setViewMode] = useState('protected'); // 'original' | 'protected' | 'ai_view'
  const [disruptionLevel, setDisruptionLevel] = useState(65); // 0 to 100%
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const viewportRef = useRef(null);

  const presetLevels = {
    Light: 30,
    Balanced: 65,
    Aggressive: 95,
  };

  const handlePresetSelect = (p) => {
    setPreset(p);
    setDisruptionLevel(presetLevels[p]);
  };

  // Interactive Mouse Parallax Tilt
  const handleMouseMove = (e) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10px to +10px
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Dynamic calculated metrics based on disruption level slider
  const calculatedSSIM = (0.995 - (disruptionLevel / 100) * 0.085).toFixed(3);
  const calculatedPSNR = (42 - (disruptionLevel / 100) * 8).toFixed(1);
  const calculatedYNPR = (85 + (disruptionLevel / 100) * 35).toFixed(1);
  const calculatedWarpPx = ((disruptionLevel / 100) * 1.8).toFixed(1);
  
  // AI Scraper Recognition Confidence (Collapses as disruption increases)
  const aiConfidence = Math.max(8.4, 99.8 - (disruptionLevel / 100) * 91.4).toFixed(1);
  const isNeutralized = aiConfidence < 40;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-900/5 flex flex-col gap-5 relative overflow-hidden selection:bg-emerald-100 font-sans">
      {/* Header & Preset Selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Interactive Engine Simulator
          </span>
        </div>

        {/* Preset Pills */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {['Light', 'Balanced', 'Aggressive'].map((p) => (
            <button
              key={p}
              onClick={() => handlePresetSelect(p)}
              className={`px-3 py-1 rounded-lg transition-all ${
                preset === p
                  ? 'bg-slate-900 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas Viewport */}
      <div
        ref={viewportRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner group cursor-crosshair"
      >
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-200 ease-out"
          style={{
            backgroundImage:
              'linear-gradient(to right, #059669 1px, transparent 1px), linear-gradient(to bottom, #059669 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          }}
        ></div>

        {/* AI Model View Disruption Wave Grid */}
        {viewMode === 'ai_view' && (
          <div className="absolute inset-0 bg-red-950/20 mix-blend-screen pointer-events-none flex items-center justify-center">
            <div
              className="w-full h-full opacity-40 animate-pulse"
              style={{
                backgroundImage: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.4) 0%, transparent 70%)',
              }}
            ></div>
          </div>
        )}

        {/* Face Landmark Graphic Container */}
        <div
          className="relative w-52 h-52 flex items-center justify-center transition-transform duration-200 ease-out z-10"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
            {/* Head Contour */}
            <ellipse
              cx="100"
              cy="100"
              rx="62"
              ry="76"
              stroke={viewMode === 'ai_view' ? '#ef4444' : '#059669'}
              strokeWidth="2"
              strokeDasharray={viewMode === 'ai_view' ? '4 4' : 'none'}
              className="transition-all duration-300"
            />

            {/* Landmark Keypoint Coordinates (Dynamically shifted by disruption level) */}
            {(() => {
              const shift = (disruptionLevel / 100) * (viewMode === 'original' ? 0 : 7);
              const leftEye = { x: 74 - shift, y: 84 - shift * 0.5 };
              const rightEye = { x: 126 + shift, y: 84 + shift * 0.5 };
              const nose = { x: 100, y: 110 + shift };
              const leftMouth = { x: 78 - shift * 0.8, y: 140 + shift * 0.6 };
              const rightMouth = { x: 122 + shift * 0.8, y: 140 - shift * 0.4 };

              return (
                <>
                  {/* Eye Mesh Line */}
                  <polygon
                    points={`${leftEye.x},${leftEye.y} ${rightEye.x},${rightEye.y} ${nose.x},${nose.y}`}
                    stroke={viewMode === 'ai_view' ? '#ef4444' : '#10b981'}
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                    fill={viewMode === 'ai_view' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}
                  />

                  {/* Mouth Mesh Line */}
                  <polygon
                    points={`${leftMouth.x},${leftMouth.y} ${rightMouth.x},${rightMouth.y} ${nose.x},${nose.y}`}
                    stroke={viewMode === 'ai_view' ? '#ef4444' : '#10b981'}
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                    fill={viewMode === 'ai_view' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)'}
                  />

                  {/* Keypoint Dots */}
                  <circle cx={leftEye.x} cy={leftEye.y} r="4.5" fill={viewMode === 'ai_view' ? '#ef4444' : '#10b981'} />
                  <circle cx={rightEye.x} cy={rightEye.y} r="4.5" fill={viewMode === 'ai_view' ? '#ef4444' : '#10b981'} />
                  <circle cx={nose.x} cy={nose.y} r="4" fill={viewMode === 'ai_view' ? '#ef4444' : '#10b981'} />
                  <circle cx={leftMouth.x} cy={leftMouth.y} r="4" fill={viewMode === 'ai_view' ? '#ef4444' : '#10b981'} />
                  <circle cx={rightMouth.x} cy={rightMouth.y} r="4" fill={viewMode === 'ai_view' ? '#ef4444' : '#10b981'} />

                  {/* Disruption Vectors in Protected / AI view */}
                  {viewMode !== 'original' && (
                    <>
                      <line x1="74" y1="84" x2={leftEye.x} y2={leftEye.y} stroke="#ef4444" strokeWidth="2" />
                      <line x1="126" y1="84" x2={rightEye.x} y2={rightEye.y} stroke="#ef4444" strokeWidth="2" />
                      <line x1="100" y1="110" x2={nose.x} y2={nose.y} stroke="#ef4444" strokeWidth="2" />

                      {/* Frequency Disruption Orbit */}
                      <circle
                        cx="100"
                        cy="100"
                        r="52"
                        stroke="#3b82f6"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        className="animate-spin"
                        style={{ animationDuration: '10s' }}
                      />
                    </>
                  )}
                </>
              );
            })()}
          </svg>
        </div>

        {/* HUD Top Tag */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 text-xs font-mono text-white shadow-sm">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>YuNet: 5 Keypoints Anchored</span>
        </div>

        {/* HUD Interactive Tilt Mouse Guide */}
        <div className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1.5 select-none">
          <MousePointer className="w-3 h-3 text-emerald-400" /> Move cursor to tilt mesh
        </div>

        {/* HUD Bottom Status Badge */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 text-xs font-mono">
          {viewMode === 'ai_view' ? (
            isNeutralized ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> AI Scraper Blocked ({aiConfidence}%)
              </span>
            ) : (
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Recognition: {aiConfidence}%
              </span>
            )
          ) : (
            <span className="text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> SSIM: {calculatedSSIM} (Passed)
            </span>
          )}
        </div>
      </div>

      {/* Disruption Strength Slider */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" /> Disruption Strength Slider
          </span>
          <span className="font-mono text-emerald-600 font-bold">{disruptionLevel}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={disruptionLevel}
          onChange={(e) => setDisruptionLevel(Number(e.target.value))}
          className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg"
        />
      </div>

      {/* View Mode Toggle Buttons */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setViewMode('original')}
          className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'original'
              ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          Original
        </button>

        <button
          onClick={() => setViewMode('protected')}
          className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'protected'
              ? 'bg-white text-emerald-700 shadow-sm font-bold border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          Varman Protected
        </button>

        <button
          onClick={() => setViewMode('ai_view')}
          className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'ai_view'
              ? 'bg-white text-red-700 shadow-sm font-bold border border-red-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-red-600" />
          AI Model View
        </button>
      </div>

      {/* Live Calculated Metric Gauges */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Global SSIM</div>
          <div className="text-sm font-extrabold font-mono text-slate-900">{calculatedSSIM}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">PSNR</div>
          <div className="text-sm font-extrabold font-mono text-slate-900">{calculatedPSNR} dB</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Avg Y-NPR</div>
          <div className="text-sm font-extrabold font-mono text-emerald-600">{calculatedYNPR}%</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Warp Shift</div>
          <div className="text-sm font-extrabold font-mono text-slate-900">{calculatedWarpPx} px</div>
        </div>
      </div>
    </div>
  );
};

export default HeroDemoCard;
