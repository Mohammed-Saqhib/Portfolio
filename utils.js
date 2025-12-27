/**
 * Utility Functions for Portfolio Website
 * Provides helper functions for performance, analytics, and user experience
 */

// Performance Monitoring
const PerformanceMonitor = {
    init() {
        if (typeof window.performance !== 'undefined') {
            window.addEventListener('load', () => {
                setTimeout(() => this.logMetrics(), 2000);
            });
        }
    },

    logMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        const metrics = {
            'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
            'TCP Connection': navigation.connectEnd - navigation.connectStart,
            'Server Response': navigation.responseEnd - navigation.requestStart,
            'DOM Processing': navigation.domInteractive - navigation.domLoading,
            'Page Load': navigation.loadEventEnd - navigation.navigationStart,
            'Total Time': navigation.loadEventEnd - navigation.fetchStart
        };

        console.log('🚀 Performance Metrics:', metrics);
        return metrics;
    },

    measureFunction(fn, name) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`⏱️ ${name} took ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

// Analytics Helper
const Analytics = {
    track(eventName, properties = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Custom analytics logging
        console.log(`📊 Analytics: ${eventName}`, properties);
        
        // Store in localStorage for offline tracking
        try {
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            events.push({
                event: eventName,
                properties,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('analytics_events', JSON.stringify(events.slice(-50))); // Keep last 50
        } catch (e) {
            console.warn('Analytics storage failed:', e);
        }
    },

    trackPageView(pageName) {
        this.track('page_view', { page: pageName });
    },

    trackButtonClick(buttonName) {
        this.track('button_click', { button: buttonName });
    },

    trackProjectView(projectName) {
        this.track('project_view', { project: projectName });
    }
};

// Device Detection
const DeviceDetection = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: /iPad|Android/i.test(navigator.userAgent) && !this.isMobile,
    isDesktop: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)),
    
    getDeviceType() {
        if (this.isMobile) return 'mobile';
        if (this.isTablet) return 'tablet';
        return 'desktop';
    },
    
    getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }
};

// Smooth Scroll Utility
const SmoothScroll = {
    scrollTo(target, duration = 800) {
        const targetElement = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;
        
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 80; // Account for fixed nav
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }

        requestAnimationFrame(animation);
    },

    scrollToTop(duration = 600) {
        this.scrollTo(document.body, duration);
    }
};

// LocalStorage Helper
const Storage = {
    set(key, value, expiryDays = null) {
        const data = {
            value,
            timestamp: Date.now(),
            expiry: expiryDays ? Date.now() + (expiryDays * 24 * 60 * 60 * 1000) : null
        };
        
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.warn('Storage set failed:', e);
            return false;
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            
            const data = JSON.parse(item);
            
            // Check expiry
            if (data.expiry && Date.now() > data.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            
            return data.value;
        } catch (e) {
            console.warn('Storage get failed:', e);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            return false;
        }
    }
};

// Debounce Utility
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle Utility
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy Loading Helper
const LazyLoader = {
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
};

// Error Handler
const ErrorHandler = {
    init() {
        window.addEventListener('error', (event) => {
            this.logError(event.error || event.message, event.filename, event.lineno);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logError(event.reason, 'Promise Rejection');
        });
    },

    logError(error, source = '', line = '') {
        const errorData = {
            message: error?.message || error,
            source,
            line,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.error('🚨 Error:', errorData);
        
        // Could send to error tracking service here
        // Example: Sentry, LogRocket, etc.
    }
};

// Cookie Helper
const Cookie = {
    set(name, value, days = 7) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    remove(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

// Form Validation Helper
const FormValidator = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

// Format Utilities
const Format = {
    formatDate(date, locale = 'en-US') {
        return new Date(date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatNumber(num, decimals = 0) {
        return num.toLocaleString('en-US', { 
            minimumFractionDigits: decimals, 
            maximumFractionDigits: decimals 
        });
    },

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};

// Network Status
const NetworkStatus = {
    init() {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            const updateNetworkStatus = () => {
                const status = {
                    online: navigator.onLine,
                    effectiveType: connection?.effectiveType || 'unknown',
                    downlink: connection?.downlink || 'unknown',
                    rtt: connection?.rtt || 'unknown',
                    saveData: connection?.saveData || false
                };
                
                document.body.setAttribute('data-network', status.effectiveType);
                document.body.classList.toggle('offline', !status.online);
                
                if (!status.online) {
                    console.warn('📡 Network offline');
                }
            };

            window.addEventListener('online', updateNetworkStatus);
            window.addEventListener('offline', updateNetworkStatus);
            connection?.addEventListener('change', updateNetworkStatus);
            updateNetworkStatus();
        }
    }
};

// Initialize utilities when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        PerformanceMonitor.init();
        ErrorHandler.init();
        LazyLoader.init();
        NetworkStatus.init();
    });
} else {
    PerformanceMonitor.init();
    ErrorHandler.init();
    LazyLoader.init();
    NetworkStatus.init();
}

// Export for use in other scripts
window.Utils = {
    PerformanceMonitor,
    Analytics,
    DeviceDetection,
    SmoothScroll,
    Storage,
    LazyLoader,
    ErrorHandler,
    Cookie,
    FormValidator,
    Format,
    NetworkStatus,
    debounce,
    throttle
};

