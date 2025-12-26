// Investigation Data - Mock Dataset
// Designed for easy replacement with real API data

export const investigationData = {
    // Monthly data from Jan 2021 to Dec 2022
    months: [
        'Jan 21', 'Feb 21', 'Mar 21', 'Apr 21', 'May 21', 'Jun 21',
        'Jul 21', 'Aug 21', 'Sep 21', 'Oct 21', 'Nov 21', 'Dec 21',
        'Jan 22', 'Feb 22', 'Mar 22', 'Apr 22', 'May 22', 'Jun 22',
        'Jul 22', 'Aug 22', 'Sep 22', 'Oct 22', 'Nov 22', 'Dec 22'
    ],

    // Investigation counts by category
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
    ],

    // Current period summary (December 2022)
    summary: {
        timeframe: 'December, 2022',
        description: 'All referrals received in the selected month (12/01/22 to 12/31/22)',
        categories: [
            { name: 'Investigation Timely', count: 1737, percentage: 90.8 },
            { name: 'Investigation Not Timely', count: 152, percentage: 7.9 },
            { name: 'Pending Investigation', count: 24, percentage: 1.3 }
        ],
        total: 1913
    }
};

// Helper function to get monthly totals
export function getMonthlyTotals() {
    return investigationData.months.map((month, index) => ({
        month,
        timely: investigationData.timely[index],
        notTimely: investigationData.notTimely[index],
        pending: investigationData.pending[index],
        total: investigationData.timely[index] +
            investigationData.notTimely[index] +
            investigationData.pending[index]
    }));
}

// Helper function to get data for a specific month
export function getMonthData(monthIndex) {
    return {
        month: investigationData.months[monthIndex],
        timely: investigationData.timely[monthIndex],
        notTimely: investigationData.notTimely[monthIndex],
        pending: investigationData.pending[monthIndex]
    };
}

// Helper function to calculate percentages for any month
export function getMonthPercentages(monthIndex) {
    const data = getMonthData(monthIndex);
    const total = data.timely + data.notTimely + data.pending;
    return {
        month: data.month,
        timely: ((data.timely / total) * 100).toFixed(1),
        notTimely: ((data.notTimely / total) * 100).toFixed(1),
        pending: ((data.pending / total) * 100).toFixed(1)
    };
}

// Helper to get date range
export function getDateRange() {
    return {
        start: 'January 2021',
        end: 'December 2022'
    };
}

// Export for AI analysis
export function getAnalysisData() {
    return {
        raw: investigationData,
        monthly: getMonthlyTotals(),
        summary: investigationData.summary,
        dateRange: getDateRange()
    };
}
