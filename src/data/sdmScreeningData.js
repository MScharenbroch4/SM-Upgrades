// SDM Hotline Screening Decision Data
// Timeframe: Jul 21 - Dec 22 (18 months)

export const sdmScreeningData = {
    title: "SDM Hotline Screening Decision",
    dateRange: {
        start: "Jul 21",
        end: "Dec 22",
        full: "Jul 21 - Dec 22"
    },

    // X-Axis Labels
    labels: [
        'Jul 21', 'Aug 21', 'Sep 21', 'Oct 21', 'Nov 21', 'Dec 21',
        'Jan 22', 'Feb 22', 'Mar 22', 'Apr 22', 'May 22', 'Jun 22',
        'Jul 22', 'Aug 22', 'Sep 22', 'Oct 22', 'Nov 22', 'Dec 22'
    ],

    // Line Chart Series Data
    chartData: {
        screenIn: [950, 960, 1120, 1180, 1190, 1220, 1290, 1250, 1230, 1310, 1420, 1360, 1380, 1440, 1560, 1602, 1750, 1765],
        evaluateOut: [380, 390, 310, 320, 330, 325, 300, 305, 315, 300, 290, 310, 320, 360, 350, 370, 365, 380],
        overrideInPerson: [40, 45, 35, 42, 40, 38, 41, 39, 45, 40, 38, 42, 40, 35, 38, 28, 30, 28],
        overrideEvalOut: [30, 28, 25, 30, 28, 25, 27, 26, 30, 28, 25, 27, 26, 25, 25, 21, 22, 21]
    },

    // Summary Table Data
    summary: {
        total: 1848,
        categories: [
            { id: 'screenIn', name: 'Screen In', count: 1602, percentage: 86.7, color: '#3366cc' },
            { id: 'evaluateOut', name: 'Evaluate Out', count: 197, percentage: 10.7, color: '#cc33cc' },
            { id: 'overrideInPerson', name: 'Override to In Person', count: 28, percentage: 1.5, color: '#00cc99' },
            { id: 'overrideEvalOut', name: 'Override to Eval Out', count: 21, percentage: 1.1, color: '#ff3399' }
        ]
    }
};

// ============================================
// CENTRALIZED FILTER STATE FOR SDM
// ============================================

class SDMFilterState {
    constructor() {
        this.startIndex = 0;
        this.endIndex = sdmScreeningData.labels.length - 1;
        this.displayMode = 'counts';
        this.categories = {
            screenIn: true,
            evaluateOut: true,
            overrideInPerson: true,
            overrideEvalOut: true
        };
        this.listeners = [];
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        this.listeners.forEach(callback => callback(this.getFilteredData()));
    }

    setDateRange(startIndex, endIndex) {
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.notify();
    }

    setDisplayMode(mode) {
        this.displayMode = mode;
        this.notify();
    }

    setCategory(category, enabled) {
        if (this.categories.hasOwnProperty(category)) {
            this.categories[category] = enabled;
            this.notify();
        }
    }

    getState() {
        return {
            startIndex: this.startIndex,
            endIndex: this.endIndex,
            displayMode: this.displayMode,
            categories: { ...this.categories }
        };
    }

    getFilteredData() {
        const start = this.startIndex;
        const end = this.endIndex + 1;

        const labels = sdmScreeningData.labels.slice(start, end);
        const screenIn = sdmScreeningData.chartData.screenIn.slice(start, end);
        const evaluateOut = sdmScreeningData.chartData.evaluateOut.slice(start, end);
        const overrideInPerson = sdmScreeningData.chartData.overrideInPerson.slice(start, end);
        const overrideEvalOut = sdmScreeningData.chartData.overrideEvalOut.slice(start, end);

        // Calculate totals for filtered range
        const totalScreenIn = screenIn.reduce((a, b) => a + b, 0);
        const totalEvalOut = evaluateOut.reduce((a, b) => a + b, 0);
        const totalOverrideIn = overrideInPerson.reduce((a, b) => a + b, 0);
        const totalOverrideEval = overrideEvalOut.reduce((a, b) => a + b, 0);
        const grandTotal = totalScreenIn + totalEvalOut + totalOverrideIn + totalOverrideEval;

        // Calculate percentages
        const screenInPct = grandTotal > 0 ? (totalScreenIn / grandTotal * 100).toFixed(1) : 0;
        const evalOutPct = grandTotal > 0 ? (totalEvalOut / grandTotal * 100).toFixed(1) : 0;
        const overrideInPct = grandTotal > 0 ? (totalOverrideIn / grandTotal * 100).toFixed(1) : 0;
        const overrideEvalPct = grandTotal > 0 ? (totalOverrideEval / grandTotal * 100).toFixed(1) : 0;

        const summary = {
            total: grandTotal,
            categories: [
                { id: 'screenIn', name: 'Screen In', count: totalScreenIn, percentage: parseFloat(screenInPct), color: '#3366cc' },
                { id: 'evaluateOut', name: 'Evaluate Out', count: totalEvalOut, percentage: parseFloat(evalOutPct), color: '#cc33cc' },
                { id: 'overrideInPerson', name: 'Override to In Person', count: totalOverrideIn, percentage: parseFloat(overrideInPct), color: '#00cc99' },
                { id: 'overrideEvalOut', name: 'Override to Eval Out', count: totalOverrideEval, percentage: parseFloat(overrideEvalPct), color: '#ff3399' }
            ]
        };

        return {
            title: sdmScreeningData.title,
            labels,
            chartData: {
                screenIn,
                evaluateOut,
                overrideInPerson,
                overrideEvalOut
            },
            summary,
            displayMode: this.displayMode,
            categories: { ...this.categories },
            dateRange: {
                start: labels[0],
                end: labels[labels.length - 1],
                full: `${labels[0]} - ${labels[labels.length - 1]}`,
                startMonth: labels[0],
                endMonth: labels[labels.length - 1]
            }
        };
    }
}

// Singleton instance
export const sdmFilterState = new SDMFilterState();

// Convenience functions
export function getSDMFilteredData() {
    return sdmFilterState.getFilteredData();
}

export function subscribeToSDMFilters(callback) {
    return sdmFilterState.subscribe(callback);
}

export function setSDMDateRange(startIndex, endIndex) {
    sdmFilterState.setDateRange(startIndex, endIndex);
}

export function setSDMDisplayMode(mode) {
    sdmFilterState.setDisplayMode(mode);
}

export function setSDMCategory(category, enabled) {
    sdmFilterState.setCategory(category, enabled);
}

export function getSDMMonthsList() {
    return sdmScreeningData.labels;
}

export function getSDMFilterState() {
    return sdmFilterState.getState();
}
