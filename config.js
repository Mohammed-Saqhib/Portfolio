/**
 * Configuration File
 * Centralized configuration for the portfolio website
 */

const Config = {
    // Site Information
    site: {
        name: 'Mohammed Saqhib',
        title: 'Data Professional Portfolio',
        description: 'Aspiring Data Science and Analytics Professional',
        url: 'https://mohammed-saqhib.github.io/Portfolio/',
        author: 'Mohammed Saqhib',
        email: 'msaqhib76@gmail.com',
        location: 'Bengaluru, India',
        phone: '+91 6239121164'
    },

    // Social Media Links
    social: {
        linkedin: 'http://www.linkedin.com/in/mohammed-saqhib-87b8b325a',
        github: 'https://github.com/Mohammed-Saqhib',
        email: 'msaqhib76@gmail.com'
    },

    // Analytics Configuration
    analytics: {
        enabled: true,
        trackPageViews: true,
        trackClicks: true,
        trackScroll: true,
        trackTimeOnPage: true,
        // Google Analytics ID (if you have one)
        gaId: null
    },

    // Performance Settings
    performance: {
        lazyLoadImages: true,
        preloadCriticalResources: true,
        enableServiceWorker: false,
        compressionEnabled: true,
        maxImagesBeforeLazyLoad: 5
    },

    // Animation Settings
    animations: {
        enabled: true,
        reduceMotion: false, // Respect prefers-reduced-motion
        duration: {
            fast: 200,
            normal: 300,
            slow: 500
        },
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },

    // Theme Settings
    theme: {
        defaultTheme: 'dark',
        allowUserToggle: true,
        persistPreference: true,
        colors: {
            primary: '#58a6ff',
            secondary: '#21262d',
            accent: '#ff7b72',
            background: '#0d1117',
            text: '#c9d1d9'
        }
    },

    // Accessibility Settings
    accessibility: {
        enableSkipLinks: true,
        enableHighContrast: true,
        enableFontSizeControl: true,
        announcePageChanges: true,
        keyboardNavigation: true
    },

    // Feature Flags
    features: {
        particles: true,
        floatingLogos: true,
        preloader: true,
        smoothScroll: true,
        typedAnimation: true,
        projectFilter: true
    },

    // API Endpoints (if any)
    api: {
        baseUrl: null,
        endpoints: {
            contact: null,
            analytics: null
        }
    },

    // Error Handling
    errorHandling: {
        logToConsole: true,
        showUserFriendlyErrors: true,
        reportToService: false,
        serviceUrl: null
    },

    // Localization
    i18n: {
        defaultLocale: 'en',
        supportedLocales: ['en'],
        translations: {}
    },

    // Pagination/Content Limits
    content: {
        projectsPerPage: 12,
        maxProjectsDisplay: 50,
        recentProjectsCount: 6
    },

    // Contact Form
    contact: {
        enabled: true,
        requireFields: ['name', 'email', 'message'],
        spamProtection: true
    },

    // Portfolio Stats
    stats: {
        projects: 17,
        internships: 4,
        skills: 12,
        years: 3
    },

    // Performance Budget
    budget: {
        maxLCP: 2500, // ms
        maxFID: 100,  // ms
        maxCLS: 0.1,
        maxImages: 50,
        maxScripts: 20
    },

    // Development/Environment
    environment: {
        isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        isProduction: window.location.hostname.includes('github.io') || window.location.hostname.includes('vercel.app'),
        debug: false
    },

    // Get configuration value
    get(path) {
        const keys = path.split('.');
        let value = this;
        for (const key of keys) {
            value = value[key];
            if (value === undefined) return null;
        }
        return value;
    },

    // Set configuration value
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this;
        
        for (const key of keys) {
            if (!target[key]) target[key] = {};
            target = target[key];
        }
        
        target[lastKey] = value;
    }
};

// Make config available globally
window.Config = Config;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}

