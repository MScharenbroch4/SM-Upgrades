// Bar Summary Component - Consumes filtered data
import { getFilteredData, subscribeToFilters } from '../data/investigationData.js';

export class BarSummary {
    constructor(containerId) {
        this.containerId = containerId;
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

        const data = getFilteredData();
        const summary = data.summary;

        container.innerHTML = `
      <div class="bar-summary">
        <div class="bar-summary__header">
          <span class="bar-summary__title">Time to Investigation</span>
          <span class="bar-summary__count-header">Count</span>
          <span class="bar-summary__pct-header">%</span>
        </div>
        
        <div class="bar-summary__row">
          <span class="bar-summary__label">Investigation Timely</span>
          <div class="bar-summary__bar-container">
            <div class="bar-summary__bar bar-summary__bar--timely" 
                 style="width: ${summary.categories[0].percentage}%"></div>
          </div>
          <span class="bar-summary__count">${summary.categories[0].count.toLocaleString()}</span>
          <span class="bar-summary__percentage">${summary.categories[0].percentage}%</span>
        </div>
        
        <div class="bar-summary__row">
          <span class="bar-summary__label">Investigation Not Timely</span>
          <div class="bar-summary__bar-container">
            <div class="bar-summary__bar bar-summary__bar--not-timely" 
                 style="width: ${summary.categories[1].percentage}%"></div>
          </div>
          <span class="bar-summary__count">${summary.categories[1].count.toLocaleString()}</span>
          <span class="bar-summary__percentage">${summary.categories[1].percentage}%</span>
        </div>
        
        <div class="bar-summary__row">
          <span class="bar-summary__label">Pending Investigation</span>
          <div class="bar-summary__bar-container">
            <div class="bar-summary__bar bar-summary__bar--pending" 
                 style="width: ${summary.categories[2].percentage}%"></div>
          </div>
          <span class="bar-summary__count">${summary.categories[2].count.toLocaleString()}</span>
          <span class="bar-summary__percentage">${summary.categories[2].percentage}%</span>
        </div>
        
        <div class="bar-summary__row bar-summary__row--total">
          <span class="bar-summary__label">Total</span>
          <div class="bar-summary__bar-container"></div>
          <span class="bar-summary__count">${summary.total.toLocaleString()}</span>
          <span class="bar-summary__percentage">100%</span>
        </div>
      </div>
      
      <div class="bar-summary__date-range">
        Data period: ${data.dateRange.startMonth} - ${data.dateRange.endMonth}
      </div>
    `;
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}
