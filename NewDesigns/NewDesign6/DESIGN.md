---
name: Glacier Security Cockpit
colors:
  surface: '#11131d'
  surface-dim: '#11131d'
  surface-bright: '#373844'
  surface-container-lowest: '#0c0e18'
  surface-container-low: '#191b26'
  surface-container: '#1d1f2a'
  surface-container-high: '#282934'
  surface-container-highest: '#323440'
  on-surface: '#e1e1f0'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e1e1f0'
  inverse-on-surface: '#2e303b'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#a0c9ff'
  on-secondary: '#00325a'
  secondary-container: '#046dba'
  on-secondary-container: '#e2edff'
  tertiary: '#f6f5ff'
  on-tertiary: '#242f51'
  tertiary-container: '#cfd8ff'
  on-tertiary-container: '#535d82'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#d2e4ff'
  secondary-fixed-dim: '#a0c9ff'
  on-secondary-fixed: '#001c37'
  on-secondary-fixed-variant: '#00497f'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#bbc5ef'
  on-tertiary-fixed: '#0e1a3b'
  on-tertiary-fixed-variant: '#3b4569'
  background: '#11131d'
  on-background: '#e1e1f0'
  surface-variant: '#323440'
typography:
  headline-lg:
    fontFamily: Eb Garamond
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Eb Garamond
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0em
  headline-md:
    fontFamily: Eb Garamond
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Metrophobic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Metrophobic
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-snippet:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  container-max: 1440px
---

## Brand & Style

The brand personality is clinical, high-performance, and hyper-technical, evoking the atmosphere of a cold, high-altitude data center. It targets cybersecurity engineers and DevOps specialists who require a high-density, low-fatigue interface for critical monitoring.

The style is **Glassmorphism mixed with Technical Minimalism**. It utilizes deep, "frozen" midnight foundations to provide maximum contrast for neon data points. The aesthetic should feel like a high-end engineering console—precise, transparent, and authoritative. Visual interest is generated through light refraction, subtle backdrop blurs, and a sophisticated mix of serif, sans-serif, and monospaced typography that balances human readability with machine precision.

## Colors

This design system is strictly dark-mode by default to maintain the "Glacier" aesthetic and reduce eye strain in mission-control environments.

- **Primary (Neon Cyan):** #00f0ff. Used for active states, primary actions, and "safe" status indicators. It represents the "frozen" core of the interface.
- **Secondary (Deep Blue):** #006cb9. Reserved for complex data visualizations, navigational anchors, and alerting signals that require a distinct but cooler profile than the primary cyan.
- **Surface (Deep Midnight):** #0a0c16 is the foundation, providing a near-black depth that allows glass effects to pop, while #101b3c (Tertiary) provides structural container depth.
- **Accent/Alert:** Use pure Magenta or Red-orange sparingly for critical threats, ensuring they break the cool color palette.

## Typography

Typography is the primary tool for conveying the "Security Cockpit" aesthetic while ensuring professional clarity.

- **Headlines:** Uses **EB Garamond**. This choice introduces a sophisticated, high-contrast serif that evokes the authority of a legacy intelligence agency or a classical scientific journal, providing a unique "Archive" feel to the technical UI.
- **Body:** Uses **Metrophobic** for a sleek, wide-aperture sans-serif that feels futuristic and airy.
- **Labels:** Uses **Space Grotesk** to provide a geometric, high-tech personality to small metadata, tags, and capitalized labels.
- **Precision (Code):** Retains **JetBrains Mono** for terminal outputs and raw data streams to maintain the developer-centric tool identity.

## Elevation & Depth

Depth is achieved through **Glassmorphism** rather than traditional shadows.

- **Surfaces:** Use semi-transparent backgrounds (derived from Tertiary #101b3c) with a strong backdrop filter blur (20px to 40px). 
- **Borders:** Instead of shadows, use "Inner Glow" borders. Apply a 1px solid border with a low opacity (15%) of the Primary Cyan to suggest a glass edge catching light.
- **Layering:** Higher elevation levels are indicated by increased opacity of the surface color and a brighter "edge light" border.

## Shapes

The shape language is **Engineered-Rounded**. We use a more pronounced rounding than traditional technical tools to provide a modern, premium feel.

- **Standard Corners:** 8px (rounded-md) is the default for most buttons, inputs, and small widgets.
- **Containers:** 16px (rounded-lg) for main cockpit panels and modal overlays.
- **Interactive Elements:** Maintain consistent 8px rounding to ensure a disciplined, modular appearance.

## Components

- **Buttons:** Primary buttons use a solid Cyan fill with black text for maximum impact. Secondary buttons use the Deep Blue (#006cb9) or ghost-style borders with a subtle hover fill.
- **Inputs:** Dark, recessed backgrounds (Tertiary #101b3c) with a 1px border that glows Cyan upon focus. Use Metrophobic for user-entered text.
- **Chips/Badges:** Use Space Grotesk for high-density information tags. Use a "Status LED" style—small, pill-shaped badges with a faint background tint and a high-brightness text color.
- **Cards/Widgets:** Transparent glass panels with a subtle "scanning line" or "grid" pattern background texture at 2% opacity to enhance the technical feel.
- **Data Grids:** High-density rows with 1px midnight-blue dividers. Hover states should trigger a subtle Cyan edge-light on the left side of the row.
- **Terminal Output:** A specific component for log streams using **JetBrains Mono** typography with #00f0ff text on a #0a0c16 background.