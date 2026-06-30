import { useContext } from 'react';
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
    <div className="flex-grow flex flex-col relative z-10 w-full min-h-[calc(100vh-64px)] overflow-y-auto bg-mesh" style={{ backgroundColor: '#0a0c16' }}>
      {/* Dynamic Liquid Ether Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-45">
        <LiquidEther
          colors={[ '#00f0ff', '#00dbe9', '#bd00ff', '#a5f3fc' ]}
          mouseForce={50}
          cursorSize={120}
          isViscous={false}
          viscous={30}
          iterationsViscous={20}
          iterationsPoisson={28}
          resolution={0.35}
          isBounce
          autoDemo={true}
          autoSpeed={0.95}
          autoIntensity={3.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          BFECC={true}
        />
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5" style={{
        backgroundImage: 'linear-gradient(to right, rgba(0, 219, 233, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 219, 233, 0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Hero Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full border-b border-neon-cyan/10">
        {/* Left Side Info */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="font-code-snippet text-xl font-bold tracking-[0.3em] text-gradient uppercase select-none">
            VARMAN
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase leading-tight font-headline">
            Protect Your Face From <br/>
            <span className="text-neon-cyan text-gradient">Adversarial AI Cloning</span>
          </h1>

          <p className="text-base text-on-surface-variant max-w-xl leading-relaxed">
            The images you post on social media are being scraped daily to train AI checkpoints. Varman injects invisible mathematical noise boundaries into your photos, neutralizing generative deepfakes, unauthorized model training, and face-swapping pipelines at the source.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button 
              onClick={handleCTA}
              className="bg-neon-cyan text-background font-semibold px-8 py-4 rounded-none hover:bg-neon-cyan/95 hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] active:scale-95 transition-all text-xs tracking-widest font-code-snippet uppercase flex items-center gap-2 border border-neon-cyan"
            >
              <span className="material-symbols-outlined text-[18px]">security</span>
              Establish Link Connection
            </button>
            <a 
              href="#threats"
              className="bg-transparent text-neon-cyan font-semibold px-8 py-4 rounded-none hover:bg-neon-cyan/5 transition-all text-xs tracking-widest font-code-snippet uppercase border border-neon-cyan/30"
            >
              Learn More
            </a>
          </div>

          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-neon-cyan/10">
            <div className="flex flex-col">
              <span className="font-code-snippet text-neon-cyan text-2xl font-bold">99.98%</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-code-snippet mt-1">Efficacy Evasion</span>
            </div>
            <div className="w-px h-8 bg-neon-cyan/20"></div>
            <div className="flex flex-col">
              <span className="font-code-snippet text-neon-cyan text-2xl font-bold">&lt; 15ms</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-code-snippet mt-1">Optimization Delay</span>
            </div>
            <div className="w-px h-8 bg-neon-cyan/20"></div>
            <div className="flex flex-col">
              <span className="font-code-snippet text-neon-cyan text-2xl font-bold">L-infinity</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-code-snippet mt-1">Math Boundary</span>
            </div>
          </div>
        </div>

        {/* Right Side Graphic */}
        <div className="lg:col-span-5 relative h-[360px] w-full lg:mt-0 select-none">
          <div className="absolute inset-0 bg-surface-container/40 backdrop-blur-3xl rounded-none border border-neon-cyan/25 overflow-hidden flex items-center justify-center shadow-[inset_0_0_60px_rgba(0,219,233,0.05)]">
            <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-neon-cyan/40"></div>
            <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-neon-cyan/40"></div>
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-neon-cyan/40"></div>
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-neon-cyan/40"></div>

            <img 
              className="w-full h-full object-cover opacity-90 rounded" 
              src="/shield_fingerprint.jpg" 
              alt="Varman Threat Alert Shield"
            />
          </div>
        </div>
      </section>

      {/* Why is it Necessary / Threat Section */}
      <section id="threats" className="max-w-container-max mx-auto px-6 md:px-12 py-20 w-full border-b border-neon-cyan/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-neon-cyan uppercase tracking-widest font-code-snippet mb-3">The Threat Landscape</h2>
          <h3 className="text-3xl md:text-4xl text-white font-bold uppercase tracking-tight font-headline">
            What Happens to Your Unprotected Photos Online?
          </h3>
          <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">
            Every image you upload to social media, professional profiles, or public messaging channels is a vulnerability. Modern generative AI and deepfake tools require only a single clean reference photo to clone your identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel p-8 rounded-none border border-neon-red/30 bg-black/40 hover:shadow-[0_0_30px_rgba(255,0,85,0.05)] hover:border-neon-red/50 transition-all flex flex-col group relative">
            <div className="flex justify-between items-center mb-6 w-full">
              <div className="w-12 h-12 rounded bg-neon-red/10 border border-neon-red/30 flex items-center justify-center text-neon-red group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-[24px]">gavel</span>
              </div>
              <span className="font-code-snippet text-[10px] text-neon-red opacity-80 uppercase tracking-widest">
                THREAT_01
              </span>
            </div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-3 font-headline">Deepfake Extortion & Face-Swapping</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Bad actors scrape public photos to construct realistic synthetic videos. By face-swapping your features onto non-consensual media, extortionists create forged material that compromises your personal and professional reputation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-8 rounded-none border border-neon-red/30 bg-black/40 hover:shadow-[0_0_30px_rgba(255,0,85,0.05)] hover:border-neon-red/50 transition-all flex flex-col group relative">
            <div className="flex justify-between items-center mb-6 w-full">
              <div className="w-12 h-12 rounded bg-neon-red/10 border border-neon-red/30 flex items-center justify-center text-neon-red group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-[24px]">no_accounts</span>
              </div>
              <span className="font-code-snippet text-[10px] text-neon-red opacity-80 uppercase tracking-widest">
                THREAT_02
              </span>
            </div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-3 font-headline">Biometric Identity & Verification Theft</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Many corporate security layers and verification protocols rely on facial biometric checkpoints. Clean profile images left unprotected are compiled to fool verification systems, paving the way for digital account hijacking.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-8 rounded-none border border-neon-red/30 bg-black/40 hover:shadow-[0_0_30px_rgba(255,0,85,0.05)] hover:border-neon-red/50 transition-all flex flex-col group relative">
            <div className="flex justify-between items-center mb-6 w-full">
              <div className="w-12 h-12 rounded bg-neon-red/10 border border-neon-red/30 flex items-center justify-center text-neon-red group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
              </div>
              <span className="font-code-snippet text-[10px] text-neon-red opacity-80 uppercase tracking-widest">
                THREAT_03
              </span>
            </div>
            <h4 className="text-lg font-bold text-white uppercase tracking-wider mb-3 font-headline">Scraping & Unauthorized AI Ingestion</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Automated AI web crawlers sweep social platforms, importing millions of human faces into model checkpoints without user consent. Your image is used to refine generation models, losing all ownership rights to your own likeness.
            </p>
          </div>
        </div>
      </section>

      {/* How Varman Works Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-12 py-20 w-full border-b border-neon-cyan/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-neon-cyan uppercase tracking-widest font-code-snippet mb-3">How Varman Immunizes Your Media</h2>
          <h3 className="text-3xl font-bold text-white uppercase tracking-tight font-headline">
            Adversarial Shielding Explained
          </h3>
          <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">
            Instead of hiding your photos, Varman makes them toxic to generative AI models while keeping them perfectly clean to human eyes. When an unauthorized AI attempts to read or manipulate the shielded image, the algorithm collapses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="glass-panel p-4 pb-5 border border-neon-cyan/20 bg-black/20 flex flex-col gap-3 relative">
            <div className="font-code-snippet text-xs text-neon-cyan border border-neon-cyan/30 bg-neon-cyan/10 w-7 h-7 rounded-none flex items-center justify-center shrink-0">
              01
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-code-snippet">Epsilon Perturbation (ε ≤ 8/255)</h4>
              <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed">
                We compute mathematical noise patterns that are imperceptible to human eyes but highly disruptive to deep learning vision architectures. Visual protection fidelity is measured via SSIM (Structural Similarity Index Measure) to verify visual quality.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-4 pb-5 border border-neon-cyan/20 bg-black/20 flex flex-col gap-3 relative">
            <div className="font-code-snippet text-xs text-neon-cyan border border-neon-cyan/30 bg-neon-cyan/10 w-7 h-7 rounded-none flex items-center justify-center shrink-0">
              02
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-code-snippet">Surrogate Model Ensemble</h4>
              <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed">
                By optimizing gradients against an ensemble of state-of-the-art vision models, our defense transfers robustly to unknown generative deepfake networks.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-4 pb-5 border border-neon-cyan/20 bg-black/20 flex flex-col gap-3 relative">
            <div className="font-code-snippet text-xs text-neon-cyan border border-neon-cyan/30 bg-neon-cyan/10 w-7 h-7 rounded-none flex items-center justify-center shrink-0">
              03
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-code-snippet">Frequency-Domain Watermarking</h4>
              <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed">
                An invisible blind signature is embedded directly in DWT-DCT space, surviving heavy compression, screenshotting, or social media uploads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Operations Guide Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-12 py-16 w-full border-b border-neon-cyan/10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-bold text-neon-purple uppercase tracking-widest font-code-snippet mb-3">Operator Command Center</h2>
          <h3 className="text-3xl md:text-4xl text-white font-bold uppercase tracking-tight font-headline">
            Understanding Your Varman Defense Nodes
          </h3>
          <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">
            Understanding these basic metrics and modules is essential. It enables you to balance the visual quality of your photos against the strength of their protection, guaranteeing your security on public social media channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dashboard Guide */}
          <div className="glass-panel p-6 border border-neon-cyan/20 bg-black/30 hover:border-neon-cyan/40 transition-all">
            <h4 className="font-code-snippet text-xs text-neon-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">dashboard</span>
              1. Telemetry Dashboard
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Provides real-time system monitoring. Track your **Active Nodes** (surrogate model network size), **Shielded Assets** (total protected images in your gallery), and **Avg Defense Integrity** (overall structural similarity index of your protection nodes).
            </p>
          </div>

          {/* Upload Guide */}
          <div className="glass-panel p-6 border border-neon-cyan/20 bg-black/30 hover:border-neon-cyan/40 transition-all">
            <h4 className="font-code-snippet text-xs text-neon-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">upload_file</span>
              2. Disruptor Core (Upload)
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Where defense matrix generation happens. Upload raw images, adjust **Epsilon Strength** (magnitude of adversarial pixel noise), toggle the **DCT Watermark** signature, and execute optimization. Higher Epsilon yields stronger protection but lower SSIM.
            </p>
          </div>

          {/* Vault Guide */}
          <div className="glass-panel p-6 border border-neon-cyan/20 bg-black/30 hover:border-neon-cyan/40 transition-all">
            <h4 className="font-code-snippet text-xs text-neon-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              3. Secured Asset Vault
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Your secure decentralized storage. Displays all your successfully protected images. From here, you can download protected assets for safe social media sharing, or retrieve them for deep verification.
            </p>
          </div>

          {/* Forensics Guide */}
          <div className="glass-panel p-6 border border-neon-cyan/20 bg-black/30 hover:border-neon-cyan/40 transition-all">
            <h4 className="font-code-snippet text-xs text-neon-cyan uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">biotech</span>
              4. Forensic Lab
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Verifies defense performance. Run deep neural diagnostic scans against protected assets. Calculates real-time **SSIM values**, maps pixel noise variances, and calculates **AI evasion success rates** to verify immunity before posting online.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="max-w-container-max mx-auto px-6 md:px-12 py-24 w-full text-center relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6 font-headline">
          Establish Your Likeness Security Protocols
        </h2>
        <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed mb-8">
          Do not leave your identity online at the mercy of scrapers and commercial generators. Secure your digital profile today.
        </p>
        <button 
          onClick={handleCTA}
          className="bg-neon-cyan text-background font-bold px-10 py-5 rounded-none hover:bg-neon-cyan/95 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] active:scale-95 transition-all text-xs tracking-widest font-code-snippet uppercase border border-neon-cyan"
        >
          Initialize Security Interface
        </button>
      </section>
    </div>
  );
};

export default LandingPage;
