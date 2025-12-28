// Time Series Chart Component - Consumes filtered data
import { Chart } from 'chart.js/auto';
import { getFilteredData, subscribeToFilters } from '../data/investigationData.js';
import { getSDMFilteredData, subscribeToSDMFilters } from '../data/sdmScreeningData.js';


export class TimeSeriesChart {
    constructor(containerId, dataOptions = null) {
        this.containerId = containerId;
        this.chart = null;
        this.unsubscribe = null;
        this.dataOptions = dataOptions; // If set, indicates SDM mode
        this.isSDM = dataOptions !== null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
      <div class="chart-container chart-container--timeseries">
        <canvas id="timeSeriesCanvas"></canvas>
      </div>
    `;

        this.createChart();

        // Subscribe to appropriate filter changes
        if (this.isSDM) {
            this.unsubscribe = subscribeToSDMFilters((filteredData) => {
                this.updateChart(filteredData);
            });
        } else {
            this.unsubscribe = subscribeToFilters((filteredData) => {
                this.updateChart(filteredData);
            });
        }
    }

    createChart() {
        const canvas = document.getElementById('timeSeriesCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let data;

        if (this.isSDM) {
            data = getSDMFilteredData();
        } else {
            data = getFilteredData();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: this.getChartData(data),
            options: this.getChartOptions(data)
        });
    }

    getChartData(data) {
        // Handle SDM Screen Data Structure (check for SDM-specific properties)
        if (data.chartData && data.chartData.screenIn !== undefined) {
            const isPercentage = data.displayMode === 'percentages';
            const categories = data.categories || { screenIn: true, evaluateOut: true, overrideInPerson: true, overrideEvalOut: true };

            // Calculate percentage values if needed
            let screenInData = data.chartData.screenIn;
            let evaluateOutData = data.chartData.evaluateOut;
            let overrideInPersonData = data.chartData.overrideInPerson;
            let overrideEvalOutData = data.chartData.overrideEvalOut;

            if (isPercentage) {
                // Calculate percentage for each month (each series as % of total for that month)
                const monthlyTotals = screenInData.map((_, i) =>
                    screenInData[i] + evaluateOutData[i] + overrideInPersonData[i] + overrideEvalOutData[i]
                );

                screenInData = screenInData.map((val, i) => monthlyTotals[i] > 0 ? (val / monthlyTotals[i] * 100) : 0);
                evaluateOutData = evaluateOutData.map((val, i) => monthlyTotals[i] > 0 ? (val / monthlyTotals[i] * 100) : 0);
                overrideInPersonData = overrideInPersonData.map((val, i) => monthlyTotals[i] > 0 ? (val / monthlyTotals[i] * 100) : 0);
                overrideEvalOutData = overrideEvalOutData.map((val, i) => monthlyTotals[i] > 0 ? (val / monthlyTotals[i] * 100) : 0);
            }

            // Build datasets based on category visibility
            const datasets = [];

            if (categories.screenIn) {
                datasets.push({
                    label: 'Screen In',
                    data: screenInData,
                    borderColor: '#3366cc',
                    backgroundColor: '#3366cc',
                    tension: 0.1,
                    pointRadius: 3,
                    borderWidth: 1.5,
                    fill: false
                });
            }

            if (categories.evaluateOut) {
                datasets.push({
                    label: 'Evaluate Out',
                    data: evaluateOutData,
                    borderColor: '#cc33cc',
                    backgroundColor: '#cc33cc',
                    tension: 0.1,
                    pointRadius: 3,
                    borderWidth: 1.5,
                    fill: false
                });
            }

            if (categories.overrideInPerson) {
                datasets.push({
                    label: 'Override to In Person',
                    data: overrideInPersonData,
                    borderColor: '#00cc99',
                    backgroundColor: '#00cc99',
                    tension: 0.1,
                    pointRadius: 3,
                    borderWidth: 1.5,
                    fill: false
                });
            }

            if (categories.overrideEvalOut) {
                datasets.push({
                    label: 'Override to Eval Out',
                    data: overrideEvalOutData,
                    borderColor: '#ff3399',
                    backgroundColor: '#ff3399',
                    tension: 0.1,
                    pointRadius: 3,
                    borderWidth: 1.5,
                    fill: false
                });
            }

            return {
                labels: data.labels,
                datasets
            };
        }

        // Handle Default Investigation Data Structure
        const datasets = [];

        if (data.categories.timely) {
            datasets.push({
                label: 'Investigation Timely',
                data: data.displayMode === 'percentages'
                    ? data.monthlyData.map(m => m.timelyPct)
                    : data.timely,
                borderColor: '#3366cc',
                backgroundColor: '#3366cc',
                tension: 0.1,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 2,
                fill: false
            });
        }

        if (data.categories.notTimely) {
            datasets.push({
                label: 'Investigation Not Timely',
                data: data.displayMode === 'percentages'
                    ? data.monthlyData.map(m => m.notTimelyPct)
                    : data.notTimely,
                borderColor: '#cc33cc',
                backgroundColor: '#cc33cc',
                tension: 0.1,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 2,
                fill: false
            });
        }

        if (data.categories.pending) {
            datasets.push({
                label: 'Pending Investigation',
                data: data.displayMode === 'percentages'
                    ? data.monthlyData.map(m => m.pendingPct)
                    : data.pending,
                borderColor: '#00cccc',
                backgroundColor: '#00cccc',
                tension: 0.1,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 2,
                fill: false
            });
        }

        return {
            labels: data.months,
            datasets
        };
    }

    getChartOptions(data) {
        const isPercentage = data.displayMode === 'percentages';
        const isMobile = window.innerWidth < 768;

        let titleText = `Investigation Trends (${data.dateRange?.startMonth} - ${data.dateRange?.endMonth})`;
        if (data.title) {
            titleText = `Screening Decisions (${data.dateRange?.full})`;
        }

        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: isMobile ? 'bottom' : 'right',
                    align: isMobile ? 'center' : 'start',
                    labels: {
                        boxWidth: isMobile ? 10 : 12,
                        padding: isMobile ? 10 : 15,
                        usePointStyle: true,
                        font: { size: isMobile ? 10 : 12 }
                    }
                },
                title: {
                    display: true,
                    text: titleText,
                    font: { size: isMobile ? 12 : 14, weight: 'bold' }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: isMobile ? 11 : 13 },
                    bodyFont: { size: isMobile ? 10 : 12 },
                    padding: isMobile ? 8 : 12,
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed.y;
                            if (isPercentage) {
                                return `${context.dataset.label}: ${value.toFixed(1)}%`;
                            }
                            return `${context.dataset.label}: ${value.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        maxRotation: isMobile ? 60 : 45,
                        minRotation: isMobile ? 60 : 45,
                        font: { size: isMobile ? 9 : 11 },
                        maxTicksLimit: isMobile ? 6 : 12
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        font: { size: isMobile ? 9 : 11 },
                        callback: (value) => isPercentage ? value + '%' : value.toLocaleString()
                    },
                    title: {
                        display: !isMobile,
                        text: isPercentage ? 'Percentage' : 'Count',
                        font: { size: 12 }
                    }
                }
            }
        };
    }

    updateChart(data) {
        if (!this.chart) return;

        this.chart.data = this.getChartData(data);
        this.chart.options = this.getChartOptions(data);
        this.chart.update('active');
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        if (this.chart) {
            this.chart.destroy();
        }
    }

    getCanvas() {
        return document.getElementById('timeSeriesCanvas');
    }
}
