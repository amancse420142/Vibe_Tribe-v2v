import React, { useEffect, useRef } from 'react';

export function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const mouse = { x: null, y: null, radius: 160 };

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Zero-Gravity Orb constructor
    class Orb {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.4 - 0.15; // Slow upward float against gravity
        this.radius = Math.random() * 6 + 2; // Delicate glowing sizes (2px to 8px)
        this.baseAlpha = Math.random() * 0.15 + 0.05; // Faint ambient opacity
        this.alpha = this.baseAlpha;
        
        // Randomly assign fuchsia or purple color base
        this.color = Math.random() > 0.5 
          ? { r: 217, g: 70, b: 239 } // Fuchsia Pink
          : { r: 168, g: 85, b: 247 }; // Purple
      }

      update() {
        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Reset to bottom if it floats past the top boundary
        if (this.y < -this.radius) {
          this.y = canvas.height + this.radius;
          this.x = Math.random() * canvas.width;
          this.vy = -Math.random() * 0.4 - 0.15;
          this.vx = (Math.random() - 0.5) * 0.3;
        }

        // Horizontal bounce constraints
        if (this.x < -this.radius || this.x > canvas.width + this.radius) {
          this.vx = -this.vx;
        }

        // Mouse gravity-repulsion and glow activation
        this.alpha = this.baseAlpha;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            
            // Push orbs gently away from cursor (magnetic push)
            this.vx += (dx / dist) * force * 0.12;
            this.vy += (dy / dist) * force * 0.12;
            
            // Glow intensely near cursor
            this.alpha = this.baseAlpha + force * 0.45;
          }
        }

        // Clamp speeds to keep movement graceful and calm
        const speedLimit = 1.0;
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (currentSpeed > speedLimit) {
          this.vx = (this.vx / currentSpeed) * speedLimit;
          this.vy = (this.vy / currentSpeed) * speedLimit;
        }

        // Slowly decay horizontal speeds back to ambient drift
        this.vx *= 0.98;
      }

      draw() {
        ctx.beginPath();
        
        // Draw soft radial volumetric glow gradient
        const grad = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        grad.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`);
        grad.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize bubble arrays
    const initParticles = () => {
      particles = [];
      const density = Math.floor((canvas.width * canvas.height) / 2000); // extremely high density
      const maxOrbs = Math.min(density, 550); // maximum particle limit for high-resolution displays
      for (let i = 0; i < maxOrbs; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Orb(x, y));
      }
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Mouse listeners
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Bootstrap dimensions & loop
    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
