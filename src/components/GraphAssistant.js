// Graph Assistant Component - Visualization Selector with filtered data
import { Chart } from 'chart.js/auto';
import { getFilteredData, subscribeToFilters } from '../data/investigationData.js';
import { getSDMFilteredData, subscribeToSDMFilters } from '../data/sdmScreeningData.js';
import { accessibilityReader } from '../accessibility/AccessibilityToggle.js';

export class GraphAssistant {
    constructor(containerId, dataOptions = null) {
        this.containerId = containerId;
        this.currentChartType = 'pie'; // Default to pie to support summary data visualization
        this.chart = null;
        this.unsubscribe = null;
        this.dataOptions = dataOptions; // Custom data source if provided
        this.isSDM = dataOptions !== null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const chartTypes = this.getChartTypes();

        container.innerHTML = `
      <div class="graph-assistant">
        <div class="visualization-selector" role="group" aria-label="Chart type selection">
          <label class="visualization-selector__label" id="viz-selector-label">Select Visualization:</label>
          <div class="visualization-selector__buttons" role="radiogroup" aria-labelledby="viz-selector-label">
            ${chartTypes.map(type => `
              <button class="viz-btn ${type.id === this.currentChartType ? 'viz-btn--active' : ''}" 
                      data-type="${type.id}"
                      role="radio"
                      aria-checked="${type.id === this.currentChartType}"
                      aria-label="${type.label}: ${type.description}"
                      title="${type.description}">
                ${type.label}
              </button>
            `).join('')}
          </div>
        </div>
        
        <div class="chart-container chart-container--dynamic" id="graphAssistantChart" 
             role="img" aria-label="Interactive visualization chart" tabindex="0">
          <canvas id="dynamicChartCanvas" aria-hidden="true"></canvas>
        </div>
      </div>
    `;

        this.addStyles();
        this.attachEventListeners();
        this.createChart();

        // Subscribe to appropriate filter changes
        if (this.isSDM) {
            this.unsubscribe = subscribeToSDMFilters(() => {
                this.createChart();
            });
        } else {
            this.unsubscribe = subscribeToFilters(() => {
                this.createChart();
            });
        }

        // Add keyboard listener for chart focus
        const chartContainer = document.getElementById('graphAssistantChart');
        if (chartContainer) {
            chartContainer.addEventListener('focus', () => this.announceChart());
            chartContainer.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.announceChart();
                }
            });
        }
    }

    announceChart() {
        const data = getFilteredData();
        const chartType = this.getChartTypes().find(t => t.id === this.currentChartType);
        accessibilityReader.describeChart(this.currentChartType, data, chartType?.label || 'Chart');
    }

    addStyles() {
        if (!document.getElementById('viz-selector-styles')) {
            const style = document.createElement('style');
            style.id = 'viz-selector-styles';
            style.textContent = `
        .visualization-selector {
          margin-bottom: 16px;
        }
        .visualization-selector__label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--color-text-secondary, #666);
          font-size: 13px;
        }
        .visualization-selector__buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .viz-btn {
          padding: 8px 14px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          color: #333;
        }
        .viz-btn:hover {
          background: #f5f5f5;
          border-color: #3366cc;
        }
        .viz-btn--active {
          background: #3366cc;
          color: white;
          border-color: #3366cc;
        }
        .viz-btn--active:hover {
          background: #2855b3;
        }
      `;
            document.head.appendChild(style);
        }
    }

    getChartTypes() {
        return [
            { id: 'pie', label: 'Pie', description: 'Pie chart showing distribution' },
            { id: 'donut', label: 'Donut', description: 'Donut chart with center cutout' },
            { id: 'bar', label: 'Bar', description: 'Grouped bar chart by month' },
            { id: 'stackedBar', label: 'Stacked Bar', description: 'Stacked bar chart' },
            { id: 'line', label: 'Line', description: 'Line chart showing trends' },
            { id: 'area', label: 'Area', description: 'Area chart with filled regions' },
            { id: 'cumulative', label: 'Cumulative', description: 'Running totals over time' },
            { id: 'percentageBar', label: 'Percentage', description: '100% stacked bars' }
        ];
    }

    createChart() {
        const canvas = document.getElementById('dynamicChartCanvas');
        if (!canvas) return;

        // Use correct data getter based on mode
        let data;
        if (this.isSDM) {
            data = getSDMFilteredData();
        } else {
            data = getFilteredData();
        }

        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        // const data = getFilteredData();

        switch (this.currentChartType) {
            case 'donut':
                this.createDonutChart(canvas, data);
                break;
            case 'bar':
                this.createBarChart(canvas, data);
                break;
            case 'stackedBar':
                this.createStackedBarChart(canvas, data);
                break;
            case 'line':
                this.createLineChart(canvas, data);
                break;
            case 'area':
                this.createAreaChart(canvas, data);
                break;
            case 'cumulative':
                this.createCumulativeChart(canvas, data);
                break;
            case 'percentageBar':
                this.createPercentageBarChart(canvas, data);
                break;
            case 'pie':
            default:
                this.createPieChart(canvas, data);
                break;
        }
    }

    // Color constants
    get colors() {
        return {
            timely: '#3366cc',
            notTimely: '#cc33cc',
            pending: '#00cccc',
            timelyAlpha: 'rgba(51, 102, 204, 0.3)',
            notTimelyAlpha: 'rgba(204, 51, 204, 0.3)',
            pendingAlpha: 'rgba(0, 204, 204, 0.3)'
        };
    }

    createPieChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        const summary = data.summary;

        this.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: summary.categories.map(c => c.name),
                datasets: [{
                    data: summary.categories.map(c => c.count),
                    backgroundColor: summary.categories.map(c => c.color || this.colors[c.id] || '#ccc'),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: `Pie Chart (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`,
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }

    createDonutChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        const summary = data.summary;

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: summary.categories.map(c => c.name),
                datasets: [{
                    data: summary.categories.map(c => c.count),
                    backgroundColor: summary.categories.map(c => c.color || this.colors[c.id] || '#ccc'),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: `Donut Chart (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`,
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        });
    }

    createBarChart(canvas, data) {
        const ctx = canvas.getContext('2d');

        // Handle SDM data structure
        if (data.chartData && !data.timely) {
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [
                        { label: 'Screen In', data: data.chartData.screenIn, backgroundColor: '#3366cc' },
                        { label: 'Evaluate Out', data: data.chartData.evaluateOut, backgroundColor: '#cc33cc' },
                        { label: 'Override to In Person', data: data.chartData.overrideInPerson, backgroundColor: '#00cc99' },
                        { label: 'Override to Eval Out', data: data.chartData.overrideEvalOut, backgroundColor: '#ff3399' }
                    ]
                },
                options: this.getCommonOptions(`Bar Chart (${data.dateRange?.start || data.dateRange?.startMonth} - ${data.dateRange?.end || data.dateRange?.endMonth})`)
            });
            return;
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.months,
                datasets: [
                    { label: 'Timely', data: data.timely, backgroundColor: this.colors.timely },
                    { label: 'Not Timely', data: data.notTimely, backgroundColor: this.colors.notTimely },
                    { label: 'Pending', data: data.pending, backgroundColor: this.colors.pending }
                ]
            },
            options: this.getCommonOptions(`Bar Chart (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`)
        });
    }

    createStackedBarChart(canvas, data) {
        const ctx = canvas.getContext('2d');

        // Handle SDM data structure
        if (data.chartData && !data.timely) {
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [
                        { label: 'Screen In', data: data.chartData.screenIn, backgroundColor: '#3366cc', stack: 's1' },
                        { label: 'Evaluate Out', data: data.chartData.evaluateOut, backgroundColor: '#cc33cc', stack: 's1' },
                        { label: 'Override to In Person', data: data.chartData.overrideInPerson, backgroundColor: '#00cc99', stack: 's1' },
                        { label: 'Override to Eval Out', data: data.chartData.overrideEvalOut, backgroundColor: '#ff3399', stack: 's1' }
                    ]
                },
                options: {
                    ...this.getCommonOptions(`Stacked Bar (${data.dateRange?.start || data.dateRange?.startMonth} - ${data.dateRange?.end || data.dateRange?.endMonth})`),
                    scales: { x: { stacked: true }, y: { stacked: true } }
                }
            });
            return;
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.months,
                datasets: [
                    { label: 'Timely', data: data.timely, backgroundColor: this.colors.timely, stack: 's1' },
                    { label: 'Not Timely', data: data.notTimely, backgroundColor: this.colors.notTimely, stack: 's1' },
                    { label: 'Pending', data: data.pending, backgroundColor: this.colors.pending, stack: 's1' }
                ]
            },
            options: {
                ...this.getCommonOptions(`Stacked Bar (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`),
                scales: { x: { stacked: true }, y: { stacked: true } }
            }
        });
    }

    createLineChart(canvas, data) {
        const ctx = canvas.getContext('2d');

        // Handle SDM data structure
        if (data.chartData && !data.timely) {
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [
                        { label: 'Screen In', data: data.chartData.screenIn, borderColor: '#3366cc', backgroundColor: '#3366cc', fill: false, tension: 0.1, pointRadius: 4 },
                        { label: 'Evaluate Out', data: data.chartData.evaluateOut, borderColor: '#cc33cc', backgroundColor: '#cc33cc', fill: false, tension: 0.1, pointRadius: 4 },
                        { label: 'Override to In Person', data: data.chartData.overrideInPerson, borderColor: '#00cc99', backgroundColor: '#00cc99', fill: false, tension: 0.1, pointRadius: 4 },
                        { label: 'Override to Eval Out', data: data.chartData.overrideEvalOut, borderColor: '#ff3399', backgroundColor: '#ff3399', fill: false, tension: 0.1, pointRadius: 4 }
                    ]
                },
                options: this.getCommonOptions(`Line Chart (${data.dateRange?.start || data.dateRange?.startMonth} - ${data.dateRange?.end || data.dateRange?.endMonth})`)
            });
            return;
        }

        // Handle Investigation data structure
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [
                    { label: 'Timely', data: data.timely, borderColor: this.colors.timely, backgroundColor: this.colors.timely, fill: false, tension: 0.1, pointRadius: 4 },
                    { label: 'Not Timely', data: data.notTimely, borderColor: this.colors.notTimely, backgroundColor: this.colors.notTimely, fill: false, tension: 0.1, pointRadius: 4 },
                    { label: 'Pending', data: data.pending, borderColor: this.colors.pending, backgroundColor: this.colors.pending, fill: false, tension: 0.1, pointRadius: 4 }
                ]
            },
            options: this.getCommonOptions(`Line Chart (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`)
        });
    }

    createAreaChart(canvas, data) {
        const ctx = canvas.getContext('2d');

        // Handle SDM data structure
        if (data.chartData && !data.timely) {
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [
                        { label: 'Screen In', data: data.chartData.screenIn, borderColor: '#3366cc', backgroundColor: 'rgba(51, 102, 204, 0.3)', fill: true, tension: 0.3 },
                        { label: 'Evaluate Out', data: data.chartData.evaluateOut, borderColor: '#cc33cc', backgroundColor: 'rgba(204, 51, 204, 0.3)', fill: true, tension: 0.3 },
                        { label: 'Override to In Person', data: data.chartData.overrideInPerson, borderColor: '#00cc99', backgroundColor: 'rgba(0, 204, 153, 0.3)', fill: true, tension: 0.3 },
                        { label: 'Override to Eval Out', data: data.chartData.overrideEvalOut, borderColor: '#ff3399', backgroundColor: 'rgba(255, 51, 153, 0.3)', fill: true, tension: 0.3 }
                    ]
                },
                options: this.getCommonOptions(`Area Chart (${data.dateRange?.start || data.dateRange?.startMonth} - ${data.dateRange?.end || data.dateRange?.endMonth})`)
            });
            return;
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [
                    { label: 'Timely', data: data.timely, borderColor: this.colors.timely, backgroundColor: this.colors.timelyAlpha, fill: true, tension: 0.3 },
                    { label: 'Not Timely', data: data.notTimely, borderColor: this.colors.notTimely, backgroundColor: this.colors.notTimelyAlpha, fill: true, tension: 0.3 },
                    { label: 'Pending', data: data.pending, borderColor: this.colors.pending, backgroundColor: this.colors.pendingAlpha, fill: true, tension: 0.3 }
                ]
            },
            options: this.getCommonOptions(`Area Chart (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`)
        });
    }

    createLollipopChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        const summary = data.summary;

        // Lollipop chart - horizontal bars with circles at the end
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: summary.categories.map(c => c.name),
                datasets: [{
                    label: 'Count',
                    data: summary.categories.map(c => c.count),
                    backgroundColor: [this.colors.timely, this.colors.notTimely, this.colors.pending],
                    borderColor: [this.colors.timely, this.colors.notTimely, this.colors.pending],
                    borderWidth: 2,
                    borderRadius: 50,
                    barThickness: 8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `Lollipop Chart (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`,
                        font: { size: 14, weight: 'bold' }
                    }
                },
                scales: {
                    x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                    y: { grid: { display: false } }
                }
            }
        });
    }

    createHeatmapChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        const percentages = data.monthlyData.map(m => m.timelyPct);
        const colors = percentages.map(p => `hsla(${120 * p / 100}, 70%, 50%, 0.8)`);

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.months,
                datasets: [{ label: 'Timeliness %', data: percentages, backgroundColor: colors }]
            },
            options: {
                ...this.getCommonOptions(`Heatmap (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`),
                scales: { y: { max: 100, beginAtZero: true } }
            }
        });
    }

    createCumulativeChart(canvas, data) {
        const ctx = canvas.getContext('2d');

        // Handle SDM data structure
        if (data.chartData && !data.timely) {
            let cumSI = 0, cumEO = 0, cumOI = 0, cumOE = 0;
            const cumScreenIn = data.chartData.screenIn.map(v => cumSI += v);
            const cumEvalOut = data.chartData.evaluateOut.map(v => cumEO += v);
            const cumOverrideIn = data.chartData.overrideInPerson.map(v => cumOI += v);
            const cumOverrideEval = data.chartData.overrideEvalOut.map(v => cumOE += v);

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [
                        { label: 'Cumulative Screen In', data: cumScreenIn, borderColor: '#3366cc', backgroundColor: 'rgba(51, 102, 204, 0.3)', fill: true, tension: 0.2 },
                        { label: 'Cumulative Evaluate Out', data: cumEvalOut, borderColor: '#cc33cc', backgroundColor: 'rgba(204, 51, 204, 0.3)', fill: true, tension: 0.2 },
                        { label: 'Cumulative Override In Person', data: cumOverrideIn, borderColor: '#00cc99', backgroundColor: 'rgba(0, 204, 153, 0.3)', fill: true, tension: 0.2 },
                        { label: 'Cumulative Override Eval Out', data: cumOverrideEval, borderColor: '#ff3399', backgroundColor: 'rgba(255, 51, 153, 0.3)', fill: true, tension: 0.2 }
                    ]
                },
                options: this.getCommonOptions(`Cumulative (${data.dateRange?.start || data.dateRange?.startMonth} - ${data.dateRange?.end || data.dateRange?.endMonth})`)
            });
            return;
        }

        let cumT = 0, cumN = 0, cumP = 0;
        const cumTimely = data.timely.map(v => cumT += v);
        const cumNotTimely = data.notTimely.map(v => cumN += v);
        const cumPending = data.pending.map(v => cumP += v);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [
                    { label: 'Cumulative Timely', data: cumTimely, borderColor: this.colors.timely, backgroundColor: this.colors.timelyAlpha, fill: true, tension: 0.2 },
                    { label: 'Cumulative Not Timely', data: cumNotTimely, borderColor: this.colors.notTimely, backgroundColor: this.colors.notTimelyAlpha, fill: true, tension: 0.2 },
                    { label: 'Cumulative Pending', data: cumPending, borderColor: this.colors.pending, backgroundColor: this.colors.pendingAlpha, fill: true, tension: 0.2 }
                ]
            },
            options: this.getCommonOptions(`Cumulative (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`)
        });
    }

    createPercentageBarChart(canvas, data) {
        const ctx = canvas.getContext('2d');

        // Handle SDM data structure
        if (data.chartData && !data.timely) {
            // Calculate percentage for each category per month
            const numMonths = data.chartData.screenIn.length;
            const pctData = [];
            for (let i = 0; i < numMonths; i++) {
                const total = data.chartData.screenIn[i] + data.chartData.evaluateOut[i] +
                    data.chartData.overrideInPerson[i] + data.chartData.overrideEvalOut[i];
                pctData.push({
                    screenIn: total > 0 ? (data.chartData.screenIn[i] / total * 100) : 0,
                    evaluateOut: total > 0 ? (data.chartData.evaluateOut[i] / total * 100) : 0,
                    overrideInPerson: total > 0 ? (data.chartData.overrideInPerson[i] / total * 100) : 0,
                    overrideEvalOut: total > 0 ? (data.chartData.overrideEvalOut[i] / total * 100) : 0
                });
            }

            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [
                        { label: 'Screen In %', data: pctData.map(d => d.screenIn), backgroundColor: '#3366cc', stack: 's1' },
                        { label: 'Evaluate Out %', data: pctData.map(d => d.evaluateOut), backgroundColor: '#cc33cc', stack: 's1' },
                        { label: 'Override In Person %', data: pctData.map(d => d.overrideInPerson), backgroundColor: '#00cc99', stack: 's1' },
                        { label: 'Override Eval Out %', data: pctData.map(d => d.overrideEvalOut), backgroundColor: '#ff3399', stack: 's1' }
                    ]
                },
                options: {
                    ...this.getCommonOptions(`100% Stacked (${data.dateRange?.start || data.dateRange?.startMonth} - ${data.dateRange?.end || data.dateRange?.endMonth})`),
                    scales: { x: { stacked: true }, y: { stacked: true, max: 100 } }
                }
            });
            return;
        }

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.months,
                datasets: [
                    { label: 'Timely %', data: data.monthlyData.map(m => m.timelyPct), backgroundColor: this.colors.timely, stack: 's1' },
                    { label: 'Not Timely %', data: data.monthlyData.map(m => m.notTimelyPct), backgroundColor: this.colors.notTimely, stack: 's1' },
                    { label: 'Pending %', data: data.monthlyData.map(m => m.pendingPct), backgroundColor: this.colors.pending, stack: 's1' }
                ]
            },
            options: {
                ...this.getCommonOptions(`100% Stacked (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`),
                scales: { x: { stacked: true }, y: { stacked: true, max: 100 } }
            }
        });
    }

    createSankeyChart(canvas, data) {
        // Sankey approximation using horizontal stacked bars showing flow
        const ctx = canvas.getContext('2d');
        const summary = data.summary;
        const total = summary.total;

        // Create a flow visualization showing proportion of each category
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Total Investigations', 'By Status'],
                datasets: [
                    {
                        label: 'Timely',
                        data: [total, summary.categories[0].count],
                        backgroundColor: this.colors.timely,
                        stack: 's1'
                    },
                    {
                        label: 'Not Timely',
                        data: [0, summary.categories[1].count],
                        backgroundColor: this.colors.notTimely,
                        stack: 's1'
                    },
                    {
                        label: 'Pending',
                        data: [0, summary.categories[2].count],
                        backgroundColor: this.colors.pending,
                        stack: 's1'
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: `Sankey Flow (${data.dateRange.startMonth} - ${data.dateRange.endMonth})`,
                        font: { size: 14, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.x;
                                const pct = ((value / total) * 100).toFixed(1);
                                return `${context.dataset.label}: ${value.toLocaleString()} (${pct}%)`;
                            }
                        }
                    }
                },
                scales: {
                    x: { stacked: true, beginAtZero: true },
                    y: { stacked: true }
                }
            }
        });
    }

    getCommonOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: title, font: { size: 14, weight: 'bold' } }
            },
            scales: {
                x: { grid: { color: 'rgba(0,0,0,0.05)' } },
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
            }
        };
    }

    attachEventListeners() {
        const chartTypeBtns = document.querySelectorAll('.viz-btn');

        chartTypeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentChartType = e.currentTarget.dataset.type;
                this.createChart();
                this.updateActiveButton();
            });
        });
    }

    updateActiveButton() {
        const btns = document.querySelectorAll('.viz-btn');
        btns.forEach(btn => {
            btn.classList.toggle('viz-btn--active', btn.dataset.type === this.currentChartType);
        });
    }

    destroy() {
        if (this.unsubscribe) this.unsubscribe();
        if (this.chart) this.chart.destroy();
    }
}
