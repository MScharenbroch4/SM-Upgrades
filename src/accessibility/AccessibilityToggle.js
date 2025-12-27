// Accessibility Toggle Component - Screen Reader On/Off Button
import { accessibilityReader } from './AccessibilityReader.js';

export class AccessibilityToggle {
    constructor(containerId) {
        this.containerId = containerId;
        this.isEnabled = false;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
      <div class="a11y-toggle" role="region" aria-label="Accessibility Controls">
        <button 
          class="a11y-toggle__btn ${this.isEnabled ? 'a11y-toggle__btn--active' : ''}"
          id="screenReaderToggle"
          aria-pressed="${this.isEnabled}"
          aria-label="Screen Reader: ${this.isEnabled ? 'On' : 'Off'}"
          title="Toggle screen reader"
        >
          <span class="a11y-toggle__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
          </span>
          <span class="a11y-toggle__label">Screen Reader: ${this.isEnabled ? 'ON' : 'OFF'}</span>
        </button>
        
        <div class="a11y-settings ${this.isEnabled ? 'a11y-settings--visible' : ''}" id="a11ySettings">
          <label class="a11y-settings__item">
            <span>Speed:</span>
            <input 
              type="range" 
              id="readerSpeed" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value="1"
              aria-label="Reading speed"
            />
          </label>
        </div>
      </div>
    `;

        this.addStyles();
        this.attachEventListeners();
    }

    addStyles() {
        if (document.getElementById('a11y-toggle-styles')) return;

        const style = document.createElement('style');
        style.id = 'a11y-toggle-styles';
        style.textContent = `
      .a11y-toggle {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .a11y-toggle__btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: #f0f0f0;
        border: 2px solid #ccc;
        border-radius: 20px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: #333;
        transition: all 0.2s ease;
        font-family: inherit;
      }
      
      .a11y-toggle__btn:hover {
        background: #e5e5e5;
        border-color: #999;
      }
      
      .a11y-toggle__btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.4);
      }
      
      .a11y-toggle__btn--active {
        background: #3366cc;
        border-color: #3366cc;
        color: white;
      }
      
      .a11y-toggle__btn--active:hover {
        background: #2855b3;
        border-color: #2855b3;
      }
      
      .a11y-toggle__icon {
        display: flex;
        align-items: center;
      }
      
      .a11y-toggle__label {
        white-space: nowrap;
      }
      
      .a11y-settings {
        display: none;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background: #f8f8f8;
        border-radius: 8px;
      }
      
      .a11y-settings--visible {
        display: flex;
      }
      
      .a11y-settings__item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: #666;
      }
      
      .a11y-settings__item input[type="range"] {
        width: 80px;
        cursor: pointer;
      }
      
      /* Skip Link for keyboard users */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #3366cc;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.2s;
      }
      
      .skip-link:focus {
        top: 0;
      }
      
      /* Focus indicators for accessibility */
      *:focus-visible {
        outline: 2px solid #3366cc;
        outline-offset: 2px;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .a11y-toggle__btn {
          border-width: 3px;
        }
        
        .a11y-toggle__btn--active {
          background: #000;
          color: #fff;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          transition-duration: 0.01ms !important;
          animation-duration: 0.01ms !important;
        }
      }
    `;
        document.head.appendChild(style);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('screenReaderToggle');
        const speedSlider = document.getElementById('readerSpeed');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());

            // Keyboard support
            toggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle();
                }
            });
        }

        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                accessibilityReader.setRate(parseFloat(e.target.value));
                if (this.isEnabled) {
                    accessibilityReader.announce(`Speed set to ${e.target.value}`);
                }
            });
        }

        // Add global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + R to toggle reader
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                this.toggle();
            }

            // Escape to stop speaking
            if (e.key === 'Escape' && this.isEnabled) {
                accessibilityReader.stop();
            }
        });

        // Focus tracking for announcements
        document.addEventListener('focusin', (e) => {
            if (this.isEnabled && e.target.matches('button, a, input, select, textarea, [tabindex]')) {
                accessibilityReader.announceFocus(e.target);
            }
        });
    }

    toggle() {
        this.isEnabled = accessibilityReader.toggle();
        this.updateUI();
    }

    updateUI() {
        const btn = document.getElementById('screenReaderToggle');
        const settings = document.getElementById('a11ySettings');

        if (btn) {
            btn.classList.toggle('a11y-toggle__btn--active', this.isEnabled);
            btn.setAttribute('aria-pressed', this.isEnabled);
            btn.setAttribute('aria-label', `Screen Reader: ${this.isEnabled ? 'On' : 'Off'}`);
            btn.querySelector('.a11y-toggle__label').textContent = `Screen Reader: ${this.isEnabled ? 'ON' : 'OFF'}`;
        }

        if (settings) {
            settings.classList.toggle('a11y-settings--visible', this.isEnabled);
        }
    }

    getReader() {
        return accessibilityReader;
    }
}

export { accessibilityReader };
