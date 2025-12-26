// AI Visualization Generator - Creates dynamic charts based on user requests
import { Chart } from 'chart.js/auto';
import { investigationData, getMonthlyTotals } from '../data/investigationData.js';

export class VisualizationGenerator {
    constructor() {
        this.monthlyData = getMonthlyTotals();
        this.currentChart = null;
        this.chartContainer = null;
        this.defaultChartType = 'pie';
    }

    // Set the chart container
    setContainer(container) {
        this.chartContainer = container;
    }

    // Parse user request and determine visualization type
    parseRequest(request) {
        const r = request.toLowerCase();

        // Chart type detection
        if (r.includes('stacked') && r.includes('bar')) {
            return { type: 'stackedBar', request };
        }
        if (r.includes('bar') || r.includes('column')) {
            return { type: 'bar', request };
        }
        if (r.includes('line') || r.includes('trend')) {
            return { type: 'line', request };
        }
        if (r.includes('area')) {
            return { type: 'area', request };
        }
        if (r.includes('heatmap') || r.includes('heat map')) {
            return { type: 'heatmap', request };
        }
        if (r.includes('pie') || r.includes('donut') || r.includes('doughnut')) {
            return { type: 'pie', request };
        }
        if (r.includes('cumulative') || r.includes('running total')) {
            return { type: 'cumulative', request };
        }
        if (r.includes('percentage') || r.includes('percent') || r.includes('proportion')) {
            return { type: 'percentageBar', request };
        }
        if (r.includes('radar') || r.includes('spider')) {
            return { type: 'radar', request };
        }

        // Default to bar if no specific type detected
        return { type: 'bar', request };
    }

    // Generate the visualization
    generateVisualization(request, canvas) {
        const parsed = this.parseRequest(request);

        // Destroy existing chart
        if (this.currentChart) {
            this.currentChart.destroy();
        }

        switch (parsed.type) {
            case 'bar':
                return this.createBarChart(canvas);
            case 'stackedBar':
                return this.createStackedBarChart(canvas);
            case 'line':
                return this.createLineChart(canvas);
            case 'area':
                return this.createAreaChart(canvas);
            case 'pie':
                return this.createPieChart(canvas);
            case 'heatmap':
                return this.createHeatmapChart(canvas);
            case 'cumulative':
                return this.createCumulativeChart(canvas);
            case 'percentageBar':
                return this.createPercentageBarChart(canvas);
            case 'radar':
                return this.createRadarChart(canvas);
            default:
                return this.createBarChart(canvas);
        }
    }

