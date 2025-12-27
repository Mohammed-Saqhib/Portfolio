/**
 * Accessibility Enhancements
 * Improves website accessibility for users with disabilities
 */

const AccessibilityEnhancer = {
    init() {
        this.enhanceKeyboardNavigation();
        this.addSkipLinks();
        this.enhanceFocusIndicators();
        this.addAriaLabels();
        this.improveScreenReaderSupport();
        this.addHighContrastMode();
        this.addFontSizeControls();
    },

    enhanceKeyboardNavigation() {
        // Enhanced Tab navigation
        document.addEventListener('keydown', (e) => {
            // Skip links with Enter
            if (e.key === 'Enter' && e.target.classList.contains('skip-link')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            // Close modals with Escape
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('[role="dialog"]');
                modals.forEach(modal => {
                    if (modal.classList.contains('active') || modal.style.display !== 'none') {
                        this.closeModal(modal);
                    }
                });
            }

            // Arrow key navigation for carousels
            if (e.target.closest('.carousel-track')) {
                const carousel = e.target.closest('.projects-carousel');
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    // Add carousel navigation logic here
                }
            }
        });

        // Trap focus in modals
        this.setupFocusTrap();
    },

    setupFocusTrap() {
        const modals = document.querySelectorAll('[role="dialog"]');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        });
    },

    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#footer" class="skip-link">Skip to footer</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);

        // Add CSS for skip links
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -100px;
                left: 0;
                z-index: 10000;
            }
            .skip-link {
                position: absolute;
                top: 0;
                left: 0;
                background: var(--primary-color);
                color: white;
                padding: 1rem 2rem;
                text-decoration: none;
                border-radius: 0 0 8px 0;
                font-weight: 600;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            }
            .skip-link:focus {
                transform: translateY(0);
                outline: 3px solid var(--accent-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    },

    enhanceFocusIndicators() {
        // Add visible focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 3px solid var(--primary-color) !important;
                outline-offset: 3px !important;
                border-radius: 4px;
            }
            button:focus-visible,
            a:focus-visible,
            input:focus-visible,
            select:focus-visible,
            textarea:focus-visible {
                outline: 3px solid var(--primary-color) !important;
                outline-offset: 2px !important;
            }
            /* Remove outline for mouse users */
            *:focus:not(:focus-visible) {
                outline: none;
            }
        `;
        document.head.appendChild(style);
    },

    addAriaLabels() {
        // Add aria-labels to buttons without text
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
            const icon = button.querySelector('i, svg');
            if (icon && !button.textContent.trim()) {
                const ariaLabel = this.getIconLabel(icon);
                if (ariaLabel) {
                    button.setAttribute('aria-label', ariaLabel);
                }
            }
        });

        // Add aria-labels to icon-only links
        document.querySelectorAll('a:not([aria-label])').forEach(link => {
            const icon = link.querySelector('i.fa-bars, i.fa-times, i.fa-search');
            if (icon && !link.textContent.trim()) {
                const ariaLabel = this.getIconLabel(icon);
                if (ariaLabel) {
                    link.setAttribute('aria-label', ariaLabel);
                }
            }
        });

        // Add role attributes
        document.querySelectorAll('[role]').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.textContent.trim()) {
                const role = el.getAttribute('role');
                const labels = {
                    'button': 'Button',
                    'link': 'Link',
                    'dialog': 'Dialog',
                    'menu': 'Menu'
                };
                if (labels[role]) {
                    el.setAttribute('aria-label', labels[role]);
                }
            }
        });
    },

    getIconLabel(icon) {
        const classList = icon.className;
        const labels = {
            'fa-bars': 'Menu',
            'fa-times': 'Close',
            'fa-search': 'Search',
            'fa-moon': 'Toggle dark mode',
            'fa-sun': 'Toggle light mode',
            'fa-arrow-up': 'Scroll to top',
            'fa-envelope': 'Email',
            'fa-github': 'GitHub profile',
            'fa-linkedin': 'LinkedIn profile'
        };

        for (const [className, label] of Object.entries(labels)) {
            if (classList.includes(className)) {
                return label;
            }
        }
        return null;
    },

    improveScreenReaderSupport() {
        // Add live regions for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);

        // Announce page changes
        const observer = new MutationObserver(() => {
            // Announce significant content changes
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Add screen reader only class styles
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
            .sr-only-focusable:focus {
                position: static;
                width: auto;
                height: auto;
                padding: inherit;
                margin: inherit;
                overflow: visible;
                clip: auto;
                white-space: normal;
            }
        `;
        document.head.appendChild(style);
    },

    addHighContrastMode() {
        const toggle = document.createElement('button');
        toggle.setAttribute('aria-label', 'Toggle high contrast mode');
        toggle.className = 'accessibility-toggle contrast-toggle';
        toggle.innerHTML = '<i class="fas fa-adjust"></i> High Contrast';
        
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isEnabled = document.body.classList.contains('high-contrast');
            localStorage.setItem('highContrast', isEnabled);
            this.announce('High contrast mode ' + (isEnabled ? 'enabled' : 'disabled'));
        });

        // Check saved preference
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
        }

        // Add high contrast styles
        const style = document.createElement('style');
        style.textContent = `
            body.high-contrast {
                --bg-color: #000000;
                --text-color: #FFFFFF;
                --primary-color: #00FFFF;
                --accent-color: #FF00FF;
            }
            body.high-contrast * {
                background-color: var(--bg-color) !important;
                color: var(--text-color) !important;
                border-color: var(--text-color) !important;
            }
            body.high-contrast a,
            body.high-contrast button {
                border: 2px solid var(--primary-color) !important;
            }
        `;
        document.head.appendChild(style);
    },

    addFontSizeControls() {
        const controls = document.createElement('div');
        controls.className = 'accessibility-controls';
        controls.innerHTML = `
            <button aria-label="Decrease font size" class="font-size-btn decrease">
                <i class="fas fa-minus"></i> A-
            </button>
            <button aria-label="Reset font size" class="font-size-btn reset">
                <i class="fas fa-undo"></i> Reset
            </button>
            <button aria-label="Increase font size" class="font-size-btn increase">
                <i class="fas fa-plus"></i> A+
            </button>
        `;

        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        let currentSize = parseFloat(localStorage.getItem('fontSize') || fontSize);

        controls.querySelector('.decrease').addEventListener('click', () => {
            currentSize = Math.max(12, currentSize - 2);
            document.documentElement.style.fontSize = currentSize + 'px';
            localStorage.setItem('fontSize', currentSize);
            this.announce(`Font size decreased to ${currentSize} pixels`);
        });

        controls.querySelector('.increase').addEventListener('click', () => {
            currentSize = Math.min(24, currentSize + 2);
            document.documentElement.style.fontSize = currentSize + 'px';
            localStorage.setItem('fontSize', currentSize);
            this.announce(`Font size increased to ${currentSize} pixels`);
        });

        controls.querySelector('.reset').addEventListener('click', () => {
            currentSize = fontSize;
            document.documentElement.style.fontSize = '';
            localStorage.removeItem('fontSize');
            this.announce('Font size reset to default');
        });

        // Apply saved font size
        if (localStorage.getItem('fontSize')) {
            document.documentElement.style.fontSize = currentSize + 'px';
        }

        // Add controls styles
        const style = document.createElement('style');
        style.textContent = `
            .accessibility-controls {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                gap: 0.5rem;
                z-index: 1000;
                background: var(--glass-bg);
                padding: 0.5rem;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                backdrop-filter: blur(10px);
            }
            .font-size-btn {
                padding: 0.5rem;
                background: var(--secondary-color);
                border: 1px solid var(--border-color);
                color: var(--text-color);
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85rem;
            }
            .font-size-btn:hover {
                background: var(--primary-color);
                color: white;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(controls);
    },

    announce(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    },

    closeModal(modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        
        // Return focus to trigger element if available
        const trigger = document.querySelector(`[data-target="${modal.id}"]`);
        if (trigger) {
            trigger.focus();
        }
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AccessibilityEnhancer.init();
    });
} else {
    AccessibilityEnhancer.init();
}

