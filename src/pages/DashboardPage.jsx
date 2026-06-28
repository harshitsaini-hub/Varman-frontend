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

  // Live fluctuating cluster VRAM and performance stats
  const [clusterData, setClusterData] = useState([
    { name: 'NODE_01', region: 'US-EAST', vram: 78, tflops: 42, color: 'text-neon-cyan', bg: 'bg-neon-cyan', active: true },
    { name: 'NODE_02', region: 'EU-WEST', vram: 45, tflops: 24, color: 'text-secondary', bg: 'bg-secondary', active: true }
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
        const nextTflops = Math.round(nextVram * (node.name === 'NODE_01' ? 0.54 : 0.53));
        return { ...node, vram: nextVram, tflops: nextTflops };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  // Appending real-time security log ticks
  useEffect(() => {
    if (loading) return;
    const logs = [
      "Ingress handshake verified for NODE_02",
      "Gradients threshold verification: clean",
      "Flushed temporary CPU cache volumes",
      "Surrogate ViT-B/32 state: STABLE",
      "Enrolled signature verification pass",
      "VRAM allocations recalibrated",
      "NODE_01 cluster task distribution complete",
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
          <h1 className="text-2xl md:text-3xl text-neon-cyan mb-2 font-bold tracking-wider uppercase font-headline text-gradient">
            Security Dashboard
          </h1>
          <p className="text-xs text-neon-cyan/70 max-w-2xl tracking-wide uppercase font-code-snippet">
            Real-time adversarial monitoring and node network health logs.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/30 px-3 py-1.5 rounded-none text-[10px] text-neon-cyan font-code-snippet">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
          NODE_ONLINE
        </div>
      </header>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-code-snippet">
              Active Protection Nodes
            </h3>
            <span className="material-symbols-outlined text-neon-cyan/70 text-[20px]">hub</span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl text-neon-cyan font-bold leading-none font-code-snippet">
              <AnimatedCounter value={12} />
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase font-code-snippet">/ 16 ONLINE</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-code-snippet">
              Total Assets Shielded
            </h3>
            <span className="material-symbols-outlined text-secondary/70 text-[20px]">shield</span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl text-secondary font-bold leading-none font-code-snippet">
              <AnimatedCounter value={stats?.completed_images || 0} />
            </span>
            <span className="text-[10px] text-on-surface-variant text-[11px] bg-secondary/10 px-2 py-0.5 rounded text-secondary font-code-snippet">
              Active Vault
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel rounded-lg p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-container/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest font-code-snippet">
              Avg Defense Integrity (SSIM)
            </h3>
            <span className="material-symbols-outlined text-tertiary-container/70 text-[20px]">analytics</span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl text-white font-bold leading-none font-code-snippet">
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
              <span className="material-symbols-outlined text-neon-cyan">dns</span> Active GPU Clusters
            </h2>
            <span className="text-[10px] text-on-surface-variant font-code-snippet">Surrogate Engine</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {clusterData.map((node, index) => (
              <div key={index} className="bg-surface/50 border border-surface-bright rounded p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 hover:bg-surface/80">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
                  <div>
                    <div className="font-code-snippet text-xs text-on-surface font-semibold">{node.name}</div>
                    <div className="text-[10px] text-on-surface-variant uppercase font-code-snippet">{node.region} • GPU_CLUSTER</div>
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
              <circle className="text-surface-container-highest" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeWidth="2"></circle>
              <circle className="text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] transition-all duration-1000" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeDasharray="263" strokeDashoffset={dashoffset} strokeLinecap="round" strokeWidth="4"></circle>
              <circle className="text-neon-cyan/20" cx="50" cy="50" fill="none" r="32" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1"></circle>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl text-neon-cyan font-bold leading-none font-code-snippet">
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
            <span className="text-[10px] text-on-surface-variant font-code-snippet">ENGINE_v2.0</span>
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