    // Bar Chart
    createBarChart(canvas) {
        const ctx = canvas.getContext('2d');
        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: investigationData.months,
                datasets: [
                    {
                        label: 'Investigation Timely',
                        data: investigationData.timely,
                        backgroundColor: 'rgba(51, 102, 204, 0.8)',
                        borderColor: '#3366cc',
                        borderWidth: 1
                    },
                    {
                        label: 'Investigation Not Timely',
                        data: investigationData.notTimely,
                        backgroundColor: 'rgba(204, 51, 204, 0.8)',
                        borderColor: '#cc33cc',
                        borderWidth: 1
                    },
                    {
                        label: 'Pending Investigation',
                        data: investigationData.pending,
                        backgroundColor: 'rgba(0, 204, 204, 0.8)',
                        borderColor: '#00cccc',
                        borderWidth: 1
                    }
                ]
            },
            options: this.getCommonOptions('Investigation Status by Month')
        });
        return { type: 'bar', chart: this.currentChart };
    }

    // Stacked Bar Chart
    createStackedBarChart(canvas) {
        const ctx = canvas.getContext('2d');
        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: investigationData.months,
                datasets: [
                    {
                        label: 'Investigation Timely',
                        data: investigationData.timely,
                        backgroundColor: '#3366cc',
                        stack: 'stack1'
                    },
                    {
                        label: 'Investigation Not Timely',
                        data: investigationData.notTimely,
                        backgroundColor: '#cc33cc',
                        stack: 'stack1'
                    },
                    {
                        label: 'Pending Investigation',
                        data: investigationData.pending,
                        backgroundColor: '#00cccc',
                        stack: 'stack1'
                    }
                ]
            },
            options: {
                ...this.getCommonOptions('Stacked Investigation Status by Month'),
                scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                }
            }
        });
        return { type: 'stackedBar', chart: this.currentChart };
    }

    // Line Chart
    createLineChart(canvas) {
        const ctx = canvas.getContext('2d');
        this.currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: investigationData.months,
                datasets: [
                    {
                        label: 'Investigation Timely',
                        data: investigationData.timely,
                        borderColor: '#3366cc',
                        backgroundColor: 'transparent',
                        tension: 0.1,
                        pointRadius: 4
                    },
                    {
                        label: 'Investigation Not Timely',
                        data: investigationData.notTimely,
                        borderColor: '#cc33cc',
                        backgroundColor: 'transparent',
                        tension: 0.1,
                        pointRadius: 4
                    },
                    {
                        label: 'Pending Investigation',
                        data: investigationData.pending,
                        borderColor: '#00cccc',
                        backgroundColor: 'transparent',
                        tension: 0.1,
                        pointRadius: 4
                    }
                ]
            },
            options: this.getCommonOptions('Investigation Trends Over Time')
        });
        return { type: 'line', chart: this.currentChart };
    }

    // Area Chart
    createAreaChart(canvas) {
        const ctx = canvas.getContext('2d');
        this.currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: investigationData.months,
                datasets: [
                    {
                        label: 'Investigation Timely',
                        data: investigationData.timely,
                        borderColor: '#3366cc',
                        backgroundColor: 'rgba(51, 102, 204, 0.3)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Investigation Not Timely',
                        data: investigationData.notTimely,
                        borderColor: '#cc33cc',
                        backgroundColor: 'rgba(204, 51, 204, 0.3)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Pending Investigation',
                        data: investigationData.pending,
                        borderColor: '#00cccc',
                        backgroundColor: 'rgba(0, 204, 204, 0.3)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: this.getCommonOptions('Investigation Area Distribution')
        });
        return { type: 'area', chart: this.currentChart };
    }

    // Pie Chart (Default)
    createPieChart(canvas) {
        const ctx = canvas.getContext('2d');
        const summary = investigationData.summary;

        this.currentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: summary.categories.map(c => c.name),
                datasets: [{
                    data: summary.categories.map(c => c.count),
                    backgroundColor: ['#3366cc', '#cc33cc', '#00cccc'],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    title: {
                        display: true,
                        text: 'Investigation Distribution - ' + summary.timeframe,
                        font: { size: 14, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        return { type: 'pie', chart: this.currentChart };
    }

    // Heatmap-style Chart (using bar chart with color scale)
    createHeatmapChart(canvas) {
        const ctx = canvas.getContext('2d');
        const monthlyData = this.monthlyData;

        // Calculate percentages for intensity
        const percentages = monthlyData.map(m => {
            const total = m.timely + m.notTimely + m.pending;
            return (m.timely / total) * 100;
        });

        // Create color scale based on timeliness
        const colors = percentages.map(p => {
            const hue = 120 * (p / 100); // Green = high, Red = low
            return `hsla(${hue}, 70%, 50%, 0.8)`;
        });

        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: investigationData.months,
                datasets: [{
                    label: 'Timeliness Rate %',
                    data: percentages,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c.replace('0.8', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                ...this.getCommonOptions('Timeliness Rate Heatmap'),
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Timeliness %'
                        }
                    }
                }
            }
        });
        return { type: 'heatmap', chart: this.currentChart };
    }

    // Cumulative Trend Chart
    createCumulativeChart(canvas) {
        const ctx = canvas.getContext('2d');

        // Calculate cumulative values
        let cumTimely = 0, cumNotTimely = 0, cumPending = 0;
        const cumulativeTimely = investigationData.timely.map(v => cumTimely += v);
        const cumulativeNotTimely = investigationData.notTimely.map(v => cumNotTimely += v);
        const cumulativePending = investigationData.pending.map(v => cumPending += v);

        this.currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: investigationData.months,
                datasets: [
                    {
                        label: 'Cumulative Timely',
                        data: cumulativeTimely,
                        borderColor: '#3366cc',
                        backgroundColor: 'rgba(51, 102, 204, 0.1)',
                        fill: true,
                        tension: 0.2
                    },
                    {
                        label: 'Cumulative Not Timely',
                        data: cumulativeNotTimely,
                        borderColor: '#cc33cc',
                        backgroundColor: 'rgba(204, 51, 204, 0.1)',
                        fill: true,
                        tension: 0.2
                    },
                    {
                        label: 'Cumulative Pending',
                        data: cumulativePending,
                        borderColor: '#00cccc',
                        backgroundColor: 'rgba(0, 204, 204, 0.1)',
                        fill: true,
                        tension: 0.2
                    }
                ]
            },
            options: this.getCommonOptions('Cumulative Investigation Trends')
        });
        return { type: 'cumulative', chart: this.currentChart };
    }

    // Percentage Bar Chart (100% stacked)
    createPercentageBarChart(canvas) {
        const ctx = canvas.getContext('2d');
        const monthlyData = this.monthlyData;

        const timelyPct = monthlyData.map(m => {
            const total = m.timely + m.notTimely + m.pending;
            return (m.timely / total) * 100;
        });
        const notTimelyPct = monthlyData.map(m => {
            const total = m.timely + m.notTimely + m.pending;
            return (m.notTimely / total) * 100;
        });
        const pendingPct = monthlyData.map(m => {
            const total = m.timely + m.notTimely + m.pending;
            return (m.pending / total) * 100;
        });

        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: investigationData.months,
                datasets: [
                    {
                        label: 'Timely %',
                        data: timelyPct,
                        backgroundColor: '#3366cc',
                        stack: 'stack1'
                    },
                    {
                        label: 'Not Timely %',
                        data: notTimelyPct,
                        backgroundColor: '#cc33cc',
                        stack: 'stack1'
                    },
                    {
                        label: 'Pending %',
                        data: pendingPct,
                        backgroundColor: '#00cccc',
                        stack: 'stack1'
                    }
                ]
            },
            options: {
                ...this.getCommonOptions('Investigation Distribution (%)'),
                scales: {
                    x: { stacked: true },
                    y: {
                        stacked: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Percentage'
                        }
                    }
                }
            }
        });
        return { type: 'percentageBar', chart: this.currentChart };
    }

    // Radar Chart (last 6 months comparison)
    createRadarChart(canvas) {
        const ctx = canvas.getContext('2d');
        const last6Months = investigationData.months.slice(-6);
        const last6Timely = investigationData.timely.slice(-6);
        const last6NotTimely = investigationData.notTimely.slice(-6);
        const last6Pending = investigationData.pending.slice(-6);

        this.currentChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: last6Months,
                datasets: [
                    {
                        label: 'Investigation Timely',
                        data: last6Timely,
                        borderColor: '#3366cc',
                        backgroundColor: 'rgba(51, 102, 204, 0.2)',
                        pointBackgroundColor: '#3366cc'
                    },
                    {
                        label: 'Investigation Not Timely',
                        data: last6NotTimely,
                        borderColor: '#cc33cc',
                        backgroundColor: 'rgba(204, 51, 204, 0.2)',
                        pointBackgroundColor: '#cc33cc'
                    },
                    {
                        label: 'Pending Investigation',
                        data: last6Pending,
                        borderColor: '#00cccc',
                        backgroundColor: 'rgba(0, 204, 204, 0.2)',
                        pointBackgroundColor: '#00cccc'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: 'Last 6 Months Comparison',
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
        return { type: 'radar', chart: this.currentChart };
    }

    // Common chart options
    getCommonOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: { size: 14, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { maxRotation: 45, minRotation: 45 }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                }
            }
        };
    }

    // Get available chart types
    getChartTypes() {
        return [
            { id: 'pie', label: 'Pie', icon: '' },
            { id: 'bar', label: 'Bar', icon: '' },
            { id: 'stackedBar', label: 'Stacked', icon: '' },
            { id: 'line', label: 'Line', icon: '' },
            { id: 'area', label: 'Area', icon: '' },
            { id: 'heatmap', label: 'Heatmap', icon: '' },
            { id: 'cumulative', label: 'Cumulative', icon: '' },
            { id: 'percentageBar', label: 'Percentage', icon: '%' }
        ];
    }

    // Reset to default pie chart
    resetToDefault(canvas) {
        return this.createPieChart(canvas);
    }
}

export const visualizationGenerator = new VisualizationGenerator();
