import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import HeroDemoCard from '../components/HeroDemoCard';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) {
      navigate('/upload');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* Main Content Container */}
      <main className="flex-grow pt-20">
        {/* ── HERO SECTION (2-Column Balanced Grid) ───────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold w-fit tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>VARMAN · PRACTICAL FACE DISRUPTION</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Make your photos <br />
                <span className="text-emerald-600 font-extrabold">
                  annoying & expensive
                </span>{' '}
                to steal.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                There is no permanent 100% magic bullet in AI security. Varman applies{' '}
                <span className="text-emerald-600 font-semibold">micro-geometric warps</span> and{' '}
                <span className="text-emerald-600 font-semibold">Y-channel frequency disruptions</span> to photos 
                before you share them—<span className="text-emerald-600 font-semibold">raising the computational cost</span> for 
                face scrapers and deepfake tools while <span className="text-emerald-600 font-semibold">keeping images visually pristine</span> to human eyes.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleCTA}
                  className="bg-slate-900 text-white hover:bg-slate-800 font-semibold px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 text-sm"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  {user ? 'Go to Protection Console' : 'Start Protecting Photos'}
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <Link
                  to="/spec"
                  className="bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm flex items-center gap-2"
                >
                  View Engine Spec
                </Link>
              </div>

              {/* Verified Technical Proof Chips */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80">
                <div className="flex flex-col">
                  <span className="font-bold text-emerald-600 text-base sm:text-lg">SSIM ≥ 0.90</span>
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Quality Guardrail</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-3">
                  <span className="font-bold text-emerald-600 text-base sm:text-lg">Y-NPR 93–137%</span>
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">JPEG Survival</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 pl-3">
                  <span className="font-bold text-emerald-600 text-base sm:text-lg">&lt; 1 sec</span>
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Pure CPU ONNX</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Engine Simulator */}
            <div className="lg:col-span-5 w-full">
              <HeroDemoCard />
            </div>
          </div>
        </section>

        {/* ── ARCHITECTURE & PIPELINE (Full-Width Grid) ──────────────────── */}
        <section id="architecture" className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  4-Stage Protection Pipeline
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  How Varman Slows Down AI Scraping
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium max-w-sm">
                No black-box mystery. Here is the exact mathematical pipeline executed per image.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                    01
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">YuNet Landmark Detection</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Detects actual <span className="text-emerald-600 font-semibold">5-point facial landmarks</span> (eyes, nose, mouth corners) using lightweight YuNet ONNX with multi-scale fallback.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-slate-500">
                  No Haar Cascades · No Fake Landmarks
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                    02
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">Soft-Masked Micro-Warp</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Applies subtle <span className="text-emerald-600 font-semibold">landmark displacements</span> with Gaussian falloff to confuse facial alignment steps in downstream deepfakes.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-slate-500">
                  Sub-pixel Displacement · Gaussian Falloff
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                    03
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">Y-Channel DCT Perturbation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Injects mid-frequency 8×8 DCT perturbations strictly into the <span className="text-emerald-600 font-semibold">Luminance (Y) channel</span> so perturbations survive JPEG re-encoding.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-slate-500">
                  JPEG Q95-Q60 Resilient · Chroma Preserved
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-4">
                    04
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">Adaptive SSIM Guardrail</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automatically checks <span className="text-emerald-600 font-semibold">Global SSIM</span> and <span className="text-emerald-600 font-semibold">1.2× Expanded Face SSIM</span>, attenuating perturbations if quality drops below target threshold.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-emerald-600">
                  Global SSIM ≥ 0.90 Guaranteed
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPARISON MATRIX SECTION ───────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Honest Reality Check
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-3">
                Why Pixel Noise Fails & Why Varman Works
              </h2>
              <p className="text-slate-600 text-sm font-normal">
                Most anti-AI tools use pixel-level noise ($L_\infty$) that Instagram and WhatsApp strip away instantly. Here is how Varman differs:
              </p>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Legacy Pixel Noise */}
              <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-red-200/60 pb-3">
                  <span className="font-bold text-red-900 text-sm">Traditional Adversarial Noise</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-red-100 text-red-800">
                    Fragile
                  </span>
                </div>

                <ul className="flex flex-col gap-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold text-sm">✕</span>
                    <span>Wiped out instantly by JPEG compression on social media platforms.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold text-sm">✕</span>
                    <span>Requires heavy multi-gigabyte PyTorch/CUDA GPU environments.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold text-sm">✕</span>
                    <span>8+ seconds latency per image execution.</span>
                  </li>
                </ul>
              </div>

              {/* Varman Y-DCT + Landmark Warp */}
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                  <span className="font-bold text-emerald-950 text-sm">Varman Y-DCT & Landmark Disruption</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Resilient
                  </span>
                </div>

                <ul className="flex flex-col gap-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Luminance DCT perturbations <span className="text-emerald-600 font-bold">survive JPEG Q95–Q60 compression</span> (Y-NPR 93–137%).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Pure <span className="text-emerald-600 font-bold">CPU execution</span> via ONNX Runtime without GPU dependencies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Sub-second execution with enforced <span className="text-emerald-600 font-bold">SSIM ≥ 0.90 guardrail</span>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── REALISTIC FRAMING BANNER ───────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Practical AI Defense</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-4 text-white">
                "We don't promise <span className="text-emerald-400 font-extrabold">magic</span>. We build <span className="text-emerald-400 font-extrabold">friction</span>."
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Security is about raising the effort required to breach a target. By making your photos mathematically noisy for AI models, scrapers incur higher failure rates and alignment errors.
              </p>
            </div>
            <button
              onClick={handleCTA}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/20 text-sm whitespace-nowrap"
            >
              Protect an Image Now
            </button>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>VARMAN · Practical Anti-Scraping Image Protection</div>
          <div>CPU ONNX Engine · Open Source Architecture</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
