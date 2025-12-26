// Chat Panel Component - AI Analytics Chatbot
import { dataAnalyzer } from '../ai/DataAnalyzer.js';

export class ChatPanel {
  constructor(containerId) {
    this.containerId = containerId;
    this.isExpanded = true;
    this.messages = [];
    this.conversationContext = [];
    this.isProcessing = false;

    // Add welcome message
    this.messages.push({
      type: 'ai',
      content: `Welcome to the **AI Analytics Assistant**. I can help you analyze the investigation data.

Try asking me:
• "What are the main trends?"
• "Which month had the highest timely investigations?"
• "Are there any anomalies in the data?"
• "Give me an executive summary"
• "Compare timely vs not timely investigations"`
    });
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="chat-panel" id="chatPanelWrapper">
        <div class="chat-panel__header">
          <div class="chat-panel__title">
            <span class="ai-icon">AI</span>
            <span>AI Analytics Chatbot</span>
          </div>
          <button class="chat-panel__toggle" id="chatToggle">
            ${this.isExpanded ? '▼ Collapse' : '▲ Expand'}
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
              placeholder="Ask a question about the data (trends, anomalies, comparisons, summaries)..."
              ${this.isProcessing ? 'disabled' : ''}
            />
            <button class="chat-send-btn" id="chatSendBtn" ${this.isProcessing ? 'disabled' : ''}>
              ${this.isProcessing ? '<span class="spinner"></span>' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners();
    this.scrollToBottom();
  }

  renderMessages() {
    return this.messages.map(msg => `
      <div class="chat-message chat-message--${msg.type}">
        ${this.formatMessage(msg.content)}
      </div>
    `).join('');
  }

  formatMessage(content) {
    // Convert markdown-like formatting to HTML
    let formatted = content
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Bullet points
      .replace(/^• (.*?)$/gm, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap bullet points in ul
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    }

    // Wrap in paragraph
    if (!formatted.startsWith('<')) {
      formatted = '<p>' + formatted + '</p>';
    }

    return formatted;
  }

  attachEventListeners() {
    const toggle = document.getElementById('chatToggle');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');

    if (toggle) {
      toggle.addEventListener('click', () => this.toggleExpand());
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
        if (!this.isProcessing) {
          this.handleSend();
        }
      });
    }
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    this.render();
  }

  async handleSend() {
    const input = document.getElementById('chatInput');
    const question = input?.value?.trim();

    if (!question) return;

    // Add user message
    this.messages.push({
      type: 'user',
      content: question
    });

    // Clear input and show processing
    this.isProcessing = true;
    this.render();

    // Simulate AI processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Get AI response
    const response = dataAnalyzer.answerQuestion(question);

    // Add AI response
    this.messages.push({
      type: 'ai',
      content: response
    });

    // Update conversation context
    this.conversationContext.push({ question, response });

    // Done processing
    this.isProcessing = false;
    this.render();

    // Focus input for next question
    const newInput = document.getElementById('chatInput');
    if (newInput) newInput.focus();
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Method to add a message externally
  addMessage(content, type = 'ai') {
    this.messages.push({ type, content });
    this.render();
  }
}
