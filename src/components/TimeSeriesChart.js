// Time Series Chart Component
import { Chart } from 'chart.js/auto';
import { investigationData } from '../data/investigationData.js';

export class TimeSeriesChart {
    constructor(containerId) {
        this.containerId = containerId;
        this.chart = null;
        this.showPercentages = false;
        this.visibleCategories = {
            timely: true,
            notTimely: true,
            pending: true
        };
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
    }

    createChart() {
        const canvas = document.getElementById('timeSeriesCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        const datasets = [];

        if (this.visibleCategories.timely) {
            datasets.push({
                label: 'Investigation Timely',
                data: this.showPercentages ? this.calculatePercentages('timely') : investigationData.timely,
                borderColor: '#3366cc',
                backgroundColor: '#3366cc',
                tension: 0.1,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 2,
                fill: false
            });
        }

        if (this.visibleCategories.notTimely) {
            datasets.push({
                label: 'Investigation Not Timely',
                data: this.showPercentages ? this.calculatePercentages('notTimely') : investigationData.notTimely,
                borderColor: '#cc33cc',
                backgroundColor: '#cc33cc',
                tension: 0.1,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 2,
                fill: false
            });
        }

        if (this.visibleCategories.pending) {
            datasets.push({
                label: 'Pending Investigation',
                data: this.showPercentages ? this.calculatePercentages('pending') : investigationData.pending,
                borderColor: '#00cccc',
                backgroundColor: '#00cccc',
                tension: 0.1,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 2,
                fill: false
            });
        }

        // Destroy existing chart if exists
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: investigationData.months,
                datasets: datasets
            },
            options: {
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
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: { size: 13 },
                        bodyFont: { size: 12 },
                        padding: 12,
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                if (this.showPercentages) {
                                    return `${context.dataset.label}: ${value.toFixed(1)}%`;
                                }
                                return `${context.dataset.label}: ${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: { size: 11 }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: { size: 11 },
                            callback: (value) => {
                                if (this.showPercentages) {
                                    return value + '%';
                                }
                                return value.toLocaleString();
                            }
                        },
                        title: {
                            display: true,
                            text: this.showPercentages ? 'Percentage' : 'Count',
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    calculatePercentages(category) {
        const data = investigationData[category];
        return data.map((value, index) => {
            const total = investigationData.timely[index] +
                investigationData.notTimely[index] +
                investigationData.pending[index];
            return (value / total) * 100;
        });
    }

    togglePercentages(showPercentages) {
        this.showPercentages = showPercentages;
        this.createChart();
    }

    toggleCategory(category, visible) {
        this.visibleCategories[category] = visible;
        this.createChart();
    }

    getCanvas() {
        return document.getElementById('timeSeriesCanvas');
    }
}
