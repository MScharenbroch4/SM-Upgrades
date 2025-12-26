# Enterprise Data Analytics Dashboard

A professional business intelligence platform with embedded AI assistants for data analysis and dynamic visualization generation.

## Features

- **Interactive Time Series Charts** - Multi-line visualization of investigation trends over time
- **Summary Bar Charts** - Horizontal bar displays with counts and percentages
- **AI Analytics Chatbot** - Natural language queries about trends, anomalies, and comparisons
- **AI Visualization Assistant** - Dynamic chart generation from text descriptions
- **AI Insights Panel** - Auto-generated trend highlights and anomaly alerts
- **Executive Summary Generator** - One-click leadership-ready reports
- **Export Tools** - Charts as PNG, summaries as text files
- **Interactive Filters** - Date range, count/percentage toggle, category visibility

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Vite
- **Charts**: Chart.js
- **Export**: html2canvas

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/enterprise-analytics-dashboard.git

# Navigate to project directory
cd enterprise-analytics-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Production files will be generated in the `dist/` directory.

## Project Structure

```
├── index.html              # Entry point
├── package.json            # Dependencies
├── vite.config.js          # Build config
├── src/
│   ├── main.js             # App orchestration
│   ├── data/
│   │   └── investigationData.js    # Mock dataset
│   ├── ai/
│   │   ├── DataAnalyzer.js         # NLP query engine
│   │   └── VisualizationGenerator.js # Dynamic chart generation
│   ├── components/
│   │   ├── TimeSeriesChart.js      # Line chart
│   │   ├── BarSummary.js           # Horizontal bars
│   │   ├── ChatPanel.js            # AI Chatbot
│   │   ├── GraphAssistant.js       # AI Viz Assistant
│   │   ├── InsightsPanel.js        # Auto insights
│   │   ├── Filters.js              # Interactive controls
│   │   └── ExportTools.js          # Export functionality
│   └── styles/
│       ├── variables.css           # Design tokens
│       └── main.css                # Styles
```

## Customization

### Replacing Mock Data

Edit `src/data/investigationData.js` to connect to your data source:

```javascript
// Replace with API call
export async function fetchInvestigationData() {
  const response = await fetch('/api/investigations');
  return response.json();
}
```

### Connecting a Real LLM

Modify `src/ai/DataAnalyzer.js` to call your LLM API:

```javascript
async answerQuestion(question) {
  const response = await fetch('/api/ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, data: this.data })
  });
  return response.json();
}
```

## AI Chatbot Examples

Ask the chatbot natural language questions:

- "What are the main trends in the data?"
- "Which month had the highest timely investigations?"
- "Are there any anomalies?"
- "Compare timely vs not timely investigations"
- "Give me an executive summary"

## AI Visualization Assistant

Request different chart types:

- "Show as stacked bar chart"
- "Create a heatmap"
- "Show cumulative trend"
- "Display percentages instead of counts"

## Screenshots

*Add screenshots of your dashboard here*

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
