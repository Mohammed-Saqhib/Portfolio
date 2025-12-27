/**
 * Analytics and Tracking
 * Handles user analytics, performance tracking, and engagement metrics
 */

const AnalyticsTracker = {
    sessionStartTime: Date.now(),
    pageViews: 0,
    interactions: [],
    
    init() {
        this.trackPageView();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackClicks();
        this.trackFormSubmissions();
        this.trackExternalLinks();
        this.setupHeatmapTracking();
        this.trackPerformanceMetrics();
    },

    trackPageView() {
        this.pageViews++;
        const pageData = {
            url: window.location.href,
            referrer: document.referrer || 'direct',
            timestamp: new Date().toISOString(),
            device: window.Utils?.DeviceDetection?.getDeviceType() || 'unknown',
            viewport: window.Utils?.DeviceDetection?.getViewportSize() || {}
        };

        window.Utils?.Analytics?.trackPageView(window.location.pathname);
        console.log('📊 Page View:', pageData);
        
        // Store in session
        sessionStorage.setItem('pageView', JSON.stringify(pageData));
    },

    trackScrollDepth() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90, 100];
        const trackedMilestones = [];

        const trackScroll = throttle(() => {
            const scrollPercent = Math.round(
                ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                milestones.forEach(milestone => {
                    if (scrollPercent >= milestone && !trackedMilestones.includes(milestone)) {
                        trackedMilestones.push(milestone);
                        window.Utils?.Analytics?.track('scroll_depth', {
                            depth: milestone,
                            percent: scrollPercent
                        });
                    }
                });
            }
        }, 100);

        window.addEventListener('scroll', trackScroll);
        window.addEventListener('beforeunload', () => {
            window.Utils?.Analytics?.track('max_scroll_depth', { depth: maxScroll });
        });
    },

    trackTimeOnPage() {
        const startTime = Date.now();
        
        // Track time at intervals
        const interval = setInterval(() => {
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            
            // Track milestones: 30s, 1min, 2min, 5min
            const milestones = [30, 60, 120, 300];
            milestones.forEach(ms => {
                if (timeSpent === ms) {
                    window.Utils?.Analytics?.track('time_on_page', {
                        seconds: ms,
                        minutes: (ms / 60).toFixed(1)
                    });
                }
            });
        }, 1000);

        // Final time on page before unload
        window.addEventListener('beforeunload', () => {
            clearInterval(interval);
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            window.Utils?.Analytics?.track('session_duration', {
                seconds: totalTime,
                minutes: (totalTime / 60).toFixed(2)
            });
        });
    },

    trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, [role="button"]');
            if (!target) return;

            const clickData = {
                element: target.tagName.toLowerCase(),
                text: target.textContent?.trim().substring(0, 50),
                href: target.href || null,
                id: target.id || null,
                className: target.className || null,
                timestamp: new Date().toISOString()
            };

            // Track specific elements
            if (target.closest('.nav-link')) {
                window.Utils?.Analytics?.track('navigation_click', {
                    link: target.textContent?.trim(),
                    href: target.href
                });
            } else if (target.closest('.project-tile')) {
                window.Utils?.Analytics?.track('project_click', {
                    project: target.querySelector('.project-title')?.textContent,
                    href: target.href
                });
            } else if (target.closest('.cta-primary, .cta-secondary')) {
                window.Utils?.Analytics?.track('cta_click', {
                    button: target.textContent?.trim(),
                    type: target.classList.contains('cta-primary') ? 'primary' : 'secondary'
                });
            } else if (target.closest('.social-link')) {
                window.Utils?.Analytics?.track('social_click', {
                    platform: target.querySelector('i')?.className.match(/fa-(\w+)/)?.[1],
                    href: target.href
                });
            }

            this.interactions.push(clickData);
        });
    },

    trackFormSubmissions() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const formData = {
                    formId: form.id || form.className,
                    action: form.action || 'none',
                    method: form.method || 'get',
                    fieldCount: form.querySelectorAll('input, textarea, select').length
                };

                window.Utils?.Analytics?.track('form_submit', formData);
            });
        });
    },

    trackExternalLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (link.hostname !== window.location.hostname) {
                link.addEventListener('click', () => {
                    window.Utils?.Analytics?.track('external_link_click', {
                        url: link.href,
                        text: link.textContent?.trim().substring(0, 50)
                    });
                });
            }
        });
    },

    setupHeatmapTracking() {
        // Track mouse movements for heatmap (with privacy consideration)
        if (localStorage.getItem('allow_heatmap') === 'true') {
            let mousePositions = [];
            const maxPositions = 100; // Limit data collection

            const trackMouse = throttle((e) => {
                if (mousePositions.length < maxPositions) {
                    mousePositions.push({
                        x: Math.round((e.clientX / window.innerWidth) * 100),
                        y: Math.round((e.clientY / window.innerHeight) * 100),
                        timestamp: Date.now()
                    });
                }
            }, 100);

            document.addEventListener('mousemove', trackMouse);

            // Send batch data periodically
            setInterval(() => {
                if (mousePositions.length > 0) {
                    window.Utils?.Analytics?.track('heatmap_data', {
                        positions: mousePositions,
                        viewport: {
                            width: window.innerWidth,
                            height: window.innerHeight
                        }
                    });
                    mousePositions = [];
                }
            }, 30000); // Every 30 seconds
        }
    },

    trackPerformanceMetrics() {
        if ('PerformanceObserver' in window) {
            // Track Largest Contentful Paint (LCP)
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    window.Utils?.Analytics?.track('performance_lcp', {
                        value: Math.round(lastEntry.renderTime || lastEntry.loadTime)
                    });
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP tracking not supported');
            }

            // Track First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        window.Utils?.Analytics?.track('performance_fid', {
                            value: Math.round(entry.processingStart - entry.startTime)
                        });
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID tracking not supported');
            }

            // Track Cumulative Layout Shift (CLS)
            let clsValue = 0;
            try {
                const clsObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });

                window.addEventListener('beforeunload', () => {
                    window.Utils?.Analytics?.track('performance_cls', {
                        value: Math.round(clsValue * 1000) / 1000
                    });
                });
            } catch (e) {
                console.warn('CLS tracking not supported');
            }
        }
    },

    getSessionSummary() {
        return {
            duration: Math.floor((Date.now() - this.sessionStartTime) / 1000),
            pageViews: this.pageViews,
            interactions: this.interactions.length,
            device: window.Utils?.DeviceDetection?.getDeviceType() || 'unknown',
            viewport: window.Utils?.DeviceDetection?.getViewportSize() || {}
        };
    }
};

// Initialize analytics when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for Utils to be available
        setTimeout(() => {
            AnalyticsTracker.init();
        }, 100);
    });
} else {
    setTimeout(() => {
        AnalyticsTracker.init();
    }, 100);
}

// Export for external access
window.AnalyticsTracker = AnalyticsTracker;

