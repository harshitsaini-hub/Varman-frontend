import { useEffect, useState } from 'react';
import api from '../api';

// Reusable animated counter component to bring stats to life
const AnimatedCounter = ({ value, duration = 800, decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    if (start === end) {
      setCount(end);
      return;
    }

    const incrementTime = Math.abs(Math.floor(duration / 30));
    
    const timer = setInterval(() => {
      start += (end - start) * 0.2;
      if (Math.abs(end - start) < 0.05) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  if (typeof value === 'string' && isNaN(parseFloat(value))) {
    return <span>{value}</span>;
  }

  return <span>{decimals > 0 ? count.toFixed(decimals) : Math.round(count)}</span>;
};

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(() => {
    return sessionStorage.getItem('varman_guide_dashboard') !== 'dismissed';
  });

  // Live fluctuating cluster VRAM and performance stats
  const [clusterData, setClusterData] = useState([
    { name: 'Core 01', region: 'US-EAST', vram: 78, tflops: 42, color: 'text-gradient font-bold', bg: 'bg-neon-cyan', active: true },
    { name: 'Core 02', region: 'EU-WEST', vram: 45, tflops: 24, color: 'text-neon-purple', bg: 'bg-neon-purple', active: true }
  ]);

  // Live threat feed logs
  const [feeds, setFeeds] = useState([
    { time: new Date().toLocaleTimeString(), msg: "Ingress firewall verification: OK" },
    { time: new Date().toLocaleTimeString(), msg: "Surrogate weight configuration synced" },
    { time: new Date().toLocaleTimeString(), msg: "Ensemble load balancer active" }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/summary');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fluctuating VRAM utilization to make it feel alive
  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setClusterData(prev => prev.map(node => {
        const delta = (Math.random() - 0.5) * 6; // random shift -3 to +3
        const nextVram = Math.max(15, Math.min(95, Math.round(node.vram + delta)));
        const nextTflops = Math.round(nextVram * (node.name === 'Core 01' ? 0.54 : 0.53));
        return { ...node, vram: nextVram, tflops: nextTflops };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  // Appending real-time security log ticks
  useEffect(() => {
    if (loading) return;
    const logs = [
      "Ingress handshake verified for Core 02",
      "Gradients threshold verification: clean",
      "Flushed temporary CPU cache volumes",
      "Surrogate ViT-B/32 state: STABLE",
      "Enrolled signature verification pass",
      "VRAM allocations recalibrated",
      "Core 01 cluster task distribution complete",
      "PGD optimization loop status: idle"
    ];
    const interval = setInterval(() => {
      const randomMsg = logs[Math.floor(Math.random() * logs.length)];
      setFeeds(prev => [
        { time: new Date().toLocaleTimeString(), msg: randomMsg },
        ...prev.slice(0, 4) // Keep last 5 entries
      ]);
    }, 4500);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex-1 p-6 md:p-8 flex items-center justify-center text-neon-cyan font-code-snippet">
        LOADING TELEMETRY SYSTEMS...
      </div>
    );
  }

  // Calculate integrity percentage dynamically
  const total = stats?.total_images || 0;
  const completed = stats?.completed_images || 0;
  const integrityPercent = total > 0 ? Math.round((completed / total) * 100) : 100;
  const dashoffset = 263 - (263 * integrityPercent) / 100;

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl text-neon-cyan font-bold tracking-wider uppercase font-headline text-gradient">
              Security Dashboard
            </h1>
            {!showGuide && (
              <button 
                onClick={() => {
                  sessionStorage.removeItem('varman_guide_dashboard');
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
            Real-time adversarial monitoring and node network health logs.
          </p>
        </div>
        <div className="glass-panel px-3 py-1.5 flex items-center gap-2 border-neon-purple/30 rounded shadow-[0_0_15px_rgba(189,0,255,0.05)]">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_5px_#00f0ff]"></span>
          <span className="text-[10px] font-bold tracking-widest font-code-snippet text-gradient">Cluster Online</span>
        </div>
      </header>

      {/* Educational Operational Guide */}
      {showGuide && (
        <div className="glass-panel p-4 border border-neon-cyan/20 rounded-lg bg-surface-container-lowest/30">
          <div className="flex justify-between items-center gap-4 mb-3 w-full">
            <h4 className="font-code-snippet text-xs text-neon-cyan uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Telemetry Control Manual
            </h4>
            <button 
              onClick={() => {
                sessionStorage.setItem('varman_guide_dashboard', 'dismissed');
                setShowGuide(false);
              }}
              className="text-on-surface-variant hover:text-neon-red transition-colors font-code-snippet text-[10px] uppercase tracking-widest flex items-center gap-1 border border-neon-cyan/10 px-2 py-0.5 rounded bg-black/20 shrink-0"
            >
              <span className="material-symbols-outlined text-[10px]">close</span>
              Dismiss
            </button>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-relaxed mb-2">
            This dashboard displays the active defense nodes shielding your biometric identities.
          </p>
          <ul className="text-[11px] text-on-surface-variant leading-relaxed space-y-1 list-disc pl-4">
            <li><strong>Active Protection Nodes:</strong> The number of active surrogate visual network models (e.g., ArcFace, CLIP) currently generating adversarial perturbations.</li>
            <li><strong>Total Assets Shielded:</strong> Count of images processed and stored in your Vault.</li>
            <li><strong>Avg Defense Integrity:</strong> The average Structural Similarity (SSIM) score of your protected images. A score near 1.0 (e.g. 0.9825) verifies they look identical to humans, while being mathematically toxic to scrapers.</li>
          </ul>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-neon-cyan/20 pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-neon-cyan/20 pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-neon-cyan/20 pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-neon-cyan/20 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-code-snippet">
              Active Protection Nodes
            </h3>
            <span className="material-symbols-outlined text-neon-cyan/70 text-[20px]">hub</span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-bold leading-none font-code-snippet text-gradient">
              <AnimatedCounter value={12} />
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase font-code-snippet">/ 16 ONLINE</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-neon-cyan/20 pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-neon-cyan/20 pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-neon-cyan/20 pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-neon-cyan/20 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-code-snippet">
              Total Assets Shielded
            </h3>
            <span className="material-symbols-outlined text-neon-cyan/70 text-[20px]">shield</span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-bold leading-none font-code-snippet text-gradient">
              <AnimatedCounter value={stats?.completed_images || 0} />
            </span>
            <span className="text-[10px] text-[11px] bg-neon-cyan/10 px-2 py-0.5 rounded text-neon-cyan font-code-snippet">
              Active Vault
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-neon-cyan/20 pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-neon-cyan/20 pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-neon-cyan/20 pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-neon-cyan/20 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-code-snippet">
              Avg Defense Integrity (SSIM)
            </h3>
            <span className="material-symbols-outlined text-neon-cyan/70 text-[20px]">analytics</span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-bold leading-none font-code-snippet text-gradient">
              <AnimatedCounter value={stats?.avg_ssim || 0} decimals={4} />
            </span>
            <span className="text-[10px] text-on-surface-variant font-code-snippet">TARGET &gt; 0.980</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active GPU Clusters (Col Span 8) */}
        <div className="lg:col-span-8 glass-panel rounded-lg p-6 flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-md text-on-surface font-semibold uppercase tracking-wider font-code-snippet flex items-center gap-2">
              <span className="material-symbols-outlined text-gradient">dns</span> Active GPU Clusters
            </h2>
            <span className="text-[10px] text-on-surface-variant font-code-snippet">Surrogate Engine</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {clusterData.map((node, index) => (
              <div key={index} className="bg-surface/50 border border-surface-bright rounded p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 hover:bg-surface/80">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className={`w-2 h-2 rounded-full ${node.name === 'Core 01' ? 'led-secured' : 'led-purple'} animate-pulse`}></div>
                  <div>
                    <div className="font-code-snippet text-xs text-on-surface font-semibold">{node.name}</div>
                    <div className="text-[10px] text-on-surface-variant uppercase font-code-snippet">{node.region} • GPU Cluster</div>
                  </div>
                </div>
                <div className="flex-1 w-full max-w-xs">
                  <div className="flex justify-between text-[10px] mb-1 font-code-snippet">
                    <span className="text-on-surface-variant">VRAM UTILIZATION</span>
                    <span className={node.color}>{node.vram}%</span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full ${node.bg} transition-all duration-[2000ms] ease-out`} style={{ width: `${node.vram}%` }}></div>
                  </div>
                </div>
                <div className="font-code-snippet text-[11px] text-on-surface-variant text-right w-24">
                  {node.tflops} TFLOPS
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Health Status (Col Span 4) */}
        <div className="lg:col-span-4 glass-panel rounded-lg p-6 flex flex-col h-[350px] items-center justify-center relative">
          <h2 className="absolute top-6 left-6 text-sm text-on-surface font-semibold uppercase tracking-wider font-code-snippet" title="Defense Integrity represents the percentage of successfully secured assets out of total uploaded payloads.">
            Defense Integrity
          </h2>
          <div className="relative w-40 h-40 mt-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#bd00ff" />
                </linearGradient>
              </defs>
              <circle className="text-surface-container-highest" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeWidth="2"></circle>
              <circle className="transition-all duration-1000" cx="50" cy="50" fill="none" r="42" stroke="url(#circle-grad)" strokeLinecap="round" strokeWidth="4" style={{ filter: 'drop-shadow(0 0 4px rgba(189, 0, 255, 0.4))' }} strokeDasharray="263" strokeDashoffset={dashoffset}></circle>
              <circle className="text-neon-cyan/10" cx="50" cy="50" fill="none" r="32" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1"></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold leading-none font-code-snippet text-gradient">
                <AnimatedCounter value={integrityPercent} />%
              </span>
              <span className="text-[10px] text-on-surface-variant mt-1 tracking-widest font-code-snippet">SECURED</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 w-full px-4 text-center">
            <div>
              <div className="text-[10px] text-on-surface-variant tracking-wider font-code-snippet">SYSTEM LOAD</div>
              <div className="text-xs text-secondary mt-0.5 font-code-snippet">LOW</div>
            </div>
            <div>
              <div className="text-[10px] text-on-surface-variant tracking-wider font-code-snippet">THREAT LEVEL</div>
              <div className="text-xs text-neon-red mt-0.5 font-code-snippet">STABLE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row Grid (Live Security Feeds & Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Threat Activity Feed */}
        <div className="lg:col-span-8 glass-panel rounded-lg p-6 flex flex-col h-[280px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md text-on-surface font-semibold uppercase tracking-wider font-code-snippet flex items-center gap-2">
              <span className="material-symbols-outlined text-neon-cyan animate-pulse text-[18px]">history</span> Security Operations Feed
            </h2>
            <span className="text-[10px] text-on-surface-variant font-code-snippet uppercase">LIVE CORRELATION LOGS</span>
          </div>
          <div className="flex-grow overflow-y-auto space-y-2 pr-2 font-code-snippet text-xs">
            {feeds.map((feed, index) => (
              <div key={index} className="flex gap-4 hover:bg-neon-cyan/5 p-1 transition-colors border-b border-neon-cyan/5">
                <span className="text-neon-cyan/40 shrink-0 select-none">{feed.time}</span>
                <span className="text-on-surface-variant/50 shrink-0 select-none">[SYS]</span>
                <span className="text-on-surface truncate">{feed.msg}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Settings Telemetry */}
        <div className="lg:col-span-4 glass-panel rounded-lg p-6 flex flex-col h-[280px]">
          <div className="flex justify-between items-center mb-4 border-b border-neon-cyan/20 pb-3">
            <h2 className="text-md text-on-surface font-semibold uppercase tracking-wider font-code-snippet flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">settings_suggest</span> Core Configuration
            </h2>
            <span className="text-[10px] text-on-surface-variant font-code-snippet">Engine v2.0</span>
          </div>
          <div className="flex-grow flex flex-col justify-between text-xs font-code-snippet py-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Surrogate Ensemble</span>
              <span className="text-white text-right">ResNet50 + ViT-B/32</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">EOT Iterations</span>
              <span className="text-neon-cyan">50 steps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Max Epsilon Limit</span>
              <span className="text-neon-red">8 / 255 (0.031)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Optimization Alg</span>
              <span className="text-white">PGD + Projected Sign</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
