// Keyboard Navigation Manager - Full ADA Compliance
// Handles focus management, keyboard shortcuts, and navigation

class KeyboardNavigationManager {
    constructor() {
        this.focusTrapStack = [];
        this.shortcuts = new Map();
        this.lastFocusedElement = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.setupGlobalKeyboardHandlers();
        this.setupFocusTracking();
        this.registerDefaultShortcuts();
        this.enhanceInteractiveElements();
        this.createShortcutsHelpPanel();
    }

    // Global keyboard event handling
    setupGlobalKeyboardHandlers() {
        document.addEventListener('keydown', (e) => {
            // Handle focus trap
            if (this.focusTrapStack.length > 0) {
                this.handleFocusTrap(e);
            }

            // Handle registered shortcuts
            this.handleShortcuts(e);

            // Arrow key navigation for radio groups and button groups
            this.handleArrowNavigation(e);
        });

        // Ensure focus is visible when using keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Track focus changes
    setupFocusTracking() {
        document.addEventListener('focusin', (e) => {
            this.lastFocusedElement = e.target;
        });

        // Handle focus on dynamic content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    this.enhanceNewElements(mutation.addedNodes);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Register default keyboard shortcuts
    registerDefaultShortcuts() {
        // Alt + key shortcuts (safe, won't conflict with screen readers)
        this.registerShortcut('alt+h', 'Show keyboard shortcuts help', () => {
            this.toggleShortcutsHelp();
        });

        this.registerShortcut('alt+f', 'Focus on filters', () => {
            const firstFilter = document.querySelector('#filtersContainer select, #filtersContainer input');
            if (firstFilter) firstFilter.focus();
        });

        this.registerShortcut('alt+c', 'Focus on chat input', () => {
            const chatInput = document.querySelector('#chatInput');
            if (chatInput) chatInput.focus();
        });

        this.registerShortcut('alt+v', 'Focus on visualization selector', () => {
            const firstVizBtn = document.querySelector('.viz-btn');
            if (firstVizBtn) firstVizBtn.focus();
        });

        this.registerShortcut('alt+e', 'Focus on export tools', () => {
            const firstExportBtn = document.querySelector('.export-btn');
            if (firstExportBtn) firstExportBtn.focus();
        });

        this.registerShortcut('alt+m', 'Focus on main chart', () => {
            const mainChart = document.querySelector('#timeSeriesContainer');
            if (mainChart) mainChart.focus();
        });

        // Escape always closes modals/dialogs
        this.registerShortcut('escape', 'Close modal or dialog', () => {
            const modal = document.querySelector('.modal-overlay[style*="flex"], .email-modal-overlay[style*="flex"]');
            if (modal) {
                modal.style.display = 'none';
                this.releaseFocusTrap();
            }
        });
    }

    // Register a keyboard shortcut
    registerShortcut(keys, description, callback) {
        this.shortcuts.set(keys.toLowerCase(), { description, callback });
    }

    // Handle keyboard shortcuts
    handleShortcuts(e) {
        const keys = [];
        if (e.altKey) keys.push('alt');
        if (e.ctrlKey) keys.push('ctrl');
        if (e.shiftKey) keys.push('shift');
        if (e.key !== 'Alt' && e.key !== 'Control' && e.key !== 'Shift') {
            keys.push(e.key.toLowerCase());
        }

        const combo = keys.join('+');
        const shortcut = this.shortcuts.get(combo);

        if (shortcut) {
            e.preventDefault();
            shortcut.callback();
        }
    }

    // Arrow key navigation for grouped elements
    handleArrowNavigation(e) {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;

        const target = e.target;
        const group = target.closest('[role="radiogroup"], [role="group"], [role="toolbar"], .visualization-selector__buttons');

        if (!group) return;

        const items = Array.from(group.querySelectorAll('button, [role="radio"], input[type="radio"]'));
        const currentIndex = items.indexOf(target);

        if (currentIndex === -1) return;

        let newIndex;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            newIndex = (currentIndex + 1) % items.length;
        } else {
            newIndex = (currentIndex - 1 + items.length) % items.length;
        }

        e.preventDefault();
        items[newIndex].focus();

        // If it's a radio-like button, activate it
        if (items[newIndex].hasAttribute('role') && items[newIndex].getAttribute('role') === 'radio') {
            items[newIndex].click();
        }
    }

    // Focus trap for modals
    trapFocus(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        this.focusTrapStack.push({
            container,
            previousFocus: document.activeElement
        });

        // Focus first focusable element
        const focusable = this.getFocusableElements(container);
        if (focusable.length > 0) {
            setTimeout(() => focusable[0].focus(), 50);
        }
    }

    releaseFocusTrap() {
        const trap = this.focusTrapStack.pop();
        if (trap && trap.previousFocus) {
            trap.previousFocus.focus();
        }
    }

    handleFocusTrap(e) {
        if (e.key !== 'Tab') return;

        const currentTrap = this.focusTrapStack[this.focusTrapStack.length - 1];
        if (!currentTrap) return;

        const focusable = this.getFocusableElements(currentTrap.container);
        if (focusable.length === 0) return;

        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }

    getFocusableElements(container) {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled]):not([type="hidden"])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ].join(', ');

        return Array.from(container.querySelectorAll(focusableSelectors))
            .filter(el => el.offsetParent !== null); // Only visible elements
    }

    // Enhance interactive elements for better keyboard support
    enhanceInteractiveElements() {
        // Make chart containers focusable and keyboard-interactive
        document.querySelectorAll('.chart-container, .card__body').forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });

        // Ensure all buttons have proper keyboard handling
        document.querySelectorAll('button, [role="button"]').forEach(btn => {
            if (!btn.hasAttribute('type')) {
                btn.setAttribute('type', 'button');
            }
        });

        // Add keyboard support to clickable divs
        document.querySelectorAll('[onclick], .clickable').forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
                el.setAttribute('role', 'button');
            }

            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    }

    enhanceNewElements(nodes) {
        nodes.forEach(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            // Re-run enhancements on new content
            const buttons = node.querySelectorAll?.('button, [role="button"]') || [];
            buttons.forEach(btn => {
                if (!btn.hasAttribute('type')) {
                    btn.setAttribute('type', 'button');
                }
            });
        });
    }

    // Keyboard shortcuts help panel
    createShortcutsHelpPanel() {
        const panel = document.createElement('div');
        panel.id = 'keyboardShortcutsHelp';
        panel.className = 'shortcuts-help-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Keyboard Shortcuts');
        panel.setAttribute('aria-hidden', 'true');
        panel.style.display = 'none';

        let shortcutsList = '';
        this.shortcuts.forEach((value, key) => {
            const keyDisplay = key.split('+').map(k =>
                `<kbd>${k.charAt(0).toUpperCase() + k.slice(1)}</kbd>`
            ).join(' + ');
            shortcutsList += `
        <div class="shortcut-item">
          <span class="shortcut-keys">${keyDisplay}</span>
          <span class="shortcut-desc">${value.description}</span>
        </div>
      `;
        });

        panel.innerHTML = `
      <div class="shortcuts-help-content">
        <div class="shortcuts-help-header">
          <h2>Keyboard Shortcuts</h2>
          <button class="shortcuts-help-close" aria-label="Close shortcuts help">&times;</button>
        </div>
        <div class="shortcuts-help-body">
          ${shortcutsList}
          <div class="shortcut-item">
            <span class="shortcut-keys"><kbd>Tab</kbd></span>
            <span class="shortcut-desc">Navigate to next element</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-keys"><kbd>Shift</kbd> + <kbd>Tab</kbd></span>
            <span class="shortcut-desc">Navigate to previous element</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-keys"><kbd>Enter</kbd> / <kbd>Space</kbd></span>
            <span class="shortcut-desc">Activate focused button or link</span>
          </div>
          <div class="shortcut-item">
            <span class="shortcut-keys"><kbd>Arrow Keys</kbd></span>
            <span class="shortcut-desc">Navigate within groups (visualization selector, etc.)</span>
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(panel);

        // Close button handler
        panel.querySelector('.shortcuts-help-close').addEventListener('click', () => {
            this.toggleShortcutsHelp();
        });

        // Close on click outside
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                this.toggleShortcutsHelp();
            }
        });

        this.addShortcutsHelpStyles();
    }

    toggleShortcutsHelp() {
        const panel = document.getElementById('keyboardShortcutsHelp');
        if (!panel) return;

        const isVisible = panel.style.display === 'flex';
        panel.style.display = isVisible ? 'none' : 'flex';
        panel.setAttribute('aria-hidden', isVisible ? 'true' : 'false');

        if (!isVisible) {
            this.trapFocus('#keyboardShortcutsHelp');
        } else {
            this.releaseFocusTrap();
        }
    }

    addShortcutsHelpStyles() {
        if (document.getElementById('keyboard-nav-styles')) return;

        const style = document.createElement('style');
        style.id = 'keyboard-nav-styles';
        style.textContent = `
      /* Keyboard navigation focus styles */
      .keyboard-navigation *:focus {
        outline: 3px solid #3366cc !important;
        outline-offset: 2px !important;
      }

      .keyboard-navigation button:focus,
      .keyboard-navigation a:focus,
      .keyboard-navigation input:focus,
      .keyboard-navigation select:focus,
      .keyboard-navigation textarea:focus,
      .keyboard-navigation [tabindex]:focus {
        outline: 3px solid #3366cc !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(51, 102, 204, 0.2) !important;
      }

      /* Shortcuts help panel */
      .shortcuts-help-panel {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
      }

      .shortcuts-help-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .shortcuts-help-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e5e5e5;
      }

      .shortcuts-help-header h2 {
        margin: 0;
        font-size: 1.2rem;
      }

      .shortcuts-help-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 4px 8px;
        border-radius: 4px;
      }

      .shortcuts-help-close:hover {
        background: #f0f0f0;
      }

      .shortcuts-help-body {
        padding: 16px 20px;
      }

      .shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;
      }

      .shortcut-item:last-child {
        border-bottom: none;
      }

      .shortcut-keys {
        display: flex;
        gap: 4px;
        align-items: center;
      }

      .shortcut-keys kbd {
        display: inline-block;
        padding: 4px 8px;
        font-family: 'Consolas', monospace;
        font-size: 12px;
        background: #f4f4f4;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }

      .shortcut-desc {
        color: #666;
        font-size: 14px;
      }

      /* Ensure focus is visible on all interactive elements */
      button:focus-visible,
      a:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible,
      [tabindex]:focus-visible {
        outline: 3px solid #3366cc;
        outline-offset: 2px;
      }

      /* High contrast mode */
      @media (prefers-contrast: high) {
        .keyboard-navigation *:focus {
          outline: 4px solid #000 !important;
          outline-offset: 3px !important;
        }
      }
    `;
        document.head.appendChild(style);
    }

    // Public API for focus management
    moveFocusTo(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.focus();
            return true;
        }
        return false;
    }

    announceToScreenReader(message) {
        let announcer = document.getElementById('sr-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
            document.body.appendChild(announcer);
        }
        announcer.textContent = message;
    }
}

// Create singleton instance
const keyboardNav = new KeyboardNavigationManager();

// Export for use in other modules
export { keyboardNav, KeyboardNavigationManager };
