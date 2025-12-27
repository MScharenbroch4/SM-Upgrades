// Accessibility Module - Screen Reader with Toggle
// Uses Web Speech API for text-to-speech functionality

class AccessibilityReader {
    constructor() {
        this.isEnabled = false;
        this.synth = window.speechSynthesis;
        this.currentUtterance = null;
        this.voice = null;
        this.rate = 1.0;
        this.pitch = 1.0;
        this.volume = 1.0;

        // Initialize voice when available
        this.initVoice();
    }

    initVoice() {
        // Wait for voices to be loaded
        if (this.synth.getVoices().length > 0) {
            this.selectVoice();
        } else {
            this.synth.onvoiceschanged = () => this.selectVoice();
        }
    }

    selectVoice() {
        const voices = this.synth.getVoices();
        // Prefer English voices
        this.voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Microsoft')) ||
            voices.find(v => v.lang.startsWith('en')) ||
            voices[0];
    }

    toggle() {
        this.isEnabled = !this.isEnabled;

        if (this.isEnabled) {
            this.announce('Screen reader enabled. Use Tab to navigate through interactive elements.');
        } else {
            this.stop();
            // Brief announcement before disabling
            const utterance = new SpeechSynthesisUtterance('Screen reader disabled.');
            utterance.rate = this.rate;
            this.synth.speak(utterance);
        }

        return this.isEnabled;
    }

    enable() {
        this.isEnabled = true;
        this.announce('Screen reader enabled.');
    }

    disable() {
        this.isEnabled = false;
        this.stop();
    }

    stop() {
        this.synth.cancel();
        this.currentUtterance = null;
    }

