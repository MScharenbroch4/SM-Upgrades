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

import {
  getSDMMonthsList,
  setSDMDateRange,
  setSDMDisplayMode,
  setSDMCategory,
  getSDMFilterState
} from '../data/sdmScreeningData.js';

export class Filters {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = { showCategories: true, isSDM: false, ...options };
    this.months = this.options.isSDM ? getSDMMonthsList() : getFullMonthsList();
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const state = this.options.isSDM ? getSDMFilterState() : getFilterState();

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
        
        ${this.options.showCategories && !this.options.isSDM ? `
        <div class="filter-group">
          <span class="filter-label">Show:</span>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterTimely" ${state.categories?.timely ? 'checked' : ''}>
            <span style="color: var(--color-timely)">■</span> Timely
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterNotTimely" ${state.categories?.notTimely ? 'checked' : ''}>
            <span style="color: var(--color-not-timely)">■</span> Not Timely
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterPending" ${state.categories?.pending ? 'checked' : ''}>
            <span style="color: var(--color-pending)">■</span> Pending
          </label>
        </div>
        ` : ''}
        
        ${this.options.isSDM ? `
        <div class="filter-group">
          <span class="filter-label">Show:</span>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterScreenIn" ${state.categories?.screenIn ? 'checked' : ''}>
            <span style="color: #3366cc">■</span> Screen In
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterEvaluateOut" ${state.categories?.evaluateOut ? 'checked' : ''}>
            <span style="color: #cc33cc">■</span> Evaluate Out
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterOverrideIn" ${state.categories?.overrideInPerson ? 'checked' : ''}>
            <span style="color: #00cc99">■</span> Override In
          </label>
          <label class="filter-checkbox">
            <input type="checkbox" id="filterOverrideOut" ${state.categories?.overrideEvalOut ? 'checked' : ''}>
            <span style="color: #ff3399">■</span> Override Out
          </label>
        </div>
        ` : ''}
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    // Date range selectors
    const startFilter = document.getElementById('startMonthFilter');
    const endFilter = document.getElementById('endMonthFilter');
    const resetBtn = document.getElementById('resetDateRange');

    // Helper to call correct setter based on mode
    const updateDateRange = (start, end) => {
      if (this.options.isSDM) {
        setSDMDateRange(start, end);
      } else {
        setDateRange(start, end);
      }
    };

    const updateDisplayMode = (mode) => {
      if (this.options.isSDM) {
        setSDMDisplayMode(mode);
      } else {
        setDisplayMode(mode);
      }
    };

    if (startFilter) {
      startFilter.addEventListener('change', (e) => {
        const startIdx = parseInt(e.target.value);
        const endIdx = parseInt(endFilter.value);

        // Ensure start <= end
        if (startIdx <= endIdx) {
          updateDateRange(startIdx, endIdx);
        } else {
          // Auto-adjust end to match start
          updateDateRange(startIdx, startIdx);
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
          updateDateRange(startIdx, endIdx);
        } else {
          // Auto-adjust start to match end
          updateDateRange(endIdx, endIdx);
          this.render(); // Re-render to update select
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        updateDateRange(0, this.months.length - 1);
        this.render();
      });
    }

    // Display mode toggle
    const toggleBtns = document.querySelectorAll('.filter-toggle__btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        if (mode) {
          updateDisplayMode(mode);
          this.render();
        }
      });
    });

    // Category checkboxes - Investigation
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

    // Category checkboxes - SDM
    const screenInCheck = document.getElementById('filterScreenIn');
    const evaluateOutCheck = document.getElementById('filterEvaluateOut');
    const overrideInCheck = document.getElementById('filterOverrideIn');
    const overrideOutCheck = document.getElementById('filterOverrideOut');

    if (screenInCheck) {
      screenInCheck.addEventListener('change', (e) => {
        setSDMCategory('screenIn', e.target.checked);
      });
    }

    if (evaluateOutCheck) {
      evaluateOutCheck.addEventListener('change', (e) => {
        setSDMCategory('evaluateOut', e.target.checked);
      });
    }

    if (overrideInCheck) {
      overrideInCheck.addEventListener('change', (e) => {
        setSDMCategory('overrideInPerson', e.target.checked);
      });
    }

    if (overrideOutCheck) {
      overrideOutCheck.addEventListener('change', (e) => {
        setSDMCategory('overrideEvalOut', e.target.checked);
      });
    }
  }
}
