// Insights Panel Component - Auto-generated insights from filtered data
import { getFilteredData, subscribeToFilters } from '../data/investigationData.js';

export class InsightsPanel {
    constructor(containerId) {
        this.containerId = containerId;
        this.isExpanded = true;
        this.unsubscribe = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        this.updateDisplay();

        // Subscribe to filter changes
        this.unsubscribe = subscribeToFilters(() => {
            this.updateDisplay();
        });
    }

    updateDisplay() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const insights = this.generateInsights();

        container.innerHTML = `
      <div class="insights-panel">
        <div class="insights-panel__header" id="insightsHeader">
          <div class="insights-panel__title">
            <span class="insights-icon">*</span>
            <span>AI-Generated Insights</span>
          </div>
          <span class="insights-panel__toggle">${this.isExpanded ? 'Hide' : 'Show'}</span>
        </div>
        
        ${this.isExpanded ? `
          <div class="insights-panel__body">
            ${insights.map(insight => `
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

    generateInsights() {
        const data = getFilteredData();
        const summary = data.summary;
        const insights = [];
        const dateRange = `${data.dateRange.startMonth} - ${data.dateRange.endMonth}`;

        // Performance insight
        if (summary.categories[0].percentage > 85) {
            insights.push({
                icon: '[+]',
                type: 'positive',
                text: `Strong performance: ${summary.categories[0].percentage}% of investigations completed timely in ${dateRange}.`
            });
        } else if (summary.categories[0].percentage < 70) {
            insights.push({
                icon: '[!]',
                type: 'warning',
                text: `Attention needed: Only ${summary.categories[0].percentage}% timeliness rate in ${dateRange}.`
            });
        }

        // Volume insight
        if (data.months.length > 1) {
            const first = data.monthlyData[0].total;
            const last = data.monthlyData[data.monthlyData.length - 1].total;
            const growth = first > 0 ? ((last - first) / first * 100).toFixed(0) : 0;

            insights.push({
                icon: growth > 0 ? '[^]' : '[v]',
                type: 'info',
                text: `Volume ${growth > 0 ? 'increased' : 'decreased'} ${Math.abs(growth)}% from ${data.months[0]} to ${data.months[data.months.length - 1]}.`
            });
        }

        // Low pending rate
        if (summary.categories[2].percentage < 5) {
            insights.push({
                icon: '[+]',
                type: 'positive',
                text: `Excellent: Only ${summary.categories[2].percentage}% pending in the selected period.`
            });
        }

        // Anomaly detection
        const mean = data.timely.reduce((a, b) => a + b, 0) / data.timely.length;
        const stdDev = Math.sqrt(data.timely.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.timely.length);
        let anomalyCount = 0;
        data.timely.forEach(val => {
            if (Math.abs(val - mean) > 2 * stdDev) anomalyCount++;
        });

        if (anomalyCount > 0) {
            insights.push({
                icon: '[!]',
                type: 'warning',
                text: `${anomalyCount} statistical anomalies detected in ${dateRange} - may require review.`
            });
        }

        // Total summary
        insights.push({
            icon: '[i]',
            type: 'info',
            text: `Viewing ${data.months.length} months with ${summary.total.toLocaleString()} total investigations.`
        });

        return insights;
    }

    attachEventListeners() {
        const header = document.getElementById('insightsHeader');
        if (header) {
            header.addEventListener('click', () => {
                this.isExpanded = !this.isExpanded;
                this.updateDisplay();
            });
        }
    }

    destroy() {
        if (this.unsubscribe) this.unsubscribe();
    }
}
