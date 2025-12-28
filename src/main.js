// Main Application Entry Point
import './styles/main.css';

// Components
import { TimeSeriesChart } from './components/TimeSeriesChart.js';
import { BarSummary } from './components/BarSummary.js';
import { ChatPanel } from './components/ChatPanel.js';
import { GraphAssistant } from './components/GraphAssistant.js';
import { InsightsPanel } from './components/InsightsPanel.js';
import { Filters } from './components/Filters.js';
import { ExportTools } from './components/ExportTools.js';
import { Homepage } from './components/Homepage.js';

// Accessibility
import { AccessibilityToggle, accessibilityReader } from './accessibility/AccessibilityToggle.js';
import { keyboardNav } from './accessibility/KeyboardNavigation.js';

// Data - centralized filter state
import { getFilteredData, subscribeToFilters, investigationData } from './data/investigationData.js';
import { sdmScreeningData, getSDMFilteredData, subscribeToSDMFilters } from './data/sdmScreeningData.js';

class AnalyticsDashboard {
  constructor(dashboardType = 'investigation') {
    this.dashboardType = dashboardType; // 'investigation' or 'sdm'
    this.timeSeriesChart = null;
    this.barSummary = null;
    this.chatPanel = null;
    this.graphAssistant = null;
    this.insightsPanel = null;
    this.filters = null;
    this.exportTools = null;
    this.accessibilityToggle = null;
    this.unsubscribeFilters = null; // Store unsubscribe function for cleanup
  }

  init() {
    this.renderLayout();
    this.initializeComponents();
    this.setupEventListeners();

    // Initialize keyboard navigation for ADA compliance
    keyboardNav.init();
  }

  renderLayout() {
    const app = document.getElementById('app');

    app.innerHTML = `
      <!-- Skip Link for Keyboard Users -->
      <a href="#main-content" class="skip-link">Skip to main content</a>
      
      <div class="app-container" role="application" aria-label="Investigation Analytics Dashboard">
        <!-- Header -->
        <header class="dashboard-header" role="banner">
          <div class="dashboard-header__title">
            <a href="#" class="back-home-btn" id="backToHomeBtn" aria-label="Back to Home" title="Back to Home">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </a>
            <svg class="dashboard-header__logo" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="#3366cc"/>
              <path d="M8 22V14h4v8H8zM14 22V10h4v12h-4zM20 22V6h4v16h-4z" fill="white"/>
            </svg>
            <div>
              <h1 style="margin:0; font-size: 1.25rem;">${this.dashboardType === 'sdm' ? 'SDM Hotline Screening Decision' : 'Time to Investigation'}</h1>
              <span class="dashboard-header__subtitle">Powered by MS Analytics</span>
            </div>
          </div>
          
          <div class="dashboard-header__actions">
            <div id="accessibilityToggleContainer"></div>
            <button class="btn btn--ghost" id="keyboardHelpBtn" aria-label="Keyboard shortcuts (Alt+H)" title="Keyboard shortcuts (Alt+H)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
              </svg>
            </button>
            <span class="timeframe-badge" id="timeframeBadge" role="status" aria-live="polite">
              Timeframe: Full Dataset
            </span>
            <button class="btn btn--secondary" id="generateSummaryBtn" aria-label="Generate Executive Summary">
              Generate Executive Summary
            </button>
          </div>
        </header>
        
        <!-- Info Banner -->
        <div class="info-banner" id="infoBanner" role="status" aria-live="polite">
          <span class="info-banner__icon" aria-hidden="true">[i]</span>
          <span id="infoBannerText">Select a date range to filter the data</span>
        </div>
        
        <!-- Main Content -->
        <main class="dashboard-main" id="main-content" role="main">
          <!-- Filters -->
          <div id="filtersContainer" role="region" aria-label="Data Filters"></div>
          
          <!-- Time Series Chart -->
          <section class="card" role="region" aria-label="${this.dashboardType === 'sdm' ? 'Screening Decision Trends Chart' : 'Investigation Trends Chart'}">
            <div class="card__header">
              <h2 class="card__title" id="timeseries-title">${this.dashboardType === 'sdm' ? 'Screening Decision Trends Over Time' : 'Investigation Trends Over Time'}</h2>
            </div>
            <div class="card__body" id="timeSeriesContainer" aria-labelledby="timeseries-title" tabindex="0"></div>
          </section>
          
          <!-- Summary Grid -->
          <div class="summary-grid" role="group" aria-label="Summary Charts">
            <!-- Bar Summary -->
            <section class="card" role="region" aria-label="${this.dashboardType === 'sdm' ? 'Screening Decision Summary Statistics' : 'Investigation Summary Statistics'}">
              <div class="card__header">
                <h3 class="card__title" id="summary-title">${this.dashboardType === 'sdm' ? 'SDM Screening Decision Summary' : 'Time to Investigation Summary'}</h3>
              </div>
              <div class="card__body" id="barSummaryContainer" aria-labelledby="summary-title" tabindex="0"></div>
            </section>
            
            <!-- Dynamic Chart / Graph Assistant -->
            <section class="card" role="region" aria-label="Interactive Visualization">
              <div class="card__header">
                <h3 class="card__title" id="viz-title">Visualization Selector</h3>
              </div>
              <div class="card__body" id="graphAssistantContainer" aria-labelledby="viz-title"></div>
            </section>
          </div>
          
          <!-- Export Tools -->
          <div id="exportToolsContainer" role="region" aria-label="Export Options"></div>
          
          <!-- AI Chatbot -->
          <div id="chatPanelContainer" role="region" aria-label="AI Analytics Chatbot"></div>
          
          <!-- AI Insights Panel (Bottom) -->
          <div id="insightsPanelContainer" role="region" aria-label="AI Generated Insights"></div>
        </main>
        
        <!-- Footer -->
        <footer class="dashboard-footer">
          <div class="dashboard-footer__logo">
            <span></span>
            <span>Powered by MS Analytics</span>
          </div>
          <span>© ${new Date().getFullYear()} Enterprise Analytics Dashboard with AI</span>
        </footer>
      </div>
      
      <!-- Executive Summary Modal -->
      <div class="modal-overlay" id="summaryModal" style="display: none;">
        <div class="modal">
          <div class="modal__header">
            <h2>Executive Summary</h2>
            <button class="modal__close" id="closeSummaryModal">&times;</button>
          </div>
          <div class="modal__body" id="summaryContent"></div>
          <div class="modal__footer">
            <button class="btn btn--secondary" id="copySummary">Copy to Clipboard</button>
            <button class="btn btn--primary" id="downloadSummary">Download</button>
          </div>
        </div>
      </div>
    `;

    // Add modal styles
    this.addModalStyles();
  }

  addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
        padding: 16px;
      }
      
      .modal {
        background: white;
        border-radius: 12px;
        max-width: 700px;
        width: 100%;
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .modal__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #e5e5e5;
      }
      
      .modal__header h2 {
        margin: 0;
        font-size: 1.25rem;
      }
      
      .modal__close {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #666;
        padding: 8px;
        line-height: 1;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: background 0.2s;
      }
      
      .modal__close:hover {
        color: #333;
        background: rgba(0, 0, 0, 0.05);
      }
      
      .modal__body {
        padding: 24px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        flex: 1;
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
        font-family: inherit;
      }
      
      .modal__footer {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        padding: 16px 24px;
        border-top: 1px solid #e5e5e5;
        flex-wrap: wrap;
      }
      
      .filter-checkbox {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .filter-checkbox input {
        cursor: pointer;
        width: 18px;
        height: 18px;
      }
      
      /* Modal Mobile Responsive */
      @media (max-width: 768px) {
        .modal-overlay {
          padding: 12px;
          align-items: flex-end;
        }
        
        .modal {
          max-height: 90vh;
          border-radius: 16px 16px 0 0;
          animation: modalSlideUp 0.3s ease;
        }
        
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal__header {
          padding: 16px 20px;
        }
        
        .modal__header h2 {
          font-size: 1.1rem;
        }
        
        .modal__body {
          padding: 16px 20px;
          font-size: 13px;
        }
        
        .modal__footer {
          padding: 16px 20px;
          flex-direction: column;
        }
        
        .modal__footer .btn {
          width: 100%;
          min-height: 48px;
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  }

  initializeComponents() {
    // Initialize Accessibility Toggle FIRST
    this.accessibilityToggle = new AccessibilityToggle('accessibilityToggleContainer');
    this.accessibilityToggle.render();

    // Determine data source based on dashboard type
    const isSDM = this.dashboardType === 'sdm';
    const chartData = isSDM ? sdmScreeningData : null;

    // Initialize Filters
    this.filters = new Filters('filtersContainer', { showCategories: !isSDM, isSDM: isSDM });
    this.filters.render();

    // Initialize Time Series Chart
    this.timeSeriesChart = new TimeSeriesChart('timeSeriesContainer', chartData);
    this.timeSeriesChart.render();

    // Initialize Bar Summary
    this.barSummary = new BarSummary('barSummaryContainer', chartData);
    this.barSummary.render();

    // Initialize Graph Assistant
    this.graphAssistant = new GraphAssistant('graphAssistantContainer', chartData);
    this.graphAssistant.render();

    // Initialize Insights Panel
    if (!isSDM) {
      this.insightsPanel = new InsightsPanel('insightsPanelContainer');
      this.insightsPanel.render();
    } else {
      const container = document.getElementById('insightsPanelContainer');
      if (container) container.innerHTML = '';
    }

    // Initialize Export Tools
    this.exportTools = new ExportTools('exportToolsContainer');
    this.exportTools.render();

    // Initialize Chat Panel (last to ensure it's at the bottom)
    this.chatPanel = new ChatPanel('chatPanelContainer');
    this.chatPanel.render();

    // Subscribe to filter changes to update header and announce
    if (isSDM) {
      this.unsubscribeFilters = subscribeToSDMFilters((data) => {
        this.updateHeader(data);
        if (accessibilityReader.isEnabled) {
          accessibilityReader.describeFilterChange('Date range',
            `${data.dateRange?.startMonth || data.dateRange?.start} to ${data.dateRange?.endMonth || data.dateRange?.end}`, data);
        }
      });
      // Initial header update
      this.updateHeader(getSDMFilteredData());
    } else {
      this.unsubscribeFilters = subscribeToFilters((data) => {
        this.updateHeader(data);
        if (accessibilityReader.isEnabled) {
          accessibilityReader.describeFilterChange('Date range',
            `${data.dateRange.startMonth} to ${data.dateRange.endMonth}`, data);
        }
      });
      // Initial header update
      this.updateHeader(getFilteredData());
    }
  }

  setupEventListeners() {
    // Generate Summary Button
    const generateSummaryBtn = document.getElementById('generateSummaryBtn');
    if (generateSummaryBtn) {
      generateSummaryBtn.addEventListener('click', () => this.showExecutiveSummary());
    }

    // Keyboard Help Button
    const keyboardHelpBtn = document.getElementById('keyboardHelpBtn');
    if (keyboardHelpBtn) {
      keyboardHelpBtn.addEventListener('click', () => keyboardNav.toggleShortcutsHelp());
    }

    // Back to Home Button
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
      backToHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '';
      });
    }

    // Modal close button
    const closeSummaryModal = document.getElementById('closeSummaryModal');
    if (closeSummaryModal) {
      closeSummaryModal.addEventListener('click', () => this.hideModal());
    }

    // Modal overlay click to close
    const modal = document.getElementById('summaryModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideModal();
        }
      });
    }

    // Copy summary
    const copySummary = document.getElementById('copySummary');
    if (copySummary) {
      copySummary.addEventListener('click', () => this.copySummary());
    }

    // Download summary
    const downloadSummary = document.getElementById('downloadSummary');
    if (downloadSummary) {
      downloadSummary.addEventListener('click', () => {
        this.exportTools.exportSummary();
        this.hideModal();
      });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideModal();
      }
    });
  }

  updateHeader(data) {
    const badge = document.getElementById('timeframeBadge');
    const bannerText = document.getElementById('infoBannerText');

    if (badge) {
      const startMonth = data.dateRange?.startMonth || data.dateRange?.start || '';
      const endMonth = data.dateRange?.endMonth || data.dateRange?.end || '';
      badge.textContent = `Timeframe: ${startMonth} - ${endMonth}`;
    }

    if (bannerText) {
      const monthCount = data.months?.length || data.labels?.length || 0;
      const totalCount = data.summary?.total || 0;
      const itemType = this.dashboardType === 'sdm' ? 'total referrals' : 'total investigations';
      bannerText.textContent = `Showing ${monthCount} months, ${totalCount.toLocaleString()} ${itemType}`;
    }
  }

  showExecutiveSummary() {
    const data = getFilteredData();
    const summary = this.generateFilteredSummary(data);
    const modal = document.getElementById('summaryModal');
    const content = document.getElementById('summaryContent');

    if (content) {
      content.innerHTML = this.formatSummaryForModal(summary);
    }

    if (modal) {
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      // Trap focus in modal and focus first button
      keyboardNav.trapFocus('#summaryModal');
    }
  }

  generateFilteredSummary(data) {
    const s = data.summary;
    return `**Executive Summary**

**Period:** ${data.dateRange.startMonth} - ${data.dateRange.endMonth}
**Total Investigations:** ${s.total.toLocaleString()}

**Category Breakdown:**
- Timely: ${s.categories[0].count.toLocaleString()} (${s.categories[0].percentage}%)
- Not Timely: ${s.categories[1].count.toLocaleString()} (${s.categories[1].percentage}%)
- Pending: ${s.categories[2].count.toLocaleString()} (${s.categories[2].percentage}%)

**Performance:** ${s.categories[0].percentage > 85 ? 'Strong' : s.categories[0].percentage > 70 ? 'Moderate' : 'Needs Improvement'} timeliness rate of ${s.categories[0].percentage}%.

**Data Points:** ${data.months.length} months of data analyzed.`;
  }

  formatSummaryForModal(summary) {
    return summary
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  hideModal() {
    const modal = document.getElementById('summaryModal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      keyboardNav.releaseFocusTrap();
    }
  }

  copySummary() {
    const data = getFilteredData();
    const summary = this.generateFilteredSummary(data);
    const plainText = summary.replace(/\*\*(.*?)\*\*/g, '$1');

    navigator.clipboard.writeText(plainText).then(() => {
      const btn = document.getElementById('copySummary');
      if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }
    });
  }

  // Cleanup method to properly destroy dashboard and release resources
  destroy() {
    // Unsubscribe from filter changes
    if (this.unsubscribeFilters) {
      this.unsubscribeFilters();
      this.unsubscribeFilters = null;
    }

    // Destroy all components that have cleanup methods
    if (this.timeSeriesChart && this.timeSeriesChart.destroy) {
      this.timeSeriesChart.destroy();
    }
    if (this.barSummary && this.barSummary.destroy) {
      this.barSummary.destroy();
    }
    if (this.graphAssistant && this.graphAssistant.destroy) {
      this.graphAssistant.destroy();
    }
    if (this.insightsPanel && this.insightsPanel.destroy) {
      this.insightsPanel.destroy();
    }
    if (this.chatPanel && this.chatPanel.destroy) {
      this.chatPanel.destroy();
    }

    // Clear references
    this.timeSeriesChart = null;
    this.barSummary = null;
    this.graphAssistant = null;
    this.insightsPanel = null;
    this.chatPanel = null;
    this.filters = null;
    this.exportTools = null;
    this.accessibilityToggle = null;
  }
}

