import React, { useEffect, useState } from 'react';
import { Activity, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';
import api from '../api';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/analytics/summary');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="main-content flex items-center justify-center">Loading Telemetry...</div>;
  }

  return (
    <div className="main-content">
      <h2 className="mb-12">Defense Telemetry</h2>
      
      <div className="flex gap-8 mb-12" style={{ flexWrap: 'wrap' }}>
        
        <div className="glass-panel flex-1" style={{ minWidth: '200px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Protected Assets</h3>
            <ImageIcon size={20} color="var(--accent-cyan)" />
          </div>
          <p className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>
            {stats?.completed_images || 0}
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Total images shielded</p>
        </div>

        <div className="glass-panel flex-1" style={{ minWidth: '200px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Average SSIM</h3>
            <CheckCircle size={20} color="var(--success)" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            {stats?.avg_ssim ? stats.avg_ssim.toFixed(3) : '0.000'}
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Structural Similarity Index</p>
        </div>

        <div className="glass-panel flex-1" style={{ minWidth: '200px' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Processing Time</h3>
            <Clock size={20} color="var(--accent-violet)" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            {stats?.total_processing_time_ms ? (stats.total_processing_time_ms / 1000).toFixed(1) : 0}s
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Total CPU/GPU time expended</p>
        </div>

      </div>

      <div className="glass-panel">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={20} color="var(--accent-cyan)" />
          <h3 style={{ margin: 0 }}>System Health</h3>
        </div>
        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <p className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span>Active Threads (VRAM Queue)</span>
            <span className="badge badge-processing">1</span>
          </p>
          <p className="flex justify-between" style={{ marginBottom: '8px' }}>
            <span>Target Surrogate Ensemble</span>
            <span style={{ color: 'var(--text-main)' }}>ResNet50 + CLIP ViT-B/32</span>
          </p>
          <p className="flex justify-between" style={{ margin: 0 }}>
            <span>Expectation over Transformation</span>
            <span style={{ color: 'var(--text-main)' }}>50 Iterations</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
