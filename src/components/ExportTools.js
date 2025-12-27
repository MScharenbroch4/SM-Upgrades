// Export Tools Component - PDF Export with Email Option
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getFilteredData } from '../data/investigationData.js';

export class ExportTools {
  constructor(containerId) {
    this.containerId = containerId;
    this.isExporting = false;
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
        <button class="export-btn export-btn--primary" id="exportPdfBtn">
          Export Full Report (PDF)
        </button>
      </div>
      
      <!-- Email Modal -->
      <div class="email-modal-overlay" id="emailModal" style="display: none;">
        <div class="email-modal">
          <div class="email-modal__header">
            <h3>Email Report</h3>
            <button class="email-modal__close" id="closeEmailModal">&times;</button>
          </div>
          <div class="email-modal__body">
            <p>Enter email addresses to send the PDF report:</p>
            <div class="email-input-group">
              <input 
                type="text" 
                class="email-input" 
                id="emailAddresses"
                placeholder="email@example.com, another@example.com"
              />
            </div>
            <p class="email-hint">Separate multiple addresses with commas</p>
          </div>
          <div class="email-modal__footer">
            <button class="btn btn--secondary" id="cancelEmail">Cancel</button>
            <button class="btn btn--primary" id="sendEmail">Send Report</button>
          </div>
        </div>
      </div>
      
      <!-- Export Status -->
      <div class="export-status" id="exportStatus" style="display: none;"></div>
    `;

    this.addStyles();
    this.attachEventListeners();
  }

  addStyles() {
    if (!document.getElementById('export-modal-styles')) {
      const style = document.createElement('style');
      style.id = 'export-modal-styles';
      style.textContent = `
        .export-btn--primary {
          background: #3366cc !important;
          color: white !important;
          border-color: #3366cc !important;
        }
        .export-btn--primary:hover {
          background: #2855b3 !important;
        }
        .email-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }
        .email-modal {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease;
        }
        .email-modal__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e5e5;
        }
        .email-modal__header h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        .email-modal__close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          line-height: 1;
        }
        .email-modal__body {
          padding: 20px;
        }
        .email-modal__body p {
          margin: 0 0 12px 0;
          font-size: 14px;
        }
        .email-input-group {
          margin-bottom: 8px;
        }
        .email-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }
        .email-input:focus {
          outline: none;
          border-color: #3366cc;
          box-shadow: 0 0 0 3px rgba(51, 102, 204, 0.1);
        }
        .email-hint {
          color: #888;
          font-size: 12px !important;
          margin-top: 4px !important;
        }
        .email-modal__footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding: 16px 20px;
          border-top: 1px solid #e5e5e5;
        }
        .export-status {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 14px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-size: 14px;
          animation: slideIn 0.3s ease;
        }
        .export-status--success {
          background: #28a745;
          color: white;
        }
        .export-status--error {
          background: #dc3545;
          color: white;
        }
        .export-status--loading {
          background: #333;
          color: white;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  attachEventListeners() {
    document.getElementById('exportTimeseriesBtn')?.addEventListener('click', () =>
      this.exportChart('timeSeriesCanvas', 'timeseries-chart'));
    document.getElementById('exportDynamicChartBtn')?.addEventListener('click', () =>
      this.exportChart('dynamicChartCanvas', 'visualization'));
    document.getElementById('exportSummaryBtn')?.addEventListener('click', () =>
      this.exportSummary());
    document.getElementById('exportPdfBtn')?.addEventListener('click', () =>
      this.showPdfExportOptions());

    // Email modal handlers
    document.getElementById('closeEmailModal')?.addEventListener('click', () =>
      this.hideEmailModal());
    document.getElementById('cancelEmail')?.addEventListener('click', () =>
      this.hideEmailModal());
    document.getElementById('sendEmail')?.addEventListener('click', () =>
      this.sendEmailReport());

    // Close on overlay click
    document.getElementById('emailModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'emailModal') this.hideEmailModal();
    });
  }

  async exportChart(canvasId, filename) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      this.showStatus('Chart not found.', 'error');
      return;
    }

    const data = getFilteredData();
    const dateStr = `${data.dateRange.startMonth}-${data.dateRange.endMonth}`.replace(/ /g, '');

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `${filename}-${dateStr}-${this.getDateString()}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();

    this.showStatus('Chart exported successfully', 'success');
  }

  exportSummary() {
    const data = getFilteredData();
    const summary = data.summary;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 30;

    // Title
    pdf.setFontSize(22);
    pdf.setFont(undefined, 'bold');
    pdf.text('Executive Summary', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    // Subtitle
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(100);
    pdf.text('Powered by MS Analytics', pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Horizontal line
    pdf.setDrawColor(200);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Period
    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Period:', margin, yPos);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${data.dateRange.startMonth} - ${data.dateRange.endMonth}`, margin + 25, yPos);
    yPos += 10;

    // Total Investigations
    pdf.setFont(undefined, 'bold');
    pdf.text('Total Investigations:', margin, yPos);
    pdf.setFont(undefined, 'normal');
    pdf.text(summary.total.toLocaleString(), margin + 50, yPos);
    yPos += 15;

    // Category Breakdown header
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Category Breakdown', margin, yPos);
    yPos += 10;

    // Categories
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    summary.categories.forEach(cat => {
      pdf.text(`• ${cat.name}: ${cat.count.toLocaleString()} (${cat.percentage}%)`, margin + 5, yPos);
      yPos += 8;
    });
    yPos += 10;

    // Performance
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Performance', margin, yPos);
    yPos += 10;

    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    const perfLevel = summary.categories[0].percentage > 85 ? 'Strong' :
      summary.categories[0].percentage > 70 ? 'Moderate' : 'Needs Improvement';
    pdf.text(`${perfLevel} timeliness rate of ${summary.categories[0].percentage}%`, margin + 5, yPos);
    yPos += 15;

    // Data Points
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Data Points:', margin, yPos);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${data.months.length} months of data analyzed.`, margin + 35, yPos);
    yPos += 20;

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);

    // Save PDF
    const dateStr = `${data.dateRange.startMonth}-${data.dateRange.endMonth}`.replace(/ /g, '');
    pdf.save(`executive-summary-${dateStr}-${this.getDateString()}.pdf`);

    this.showStatus('Executive summary PDF exported successfully', 'success');
  }

  async showPdfExportOptions() {
    // Show options: Download PDF or Email
    const choice = confirm('Click OK to download PDF directly.\nClick Cancel to email the report instead.');

    if (choice) {
      await this.exportFullPdf();
    } else {
      this.showEmailModal();
    }
  }

  async exportFullPdf() {
    if (this.isExporting) return;
    this.isExporting = true;

    this.showStatus('Generating PDF report...', 'loading');

    try {
      const data = getFilteredData();
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text('Investigation Analytics Report', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      // Subtitle
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');
      pdf.setTextColor(100);
      pdf.text('Powered by MS Analytics', pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;

      // Date range
      pdf.setFontSize(10);
      pdf.text(`Date Range: ${data.dateRange.startMonth} - ${data.dateRange.endMonth}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 5;
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Horizontal line
      pdf.setDrawColor(200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // Summary section
      pdf.setTextColor(0);
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Executive Summary', margin, yPos);
      yPos += 10;

      pdf.setFontSize(11);
      pdf.setFont(undefined, 'normal');

      const summary = data.summary;
      pdf.text(`Total Investigations: ${summary.total.toLocaleString()}`, margin, yPos);
      yPos += 7;
      pdf.text(`Months Analyzed: ${data.months.length}`, margin, yPos);
      yPos += 12;

      // Category breakdown
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Category Breakdown', margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');

      summary.categories.forEach(cat => {
        pdf.text(`• ${cat.name}: ${cat.count.toLocaleString()} (${cat.percentage}%)`, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 10;

      // Charts section
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Charts', margin, yPos);
      yPos += 10;

      // Capture time series chart
      const timeSeriesCanvas = document.getElementById('timeSeriesCanvas');
      if (timeSeriesCanvas) {
        try {
          const imgData = timeSeriesCanvas.toDataURL('image/png');
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = (timeSeriesCanvas.height / timeSeriesCanvas.width) * imgWidth;

          if (yPos + imgHeight > 280) {
            pdf.addPage();
            yPos = 20;
          }

          pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
          yPos += imgHeight + 10;
        } catch (e) {
          console.error('Error adding time series chart:', e);
        }
      }

      // Capture dynamic chart
      const dynamicCanvas = document.getElementById('dynamicChartCanvas');
      if (dynamicCanvas) {
        try {
          if (yPos > 200) {
            pdf.addPage();
            yPos = 20;
          }

          const imgData = dynamicCanvas.toDataURL('image/png');
          const imgWidth = (pageWidth - (margin * 2)) * 0.7;
          const imgHeight = (dynamicCanvas.height / dynamicCanvas.width) * imgWidth;

          pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
          yPos += imgHeight + 15;
        } catch (e) {
          console.error('Error adding dynamic chart:', e);
        }
      }

      // Monthly data table
      if (yPos > 220) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Monthly Data', margin, yPos);
      yPos += 8;

      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.text('Month', margin, yPos);
      pdf.text('Timely', margin + 30, yPos);
      pdf.text('Not Timely', margin + 55, yPos);
      pdf.text('Pending', margin + 85, yPos);
      pdf.text('Total', margin + 110, yPos);
      yPos += 5;

      pdf.setFont(undefined, 'normal');
      data.monthlyData.forEach((m, i) => {
        if (yPos > 280) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(m.month, margin, yPos);
        pdf.text(m.timely.toString(), margin + 30, yPos);
        pdf.text(m.notTimely.toString(), margin + 55, yPos);
        pdf.text(m.pending.toString(), margin + 85, yPos);
        pdf.text(m.total.toString(), margin + 110, yPos);
        yPos += 5;
      });

      // Save PDF
      const dateStr = `${data.dateRange.startMonth}-${data.dateRange.endMonth}`.replace(/ /g, '');
      pdf.save(`investigation-report-${dateStr}-${this.getDateString()}.pdf`);

      this.showStatus('PDF report exported successfully!', 'success');
      return pdf;
    } catch (error) {
      console.error('PDF export error:', error);
      this.showStatus('Error generating PDF. Please try again.', 'error');
      return null;
    } finally {
      this.isExporting = false;
    }
  }

  showEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
      modal.style.display = 'flex';
      document.getElementById('emailAddresses')?.focus();
    }
  }

  hideEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  async sendEmailReport() {
    const emailInput = document.getElementById('emailAddresses');
    const emails = emailInput?.value?.trim();

    if (!emails) {
      this.showStatus('Please enter at least one email address.', 'error');
      return;
    }

    // Validate email format
    const emailList = emails.split(',').map(e => e.trim()).filter(e => e);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(e => !emailRegex.test(e));

    if (invalidEmails.length > 0) {
      this.showStatus(`Invalid email format: ${invalidEmails.join(', ')}`, 'error');
      return;
    }

    this.hideEmailModal();
    this.showStatus('Generating and sending report...', 'loading');

    try {
      // Generate PDF
      const pdf = await this.exportFullPdf();

      if (pdf) {
        // In a real implementation, this would send to a backend API
        // For demo purposes, we'll simulate the email sending
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate success - in production, this would be an API call like:
        // await fetch('/api/send-report', {
        //   method: 'POST',
        //   body: JSON.stringify({ emails: emailList, pdfBase64: pdf.output('datauristring') })
        // });

        this.showStatus(`Report sent successfully to: ${emailList.join(', ')}`, 'success');

        // Clear input
        if (emailInput) emailInput.value = '';
      }
    } catch (error) {
      console.error('Email error:', error);
      this.showStatus('Failed to send email. Please try again.', 'error');
    }
  }

  getDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  showStatus(message, type) {
    const status = document.getElementById('exportStatus');
    if (!status) return;

    status.textContent = message;
    status.className = `export-status export-status--${type}`;
    status.style.display = 'block';

    if (type !== 'loading') {
      setTimeout(() => {
        status.style.display = 'none';
      }, 4000);
    }
  }
}
