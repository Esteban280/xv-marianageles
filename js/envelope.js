'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const openBtn = document.getElementById('open-envelope-btn');

  if (envelopeOverlay && openBtn) {
    openBtn.addEventListener('click', () => {
      // Set sessionStorage flag so the music/speech autoplays on the main page
      sessionStorage.setItem('playMusic', 'true');
      window.location.href = 'invitacion.html?v=2';
    });
  }

  // --- Background Golden Particles Canvas System ---
  const canvas = document.getElementById('envelope-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      const COLORS = [
        { r: 212, g: 175, b: 55 },   // #D4AF37 – deep gold
        { r: 240, g: 215, b: 140 },  // #F0D78C – light gold
        { r: 255, g: 255, b: 255 },  // white
      ];

      const PARTICLE_COUNT = 85;
      const particles = [];

      const createParticle = (randomY = true) => {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        return {
          x: Math.random() * canvas.width,
          y: randomY ? Math.random() * canvas.height : canvas.height + Math.random() * 20,
          radius: 0.8 + Math.random() * 2.0,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: -(0.1 + Math.random() * 0.35),
          baseOpacity: 0.15 + Math.random() * 0.55,
          twinkleSpeed: 0.01 + Math.random() * 0.03,
          color,
          sineAmp: 0.2 + Math.random() * 0.5,
          sineFreq: 0.005 + Math.random() * 0.015,
          sinePhase: Math.random() * Math.PI * 2,
          age: 0
        };
      };

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(true));
      }

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.age++;

          p.x += p.speedX + Math.sin(p.age * p.sineFreq + p.sinePhase) * p.sineAmp;
          p.y += p.speedY;

          // Recycle particles that move off-screen top
          if (p.y + p.radius < 0) {
            p.y = canvas.height + p.radius;
            p.x = Math.random() * canvas.width;
          }
          // Wrap horizontal boundary
          if (p.x < -p.radius) p.x = canvas.width + p.radius;
          if (p.x > canvas.width + p.radius) p.x = -p.radius;

          // Twinkle logic
          const currentOpacity = p.baseOpacity + Math.sin(p.age * p.twinkleSpeed + p.sinePhase) * 0.35;
          const opacity = Math.max(0.05, Math.min(0.95, currentOpacity));

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${opacity})`;
          ctx.fill();
        }

        requestAnimationFrame(draw);
      };

      draw();
    }
  }
});
