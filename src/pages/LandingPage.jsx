import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow pt-24 pb-16">
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-16">
          <div className="max-w-3xl">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              VARMAN 2.0 · PRACTICAL FACE DISRUPTION
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Make your photos <br />
              <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy underline-offset-8">
                annoying and expensive
              </span>{' '}
              to steal.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl font-normal">
              There is no permanent 100% magic bullet in AI safety—this is an asymmetric arms race. 
              Varman applies targeted micro-geometric warps and Y-channel frequency disruptions to your photos 
              before you post them online. It raises the computational cost for face scrapers and deepfake tools 
              while keeping images visually pristine to human eyes.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button
                onClick={handleCTA}
                className="bg-slate-900 text-white hover:bg-slate-800 font-semibold px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">shield</span>
                {user ? 'Protect an Image' : 'Start Protecting Photos'}
              </button>
              <a
                href="#how-it-works"
                className="bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                How It Works
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </a>
            </div>

            {/* Honest Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold font-mono text-slate-900 mb-1">SSIM ≥ 0.90</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Visual Fidelity</div>
                <div className="text-xs text-slate-600">Guaranteed quality guardrail keeps your photos looking natural.</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold font-mono text-slate-900 mb-1">Y-Channel DCT</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">JPEG Resilience</div>
                <div className="text-xs text-slate-600">Survives compression on social platforms like Instagram & WhatsApp.</div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="text-2xl font-bold font-mono text-slate-900 mb-1">&lt; 1 sec</div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pure CPU Pipeline</div>
                <div className="text-xs text-slate-600">Fast ONNX face warping without requiring heavy GPU setups.</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                How Varman Slows Down AI Theft
              </h2>
              <p className="text-slate-600 text-sm">
                Instead of making impossible claims, Varman uses a 4-step practical protection engine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm mb-4">
                  01
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">YuNet Landmark Detection</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Identifies 5-point facial landmark coordinates (eyes, nose, mouth) using lightweight YuNet ONNX.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm mb-4">
                  02
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">Soft-Masked Micro-Warp</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Applies subtle sub-pixel landmark displacements with Gaussian falloff to confuse facial alignment steps in face-swappers.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm mb-4">
                  03
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">Y-Channel DCT Shift</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Injects mid-frequency DCT perturbations into the luminance channel so perturbations survive JPEG re-encoding.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm mb-4">
                  04
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">Adaptive SSIM Guardrail</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatically measures Global SSIM and 1.2× Face SSIM to ensure your image never looks distorted to humans.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Realistic Framing Banner */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">The Reality of AI Protection</span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-4 text-white">
                "We don't promise magic. We build friction."
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Security is about raising the effort required to breach a target. By making your photos mathematically noisy for AI models, scrapers incur higher failure rates and alignment errors.
              </p>
            </div>
            <button
              onClick={handleCTA}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              Protect Your First Photo
            </button>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>VARMAN 2.0 · Practical Anti-Scraping Image Protection</div>
          <div>CPU ONNX Engine · Open Source Architecture</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
