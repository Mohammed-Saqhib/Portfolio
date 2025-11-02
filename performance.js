/**
 * Performance Optimizations
 * Implements lazy loading, resource hints, and performance best practices
 */

const PerformanceOptimizer = {
    init() {
        this.addResourceHints();
        this.optimizeImages();
        this.preloadCriticalResources();
        this.deferNonCriticalScripts();
        this.optimizeAnimations();
        this.enableServiceWorker();
        this.addPerformanceBudget();
    },

    addResourceHints() {
        const head = document.head;
        
        // DNS prefetch for external resources
        const dnsPrefetchDomains = [
            'https://cdnjs.cloudflare.com',
            'https://fonts.googleapis.com',
            'https://unpkg.com'
        ];

        dnsPrefetchDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            head.appendChild(link);
        });

        // Preconnect to critical domains
        const preconnectDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            head.appendChild(link);
        });
    },

    optimizeImages() {
        // Convert images to WebP format if supported
        if (this.supportsWebP()) {
            document.querySelectorAll('img').forEach(img => {
                const src = img.src;
                if (src && !src.includes('.webp') && !src.includes('data:')) {
                    const webpSrc = src.replace(/\.(jpg|jpeg|png)/i, '.webp');
                    
                    // Try to load WebP version
                    const webpImg = new Image();
                    webpImg.onload = () => {
                        img.src = webpSrc;
                    };
                    webpImg.onerror = () => {
                        // Keep original if WebP fails
                    };
                    webpImg.src = webpSrc;
                }
            });
        }

        // Add lazy loading to images below the fold
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach((img, index) => {
            if (index > 5) { // First 5 images load normally
                img.loading = 'lazy';
                img.decoding = 'async';
            }
        });
    },

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },

    preloadCriticalResources() {
        const criticalResources = [
            { href: 'styles.css', as: 'style' },
            { href: 'preloader.css', as: 'style' },
            { href: 'photos/abk.png', as: 'image' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'font') {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    },

    deferNonCriticalScripts() {
        // Scripts that are not critical for initial render
        const nonCriticalScripts = [
            'analytics.js',
            'accessibility.js'
        ];

        nonCriticalScripts.forEach(src => {
            const script = document.querySelector(`script[src*="${src}"]`);
            if (script && !script.defer && !script.async) {
                script.defer = true;
            }
        });
    },

    optimizeAnimations() {
        // Use CSS will-change for animated elements
        const animatedSelectors = [
            '.hero-img',
            '.floating-logo',
            '.gradient-orb',
            '.particle'
        ];

        animatedSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.willChange = 'transform, opacity';
            });
        });

        // Reduce animations on slow devices
        if (this.isSlowDevice()) {
            document.documentElement.style.setProperty('--animation-speed', '0.5s');
            
            // Disable heavy animations
            const style = document.createElement('style');
            style.textContent = `
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },

    isSlowDevice() {
        // Detect slow devices based on hardware concurrency and connection
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const slowConnection = connection && (
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' ||
            connection.saveData === true
        );

        return hardwareConcurrency <= 2 || slowConnection;
    },

    enableServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Service worker registration would go here
                // navigator.serviceWorker.register('/sw.js')
                //   .then(reg => console.log('SW registered'))
                //   .catch(err => console.log('SW registration failed'));
            });
        }
    },

    addPerformanceBudget() {
        // Monitor and warn if performance budget is exceeded
        const performanceBudget = {
            maxLCP: 2500, // Largest Contentful Paint in ms
            maxFID: 100,  // First Input Delay in ms
            maxCLS: 0.1,  // Cumulative Layout Shift
            maxImages: 50, // Maximum images on page
            maxScripts: 20 // Maximum script tags
        };

        window.addEventListener('load', () => {
            setTimeout(() => {
                const images = document.querySelectorAll('img').length;
                const scripts = document.querySelectorAll('script').length;

                if (images > performanceBudget.maxImages) {
                    console.warn(`⚠️ Performance: ${images} images exceed budget of ${performanceBudget.maxImages}`);
                }

                if (scripts > performanceBudget.maxScripts) {
                    console.warn(`⚠️ Performance: ${scripts} scripts exceed budget of ${performanceBudget.maxScripts}`);
                }

                // Check Core Web Vitals
                if ('PerformanceObserver' in window) {
                    this.checkCoreWebVitals(performanceBudget);
                }
            }, 3000);
        });
    },

    checkCoreWebVitals(budget) {
        // This would integrate with actual Core Web Vitals measurement
        // For now, just log warnings
        console.log('📊 Performance Budget Check:', budget);
    },

    optimizeFontLoading() {
        // Add font-display: swap for better performance
        const fontLinks = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
        fontLinks.forEach(link => {
            if (!link.href.includes('display=')) {
                const url = new URL(link.href);
                url.searchParams.set('display', 'swap');
                link.href = url.toString();
            }
        });
    },

    compressAndMinify() {
        // This would typically be done at build time
        // But we can add compression hints
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Encoding';
        meta.content = 'gzip, br';
        document.head.appendChild(meta);
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        PerformanceOptimizer.init();
    });
} else {
    PerformanceOptimizer.init();
}

// Export
window.PerformanceOptimizer = PerformanceOptimizer;

