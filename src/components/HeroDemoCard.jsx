import React, { useState } from 'react';
import { Shield, Eye, Activity, CheckCircle, Sliders, Layers, RefreshCw, Zap } from 'lucide-react';

const HeroDemoCard = () => {
  const [preset, setPreset] = useState('Balanced');
  const [viewMode, setViewMode] = useState('protected'); // 'original' | 'protected' | 'ai_view'

  const presetData = {
    Light: { ssim: '0.978', psnr: '41.28 dB', npr: '104.3%', warpPx: '0.5 px', status: 'Optimal Quality' },
    Balanced: { ssim: '0.950', psnr: '38.05 dB', npr: '95.3%', warpPx: '1.0 px', status: 'Balanced Defense' },
    Aggressive: { ssim: '0.935', psnr: '37.02 dB', npr: '93.7%', warpPx: '1.5 px', status: 'Maximum Disruption' },
  };

  const currentStats = presetData[preset];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50 flex flex-col gap-5 relative overflow-hidden">
      {/* Top Header & Preset Selector */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
            Live Engine Simulator
          </span>
        </div>

        {/* Preset Selector Pills */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          {['Light', 'Balanced', 'Aggressive'].map((p) => (
            <button
              key={p}
              onClick={() => setPreset(p)}
              className={`px-3 py-1 rounded-md transition-all ${
                preset === p
                  ? 'bg-slate-900 text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas Viewport */}
      <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 shadow-inner group">
        {/* Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #059669 1px, transparent 1px), linear-gradient(to bottom, #059669 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        {/* Simulated Face Graphic */}
        <svg className="w-48 h-48 relative z-10" viewBox="0 0 200 200" fill="none">
          {/* Head Outline */}
          <ellipse
            cx="100"
            cy="100"
            rx="65"
            ry="80"
            stroke={viewMode === 'ai_view' ? '#ef4444' : '#059669'}
            strokeWidth="2"
            strokeDasharray={viewMode === 'ai_view' ? '4 4' : 'none'}
            className="transition-all duration-300"
          />

          {/* YuNet 5-Point Landmarks */}
          {/* Left Eye */}
          <circle cx="75" cy="85" r="4" fill="#10b981" />
          {/* Right Eye */}
          <circle cx="125" cy="85" r="4" fill="#10b981" />
          {/* Nose Tip */}
          <circle cx="100" cy="110" r="3.5" fill="#10b981" />
          {/* Left Mouth */}
          <circle cx="80" cy="140" r="3.5" fill="#10b981" />
          {/* Right Mouth */}
          <circle cx="120" cy="140" r="3.5" fill="#10b981" />

          {/* Landmark Connection Lines */}
          <polygon points="75,85 125,85 100,110" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          <polygon points="80,140 120,140 100,110" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" fill="none" />

          {/* Disruption Vectors when protected or ai_view */}
          {viewMode !== 'original' && (
            <>
              {/* Displacement Arrows */}
              <line x1="75" y1="85" x2="71" y2="82" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="125" y1="85" x2="129" y2="88" stroke="#ef4444" strokeWidth="2" />
              <line x1="100" y1="110" x2="100" y2="115" stroke="#ef4444" strokeWidth="2" />

              {/* Y-DCT Frequency Scan Ring */}
              <circle cx="100" cy="100" r="50" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" className="animate-spin" style={{ animationDuration: '12s' }} />
            </>
          )}
        </svg>

        {/* Overlay HUD Tags */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2 text-xs font-mono text-white">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>YuNet: 5 Landmarks OK</span>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-2 text-xs font-mono text-emerald-400">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>SSIM: {currentStats.ssim} (Passed)</span>
        </div>
      </div>

      {/* View Mode Toggle Buttons */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
        <button
          onClick={() => setViewMode('original')}
          className={`py-2 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'original'
              ? 'bg-white text-slate-900 shadow-sm font-semibold border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          Original
        </button>

        <button
          onClick={() => setViewMode('protected')}
          className={`py-2 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'protected'
              ? 'bg-white text-emerald-700 shadow-sm font-semibold border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          Varman Protected
        </button>

        <button
          onClick={() => setViewMode('ai_view')}
          className={`py-2 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'ai_view'
              ? 'bg-white text-red-700 shadow-sm font-semibold border border-red-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-red-600" />
          AI Model View
        </button>
      </div>

      {/* Real Metric Gauge Row */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Global SSIM</div>
          <div className="text-sm font-bold font-mono text-slate-900">{currentStats.ssim}</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <div className="text-[10px] font-mono text-slate-500 uppercase">PSNR</div>
          <div className="text-sm font-bold font-mono text-slate-900">{currentStats.psnr}</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Avg Y-NPR</div>
          <div className="text-sm font-bold font-mono text-emerald-600">{currentStats.npr}</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Warp Shift</div>
          <div className="text-sm font-bold font-mono text-slate-900">{currentStats.warpPx}</div>
        </div>
      </div>
    </div>
  );
};

export default HeroDemoCard;
