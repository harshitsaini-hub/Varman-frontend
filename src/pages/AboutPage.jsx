
const AboutPage = () => {
  return (
    <div className="flex-grow p-6 md:p-8 overflow-y-auto max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <header className="mb-8 border-b border-neon-cyan/20 pb-4">
        <h1 className="text-2xl md:text-3xl text-neon-cyan mb-2 font-bold tracking-wider uppercase font-headline text-gradient">
          System Overview // VARMAN
        </h1>
        <p className="text-xs text-neon-cyan/70 tracking-wide uppercase font-code-snippet">
          Upper-level architectural knowledge and core mathematical foundations.
        </p>
      </header>

      {/* High Level Explanation */}
      <section className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-neon-cyan/15 pb-2">
          <span className="material-symbols-outlined text-neon-cyan">menu_book</span>
          <h2 className="text-lg text-white font-semibold uppercase font-code-snippet">How Varman Works</h2>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          The threat of unauthorized AI generation, web scraping, and deepfakes has made standard visual assets vulnerable. Varman provides a proactive defense system using **Adversarial Machine Learning**. 
        </p>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Instead of reacting after a deepfake is made, Varman injects mathematically calculated **adversarial perturbations** (noise) directly into the pixel grid of your source images. To the human eye, this noise is virtually invisible or resembles subtle, high-frequency film grain, leaving the artistic value of the asset intact. 
        </p>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          However, when commercial scrapers, facial recognition models, or generative deepfake neural networks ingest this shielded asset, the high-frequency patterns trigger catastrophic features inside the AI's encoders. The AI's internal mathematical understanding is shifted towards garbage vectors—causing generators to produce scrambled noise and detection engines to misclassify the image entirely.
        </p>
      </section>

      {/* Low Level Foundations (Core Knowledge) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Optimization Loop */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-secondary border-b border-secondary/20 pb-2">
              <span className="material-symbols-outlined">analytics</span>
              <h3 className="text-sm font-semibold uppercase font-code-snippet">PGD Optimization</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Varman runs a **Projected Gradient Descent (PGD)** optimization loop. By performing backpropagation through neural networks, it computes the exact mathematical gradients needed to maximize the classification loss of target encoders. 
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              These modifications are project-clipped to remain strictly within a tight $L_\infty$ ball (capped at $\epsilon = 8/255$), ensuring maximum defensive disruption while maintaining strict visual similarity constraints.
            </p>
          </div>
        </div>

        {/* Card 2: Ensemble Learning */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-secondary border-b border-secondary/20 pb-2">
              <span className="material-symbols-outlined">hub</span>
              <h3 className="text-sm font-semibold uppercase font-code-snippet">Surrogate Ensembles</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Because proprietary models (like Midjourney, Dall-E, or commercial facial scrapers) are private black-boxes, Varman leverages the **Transferability Hypothesis**. 
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              By optimizing perturbations against a diverse **surrogate ensemble** (combining CNNs like ResNet50 with Vision Transformers like CLIP ViT-B/32) using dynamic loss scaling, Varman generates robust, universal adversarial patterns that successfully transfer and block commercial models.
            </p>
          </div>
        </div>

        {/* Card 3: Expectation-over-Transformation */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neon-cyan border-b border-neon-cyan/20 pb-2">
              <span className="material-symbols-outlined">transform</span>
              <h3 className="text-sm font-semibold uppercase font-code-snippet">EoT Robustness</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Standard adversarial attacks fail when an image is resized, rotated, or compressed. To solve this, Varman implements **Expectation-over-Transformation (EoT)**.
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              During the optimization loop, the image is subjected to random differentiable transformations (rescaling, cropping, color jitter, compression simulation). The gradients are averaged over these operations, ensuring the defensive noise survives distribution, resizing, and web-formatting.
            </p>
          </div>
        </div>

        {/* Card 4: DCT-DWT Blind Watermark */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neon-cyan border-b border-neon-cyan/20 pb-2">
              <span className="material-symbols-outlined">fingerprint</span>
              <h3 className="text-sm font-semibold uppercase font-code-snippet">Blind Watermarking</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              To verify asset ownership without modifying pixel integrity, the system embeds an invisible watermark in the frequency domain using a combined **Discrete Wavelet Transform (DWT)** and **Discrete Cosine Transform (DCT)** block structure.
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              This signature is highly resilient against physical printing, cropping, and compression, providing verifiable trace proof of the asset origin.
            </p>
          </div>
        </div>
      </section>

      {/* Node status notice */}
      <footer className="pt-6 border-t border-neon-cyan/15 flex justify-between items-center text-[10px] text-on-surface-variant/50 font-code-snippet uppercase tracking-widest">
        <span>Cleared Clearance Level: Alpha-9</span>
        <span>Secure Protocol active</span>
      </footer>
    </div>
  );
};

export default AboutPage;
