import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
    <div className="flex-1 flex flex-col relative z-10 w-full min-h-[calc(100vh-64px)] overflow-y-auto" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0, 219, 233, 0.05) 0%, rgba(17, 19, 29, 1) 100%)' }}>
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'linear-gradient(to right, rgba(0, 219, 233, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 219, 233, 0.05) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      <div className="max-w-container-max mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center flex-grow relative z-10">
        
        {/* Left Side Info */}
        <div className="md:col-span-6 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 rounded-full px-4 py-1.5 w-fit">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-code-snippet text-[10px] text-primary uppercase tracking-widest">
              System Core Online // v4.2.1
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tighter uppercase text-gradient leading-tight">
            Unbreakable<br/>
            <span className="text-white">Synthetic Media Shield</span>
          </h1>

          <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
            Deploy hyper-technical countermeasures against adversarial generation. Varman isolates, disrupts, and neutralizes deepfake generation pipelines before visual payload compilation.
          </p>

          <div className="flex items-center gap-4 mt-4">
            <button 
              onClick={handleCTA}
              className="bg-primary-container text-on-primary-container font-semibold px-8 py-4 rounded hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 transition-all text-xs tracking-wider uppercase flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">security</span>
              Establish Link Connection
            </button>
          </div>

          <div className="flex items-center gap-6 mt-12 pt-8 border-t border-primary/10">
            <div className="flex flex-col">
              <span className="font-code-snippet text-primary text-xl font-bold">99.98%</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-code-snippet mt-1">Efficacy Rate</span>
            </div>
            <div className="w-px h-8 bg-primary/20"></div>
            <div className="flex flex-col">
              <span className="font-code-snippet text-primary text-xl font-bold">&lt; 12ms</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-code-snippet mt-1">Latency Overhead</span>
            </div>
            <div className="w-px h-8 bg-primary/20"></div>
            <div className="flex flex-col">
              <span className="font-code-snippet text-primary text-xl font-bold">SHA-256</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-code-snippet mt-1">Protocol Verification</span>
            </div>
          </div>
        </div>

        {/* Right Side Shield Graphics */}
        <div className="md:col-span-6 relative h-[380px] w-full mt-8 md:mt-0">
          <div className="absolute inset-0 bg-surface-container/40 backdrop-blur-3xl rounded-xl border border-primary/15 overflow-hidden flex items-center justify-center shadow-[inset_0_0_60px_rgba(0,219,233,0.05)]">
            <img 
              className="w-full h-full object-cover opacity-80 mix-blend-screen" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCUGg85hHcQY55VYIeQid3FLv4wSg5WtGhBt4IFispeyys3yhqUlrGOMXvVjf1WA86ODCVeThNap_YHifBbZ8X1pH7IEm6RKheKdmLQWaFyOR-qfomtTZtmZF1Ru-T_n1PL_E1RSp_Fkv1bk-KGgzrs-qS50x_qwRnLuYaXI23dGvyNb2eAN3xRgMvjf9ngxt4Byc1WE6PvRI7yscg_mP2bDi4wNsKNzpxSgdIbYmXbf4pggE763gcD8OyT6bwWM0VRWlE4y_bsPs" 
              alt="Adversarial network diagram"
            />
            <div className="absolute bottom-4 right-4 bg-surface/85 backdrop-blur-md border border-primary/30 p-3 rounded flex flex-col gap-1">
              <span className="font-code-snippet text-[9px] text-neon-cyan">&gt; active_nodes: 10,482</span>
              <span className="font-code-snippet text-[9px] text-neon-cyan">&gt; perturbation_status: stable</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;
