/* ================================================================
   🎬 CINEMATIC PRELOADER - ULTRA PREMIUM EDITION 🎬
   DOM-based implementation with reliable fallbacks
   ================================================================ */

class CinematicPreloader {
  constructor() {
    this.preloader = document.getElementById('preloader');
    this.hasShown = sessionStorage.getItem('preloaderShown') === 'true';
    this.minDuration = 8500; // Set to ~8.5 seconds to match the new timeline
    this.maxDuration = 12000; // Max wait time
    this.startTime = Date.now();
    this.assets = [];
    this.loadedAssets = 0;
    this.timeline = null;
    this.isHiding = false;
    this.maxTimer = null;
    this.completionTimer = null;
  this.currentProgress = 0;

    if (!this.preloader) {
      document.body.classList.add('loaded');
      return;
    }

    if (this.hasShown) {
      this.skipPreloader(true);
      return;
    }

    this.init();
  }

  init() {
    document.body.classList.add('preloading');

    this.particlesContainer = this.preloader.querySelector('#preloader-particles');
    this.progressFill = document.getElementById('progress-fill');
    this.progressPercent = document.getElementById('progress-percent');
    this.progressText = document.getElementById('progress-text');
    this.skipButton = document.getElementById('preloader-skip');

    this.createParticles(36);
    this.initTimeline();
    this.loadAssets();
    this.setupSkipHandler();

    // Safety timer to ensure exit even if loading stalls
    this.maxTimer = setTimeout(() => this.hidePreloader(true), this.maxDuration);

    // Provide focus for accessibility
    if (this.skipButton) {
      setTimeout(() => {
        try {
          this.skipButton.focus();
        } catch (e) {
          // ignore focus errors in non-interactive contexts
        }
      }, 600);
    }
  }

