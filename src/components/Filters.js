// Filters Component - Interactive Dashboard Controls
import { investigationData } from '../data/investigationData.js';

export class Filters {
    constructor(containerId, onFilterChange) {
        this.containerId = containerId;
        this.onFilterChange = onFilterChange;

        this.state = {
            displayMode: 'counts', // 'counts' or 'percentages'
            categories: {
                timely: true,
                notTimely: true,
                pending: true
            },
            dateRange: {
                start: 0,
                end: investigationData.months.length - 1
            }
        };
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">Timeframe:</span>
          <select class="filter-select" id="startMonthFilter">
            ${investigationData.months.map((month, i) => `
              <option value="${i}" ${i === this.state.dateRange.start ? 'selected' : ''}>
                ${month}
              </option>
            `).join('')}
          </select>
          <span class="filter-label">to</span>
          <select class="filter-select" id="endMonthFilter">
            ${investigationData.months.map((month, i) => `
              <option value="${i}" ${i === this.state.dateRange.end ? 'selected' : ''}>
                ${month}
              </option>
            `).join('')}
          </select>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">Display:</span>
          <div class="filter-toggle">
            <button class="filter-toggle__btn ${this.state.displayMode === 'counts' ? 'filter-toggle__btn--active' : ''}" 
                    data-mode="counts">
              Counts
            </button>
            <button class="filter-toggle__btn ${this.state.displayMode === 'percentages' ? 'filter-toggle__btn--active' : ''}" 
                    data-mode="percentages">
              Percentages
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">Show:</span>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterTimely" ${this.state.categories.timely ? 'checked' : ''}>
            <span style="color: var(--color-timely)">■</span> Timely
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterNotTimely" ${this.state.categories.notTimely ? 'checked' : ''}>
            <span style="color: var(--color-not-timely)">■</span> Not Timely
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterPending" ${this.state.categories.pending ? 'checked' : ''}>
            <span style="color: var(--color-pending)">■</span> Pending
          </label>
        </div>
      </div>
    `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Display mode toggle
        const toggleBtns = document.querySelectorAll('.filter-toggle__btn');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.state.displayMode = e.target.dataset.mode;
                this.render();
                this.notifyChange();
            });
        });

        // Date range selectors
        const startFilter = document.getElementById('startMonthFilter');
        const endFilter = document.getElementById('endMonthFilter');

        if (startFilter) {
            startFilter.addEventListener('change', (e) => {
                this.state.dateRange.start = parseInt(e.target.value);
                this.notifyChange();
            });
        }

        if (endFilter) {
            endFilter.addEventListener('change', (e) => {
                this.state.dateRange.end = parseInt(e.target.value);
                this.notifyChange();
            });
        }

        // Category checkboxes
        const timelyCheck = document.getElementById('filterTimely');
        const notTimelyCheck = document.getElementById('filterNotTimely');
        const pendingCheck = document.getElementById('filterPending');

        if (timelyCheck) {
            timelyCheck.addEventListener('change', (e) => {
                this.state.categories.timely = e.target.checked;
                this.notifyChange();
            });
        }

        if (notTimelyCheck) {
            notTimelyCheck.addEventListener('change', (e) => {
                this.state.categories.notTimely = e.target.checked;
                this.notifyChange();
            });
        }

        if (pendingCheck) {
            pendingCheck.addEventListener('change', (e) => {
                this.state.categories.pending = e.target.checked;
                this.notifyChange();
            });
        }
    }

    notifyChange() {
        if (this.onFilterChange) {
            this.onFilterChange(this.state);
        }
    }

    getState() {
        return this.state;
    }
}