    speak(text, interrupt = true) {
        if (!this.isEnabled || !text) return;

        if (interrupt) {
            this.stop();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.rate = this.rate;
        utterance.pitch = this.pitch;
        utterance.volume = this.volume;

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
    }

    announce(text) {
        this.speak(text, true);
    }

    // Describe chart data
    describeChart(chartType, data, title) {
        if (!this.isEnabled) return;

        let description = `${title}. `;

        switch (chartType) {
            case 'line':
            case 'area':
                description += this.describeLineChart(data);
                break;
            case 'bar':
            case 'stackedBar':
                description += this.describeBarChart(data);
                break;
            case 'pie':
            case 'donut':
                description += this.describePieChart(data);
                break;
            case 'lollipop':
                description += this.describeLollipopChart(data);
                break;
            case 'sankey':
                description += this.describeSankeyChart(data);
                break;
            case 'heatmap':
                description += this.describeHeatmapChart(data);
                break;
            case 'cumulative':
                description += this.describeCumulativeChart(data);
                break;
            default:
                description += this.describeGenericChart(data);
        }

        this.announce(description);
    }

    describeLineChart(data) {
        const { months, timely, summary, dateRange } = data;
        const max = Math.max(...timely);
        const min = Math.min(...timely);
        const maxIdx = timely.indexOf(max);
        const minIdx = timely.indexOf(min);

        return `Line chart showing ${months.length} months of data from ${dateRange.startMonth} to ${dateRange.endMonth}. ` +
            `Peak of ${max} timely investigations in ${months[maxIdx]}. ` +
            `Lowest point of ${min} in ${months[minIdx]}. ` +
            `Total investigations: ${summary.total.toLocaleString()}.`;
    }

    describeBarChart(data) {
        const { months, summary, dateRange } = data;
        return `Bar chart comparing investigation categories over ${months.length} months from ${dateRange.startMonth} to ${dateRange.endMonth}. ` +
            `Timely: ${summary.categories[0].count.toLocaleString()} at ${summary.categories[0].percentage}%. ` +
            `Not Timely: ${summary.categories[1].count.toLocaleString()} at ${summary.categories[1].percentage}%. ` +
            `Pending: ${summary.categories[2].count.toLocaleString()} at ${summary.categories[2].percentage}%.`;
    }

    describePieChart(data) {
        const { summary } = data;
        return `Pie chart showing distribution of ${summary.total.toLocaleString()} total investigations. ` +
            summary.categories.map(c => `${c.name}: ${c.count.toLocaleString()}, ${c.percentage}%`).join('. ') + '.';
    }

    describeLollipopChart(data) {
        const { summary } = data;
        return `Lollipop chart comparing categories. ` +
            summary.categories.map(c => `${c.name}: ${c.count.toLocaleString()}`).join('. ') + '.';
    }

    describeSankeyChart(data) {
        const { summary } = data;
        return `Sankey flow diagram showing ${summary.total.toLocaleString()} total investigations flowing into three categories. ` +
            summary.categories.map(c => `${c.name} receives ${c.percentage}%`).join('. ') + '.';
    }

    describeHeatmapChart(data) {
        const { monthlyData, dateRange } = data;
        const avgTimeliness = (monthlyData.reduce((sum, m) => sum + m.timelyPct, 0) / monthlyData.length).toFixed(1);
        return `Heatmap showing timeliness rates from ${dateRange.startMonth} to ${dateRange.endMonth}. ` +
            `Average timeliness rate: ${avgTimeliness}%. ` +
            `Colors range from red for low timeliness to green for high timeliness.`;
    }

    describeCumulativeChart(data) {
        const { summary, dateRange } = data;
        return `Cumulative chart showing running totals from ${dateRange.startMonth} to ${dateRange.endMonth}. ` +
            `Final totals: Timely ${summary.categories[0].count.toLocaleString()}, ` +
            `Not Timely ${summary.categories[1].count.toLocaleString()}, ` +
            `Pending ${summary.categories[2].count.toLocaleString()}.`;
    }

    describeGenericChart(data) {
        const { summary, dateRange } = data;
        return `Chart showing data from ${dateRange.startMonth} to ${dateRange.endMonth} with ${summary.total.toLocaleString()} total investigations.`;
    }

    // Describe summary statistics
    describeSummary(data) {
        if (!this.isEnabled) return;

        const { summary, dateRange } = data;
        const description = `Summary for ${dateRange.startMonth} to ${dateRange.endMonth}. ` +
            `Total investigations: ${summary.total.toLocaleString()}. ` +
            summary.categories.map(c => `${c.name}: ${c.count.toLocaleString()}, ${c.percentage}%`).join('. ') + '.';

        this.announce(description);
    }

    // Describe filter change
    describeFilterChange(filterType, newValue, data) {
        if (!this.isEnabled) return;

        const description = `Filter updated. ${filterType} changed to ${newValue}. ` +
            `Now showing ${data.months.length} months with ${data.summary.total.toLocaleString()} total investigations.`;

        this.announce(description);
    }

    // Describe insights
    describeInsights(insights) {
        if (!this.isEnabled) return;

        const description = `AI Generated Insights. ${insights.length} insights available. ` +
            insights.map((insight, i) => `Insight ${i + 1}: ${insight.text}`).join('. ');

        this.announce(description);
    }

    // Read chat message
    readChatMessage(message, isUser) {
        if (!this.isEnabled) return;

        const prefix = isUser ? 'You said:' : 'AI Assistant:';
        this.announce(`${prefix} ${message}`);
    }

    // Announce focus change
    announceFocus(element) {
        if (!this.isEnabled || !element) return;

        const label = element.getAttribute('aria-label') ||
            element.getAttribute('title') ||
            element.textContent?.trim() ||
            element.placeholder ||
            element.tagName.toLowerCase();

        const role = element.getAttribute('role') || this.getImplicitRole(element);
        const state = this.getElementState(element);

        let announcement = label;
        if (role) announcement += `, ${role}`;
        if (state) announcement += `, ${state}`;

        this.announce(announcement);
    }

    getImplicitRole(element) {
        const tag = element.tagName.toLowerCase();
        const roleMap = {
            'button': 'button',
            'a': 'link',
            'input': element.type === 'checkbox' ? 'checkbox' : element.type === 'radio' ? 'radio' : 'text input',
            'select': 'dropdown',
            'textarea': 'text area',
            'h1': 'heading level 1',
            'h2': 'heading level 2',
            'h3': 'heading level 3',
            'nav': 'navigation'
        };
        return roleMap[tag] || '';
    }

    getElementState(element) {
        const states = [];

        if (element.disabled) states.push('disabled');
        if (element.getAttribute('aria-expanded') === 'true') states.push('expanded');
        if (element.getAttribute('aria-expanded') === 'false') states.push('collapsed');
        if (element.getAttribute('aria-checked') === 'true') states.push('checked');
        if (element.getAttribute('aria-selected') === 'true') states.push('selected');
        if (element.classList.contains('active') || element.classList.contains('--active')) states.push('active');

        return states.join(', ');
    }

    // Announce button action
    announceAction(action) {
        if (!this.isEnabled) return;
        this.announce(action);
    }

    // Settings
    setRate(rate) {
        this.rate = Math.max(0.5, Math.min(2, rate));
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}

// Create singleton instance
const accessibilityReader = new AccessibilityReader();

// Export for use in other modules
export { accessibilityReader, AccessibilityReader };
