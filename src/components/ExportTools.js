// Export Tools Component - Export visualizations and summaries
import html2canvas from 'html2canvas';
import { dataAnalyzer } from '../ai/DataAnalyzer.js';

export class ExportTools {
    constructor(containerId) {
        this.containerId = containerId;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `
      <div class="export-panel">
        <button class="export-btn" id="exportTimeseriesBtn">
          Export Time Series Chart
        </button>
        <button class="export-btn" id="exportDynamicChartBtn">
          Export Current Visualization
        </button>
        <button class="export-btn" id="exportSummaryBtn">
          Export Executive Summary
        </button>
        <button class="export-btn" id="exportAllBtn">
          Export Full Report
        </button>
      </div>
    `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const timeseriesBtn = document.getElementById('exportTimeseriesBtn');
        const dynamicBtn = document.getElementById('exportDynamicChartBtn');
        const summaryBtn = document.getElementById('exportSummaryBtn');
        const allBtn = document.getElementById('exportAllBtn');

        if (timeseriesBtn) {
            timeseriesBtn.addEventListener('click', () => this.exportChart('timeSeriesCanvas', 'timeseries-chart'));
        }

        if (dynamicBtn) {
            dynamicBtn.addEventListener('click', () => this.exportChart('dynamicChartCanvas', 'visualization'));
        }

        if (summaryBtn) {
            summaryBtn.addEventListener('click', () => this.exportSummary());
        }

        if (allBtn) {
            allBtn.addEventListener('click', () => this.exportFullReport());
        }
    }

    async exportChart(canvasId, filename) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            alert('Chart not found. Please ensure the chart is visible.');
            return;
        }

        try {
            // Create a temporary canvas with white background
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const ctx = tempCanvas.getContext('2d');

            // Fill with white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // Draw the original canvas
            ctx.drawImage(canvas, 0, 0);

            // Convert to image
            const link = document.createElement('a');
            link.download = `${filename}-${this.getDateString()}.png`;
            link.href = tempCanvas.toDataURL('image/png');
            link.click();

            this.showNotification('Chart exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export chart. Please try again.');
        }
    }

    exportSummary() {
        const summary = dataAnalyzer.generateExecutiveSummary();

        // Convert markdown to plain text
        const plainText = summary
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\n/g, '\r\n');

        // Create blob and download
        const blob = new Blob([plainText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = `executive-summary-${this.getDateString()}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);

        this.showNotification('Executive summary exported!');
    }

    async exportFullReport() {
        // Export executive summary as text
        const summary = dataAnalyzer.generateExecutiveSummary();
        const trends = dataAnalyzer.analyzeTrends();
        const anomalies = dataAnalyzer.detectAnomalies();
        const insights = dataAnalyzer.getAutoInsights();

        let report = `INVESTIGATION ANALYTICS REPORT
Generated: ${new Date().toLocaleString()}
${'='.repeat(50)}

${summary}

${'='.repeat(50)}
TRENDS ANALYSIS
${'='.repeat(50)}
`;

        trends.forEach(t => {
            report += `\n• ${t.category}: ${t.description}`;
        });

        report += `\n\n${'='.repeat(50)}
ANOMALIES DETECTED
${'='.repeat(50)}
`;

        if (anomalies.length > 0) {
            anomalies.forEach(a => {
                report += `\n• ${a.month} - ${a.category}: ${a.description}`;
            });
        } else {
            report += '\nNo significant anomalies detected.';
        }

        report += `\n\n${'='.repeat(50)}
KEY INSIGHTS
${'='.repeat(50)}
`;

        insights.forEach(i => {
            report += `\n${i.icon} ${i.text}`;
        });

        // Create blob and download
        const blob = new Blob([report], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = `full-analytics-report-${this.getDateString()}.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);

        this.showNotification('Full report exported!');
    }

    getDateString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    showNotification(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'export-notification';
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }
}
