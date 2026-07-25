import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LiquidEther from '../components/LiquidEther';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCTA = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex-grow flex flex-col relative z-10 w-full min-h-[calc(100vh-64px)] overflow-y-auto bg-[#09090b]">
      {/* Ambient Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-25">
        <LiquidEther
          colors={[ '#00f0ff', '#1e293b', '#7c3aed', '#0284c7' ]}
          mouseForce={30}
          cursorSize={100}
          isViscous={false}
          viscous={25}
          iterationsViscous={15}
          iterationsPoisson={20}
          resolution={0.3}
          isBounce
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.0}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          BFECC={true}
        />
      </div>

      {/* Subtle Hairline Grid Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-4" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full border-b border-white/[0.08]">
        {/* Left Side Info */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Status Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 w-fit backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
            <span className="font-code-snippet text-xs text-on-surface-variant tracking-wider uppercase">
              VARMAN v2.0 · Adversarial Protection Engine
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Protect Your Face From <br />
            <span className="bg-gradient-to-r from-white via-neon-cyan to-secondary bg-clip-text text-transparent">
              Generative AI Cloning
            </span>
          </h1>

          <p className="text-base text-on-surface-variant/90 max-w-xl leading-relaxed font-body">
            Public photos are scraped daily to train AI checkpoints and face-swapping pipelines. 
            Varman injects mathematical noise boundaries into your photos—disrupting 
            synthetic deepfakes at the source while keeping images visually pristine.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button 
              onClick={handleCTA}
              className="bg-neon-cyan text-black font-semibold px-7 py-3.5 rounded-lg hover:bg-neon-cyan/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-[0.98] transition-all text-xs tracking-wider font-code-snippet uppercase flex items-center gap-2 border border-neon-cyan"
            >
              <span className="material-symbols-outlined text-[18px]">shield</span>
              Launch Defense Console
            </button>
            <a 
              href="#threats"
              className="bg-white/[0.03] text-white font-medium px-7 py-3.5 rounded-lg hover:bg-white/[0.08] hover:border-white/20 transition-all text-xs tracking-wider font-code-snippet uppercase border border-white/10 flex items-center gap-2"
            >
              Learn Architecture
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.08] max-w-xl">
            <div className="flex flex-col">
              <span className="font-code-snippet text-white text-xl font-bold tracking-tight">&gt; 98.4%</span>
              <span className="text-[11px] text-on-surface-variant/70 font-code-snippet mt-1">SSIM Quality Index</span>
            </div>
            <div className="flex flex-col border-l border-white/[0.08] pl-4">
              <span className="font-code-snippet text-neon-cyan text-xl font-bold tracking-tight">L∞ Bound</span>
              <span className="text-[11px] text-on-surface-variant/70 font-code-snippet mt-1">Bounded Perturbation</span>
            </div>
            <div className="flex flex-col border-l border-white/[0.08] pl-4">
              <span className="font-code-snippet text-white text-xl font-bold tracking-tight">AES-256</span>
              <span className="text-[11px] text-on-surface-variant/70 font-code-snippet mt-1">Zero-Knowledge Vault</span>
            </div>
          </div>
        </div>

        {/* Right Side Interactive Demo Card */}
        <div className="lg:col-span-5 relative w-full select-none">
          <div className="glass-panel p-5 rounded-xl border border-white/10 bg-surface-container-high/60 backdrop-blur-xl shadow-2xl relative">
            {/* Window Topbar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4 font-code-snippet text-xs text-on-surface-variant/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                <span className="ml-2 text-[11px]">varman_kernel.py</span>
              </div>
              <span className="text-[10px] text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                ACTIVE
              </span>
            </div>

            {/* Preview Image with Simulated Overlay */}
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 mb-4 bg-black/60">
              <img 
                src="/shield_fingerprint.jpg" 
                alt="Adversarial Protection Demo" 
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              
              {/* Simulated Scanning Reticle Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-code-snippet text-neon-cyan bg-black/60 backdrop-blur-sm p-2 rounded border border-neon-cyan/30">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping"></span>
                  Adversarial Perturbation: Active
                </span>
                <span>SSIM: 0.982</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] font-code-snippet text-white/80">
                <span>Surrogates: OpenCLIP + ResNet50</span>
                <span className="text-secondary">Epsilon Clamped (8/255)</span>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="bg-black/70 p-3 rounded border border-white/[0.08] font-code-snippet text-[11px] text-on-surface-variant space-y-1">
              <p className="text-white/60"># Dual-surrogate PGD perturbation step</p>
              <p className="text-neon-cyan">loss = w_clip * loss_clip + w_resnet * loss_resnet</p>
              <p className="text-white/80">delta.data.clamp_(-EPSILON, EPSILON)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Threat Landscape Section */}
      <section id="threats" className="max-w-7xl mx-auto px-6 md:px-12 py-20 w-full border-b border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-neon-cyan uppercase tracking-widest font-code-snippet mb-2 block">
            Security Vectors
          </span>
          <h2 className="text-3xl md:text-4xl text-white font-extrabold tracking-tight">
            Why Standard Photos Are Vulnerable
          </h2>
          <p className="text-sm text-on-surface-variant mt-3 leading-relaxed">
            Every clean facial image uploaded to public platforms serves as training data for modern AI cloning pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-7 rounded-xl border border-white/[0.08] bg-surface-container-high/40 hover:border-white/20 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">gavel</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Deepfake Synthesis & Face-Swapping</h3>
              <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                Adversaries scrape public photos to generate synthetic video footage, compromising personal identity and reputation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-code-snippet text-red-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              High Identity Risk
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-7 rounded-xl border border-white/[0.08] bg-surface-container-high/40 hover:border-white/20 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">no_accounts</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Unauthorized Model Fine-Tuning</h3>
              <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                Generative AI LoRA models can be trained on as few as 5 public photos to replicate your likeness infinitely.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-code-snippet text-amber-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              Biometric Scraping
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-7 rounded-xl border border-white/[0.08] bg-surface-container-high/40 hover:border-white/20 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan mb-5 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">lock_reset</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Varman Zero-Knowledge Defense</h3>
              <p className="text-xs text-on-surface-variant/80 leading-relaxed">
                Disrupts feature extraction at the mathematical level, protecting images with client-side AES-256 encryption.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-code-snippet text-neon-cyan flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
              Mathematical Boundary Shield
            </div>
          </div>
        </div>
      </section>

      {/* Architecture CTA Footer */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 w-full text-center">
        <div className="glass-panel p-10 rounded-2xl border border-white/10 bg-surface-container-high/50 max-w-4xl mx-auto flex flex-col items-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Ready to Protect Your Digital Footprint?
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
            Create your account and deploy adversarial noise protection to your photos in seconds.
          </p>
          <button
            onClick={handleCTA}
            className="bg-neon-cyan text-black font-semibold px-8 py-3.5 rounded-lg hover:bg-neon-cyan/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all text-xs tracking-wider font-code-snippet uppercase border border-neon-cyan"
          >
            Access Varman Console
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
