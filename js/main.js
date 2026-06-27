'use strict';

/**
 * ============================================================
 *  XV Años Invitation – Main JavaScript
 * ============================================================
 *  Features implemented:
 *    1. Preloader
 *    2. Particle System (Canvas)
 *    3. Countdown Timer
 *    4. Scroll Reveal Animations
 *    5. Parallax Effect
 *    6. Smooth Scroll
 *    7. Hero Photo Entrance
 *    8. Navbar / Scroll Indicator
 *    9. Number Counter Animation
 *   10. Timeline Animation
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
   *  1. PRELOADER
   * -------------------------------------------------------- */
  const initPreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
      document.dispatchEvent(new CustomEvent('preloaderHidden'));
      return;
    }

    const hidePreloader = () => {
      preloader.classList.add('preloader--hidden');

      let dispatched = false;
      const done = () => {
        if (dispatched) return;
        dispatched = true;
        preloader.style.display = 'none';
        document.dispatchEvent(new CustomEvent('preloaderHidden'));
      };

      // After CSS transition ends, remove from flow completely
      const onTransitionEnd = () => {
        done();
        preloader.removeEventListener('transitionend', onTransitionEnd);
      };
      preloader.addEventListener('transitionend', onTransitionEnd);

      // Safety net: force hide even if transitionend never fires
      setTimeout(done, 1500);
    };

    // Wait for all assets, but cap at 3 seconds
    let loaded = false;
    const markLoaded = () => {
      if (loaded) return;
      loaded = true;
      hidePreloader();
    };

    window.addEventListener('load', markLoaded);
    setTimeout(markLoaded, 3000);
  };

  /* ----------------------------------------------------------
   *  1.1. BRIDGERTON ENVELOPE OVERLAY & AUDIO SPEECH
   * -------------------------------------------------------- */
  const initBridgertonAudio = () => {
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const openBtn = document.getElementById('open-envelope-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('floating-music-btn');
    const musicIcon = document.getElementById('music-icon');

    if (!bgMusic || !musicBtn) return;

    // Default audio settings
    bgMusic.volume = 0.35;
    let isPlaying = false;
    let speechUtterance = null;
    let hasVoiceoverStarted = false;

    // Lady Whistledown Spanish Voiceover Script
    const WHISTLEDOWN_SCRIPT = 
      "Querido y gentil lector. " +
      "Se dice en los pasillos de la alta sociedad que un evento verdaderamente extraordinario se aproxima. " +
      "Con gran placer, me complace anunciar que la encantadora señorita María Ángeles Caro celebrará sus quince años, iniciando una nueva etapa llena de gracia y elegancia. " +
      "Sería el mayor de los honores contar con su distinguida presencia en esta velada de música, encanto y celebración en compañía de su querido padre Orlando Caro. " +
      "Se ruega puntual asistencia y su mejor porte, pues la noche promete recuerdos que serán comentados por mucho tiempo. " +
      "Atentamente, Lady Whistledown.";

    // Play Background Music
    const playMusic = () => {
      return bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('floating-music-btn--playing');
        return true;
      }).catch(err => {
        console.warn("Autoplay blocked by browser. User interaction required:", err);
        return false;
      });
    };

    // Pause Background Music
    const pauseMusic = () => {
      bgMusic.pause();
      isPlaying = false;
      musicBtn.classList.remove('floating-music-btn--playing');
    };

    // Toggle Music Playback
    const toggleMusic = () => {
      if (isPlaying) {
        pauseMusic();
        // Also cancel speaking if they turn off the music
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } else {
        playMusic();
      }
    };

    // Lady Whistledown Speech Voiceover Function
    const speakVoiceover = () => {
      if (!('speechSynthesis' in window)) {
        console.warn("Speech Synthesis not supported in this browser.");
        return;
      }
      if (hasVoiceoverStarted) return;
      hasVoiceoverStarted = true;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      speechUtterance = new SpeechSynthesisUtterance(WHISTLEDOWN_SCRIPT);
      speechUtterance.lang = 'es-ES';
      speechUtterance.rate = 0.85; // Elegant, aristocratic, slow dramatic tempo
      speechUtterance.pitch = 1.05; // Standard, clear female tone
      speechUtterance.volume = 0.50; // Lower the voice volume a bit for a softer, more balanced mix

      // Try to find a high-quality Spanish female voice
      const findVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        // Look for common high quality female voices in Spanish
        const preferredVoices = [
          'monica', 'paulina', 'sabina', 'helena', 'elena', 'google español', 'es-es', 'es-co', 'es-la'
        ];
        
        let selectedVoice = null;

        // First look for preferred female voices
        for (const pref of preferredVoices) {
          selectedVoice = voices.find(v => v.name.toLowerCase().includes(pref) && v.lang.toLowerCase().startsWith('es'));
          if (selectedVoice) break;
        }

        // Fallback: any spanish voice
        if (!selectedVoice) {
          selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith('es'));
        }

        if (selectedVoice) {
          speechUtterance.voice = selectedVoice;
        }
      };

      // Voices are loaded asynchronously in some browsers
      findVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = findVoice;
      }

      // Duck background music volume during speech voiceover
      speechUtterance.onstart = () => {
        bgMusic.volume = 0.15;
      };

      speechUtterance.onend = () => {
        bgMusic.volume = 0.35;
      };

      speechUtterance.onerror = () => {
        bgMusic.volume = 0.35;
      };

      // Speak the Lady Whistledown message
      window.speechSynthesis.speak(speechUtterance);
    };

    const startAudioFlow = () => {
      playMusic().then(success => {
        if (success) {
          setTimeout(() => {
            speakVoiceover();
          }, 1000);
        }
      });
    };

    // Open Envelope handler
    if (envelopeOverlay && openBtn) {
      openBtn.addEventListener('click', () => {
        // Fade out overlay
        envelopeOverlay.classList.add('envelope-overlay--hidden');

        // Play Pachelbel's Canon in D
        playMusic();

        // Read Lady Whistledown script with 1.2s delay to allow envelope fade out
        setTimeout(() => {
          speakVoiceover();
        }, 1200);

        // After transition, remove overlay from DOM flow
        const cleanOverlay = () => {
          envelopeOverlay.style.display = 'none';
          envelopeOverlay.removeEventListener('transitionend', cleanOverlay);
        };
        envelopeOverlay.addEventListener('transitionend', cleanOverlay);
      });
    } else {
      // If envelope is missing, try auto-playing on preloader hidden or wait for action
      const playOnAction = () => {
        startAudioFlow();
        document.body.removeEventListener('click', playOnAction);
        document.body.removeEventListener('touchstart', playOnAction);
      };

      document.addEventListener('preloaderHidden', () => {
        if (sessionStorage.getItem('playMusic') === 'true') {
          playMusic().then(success => {
            if (success) {
              setTimeout(() => {
                speakVoiceover();
              }, 1000);
            } else {
              document.body.addEventListener('click', playOnAction);
              document.body.addEventListener('touchstart', playOnAction);
            }
          });
        } else {
          document.body.addEventListener('click', playOnAction);
          document.body.addEventListener('touchstart', playOnAction);
        }
      });
    }

    // Toggle Music Floating Button handler
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering body click
      toggleMusic();
    });
  };

  /* ----------------------------------------------------------

   *  2. PARTICLE SYSTEM (Canvas)
   * -------------------------------------------------------- */
  const initParticles = () => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- Sizing (Fixed background covering full window) ---
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Debounced resize handler
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    // --- Particle colours (Gold hues and bright white sparkle) ---
    const COLORS = [
      { r: 212, g: 175, b: 55 },   // #D4AF37  – deep gold
      { r: 240, g: 215, b: 140 },  // #F0D78C  – light gold
      { r: 255, g: 243, b: 191 },  // Creamy soft gold
      { r: 255, g: 255, b: 255 },  // white sparkle
    ];

    // --- Particle factory (Higher density for rich gold glitter) ---
    const PARTICLE_COUNT = 150 + Math.floor(Math.random() * 51); // 150 - 200 particles

    const createParticle = (randomY = true) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : canvas.height + Math.random() * 20,
        radius: 0.8 + Math.random() * 2.2,                // 0.8px - 3.0px
        speedX: (Math.random() - 0.5) * 0.5,              // Organic drift
        speedY: -(0.15 + Math.random() * 0.45),           // Upward drift
        baseOpacity: 0.15 + Math.random() * 0.6,          // Base opacity range
        twinkleSpeed: 0.01 + Math.random() * 0.03,        // Speed of twinkle oscillation
        color,
        // Sine-wave parameters for organic horizontal drift
        sineAmp: 0.3 + Math.random() * 0.7,
        sineFreq: 0.005 + Math.random() * 0.01,
        sinePhase: Math.random() * Math.PI * 2,
        age: 0,
      };
    };

    const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(true));

    // --- Animation loop ---
    let animId = null;

    const draw = () => {
      animId = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.age++;

        // Move
        p.x += p.speedX + Math.sin(p.age * p.sineFreq + p.sinePhase) * p.sineAmp;
        p.y += p.speedY;

        // Wrap around
        if (p.y + p.radius < 0) {
          p.y = canvas.height + p.radius;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -p.radius) p.x = canvas.width + p.radius;
        if (p.x > canvas.width + p.radius) p.x = -p.radius;

        // Twinkle calculation: sinusoidal oscillation around baseOpacity
        const currentOpacity = p.baseOpacity + Math.sin(p.age * p.twinkleSpeed + p.sinePhase) * 0.3;
        const opacity = Math.max(0.05, Math.min(0.95, currentOpacity));

        // Draw glittering star
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${opacity})`;
        ctx.fill();
      }
    };

    draw();
  };

  /* ----------------------------------------------------------
   *  3. COUNTDOWN TIMER
   * -------------------------------------------------------- */
  const initCountdown = () => {
    const elDays    = document.getElementById('countdown-days');
    const elHours   = document.getElementById('countdown-hours');
    const elMinutes = document.getElementById('countdown-minutes');
    const elSeconds = document.getElementById('countdown-seconds');

    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    // August 15, 2026, 18:00:00 Colombia time (UTC-5)
    // We construct the target in UTC so it's timezone-safe everywhere.
    // COT = UTC-5 → 18:00 COT = 23:00 UTC
    const TARGET_UTC = new Date(Date.UTC(2026, 7, 15, 23, 0, 0)); // month is 0-indexed → 7 = August

    const pad = (n) => String(n).padStart(2, '0');

    // Micro-animation: briefly scale up the digit when it changes
    const pulse = (el) => {
      el.classList.remove('digit-pulse');
      // Force reflow so re-adding the class triggers the animation again
      void el.offsetWidth;
      el.classList.add('digit-pulse');
    };

    let prevValues = { d: null, h: null, m: null, s: null };

    const update = () => {
      const now = Date.now();
      let diff = TARGET_UTC.getTime() - now;

      if (diff <= 0) {
        // Event has passed
        elDays.textContent    = '00';
        elHours.textContent   = '00';
        elMinutes.textContent = '00';
        elSeconds.textContent = '00';

        // Optional: surface a "the day has arrived" message
        const wrapper = elDays.closest('.countdown') || elDays.parentElement?.parentElement;
        if (wrapper && !wrapper.querySelector('.countdown__past-message')) {
          const msg = document.createElement('p');
          msg.className = 'countdown__past-message';
          msg.textContent = '¡El gran día ha llegado!';
          wrapper.appendChild(msg);
        }
        return;
      }

      const days    = Math.floor(diff / 86400000);
      diff %= 86400000;
      const hours   = Math.floor(diff / 3600000);
      diff %= 3600000;
      const minutes = Math.floor(diff / 60000);
      diff %= 60000;
      const seconds = Math.floor(diff / 1000);

      const d = pad(days);
      const h = pad(hours);
      const m = pad(minutes);
      const s = pad(seconds);

      if (d !== prevValues.d) { elDays.textContent = d;    pulse(elDays); }
      if (h !== prevValues.h) { elHours.textContent = h;   pulse(elHours); }
      if (m !== prevValues.m) { elMinutes.textContent = m; pulse(elMinutes); }
      if (s !== prevValues.s) { elSeconds.textContent = s; pulse(elSeconds); }

      prevValues = { d, h, m, s };
    };

    update();
    setInterval(update, 1000);
  };

  /* ----------------------------------------------------------
   *  4. SCROLL REVEAL ANIMATIONS
   * -------------------------------------------------------- */
  const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything immediately
      reveals.forEach((el) => el.classList.add('reveal--visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          const delay = parseInt(el.dataset.delay, 10) || 0;

          if (delay > 0) {
            setTimeout(() => el.classList.add('reveal--visible'), delay);
          } else {
            el.classList.add('reveal--visible');
          }

          obs.unobserve(el); // one-time reveal
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));
  };

  /* ----------------------------------------------------------
   *  5. PARALLAX EFFECT
   * -------------------------------------------------------- */
  const initParallax = () => {
    const heroContent = document.querySelector('.hero__content');
    if (!heroContent) return;

    let ticking = false;
    let lastScrollY = 0;

    const applyParallax = () => {
      // Desktop only
      if (window.innerWidth <= 768) {
        heroContent.style.transform = '';
        ticking = false;
        return;
      }

      const scrollY = lastScrollY;
      // Move content upward at 30 % of scroll speed → creates depth
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }, { passive: true });
  };

  /* ----------------------------------------------------------
   *  6. SMOOTH SCROLL
   * -------------------------------------------------------- */
  const initSmoothScroll = () => {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest("a[href^='#']");
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  };

  /* ----------------------------------------------------------
   *  7. HERO PHOTO ENTRANCE
   * -------------------------------------------------------- */
  const initHeroPhotoEntrance = () => {
    const photo = document.querySelector('.hero__photo');
    if (!photo) return;

    // Fade-in + scale-up after 1 second
    setTimeout(() => {
      photo.classList.add('hero__photo--visible');
    }, 1000);
  };

  /* ----------------------------------------------------------
   *  8. SCROLL INDICATOR VISIBILITY
   * -------------------------------------------------------- */
  const initScrollIndicator = () => {
    const indicator = document.querySelector('.hero__scroll-indicator');
    if (!indicator) return;

    let ticking = false;

    const check = () => {
      if (window.scrollY > 200) {
        indicator.classList.add('hero__scroll-indicator--hidden');
      } else {
        indicator.classList.remove('hero__scroll-indicator--hidden');
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(check);
        ticking = true;
      }
    }, { passive: true });
  };

  /* ----------------------------------------------------------
   *  9. NUMBER COUNTER ANIMATION
   * -------------------------------------------------------- */
  const initCounterAnimation = () => {
    const countdownSection =
      document.querySelector('.countdown') ||
      document.getElementById('countdown');
    if (!countdownSection) return;

    // We'll animate the four digit elements from 0 → current value
    const digitEls = [
      document.getElementById('countdown-days'),
      document.getElementById('countdown-hours'),
      document.getElementById('countdown-minutes'),
      document.getElementById('countdown-seconds'),
    ].filter(Boolean);

    if (!digitEls.length) return;
    if (!('IntersectionObserver' in window)) return; // skip on old browsers

    let animated = false;

    const DURATION = 2000; // 2 seconds

    // Ease-out cubic: fast start, slow end
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateDigit = (el) => {
      const targetValue = parseInt(el.textContent, 10);
      if (isNaN(targetValue) || targetValue === 0) return;

      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const easedProgress = easeOutCubic(progress);
        const current = Math.round(easedProgress * targetValue);

        el.textContent = String(current).padStart(2, '0');

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = String(targetValue).padStart(2, '0');
        }
      };

      // Briefly show 00 then start counting
      el.textContent = '00';
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          // Small delay so the countdown has already computed its first value
          setTimeout(() => {
            digitEls.forEach(animateDigit);
          }, 100);
          observer.unobserve(countdownSection);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(countdownSection);
  };

  /* ----------------------------------------------------------
   *  10. TIMELINE ANIMATION
   * -------------------------------------------------------- */
  const initTimeline = () => {
    const items = document.querySelectorAll('.timeline-item');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('reveal--visible'));
      return;
    }

    // We observe a wrapper (or the first item) to trigger staggered reveal
    const wrapper =
      document.querySelector('.timeline') ||
      items[0].parentElement;

    if (!wrapper) {
      // Fallback: show them all
      items.forEach((el) => el.classList.add('reveal--visible'));
      return;
    }

    let animated = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          animated = true;

          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('reveal--visible');
            }, index * 200);
          });

          observer.unobserve(wrapper);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(wrapper);
  };

  /* ----------------------------------------------------------
   *  INITIALISE EVERYTHING
   * -------------------------------------------------------- */
  initPreloader();
  initBridgertonAudio();
  initParticles();
  initCountdown();
  initScrollReveal();
  initParallax();
  initSmoothScroll();
  initHeroPhotoEntrance();
  initScrollIndicator();
  initCounterAnimation();
  initTimeline();
});

