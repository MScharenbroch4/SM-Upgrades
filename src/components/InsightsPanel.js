// Insights Panel Component - Auto-generated AI Insights
import { dataAnalyzer } from '../ai/DataAnalyzer.js';

export class InsightsPanel {
  constructor(containerId) {
    this.containerId = containerId;
    this.isExpanded = true;
    this.insights = [];
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Get auto-generated insights
    this.insights = dataAnalyzer.getAutoInsights();

    container.innerHTML = `
      <div class="insights-panel">
        <div class="insights-panel__header" id="insightsHeader">
          <div class="insights-panel__title">
            <span class="insights-icon">*</span>
            <span>AI-Generated Insights</span>
          </div>
          <span class="insights-panel__toggle">${this.isExpanded ? '▼' : '▲'}</span>
        </div>
        
        ${this.isExpanded ? `
          <div class="insights-panel__body">
            ${this.insights.map(insight => `
              <div class="insight-item insight-item--${insight.type}">
                <span class="insight-item__icon">${insight.icon}</span>
                <span class="insight-item__text">${insight.text}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const header = document.getElementById('insightsHeader');
    if (header) {
      header.addEventListener('click', () => {
        this.isExpanded = !this.isExpanded;
        this.render();
      });
    }
  }
}
