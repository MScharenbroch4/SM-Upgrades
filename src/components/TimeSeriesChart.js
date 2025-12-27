// Time Series Chart Component - Consumes filtered data
import { Chart } from 'chart.js/auto';
import { getFilteredData, subscribeToFilters } from '../data/investigationData.js';

export class TimeSeriesChart {
    constructor(containerId) {
        this.containerId = containerId;
        this.chart = null;
        this.unsubscribe = null;
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

        // Subscribe to filter changes
        this.unsubscribe = subscribeToFilters((filteredData) => {
            this.updateChart(filteredData);
        });
    }

    createChart() {
        const canvas = document.getElementById('timeSeriesCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = getFilteredData();

        this.chart = new Chart(ctx, {
            type: 'line',
            data: this.getChartData(data),
            options: this.getChartOptions(data)
        });
    }

    getChartData(data) {
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

        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'right',
                    align: 'start',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        usePointStyle: true,
                        font: { size: 12 }
                    }
                },
                title: {
                    display: true,
                    text: `Investigation Trends (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`,
                    font: { size: 14, weight: 'bold' }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 13 },
                    bodyFont: { size: 12 },
                    padding: 12,
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
                        maxRotation: 45,
                        minRotation: 45,
                        font: { size: 11 }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        font: { size: 11 },
                        callback: (value) => isPercentage ? value + '%' : value.toLocaleString()
                    },
                    title: {
                        display: true,
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
