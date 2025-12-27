document.addEventListener('DOMContentLoaded', function() {

    // --- 2. Particles Canvas Animation ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 80;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(88, 166, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(88, 166, 255, ${0.15 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            connectParticles();
            requestAnimationFrame(animate);
        }

        init();
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // --- 3. Animated Counter for Stats ---
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-count'));
                    animateCounter(stat, target);
                });
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statObserver.observe(heroStats);
    }

    // --- 4. Duplicate carousel items for infinite scroll ---
    const carouselTrack = document.querySelector('.carousel-track');
    if (carouselTrack) {
        const carouselCards = Array.from(carouselTrack.children);
        carouselCards.forEach(card => {
            const clone = card.cloneNode(true);
            carouselTrack.appendChild(clone);
        });
    }

    // --- 5. Duplicate marquee content for infinite scroll ---
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const marqueeItems = Array.from(marqueeContent.children);
        marqueeItems.forEach(item => {
            const clone = item.cloneNode(true);
            marqueeContent.appendChild(clone);
        });
    }

    // --- 6. Simple CSS Smooth Scrolling ---
    document.documentElement.style.scrollBehavior = 'smooth';

    // --- 7. Theme Toggle Functionality ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Set theme on load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // --- 8. Custom Cursor ---
    const cursor = document.getElementById('custom-cursor');
    const hoverElements = document.querySelectorAll('[data-cursor-hover], a, button');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // --- 9. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuItems = document.getElementById('menu-items');
    
    if (menuToggle && menuItems) {
        menuToggle.addEventListener('click', () => {
            menuItems.classList.toggle('open');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (menuItems.classList.contains('open')) {
                    menuItems.classList.remove('open');
                }
            });
        });
    }

    // --- 10. Typed.js Configuration ---
    if (document.querySelector(".dynamic-text")) {
        new Typed(".dynamic-text", {
            strings: [
                "Data Analyst",
                "Data Scientist", 
                "Machine Learning Engineer",
                "Data Engineer",
                "Business Intelligence Analyst"
            ],
            typeSpeed: 80,
            backSpeed: 40,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }

    // --- 11. Parallax Effect for Floating Logos ---
    document.addEventListener('mousemove', (e) => {
        const floatingLogos = document.querySelectorAll('.floating-logo');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        floatingLogos.forEach((logo, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed * 30;
            const y = (mouseY - 0.5) * speed * 30;
            
            logo.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // --- 12. Scroll-based Navbar Background ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(var(--bg-color-rgb), 0.95)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(var(--bg-color-rgb), 0.85)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // --- 13. Project Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectElements = document.querySelectorAll('.project-tile');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Add smooth transition
            projectElements.forEach(tile => {
                if (filterValue === 'all' || tile.getAttribute('data-category') === filterValue) {
                    tile.classList.remove('hidden');
                    tile.style.display = 'block';
                    // Animate in
                    setTimeout(() => {
                        tile.style.opacity = '1';
                        tile.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    // Animate out
                    tile.style.opacity = '0';
                    tile.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        tile.classList.add('hidden');
                        tile.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- 14. Ensure projects and skills are visible ---
    const allProjectTiles = document.querySelectorAll('.project-tile');
    allProjectTiles.forEach(tile => {
        tile.style.opacity = '1';
        tile.style.visibility = 'visible';
        tile.style.transform = 'scale(1)';
    });

    // Ensure all skill cards are visible
    const allSkillCards = document.querySelectorAll('.skill-card');
    allSkillCards.forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.display = 'flex';
    });

    console.log(`✅ Ensured ${allSkillCards.length} skill cards are visible`);

    // --- 8. GSAP Scroll Animations ---
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

    // Refresh ScrollTrigger after page load
    setTimeout(() => {
        ScrollTrigger.refresh();
        console.log('ScrollTrigger refreshed');
    }, 100);

    function animateFrom(elem, direction) {
        direction = direction || 1;
        var x = 0,
            y = direction * 50;
        if(elem.classList.contains("gs_reveal_fromLeft")) {
          x = -50;
          y = 0;
        } else if (elem.classList.contains("gs_reveal_fromRight")) {
          x = 50;
          y = 0;
        }
        elem.style.transform = "translate(" + x + "px, " + y + "px)";
        elem.style.opacity = "0";
        gsap.fromTo(elem, {x: x, y: y, autoAlpha: 0}, {
          duration: 1,
          x: 0,
          y: 0, 
          autoAlpha: 1, 
          ease: "power2.out",
          overwrite: "auto"
        });
      }
      
      function hide(elem) {
        gsap.set(elem, {autoAlpha: 0});
      }
      
      // Apply animations to elements that are not project tiles
      gsap.utils.toArray(".gs_reveal:not(.project-tile)").forEach(function(elem) {
        hide(elem);
        
        ScrollTrigger.create({
          trigger: elem,
          start: "top 90%",
          end: "bottom 10%",
          onEnter: function() { animateFrom(elem) }, 
          onEnterBack: function() { animateFrom(elem, -1) },
          onLeave: function() { hide(elem) }
        });
      });

      // Special handling for projects grid
      const projectsGrid = document.querySelector('.projects-grid');
      if (projectsGrid && projectsGrid.classList.contains('gs_reveal')) {
        ScrollTrigger.create({
          trigger: projectsGrid,
          start: "top 90%",
          onEnter: function() { 
            gsap.fromTo(projectsGrid, 
              {autoAlpha: 0}, 
              {duration: 0.8, autoAlpha: 1, ease: "power2.out"}
            );
          }
        });
      }

      // Hero elements entrance animation
      function runEntranceAnimations() {
        console.log('Running entrance animations...');
        
        // Animate main content container first
        gsap.fromTo("#main-content", { opacity: 0, scale: 0.98 }, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out"
        });

        gsap.from(".hero-profile-container", {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            ease: "back.out(1.7)",
            delay: 0.2
        });

        gsap.from(".hero-badge", {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 0.4
        });

        gsap.from(".hero-title", {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: "power3.out",
            delay: 0.6
        });

        gsap.from(".hero-subtitle-container", {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 0.8
        });

        gsap.from(".hero-description", {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 1
        });

        gsap.from(".hero-stats", {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: "power2.out",
            delay: 1.2
        });

        gsap.from(".hero-projects-showcase", {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: "power2.out",
            delay: 1.4
        });

        gsap.from(".experience-highlights", {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 1.6
        });

        gsap.from(".cta-buttons", {
            duration: 0.8,
            y: 20,
            opacity: 0,
            ease: "power2.out",
            delay: 1.8
        });

        gsap.from(".social-links a", {
            duration: 0.6,
            y: 20,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out",
            delay: 2
        });

        gsap.from(".scroll-indicator", {
            duration: 0.8,
            opacity: 0,
            ease: "power2.out",
            delay: 2.2
        });
      }

      // Check if preloader is already done
      if (document.body.classList.contains('loaded')) {
          runEntranceAnimations();
      } else {
          // Wait for preloader to finish
          window.addEventListener('portfolio-ready', runEntranceAnimations);
      }

      // Skill Cards Stagger Animation
      gsap.from(".skill-card", {
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 85%"
        },
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.08,
        ease: "power2.out"
      });

      // Project Cards Stagger Animation
      gsap.set(".project-tile", {opacity: 1, scale: 1});
      gsap.from(".project-tile", {
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 85%",
          refreshPriority: -1
        },
        duration: 0.6,
        y: 20,
        scale: 0.98,
        stagger: 0.1,
        ease: "power2.out"
      });

      // Timeline Animation
      gsap.from(".timeline-container", {
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 85%"
        },
        duration: 0.8,
        x: (index, target) => target.classList.contains('left') ? -50 : 50,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.out"
      });

      // Final Showcase Animations
      gsap.from(".achievement-card", {
        scrollTrigger: {
          trigger: ".achievements-grid",
          start: "top 80%"
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out"
      });

      gsap.from(".experience-card", {
        scrollTrigger: {
          trigger: ".experiences-timeline",
          start: "top 80%"
        },
        duration: 0.8,
        x: -50,
        opacity: 0,
        stagger: 0.2,
        ease: "power2.out"
      });

      gsap.from(".top-project-card", {
        scrollTrigger: {
          trigger: ".top-projects-grid",
          start: "top 80%"
        },
        duration: 1,
        scale: 0.8,
        opacity: 0,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });

      // Final CTA animation
      gsap.from(".final-cta", {
        scrollTrigger: {
          trigger: ".final-cta",
          start: "top 85%"
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out"
      });

      // Parallax effect for showcase background orbs
      gsap.to(".showcase-gradient-orb.orb-1", {
        scrollTrigger: {
          trigger: ".final-showcase-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        x: 100,
        y: -100,
        ease: "none"
      });

      gsap.to(".showcase-gradient-orb.orb-2", {
        scrollTrigger: {
          trigger: ".final-showcase-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        x: -100,
        y: 100,
        ease: "none"
      });

      // Floating Animation for Hero Image
      gsap.to(".hero-img", {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      console.log('GSAP animations initialized');

      // Final check to ensure projects are visible
      setTimeout(() => {
          const projects = document.querySelectorAll('.project-tile');
          projects.forEach(project => {
              if (project.style.opacity === '0' || project.style.visibility === 'hidden') {
                  project.style.opacity = '1';
                  project.style.visibility = 'visible';
                  project.style.transform = 'scale(1)';
              }
          });
          console.log(`Ensured ${projects.length} projects are visible`);
      }, 1000);
    } else {
        console.warn('GSAP not loaded, animations disabled');
    }

    // --- Auto-Scroll Functionality ---
    initAutoScroll();

    // --- Scroll Progress Indicator ---
    initScrollProgress();
});

// Auto-Scroll Feature - Enhanced Smooth Scrolling
function initAutoScroll() {
    const sections = [
        '#welcome-section',
        '#about',
        '#education',
        '#skills',
        '#journey',
        '#projects',
        '#contact',
        '#final-showcase'
    ];

    let isAutoScrolling = false;
    let currentSectionIndex = 0;
    let autoScrollTimeout = null;
    let userInteracted = false;
    let scrollTimeout = null;

    // Function to smoothly scroll to a specific section using GSAP if available
    function scrollToSection(index) {
        if (index >= sections.length) {
            stopAutoScroll();
            return;
        }

        const section = document.querySelector(sections[index]);
        if (!section) return;

        isAutoScrolling = true;
        currentSectionIndex = index;

        // Use native smooth scroll with offset for navbar
        const offsetTop = section.offsetTop - 80;
        const startScroll = window.pageYOffset || document.documentElement.scrollTop;
        const distance = Math.abs(offsetTop - startScroll);
        const duration = Math.min(2000, distance * 1.5); // Dynamic duration based on distance

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // Reset flag after scroll completes
        scrollTimeout = setTimeout(() => {
            isAutoScrolling = false;
        }, duration + 200);
    }

    // Auto-scroll through sections sequentially
    function autoScrollNext() {
        if (userInteracted || isAutoScrolling) return;

        // Get current scroll position to determine which section we're in
        const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
        let currentSection = 0;

        // Find current section
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.querySelector(sections[i]);
            if (section && scrollPos >= section.offsetTop - 100) {
                currentSection = i;
                break;
            }
        }

        // Move to next section
        const nextSection = currentSection + 1;
        if (nextSection < sections.length) {
            scrollToSection(nextSection);
            
            // Schedule next scroll (longer delay to let users read)
            autoScrollTimeout = setTimeout(() => {
                if (!userInteracted) {
                    autoScrollNext();
                }
            }, 4000); // 4 seconds per section to read
        } else {
            // Reached the end
            stopAutoScroll();
        }
    }

    // Start auto-scroll
    function startAutoScroll() {
        if (userInteracted) return;

        // Start from welcome section, then auto-scroll after delay
        setTimeout(() => {
            if (!userInteracted) {
                // Start from first section (about)
                scrollToSection(1);
                // Then continue auto-scrolling
                setTimeout(() => {
                    if (!userInteracted) {
                        autoScrollNext();
                    }
                }, 2500);
            }
        }, 2000); // Initial delay of 2 seconds
    }

    // Stop auto-scroll
    function stopAutoScroll() {
        if (autoScrollTimeout) {
            clearTimeout(autoScrollTimeout);
            autoScrollTimeout = null;
        }
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }
        userInteracted = true;
    }

    // Detect user interaction - stop auto-scroll
    const userInteractionEvents = ['wheel', 'touchstart', 'touchmove', 'keydown', 'click', 'mousedown'];
    let interactionTimeout;
    
    userInteractionEvents.forEach(event => {
        document.addEventListener(event, () => {
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                if (!userInteracted && !isAutoScrolling) {
                    userInteracted = true;
                    stopAutoScroll();
                }
            }, 100);
        }, { passive: true });
    });

    // Detect manual scroll (user scrolling themselves)
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDetectionTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollDetectionTimeout);
        scrollDetectionTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDelta = Math.abs(scrollTop - lastScrollTop);
            
            // If user scrolled significantly and it's not our auto-scroll
            if (scrollDelta > 100 && !isAutoScrolling) {
                userInteracted = true;
                stopAutoScroll();
            }
            lastScrollTop = scrollTop;
        }, 150);
    }, { passive: true });

    // Start auto-scroll after page is ready
    function initAfterReady() {
        // Only start if user is at the top of the page
        if (window.pageYOffset < 100) {
            // Scroll to top first to ensure we start from beginning
            window.scrollTo({ top: 0, behavior: 'instant' });
            setTimeout(() => {
                startAutoScroll();
            }, 500);
        }
    }

    // Initialize immediately when DOM is ready
    if (document.body.classList.contains('loaded')) {
        setTimeout(initAfterReady, 1000);
    } else {
        window.addEventListener('portfolio-ready', () => {
            setTimeout(initAfterReady, 2000);
        });
        
        // Also try to initialize after a short delay if event doesn't fire
        setTimeout(() => {
            if (!userInteracted && window.pageYOffset < 100) {
                initAfterReady();
            }
        }, 5000);
    }

    // Make functions available globally for debugging
    window.autoScrollControl = {
        start: startAutoScroll,
        stop: stopAutoScroll,
        scrollTo: scrollToSection
    };
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    function updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollableHeight = documentHeight - windowHeight;
        const scrollProgress = (scrollTop / scrollableHeight) * 100;
        
        progressBar.style.width = Math.min(scrollProgress, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial update
}
