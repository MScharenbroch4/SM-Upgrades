// Chat Panel Component - AI Analytics Chatbot (Demo Mode)
import { getFilteredData } from '../data/investigationData.js';

// Demo prompts that are supported
const DEMO_PROMPTS = [
  { keywords: ['trend'], type: 'trends' },
  { keywords: ['highest', 'peak', 'max', 'maximum'], type: 'highest' },
  { keywords: ['anomal', 'unusual', 'outlier'], type: 'anomalies' },
  { keywords: ['summar', 'overview', 'executive'], type: 'summary' },
  { keywords: ['compare', 'vs', 'versus', 'comparison'], type: 'compare' }
];

export class ChatPanel {
  constructor(containerId) {
    this.containerId = containerId;
    this.isExpanded = true;
    this.messages = [];
    this.isProcessing = false;

    // Add welcome message
    this.messages.push({
      type: 'ai',
      content: `Welcome to the **AI Analytics Chatbot** (Demo Mode).

This demo supports the following queries:
- "What are the main trends?"
- "Which month had the highest timely investigations?"
- "Are there any anomalies in the data?"
- "Give me an executive summary"
- "Compare timely vs not timely investigations"`
    });
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="chat-panel" id="chatPanelWrapper">
        <div class="chat-panel__header">
          <div class="chat-panel__title">
            <span>AI Analytics Chatbot</span>
            <span class="demo-badge">DEMO</span>
          </div>
          <button class="chat-panel__toggle" id="chatToggle">
            ${this.isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        
        <div class="chat-panel__body ${!this.isExpanded ? 'chat-panel__body--collapsed' : ''}" id="chatBody">
          <div class="chat-panel__messages" id="chatMessages">
            ${this.renderMessages()}
          </div>
          
          <div class="chat-panel__input-area">
            <input 
              type="text" 
              class="chat-input" 
              id="chatInput"
              placeholder="Try a demo prompt: trends, highest, anomalies, summary, compare..."
              ${this.isProcessing ? 'disabled' : ''}
            />
            <button class="chat-send-btn" id="chatSendBtn" ${this.isProcessing ? 'disabled' : ''}>
              ${this.isProcessing ? 'Processing...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    `;

    this.addDemoStyles();
    this.attachEventListeners();
    this.scrollToBottom();
  }

  addDemoStyles() {
    if (!document.getElementById('demo-badge-styles')) {
      const style = document.createElement('style');
      style.id = 'demo-badge-styles';
      style.textContent = `
        .demo-badge {
          background: #f0ad4e;
          color: #000;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
          text-transform: uppercase;
        }
      `;
      document.head.appendChild(style);
    }
  }

  renderMessages() {
    return this.messages.map(msg => `
      <div class="chat-message chat-message--${msg.type}">
        ${this.formatMessage(msg.content)}
      </div>
    `).join('');
  }

  formatMessage(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
  }

  attachEventListeners() {
    const toggle = document.getElementById('chatToggle');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');

    if (toggle) {
      toggle.addEventListener('click', () => {
        this.isExpanded = !this.isExpanded;
        this.render();
      });
    }

    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !this.isProcessing) {
          this.handleSend();
        }
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (!this.isProcessing) this.handleSend();
      });
    }
  }

  async handleSend() {
    const input = document.getElementById('chatInput');
    const question = input?.value?.trim();
    if (!question) return;

    this.messages.push({ type: 'user', content: question });
    this.isProcessing = true;
    this.render();

    await new Promise(resolve => setTimeout(resolve, 600));

    // Check if this is a recognized demo prompt
    const data = getFilteredData();
    const response = this.processDemoQuery(question, data);

    this.messages.push({ type: 'ai', content: response });
    this.isProcessing = false;
    this.render();

    const newInput = document.getElementById('chatInput');
    if (newInput) newInput.focus();
  }

  processDemoQuery(question, data) {
    const q = question.toLowerCase();
    const summary = data.summary;
    const dateRange = `${data.dateRange.startMonth} - ${data.dateRange.endMonth}`;

    // Check for recognized demo prompts
    for (const prompt of DEMO_PROMPTS) {
      if (prompt.keywords.some(kw => q.includes(kw))) {
        return this.generateDemoResponse(prompt.type, data, dateRange, summary);
      }
    }

    // Not a recognized prompt - return demo mode message
    return `Sorry, this AI chatbot is currently operating in demo mode. Full AI integration will be available once implementation is approved.

**Supported demo queries:**
- Trends
- Highest/peak values
- Anomalies
- Executive summary
- Compare categories`;
  }

  generateDemoResponse(type, data, dateRange, summary) {
    switch (type) {
      case 'trends':
        const first = data.timely[0] || 0;
        const last = data.timely[data.timely.length - 1] || 0;
        const growth = first > 0 ? ((last - first) / first * 100).toFixed(0) : 0;
        return `**Trends for ${dateRange}:**

- **Timely Investigations**: ${growth > 0 ? 'Increased' : 'Decreased'} by ${Math.abs(growth)}% (from ${first} to ${last})
- **Total Volume**: ${summary.total.toLocaleString()} investigations
- **Timeliness Rate**: ${summary.categories[0].percentage}% completed on time`;

      case 'highest':
        const maxVal = Math.max(...data.timely);
        const maxIdx = data.timely.indexOf(maxVal);
        return `**Peak for ${dateRange}:**

The highest timely investigations occurred in **${data.months[maxIdx]}** with **${maxVal.toLocaleString()}** investigations.`;

      case 'anomalies':
        const mean = data.timely.reduce((a, b) => a + b, 0) / data.timely.length;
        const stdDev = Math.sqrt(data.timely.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.timely.length);
        const anomalies = [];
        data.timely.forEach((val, i) => {
          if (Math.abs(val - mean) > 2 * stdDev) {
            anomalies.push(`${data.months[i]}: ${val} (${val > mean ? 'high' : 'low'})`);
          }
        });
        return anomalies.length > 0
          ? `**Anomalies detected in ${dateRange}:**\n\n${anomalies.map(a => `- ${a}`).join('\n')}`
          : `No significant anomalies detected in the selected period (${dateRange}).`;

      case 'summary':
        return `**Executive Summary (${dateRange}):**

**Period**: ${dateRange}
**Total Investigations**: ${summary.total.toLocaleString()}

**Breakdown:**
- Timely: ${summary.categories[0].count.toLocaleString()} (${summary.categories[0].percentage}%)
- Not Timely: ${summary.categories[1].count.toLocaleString()} (${summary.categories[1].percentage}%)
- Pending: ${summary.categories[2].count.toLocaleString()} (${summary.categories[2].percentage}%)

The timeliness rate of ${summary.categories[0].percentage}% indicates ${summary.categories[0].percentage > 85 ? 'strong' : 'moderate'} performance.`;

      case 'compare':
        const ratio = (summary.categories[0].count / summary.categories[1].count).toFixed(1);
        return `**Comparison for ${dateRange}:**

| Category | Count | Percentage |
|----------|-------|------------|
| Timely | ${summary.categories[0].count.toLocaleString()} | ${summary.categories[0].percentage}% |
| Not Timely | ${summary.categories[1].count.toLocaleString()} | ${summary.categories[1].percentage}% |
| Pending | ${summary.categories[2].count.toLocaleString()} | ${summary.categories[2].percentage}% |

Timely investigations outnumber not timely by **${ratio}:1**.`;

      default:
        return `Demo response for: ${type}`;
    }
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  destroy() {
    // Cleanup if needed
  }
}

