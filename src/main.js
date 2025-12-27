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

// Data - centralized filter state
import { getFilteredData, subscribeToFilters, investigationData } from './data/investigationData.js';

class AnalyticsDashboard {
  constructor() {
    this.timeSeriesChart = null;
    this.barSummary = null;
    this.chatPanel = null;
    this.graphAssistant = null;
    this.insightsPanel = null;
    this.filters = null;
    this.exportTools = null;
  }

  init() {
    this.renderLayout();
    this.initializeComponents();
    this.setupEventListeners();
  }

  renderLayout() {
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="app-container">
        <!-- Header -->
        <header class="dashboard-header">
          <div class="dashboard-header__title">
            <svg class="dashboard-header__logo" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#3366cc"/>
              <path d="M8 22V14h4v8H8zM14 22V10h4v12h-4zM20 22V6h4v16h-4z" fill="white"/>
            </svg>
            <div>
              <h1 style="margin:0; font-size: 1.25rem;">Investigation Analytics</h1>
              <span class="dashboard-header__subtitle">Powered by MS Analytics</span>
            </div>
          </div>
          
          <div class="dashboard-header__actions">
            <span class="timeframe-badge" id="timeframeBadge">
              Timeframe: Full Dataset
            </span>
            <button class="btn btn--secondary" id="generateSummaryBtn">
              Generate Executive Summary
            </button>
          </div>
        </header>
        
        <!-- Info Banner -->
        <div class="info-banner" id="infoBanner">
          <span class="info-banner__icon">[i]</span>
          <span id="infoBannerText">Select a date range to filter the data</span>
        </div>
        
        <!-- Main Content -->
        <main class="dashboard-main">
          <!-- Filters -->
          <div id="filtersContainer"></div>
          
          <!-- Time Series Chart -->
          <section class="card">
            <div class="card__header">
              <h2 class="card__title">Investigation Trends Over Time</h2>
            </div>
            <div class="card__body" id="timeSeriesContainer"></div>
          </section>
          
          <!-- Summary Grid -->
          <div class="summary-grid">
            <!-- Bar Summary -->
            <section class="card">
              <div class="card__header">
                <h3 class="card__title">Time to Investigation Summary</h3>
              </div>
              <div class="card__body" id="barSummaryContainer"></div>
            </section>
            
            <!-- Dynamic Chart / Graph Assistant -->
            <section class="card">
              <div class="card__header">
                <h3 class="card__title">AI Visualization Assistant</h3>
              </div>
              <div class="card__body" id="graphAssistantContainer"></div>
            </section>
          </div>
          
          <!-- Export Tools -->
          <div id="exportToolsContainer"></div>
          
          <!-- AI Chatbot -->
          <div id="chatPanelContainer"></div>
          
          <!-- AI Insights Panel (Bottom) -->
          <div id="insightsPanelContainer"></div>
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
      }
      
      .modal {
        background: white;
        border-radius: 12px;
        max-width: 700px;
        width: 90%;
        max-height: 80vh;
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
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        line-height: 1;
      }
      
      .modal__close:hover {
        color: #333;
      }
      
      .modal__body {
        padding: 24px;
        overflow-y: auto;
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
      }
    `;
    document.head.appendChild(style);
  }

  initializeComponents() {
    // Initialize Filters FIRST - it sets up the filter state
    this.filters = new Filters('filtersContainer');
    this.filters.render();

    // Initialize Time Series Chart
    this.timeSeriesChart = new TimeSeriesChart('timeSeriesContainer');
    this.timeSeriesChart.render();

    // Initialize Bar Summary
    this.barSummary = new BarSummary('barSummaryContainer');
    this.barSummary.render();

    // Initialize Graph Assistant
    this.graphAssistant = new GraphAssistant('graphAssistantContainer');
    this.graphAssistant.render();

    // Initialize Insights Panel
    this.insightsPanel = new InsightsPanel('insightsPanelContainer');
    this.insightsPanel.render();

    // Initialize Export Tools
    this.exportTools = new ExportTools('exportToolsContainer');
    this.exportTools.render();

    // Initialize Chat Panel (last to ensure it's at the bottom)
    this.chatPanel = new ChatPanel('chatPanelContainer');
    this.chatPanel.render();

    // Subscribe to filter changes to update header
    subscribeToFilters((data) => this.updateHeader(data));

    // Initial header update
    this.updateHeader(getFilteredData());
  }

  setupEventListeners() {
    // Generate Summary Button
    const generateSummaryBtn = document.getElementById('generateSummaryBtn');
    if (generateSummaryBtn) {
      generateSummaryBtn.addEventListener('click', () => this.showExecutiveSummary());
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
      badge.textContent = `Timeframe: ${data.dateRange.startMonth} - ${data.dateRange.endMonth}`;
    }

    if (bannerText) {
      bannerText.textContent = `Showing ${data.months.length} months, ${data.summary.total.toLocaleString()} total investigations`;
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
}

// Initialize the dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new AnalyticsDashboard();
  dashboard.init();
});

// Export for potential external use
export { AnalyticsDashboard };
