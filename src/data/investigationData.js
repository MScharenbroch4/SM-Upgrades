// Investigation Data - Mock Dataset with Centralized Filtering
// All components consume filtered data from this module

export const investigationData = {
    // Monthly data from Jan 2021 to Dec 2022
    months: [
        'Jan 21', 'Feb 21', 'Mar 21', 'Apr 21', 'May 21', 'Jun 21',
        'Jul 21', 'Aug 21', 'Sep 21', 'Oct 21', 'Nov 21', 'Dec 21',
        'Jan 22', 'Feb 22', 'Mar 22', 'Apr 22', 'May 22', 'Jun 22',
        'Jul 22', 'Aug 22', 'Sep 22', 'Oct 22', 'Nov 22', 'Dec 22'
    ],

    timely: [
        45, 52, 68, 85, 120, 135, 142, 158, 165, 172, 180, 188,
        195, 210, 225, 248, 265, 285, 310, 335, 358, 382, 405, 1737
    ],

    notTimely: [
        12, 15, 18, 22, 28, 32, 35, 38, 42, 45, 48, 52,
        55, 58, 62, 65, 68, 72, 75, 78, 82, 85, 88, 152
    ],

    pending: [
        3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 24
    ]
};

// ============================================
// CENTRALIZED FILTER STATE
// ============================================

class DataFilterState {
    constructor() {
        this.startIndex = 0;
        this.endIndex = investigationData.months.length - 1;
        this.displayMode = 'counts'; // 'counts' or 'percentages'
        this.categories = {
            timely: true,
            notTimely: true,
            pending: true
        };
        this.listeners = [];
    }

    // Subscribe to filter changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    // Notify all subscribers of changes
    notify() {
        this.listeners.forEach(callback => callback(this.getFilteredData()));
    }

    // Set date range filter
    setDateRange(startIndex, endIndex) {
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.notify();
    }

    // Set display mode (counts or percentages)
    setDisplayMode(mode) {
        this.displayMode = mode;
        this.notify();
    }

    // Toggle category visibility
    setCategory(category, visible) {
        this.categories[category] = visible;
        this.notify();
    }

    // Get current filter state
    getState() {
        return {
            startIndex: this.startIndex,
            endIndex: this.endIndex,
            displayMode: this.displayMode,
            categories: { ...this.categories }
        };
    }

    // ============================================
    // GET FILTERED DATA - SINGLE SOURCE OF TRUTH
    // ============================================

    getFilteredData() {
        const start = this.startIndex;
        const end = this.endIndex + 1; // inclusive end

        // Slice data based on date range
        const months = investigationData.months.slice(start, end);
        const timely = investigationData.timely.slice(start, end);
        const notTimely = investigationData.notTimely.slice(start, end);
        const pending = investigationData.pending.slice(start, end);

        // Calculate totals for filtered range
        const totalTimely = timely.reduce((a, b) => a + b, 0);
        const totalNotTimely = notTimely.reduce((a, b) => a + b, 0);
        const totalPending = pending.reduce((a, b) => a + b, 0);
        const grandTotal = totalTimely + totalNotTimely + totalPending;

        // Calculate percentages
        const timelyPct = grandTotal > 0 ? (totalTimely / grandTotal * 100).toFixed(1) : 0;
        const notTimelyPct = grandTotal > 0 ? (totalNotTimely / grandTotal * 100).toFixed(1) : 0;
        const pendingPct = grandTotal > 0 ? (totalPending / grandTotal * 100).toFixed(1) : 0;

        // Build summary for filtered data
        const summary = {
            timeframe: `${months[0]} - ${months[months.length - 1]}`,
            description: `Data from ${months[0]} to ${months[months.length - 1]}`,
            categories: [
                { id: 'timely', name: 'Investigation Timely', count: totalTimely, percentage: parseFloat(timelyPct), color: '#3366cc' },
                { id: 'notTimely', name: 'Investigation Not Timely', count: totalNotTimely, percentage: parseFloat(notTimelyPct), color: '#cc33cc' },
                { id: 'pending', name: 'Pending Investigation', count: totalPending, percentage: parseFloat(pendingPct), color: '#00cccc' }
            ],
            total: grandTotal
        };

        // Monthly data with calculations
        const monthlyData = months.map((month, i) => {
            const total = timely[i] + notTimely[i] + pending[i];
            return {
                month,
                timely: timely[i],
                notTimely: notTimely[i],
                pending: pending[i],
                total,
                timelyPct: total > 0 ? (timely[i] / total * 100) : 0,
                notTimelyPct: total > 0 ? (notTimely[i] / total * 100) : 0,
                pendingPct: total > 0 ? (pending[i] / total * 100) : 0
            };
        });

        return {
            // Raw filtered arrays
            months,
            timely,
            notTimely,
            pending,

            // Aggregated data
            summary,
            monthlyData,

            // Filter state
            displayMode: this.displayMode,
            categories: { ...this.categories },

            // Date range info
            dateRange: {
                startIndex: this.startIndex,
                endIndex: this.endIndex,
                startMonth: months[0],
                endMonth: months[months.length - 1]
            }
        };
    }
}

// Singleton instance - all components use this
export const filterState = new DataFilterState();

// Convenience functions
export function getFilteredData() {
    return filterState.getFilteredData();
}

export function subscribeToFilters(callback) {
    return filterState.subscribe(callback);
}

export function setDateRange(startIndex, endIndex) {
    filterState.setDateRange(startIndex, endIndex);
}

export function setDisplayMode(mode) {
    filterState.setDisplayMode(mode);
}

export function setCategory(category, visible) {
    filterState.setCategory(category, visible);
}

export function getFullMonthsList() {
    return investigationData.months;
}

export function getFilterState() {
    return filterState.getState();
}