  createParticles(count) {
    if (!this.particlesContainer) return;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${6 + Math.random() * 4}s`;
      this.particlesContainer.appendChild(particle);
    }
  }

  initTimeline() {
    if (typeof gsap === 'undefined') {
      const fallbackElements = this.preloader.querySelectorAll(
        '#preloader-profile, #preloader-text, #preloader-tagline, #preloader-highlights, .preloader-highlight-card, #preloader-projects, .preloader-project-card'
      );
      fallbackElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const highlightCards = this.preloader.querySelectorAll('.preloader-highlight-card');
    const projectCards = this.preloader.querySelectorAll('.preloader-project-card');

    gsap.set('#preloader-profile', { opacity: 0, scale: 0.85, y: 24 });
    gsap.set('#preloader-highlights', { opacity: 0 });
    gsap.set(highlightCards, { opacity: 0, y: 24, scale: 0.92 });
    gsap.set('#preloader-projects', { opacity: 0 });
    gsap.set(projectCards, { opacity: 0, y: 24, scale: 0.9 });
    gsap.set('#projects-title', { opacity: 0, y: 20 });
    gsap.set('#preloader-tagline', { opacity: 0, y: 20 });

    this.timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // --- PHASE 1: INITIAL REVEAL (0s - 1.5s) ---
    this.timeline.call(() => {
      this.setProgressMessage('Initializing neural network...');
      this.animateProgressTo(20, 1.0);
    }, null, 0.2);

    // Profile Photo Entrance
    this.timeline.to('#preloader-profile', {
      duration: 1.2,
      opacity: 1,
      scale: 1,
      y: 0,
      ease: 'back.out(1.7)',
      onStart: () => {
        // Continuous floating animation
        gsap.to('#preloader-profile', {
          y: -15,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.2
        });
      }
    }, 0.5);

    // --- PHASE 2: IDENTITY REVEAL (1.5s - 3s) ---
    this.timeline.call(() => {
      this.animateText('#preloader-name', 'chars');
      this.setProgressMessage('Loading identity profile...');
      this.animateProgressTo(40, 1.0);
    }, null, 1.5);

    this.timeline.call(() => {
      this.animateText('#preloader-title', 'words');
      gsap.to('#preloader-tagline', { duration: 0.8, opacity: 1, y: 0, ease: 'power2.out' });
    }, null, 2.2);

    // --- PHASE 3: STATS & HIGHLIGHTS (3s - 5s) ---
    this.timeline.call(() => {
      this.setProgressMessage('Analyzing career metrics...');
      this.animateProgressTo(60, 1.0);
    }, null, 3.0);

    this.timeline.to('#preloader-highlights', { duration: 0.5, opacity: 1 }, 3.2);

    highlightCards.forEach((card, index) => {
      this.timeline.to(card, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        scale: 1,
        ease: 'back.out(1.5)',
      }, 3.2 + (index * 0.15)); // Staggered reveal
    });

    // --- PHASE 4: PROJECT SHOWCASE (5s - 8s) ---
    this.timeline.call(() => {
      this.setProgressMessage('Compiling project portfolio...');
      this.animateProgressTo(85, 1.5);
    }, null, 4.5);

    this.timeline.to('#preloader-projects', { duration: 0.5, opacity: 1 }, 4.8);
    this.timeline.to('#projects-title', { duration: 0.5, opacity: 1, y: 0 }, 4.8);

    // Rapid fire project reveal
    projectCards.forEach((card, index) => {
      this.timeline.to(card, {
        duration: 0.5,
        opacity: 1,
        scale: 1,
        y: 0,
        ease: 'power2.out',
      }, 5.0 + (index * 0.12));
    });

    // --- PHASE 5: FINAL PREP (8s+) ---
    this.timeline.call(() => {
      this.setProgressMessage('System ready. Launching...');
      this.animateProgressTo(100, 1.0);
    }, null, 7.5);

    // Auto-hide after sequence if no interaction
    this.timeline.call(() => {
        // Optional: Auto-hide logic could go here, but we rely on loadAssets/minDuration
    }, null, 8.5);
  }

  animateText(selector, splitType) {
    if (typeof gsap === 'undefined') {
      return;
    }

    const element = this.preloader.querySelector(selector);
    if (!element) return;

    const text = element.textContent;
    element.textContent = '';

    if (splitType === 'chars') {
      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        element.appendChild(span);
        gsap.to(span, {
          duration: 0.5,
          opacity: 1,
          y: 0,
          rotationX: 0,
          ease: 'back.out(2)',
          delay: index * 0.05
        });
      });
    } else {
      text.split(' ').forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        element.appendChild(span);
        gsap.to(span, {
          duration: 0.6,
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          delay: index * 0.2
        });
      });
    }

    element.style.opacity = 1;
  }

  loadAssets() {
    const images = this.preloader.querySelectorAll('.preloader-project-image, .preloader-profile-image');
    this.assets = Array.from(images);

    if (this.assets.length === 0) {
      this.allAssetsLoaded();
      return;
    }

    this.assets.forEach((img) => {
      if (img.complete) {
        this.assetLoaded();
      } else {
        img.addEventListener('load', () => this.assetLoaded());
        img.addEventListener('error', () => this.assetLoaded());
      }
    });
  }

  assetLoaded() {
    this.loadedAssets += 1;
    const progress = Math.min(100, Math.round((this.loadedAssets / this.assets.length) * 100));
    this.updateProgress(progress);

    if (this.loadedAssets === this.assets.length) {
      this.allAssetsLoaded();
    }
  }

  updateProgress(percent, duration = 0.5) {
    percent = Math.min(100, percent);
    if (percent < this.currentProgress) {
      percent = this.currentProgress;
    }
    this.currentProgress = percent;

    if (typeof gsap === 'undefined') {
      if (this.progressFill) this.progressFill.style.width = `${percent}%`;
      if (this.progressPercent) this.progressPercent.textContent = `${Math.round(percent)}%`;
      return;
    }

    if (this.progressFill) {
      gsap.to(this.progressFill, {
        width: `${percent}%`,
        duration,
        ease: 'power2.out'
      });
    }

    if (this.progressPercent) {
      const percentLabel = this.progressPercent;
      const counter = { value: parseInt(percentLabel.textContent, 10) || 0 };
      gsap.to(counter, {
        value: percent,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          percentLabel.textContent = `${Math.round(counter.value)}%`;
        }
      });
    }
  }

  animateProgressTo(targetPercent, duration = 1.2) {
    if (targetPercent <= this.currentProgress) return;
    this.updateProgress(targetPercent, duration);
  }

  setProgressMessage(message) {
    if (!this.progressText || !message) return;
    if (this.progressText.textContent === message) return;

    if (typeof gsap === 'undefined') {
      this.progressText.textContent = message;
      return;
    }

    gsap.to(this.progressText, {
      opacity: 0,
      y: -6,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        this.progressText.textContent = message;
        gsap.set(this.progressText, { y: 6 });
        gsap.to(this.progressText, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out'
        });
      }
    });
  }

  allAssetsLoaded() {
    this.setProgressMessage('Experience ready!');
    this.animateProgressTo(98, 1.4);

    const elapsed = Date.now() - this.startTime;
    const remaining = Math.max(0, this.minDuration - elapsed);

    this.completionTimer = setTimeout(() => this.hidePreloader(), remaining);
  }

  hidePreloader(force = false) {
    if (this.isHiding || !this.preloader) return;
    this.isHiding = true;

    if (this.maxTimer) clearTimeout(this.maxTimer);
    if (this.completionTimer) clearTimeout(this.completionTimer);

  this.setProgressMessage('Launching portfolio...');
  this.animateProgressTo(100, 0.8);

    const targets = this.preloader.querySelectorAll('.preloader-content, .preloader-progress, .preloader-skip');

    if (typeof gsap === 'undefined') {
      targets.forEach((el) => {
        if (el) el.style.opacity = '0';
      });
      this.teardown();
      return;
    }

    if (force && this.timeline) {
      this.timeline.pause(0);
    }

    gsap.to(targets, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => {
        this.preloader.classList.add('fade-out');
        setTimeout(() => this.teardown(), 1800);
      }
    });
  }

  teardown() {
    if (!this.preloader) return;
    this.preloader.remove();
    this.preloader = null;
    document.body.classList.remove('preloading');
    document.body.classList.add('loaded');
    sessionStorage.setItem('preloaderShown', 'true');
    
    // Dispatch event to signal main script to start animations
    window.dispatchEvent(new CustomEvent('portfolio-ready'));
  }

  animateMainContent() {
    // Deprecated: Animations are now handled by script.js via 'portfolio-ready' event
    // This method is kept empty to avoid breaking calls but logic is moved
  }

  skipPreloader(initial = false) {
    if (this.maxTimer) clearTimeout(this.maxTimer);
    if (this.completionTimer) clearTimeout(this.completionTimer);

    if (this.preloader) {
      this.preloader.remove();
      this.preloader = null;
    }

    document.body.classList.remove('preloading');
    document.body.classList.add('loaded');
    sessionStorage.setItem('preloaderShown', 'true');

    if (!initial) {
       window.dispatchEvent(new CustomEvent('portfolio-ready'));
    } else {
       // If initial skip (e.g. already shown), dispatch immediately
       window.dispatchEvent(new CustomEvent('portfolio-ready'));
    }
  }

  setupSkipHandler() {
    if (this.skipButton) {
      this.skipButton.addEventListener('click', () => this.hidePreloader(true));
    }

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space' && this.preloader && !this.isHiding) {
        event.preventDefault();
        this.hidePreloader(true);
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CinematicPreloader());
} else {
  new CinematicPreloader();
}