// Simple Router for Homepage/Dashboard navigation
class AppRouter {
  constructor() {
    this.currentPage = 'home';
    this.dashboard = null;
    this.homepage = null;
  }

  init() {
    // Check URL hash for initial route
    this.handleRoute(window.location.hash.slice(1));

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.handleRoute(window.location.hash.slice(1));
    });
  }

  handleRoute(hash) {
    if (hash === 'dashboard' || hash === 'child-welfare' || hash === 'time-to-investigation') {
      this.showDashboard('investigation');
    } else if (hash === 'sdm-hotline') {
      this.showDashboard('sdm');
    } else {
      this.showHomepage();
    }
  }

  showHomepage() {
    this.currentPage = 'home';
    window.location.hash = '';

    // Cleanup dashboard if present
    if (this.dashboard) {
      this.dashboard.destroy();
      this.dashboard = null;
    }

    this.homepage = new Homepage('app', (page) => {
      if (page === 'dashboard') {
        this.showDashboard('investigation');
      } else if (page === 'sdm-hotline') {
        this.showDashboard('sdm');
      }
    });
    this.homepage.render();
    keyboardNav.init();
  }

  showDashboard(type = 'investigation') {
    this.currentPage = type === 'sdm' ? 'sdm-hotline' : 'dashboard';
    window.location.hash = this.currentPage;

    // Cleanup previous dashboard if exists
    if (this.dashboard) {
      this.dashboard.destroy();
      this.dashboard = null;
    }

    this.dashboard = new AnalyticsDashboard(type);
    this.dashboard.init();
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const router = new AppRouter();
  router.init();
});

// Export for potential external use
export { AnalyticsDashboard, AppRouter };
