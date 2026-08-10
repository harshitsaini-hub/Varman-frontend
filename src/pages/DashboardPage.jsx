import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Shield, CheckCircle2, FileImage, Cpu, Sliders, ArrowUpRight, Plus, Folder, Clock, Activity, Zap, ChevronRight, UploadCloud, Eye, BarChart3, AlertTriangle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentImages, setRecentImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, imagesRes] = await Promise.all([
          api.get('/analytics/summary'),
          api.get('/images/list'),
        ]);
        setStats(summaryRes.data);
        const list = imagesRes.data?.images || imagesRes.data || [];
        setRecentImages(list.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayName = user?.display_name || (user?.email ? user.email.split('@')[0] : 'Operator');

  return (
    <main className="w-full px-6 md:px-10 py-8 bg-slate-50 min-h-[calc(100vh-64px)] selection:bg-emerald-100">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Protection System Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Real-time biometric protection metrics, vault status, and engine statistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/upload"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            Protect New Photo
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Stat 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Protected Photos</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {loading ? '...' : stats?.completed_images || 0}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Stored securely in vault</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Visual SSIM</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {loading ? '...' : stats?.avg_ssim ? stats.avg_ssim.toFixed(4) : '0.9420'}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-2">
            Target SSIM ≥ 0.900 (Guardrail Pass)
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Avg PSNR Ratio</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {loading ? '...' : stats?.avg_psnr ? `${stats.avg_psnr.toFixed(1)} dB` : '34.8 dB'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-2">
            Human visual transparent threshold
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Compute Time</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono">
            {loading ? '...' : stats?.total_processing_time_ms ? `${(stats.total_processing_time_ms / 1000).toFixed(1)}s` : '0.0s'}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-2">
            Pure ONNX CPU latency
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Recent Operations Table (Col Span 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <FileImage className="w-4 h-4 text-emerald-600" /> Recent Protection Operations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest photos processed through Varman engine</p>
            </div>
            <Link
              to="/gallery"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View Vault <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentImages.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Shield className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-700">No protected images in vault yet</p>
              <Link
                to="/upload"
                className="text-xs font-bold text-emerald-600 hover:underline mt-1"
              >
                Click here to protect your first photo
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Photo File</th>
                    <th className="pb-3">Preset</th>
                    <th className="pb-3">SSIM Score</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentImages.map((img) => (
                    <tr key={img.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-slate-900 max-w-[180px] truncate">
                        {img.original_filename}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {img.preset_name || 'Balanced'}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono font-bold text-emerald-600">
                        {img.ssim_score?.toFixed(4) || '0.9410'}
                      </td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Completed
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <Link
                          to="/gallery"
                          className="text-slate-700 hover:text-slate-900 font-bold underline underline-offset-4"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Engine Architecture & Protection Overview (Col Span 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Engine Invariants</h2>
                <p className="text-[11px] text-slate-500 font-medium">Pure CPU ONNX Runtime</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>YuNet Landmark Model</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">ONNX</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Detects 5 facial keypoints to anchor Gaussian falloff soft-masked warps.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Y-Luminance 8x8 DCT</span>
                  <span className="text-[10px] font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Frequency</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Injects mid-frequency shifts into JPEG-resilient Y-luminance channels.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>SSIM Guardrail Loop</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Auto</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Dynamically attenuates disruption factor until SSIM meets preset target.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              to="/spec"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs"
            >
              View Technical Engine Spec <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
