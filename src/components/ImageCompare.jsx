import React, { useState, useRef, useEffect } from 'react';

const ImageCompare = ({ originalUrl, protectedUrl }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className="image-compare-container"
      ref={containerRef}
      onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
      onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '600px',
        aspectRatio: '1/1',
        overflow: 'hidden',
        borderRadius: '12px',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        border: '1px solid var(--border-color)',
        margin: '0 auto'
      }}
    >
      {/* Background: Original Image */}
      <img 
        src={originalUrl} 
        alt="Original" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        draggable={false}
      />
      <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', zIndex: 10 }}>Original</div>

      {/* Foreground: Protected Image (using clip-path instead of a clipped wrapper container) */}
      <img 
        src={protectedUrl} 
        alt="Protected" 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          display: 'block',
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          zIndex: 5
        }}
        draggable={false}
      />
      
      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--accent-cyan-glow)', border: '1px solid var(--accent-cyan)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: 'var(--accent-cyan)', zIndex: 10 }}>Protected</div>

      {/* Slider Line */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPosition}%`,
          width: '2px',
          background: 'var(--accent-cyan)',
          zIndex: 20,
          transform: 'translateX(-50%)',
          boxShadow: '0 0 10px var(--accent-cyan)'
        }}
      >
        {/* Slider Handle */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '32px',
            height: '32px',
            background: 'var(--bg-panel)',
            border: '2px solid var(--accent-cyan)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px var(--accent-cyan-glow)'
          }}
        >
          <div style={{ display: 'flex', gap: '2px' }}>
            <div style={{ width: '2px', height: '12px', background: 'var(--accent-cyan)' }}></div>
            <div style={{ width: '2px', height: '12px', background: 'var(--accent-cyan)' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompare;
