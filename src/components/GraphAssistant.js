// Graph Assistant Component - Dynamic Visualization Generation
import { visualizationGenerator } from '../ai/VisualizationGenerator.js';

export class GraphAssistant {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentChartType = 'pie';
        this.canvas = null;
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const chartTypes = visualizationGenerator.getChartTypes();

        container.innerHTML = `
      <div class="graph-assistant">
        <div class="graph-assistant__input-area">
          <input 
            type="text" 
            class="graph-assistant__input" 
            id="vizInput"
            placeholder="Describe the visualization you want (e.g., 'Show as stacked bar chart', 'Create a heatmap')"
          />
          <button class="graph-assistant__generate-btn" id="vizGenerateBtn">
            Generate
          </button>
          <button class="graph-assistant__reset-btn" id="vizResetBtn">
            Reset
          </button>
        </div>
        
        <div class="graph-assistant__chart-types">
          ${chartTypes.map(type => `
            <button class="chart-type-btn ${type.id === this.currentChartType ? 'chart-type-btn--active' : ''}" 
                    data-type="${type.id}">
              ${type.icon} ${type.label}
            </button>
          `).join('')}
        </div>
        
        <div class="chart-container chart-container--pie" id="graphAssistantChart">
          <canvas id="dynamicChartCanvas"></canvas>
        </div>
      </div>
    `;

        this.attachEventListeners();
        this.renderDefaultChart();
    }

    renderDefaultChart() {
        const canvas = document.getElementById('dynamicChartCanvas');
        if (canvas) {
            this.canvas = canvas;
            visualizationGenerator.createPieChart(canvas);
        }
    }

    attachEventListeners() {
        const input = document.getElementById('vizInput');
        const generateBtn = document.getElementById('vizGenerateBtn');
        const resetBtn = document.getElementById('vizResetBtn');
        const chartTypeBtns = document.querySelectorAll('.chart-type-btn');

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleGenerate();
                }
            });
        }

        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.handleGenerate());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }

        chartTypeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.handleQuickType(type);
            });
        });
    }

    handleGenerate() {
        const input = document.getElementById('vizInput');
        const request = input?.value?.trim();

        if (!request) return;

        const canvas = document.getElementById('dynamicChartCanvas');
        if (!canvas) return;

        const result = visualizationGenerator.generateVisualization(request, canvas);
        this.currentChartType = result.type;
        this.updateActiveButton(result.type);

        // Clear input
        input.value = '';
    }

    handleQuickType(type) {
        const canvas = document.getElementById('dynamicChartCanvas');
        if (!canvas) return;

        // Map type to request
        const typeToRequest = {
            'pie': 'pie chart',
            'bar': 'bar chart',
            'stackedBar': 'stacked bar chart',
            'line': 'line chart',
            'area': 'area chart',
            'heatmap': 'heatmap',
            'cumulative': 'cumulative trend',
            'percentageBar': 'percentage bar chart'
        };

        const request = typeToRequest[type] || type;
        visualizationGenerator.generateVisualization(request, canvas);
        this.currentChartType = type;
        this.updateActiveButton(type);
    }

    handleReset() {
        const canvas = document.getElementById('dynamicChartCanvas');
        if (!canvas) return;

        visualizationGenerator.resetToDefault(canvas);
        this.currentChartType = 'pie';
        this.updateActiveButton('pie');

        // Clear input
        const input = document.getElementById('vizInput');
        if (input) input.value = '';
    }

    updateActiveButton(activeType) {
        const btns = document.querySelectorAll('.chart-type-btn');
        btns.forEach(btn => {
            btn.classList.toggle('chart-type-btn--active', btn.dataset.type === activeType);
        });
    }

    getCanvas() {
        return document.getElementById('dynamicChartCanvas');
    }
}
