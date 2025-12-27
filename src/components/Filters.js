// Filters Component - Interactive Dashboard Controls
// Authoritative date range filter that affects all components
import {
  investigationData,
  getFullMonthsList,
  setDateRange,
  setDisplayMode,
  setCategory,
  getFilterState
} from '../data/investigationData.js';

export class Filters {
  constructor(containerId) {
    this.containerId = containerId;
    this.months = getFullMonthsList();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const state = getFilterState();

    container.innerHTML = `
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">Date Range:</span>
          <select class="filter-select" id="startMonthFilter">
            ${this.months.map((month, i) => `
              <option value="${i}" ${i === state.startIndex ? 'selected' : ''}>
                ${month}
              </option>
            `).join('')}
          </select>
          <span class="filter-label">to</span>
          <select class="filter-select" id="endMonthFilter">
            ${this.months.map((month, i) => `
              <option value="${i}" ${i === state.endIndex ? 'selected' : ''}>
                ${month}
              </option>
            `).join('')}
          </select>
          <button class="btn btn--secondary btn--small" id="resetDateRange">Reset</button>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">Display:</span>
          <div class="filter-toggle">
            <button class="filter-toggle__btn ${state.displayMode === 'counts' ? 'filter-toggle__btn--active' : ''}" 
                    data-mode="counts">
              Counts
            </button>
            <button class="filter-toggle__btn ${state.displayMode === 'percentages' ? 'filter-toggle__btn--active' : ''}" 
                    data-mode="percentages">
              Percentages
            </button>
          </div>
        </div>
        
        <div class="filter-group">
          <span class="filter-label">Show:</span>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterTimely" ${state.categories.timely ? 'checked' : ''}>
            <span style="color: var(--color-timely)">■</span> Timely
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterNotTimely" ${state.categories.notTimely ? 'checked' : ''}>
            <span style="color: var(--color-not-timely)">■</span> Not Timely
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterPending" ${state.categories.pending ? 'checked' : ''}>
            <span style="color: var(--color-pending)">■</span> Pending
          </label>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Date range selectors
    const startFilter = document.getElementById('startMonthFilter');
    const endFilter = document.getElementById('endMonthFilter');
    const resetBtn = document.getElementById('resetDateRange');

    if (startFilter) {
      startFilter.addEventListener('change', (e) => {
        const startIdx = parseInt(e.target.value);
        const endIdx = parseInt(endFilter.value);

        // Ensure start <= end
        if (startIdx <= endIdx) {
          setDateRange(startIdx, endIdx);
        } else {
          // Auto-adjust end to match start
          setDateRange(startIdx, startIdx);
          this.render(); // Re-render to update select
        }
      });
    }

    if (endFilter) {
      endFilter.addEventListener('change', (e) => {
        const endIdx = parseInt(e.target.value);
        const startIdx = parseInt(startFilter.value);

        // Ensure start <= end
        if (startIdx <= endIdx) {
          setDateRange(startIdx, endIdx);
        } else {
          // Auto-adjust start to match end
          setDateRange(endIdx, endIdx);
          this.render(); // Re-render to update select
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        setDateRange(0, this.months.length - 1);
        this.render();
      });
    }

    // Display mode toggle
    const toggleBtns = document.querySelectorAll('.filter-toggle__btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        setDisplayMode(e.target.dataset.mode);
        this.render();
      });
    });

    // Category checkboxes
    const timelyCheck = document.getElementById('filterTimely');
    const notTimelyCheck = document.getElementById('filterNotTimely');
    const pendingCheck = document.getElementById('filterPending');

    if (timelyCheck) {
      timelyCheck.addEventListener('change', (e) => {
        setCategory('timely', e.target.checked);
      });
    }

    if (notTimelyCheck) {
      notTimelyCheck.addEventListener('change', (e) => {
        setCategory('notTimely', e.target.checked);
      });
    }

    if (pendingCheck) {
      pendingCheck.addEventListener('change', (e) => {
        setCategory('pending', e.target.checked);
      });
    }
  }
}
