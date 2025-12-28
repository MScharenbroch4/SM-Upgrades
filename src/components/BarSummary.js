// Bar Summary Component - Consumes filtered data
import { getFilteredData, subscribeToFilters } from '../data/investigationData.js';
import { getSDMFilteredData, subscribeToSDMFilters } from '../data/sdmScreeningData.js';


export class BarSummary {
  constructor(containerId, dataOptions = null) {
    this.containerId = containerId;
    this.unsubscribe = null;
    this.dataOptions = dataOptions;
    this.isSDM = dataOptions !== null;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    this.updateDisplay();

    // Subscribe to appropriate filter changes
    if (this.isSDM) {
      this.unsubscribe = subscribeToSDMFilters(() => {
        this.updateDisplay();
      });
    } else {
      this.unsubscribe = subscribeToFilters(() => {
        this.updateDisplay();
      });
    }
  }

  updateDisplay() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    let data;
    let title = "Time to Investigation Summary";
    let countTitle = "Time to Investigation Count %";

    if (this.isSDM) {
      data = getSDMFilteredData();
      title = data.title || "SDM Screening Decision Summary";
      countTitle = "Screening Decision Count %";
    } else {
      data = getFilteredData();
    }

    const summary = data.summary;

    // Generate rows dynamically
    const rows = summary.categories.map(cat => `
            <div class="bar-summary__row">
              <span class="bar-summary__label">${cat.name}</span>
              <div class="bar-summary__bar-container">
                <div class="bar-summary__bar" 
                     style="width: ${cat.percentage}%; background-color: ${cat.color || this.getColor(cat.id)}"></div>
              </div>
              <span class="bar-summary__count">${cat.count.toLocaleString()}</span>
              <span class="bar-summary__percentage">${cat.percentage}%</span>
            </div>
        `).join('');

    container.innerHTML = `
      <div class="bar-summary">
        <div class="bar-summary__header">
          <span class="bar-summary__title">${title}</span>
        </div>
        
        <div class="bar-summary__subheader">
           ${countTitle}
        </div>
        
        ${rows}
        
        <div class="bar-summary__row bar-summary__row--total">
          <span class="bar-summary__label">Total</span>
          <div class="bar-summary__bar-container">
             <div class="bar-summary__bar" style="width: 100%; background-color: #f0f0f0;"></div>
          </div>
          <span class="bar-summary__count">${summary.total.toLocaleString()}</span>
          <span class="bar-summary__percentage">100%</span>
        </div>
      </div>
      
      <div class="bar-summary__date-range">
        Data period: ${data.dateRange ? (data.dateRange.full || `${data.dateRange.startMonth} - ${data.dateRange.endMonth}`) : 'Selected Period'}
      </div>
    `;
  }

  getColor(id) {
    const colors = {
      screenIn: '#3366cc',
      evaluateOut: '#cc33cc',
      overrideInPerson: '#00cc99',
      overrideEvalOut: '#ff3399',
      timely: '#3366cc',
      notTimely: '#cc33cc',
      pending: '#00cccc'
    };
    return colors[id] || '#ccc';
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
