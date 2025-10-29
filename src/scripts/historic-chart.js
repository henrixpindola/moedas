// /src/scripts/historic-chart.js
import Chart from 'chart.js/auto';

class HistoricChart {
    constructor() {
        this.chart = null;
        this.currencySymbols = this.initializeCurrencySymbols();
        this.init();
    }

    // Adicione este método para inicializar os símbolos das moedas
    initializeCurrencySymbols() {
        return {
            // Moedas com Real Brasileiro
            'USD-BRL': { symbol: 'R$', position: 'before' },
            'USD-BRLT': { symbol: 'R$', position: 'before' },
            'EUR-BRL': { symbol: 'R$', position: 'before' },
            'GBP-BRL': { symbol: 'R$', position: 'before' },
            'ARS-BRL': { symbol: 'R$', position: 'before' },
            'CAD-BRL': { symbol: 'R$', position: 'before' },
            'JPY-BRL': { symbol: 'R$', position: 'before' },
            'CHF-BRL': { symbol: 'R$', position: 'before' },
            'AUD-BRL': { symbol: 'R$', position: 'before' },
            'CNY-BRL': { symbol: 'R$', position: 'before' },
            'BTC-BRL': { symbol: 'R$', position: 'before' },
            'ETH-BRL': { symbol: 'R$', position: 'before' },
            'LTC-BRL': { symbol: 'R$', position: 'before' },
            'XRP-BRL': { symbol: 'R$', position: 'before' },
            'DOGE-BRL': { symbol: 'R$', position: 'before' },
            'USD-BRLPTAX': { symbol: 'R$', position: 'before' },
            'EUR-BRLPTAX': { symbol: 'R$', position: 'before' },
            'XAU-BRL': { symbol: 'R$', position: 'before' },
            'XAG-BRL': { symbol: 'R$', position: 'before' },
            
            // Moedas com Dólar Americano
            'EUR-USD': { symbol: 'US$', position: 'before' },
            'GBP-USD': { symbol: 'US$', position: 'before' },
            'USD-JPY': { symbol: '¥', position: 'before' },
            'USD-CHF': { symbol: 'CHF', position: 'before' },
            'USD-CAD': { symbol: 'C$', position: 'before' },
            'AUD-USD': { symbol: 'US$', position: 'before' },
            'NZD-USD': { symbol: 'US$', position: 'before' },
            'BTC-USD': { symbol: 'US$', position: 'before' },
            'ETH-USD': { symbol: 'US$', position: 'before' },
            'XAU-USD': { symbol: 'US$', position: 'before' },
            'XAG-USD': { symbol: 'US$', position: 'before' },
            'USD-MXN': { symbol: 'MX$', position: 'before' },
            'USD-ZAR': { symbol: 'R', position: 'before' },
            'USD-TRY': { symbol: '₺', position: 'before' },
            'USD-SGD': { symbol: 'S$', position: 'before' },
            'USD-INR': { symbol: '₹', position: 'before' },
            'USD-KRW': { symbol: '₩', position: 'before' },
            
            // Moedas com Euro
            'EUR-GBP': { symbol: '€', position: 'before' },
            'EUR-JPY': { symbol: '€', position: 'before' },
            'EUR-CHF': { symbol: '€', position: 'before' },
            'EUR-CAD': { symbol: '€', position: 'before' },
            'BTC-EUR': { symbol: '€', position: 'before' },
            'ETH-EUR': { symbol: '€', position: 'before' },
            'XAU-EUR': { symbol: '€', position: 'before' },
            
            // Padrão para moedas não mapeadas
            'default': { symbol: '', position: 'before' }
        };
    }

    // Método para formatar o valor baseado no código da moeda
    formatCurrencyValue(currencyCode, value) {
        const currencyInfo = this.currencySymbols[currencyCode] || this.currencySymbols['default'];
        const formattedValue = typeof value === 'number' ? value.toFixed(4) : parseFloat(value).toFixed(4);
        
        if (currencyInfo.position === 'before') {
            return `${currencyInfo.symbol} ${formattedValue}`.trim();
        } else {
            return `${formattedValue} ${currencyInfo.symbol}`.trim();
        }
    }

    init() {
        // Aguardar o DOM carregar
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
        });
    }

    setupEventListeners() {
        const loadHistoricBtn = document.getElementById('load-historic-btn');
        const daysSelect = document.getElementById('days-select');
        const currencySelect = document.getElementById('currency-historic');

        if (loadHistoricBtn) {
            loadHistoricBtn.addEventListener('click', () => {
                this.loadHistoricData();
            });
        }

        // Carregar histórico quando mudar os selects
        if (daysSelect && currencySelect) {
            daysSelect.addEventListener('change', () => {
                if (currencySelect.value) {
                    this.loadHistoricData();
                }
            });

            currencySelect.addEventListener('change', () => {
                if (currencySelect.value) {
                    this.loadHistoricData();
                }
            });
        }
    }

    async loadHistoricData() {
        const currency = document.getElementById('currency-historic').value;
        const days = document.getElementById('days-select').value;

        if (!currency) {
            alert('Por favor, selecione uma moeda.');
            return;
        }

        try {
            this.showLoading();
            const data = await this.fetchHistoricData(currency, days);
            this.createChart(data, currency);
            this.updateTable(data, currency);
        } catch (error) {
            console.error('Erro ao carregar dados históricos:', error);
            alert('Erro ao carregar dados históricos. Tente novamente.');
        } finally {
            this.hideLoading();
        }
    }

    async fetchHistoricData(currency, days) {
        // Simulando dados da API - substitua pela sua API real
        const mockData = this.generateMockData(currency, parseInt(days));
        
        // Em uma implementação real, você faria:
        // const response = await fetch(`sua-api/historico/${currency}?dias=${days}`);
        // const data = await response.json();
        // return data;
        
        return mockData;
    }

    generateMockData(currency, days) {
        const data = [];
        const basePrice = this.getBasePrice(currency);
        
        for (let i = days; i > 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const variation = (Math.random() - 0.5) * 2; // Variação entre -1% e +1%
            const price = basePrice * (1 + variation / 100);
            const high = price * (1 + Math.random() * 0.02);
            const low = price * (1 - Math.random() * 0.02);
            const bid = price * 0.995; // Preço de compra
            const ask = price * 1.005; // Preço de venda

            data.push({
                date: date.toLocaleDateString('pt-BR'),
                timestamp: date,
                bid: bid,
                ask: ask,
                variation: variation,
                high: high,
                low: low
            });
        }
        
        return data;
    }

    getBasePrice(currency) {
        const basePrices = {
            'USD-BRL': 5.20,
            'EUR-BRL': 5.60,
            'GBP-BRL': 6.50,
            'JPY-BRL': 0.035,
            'BTC-BRL': 150000,
            'ETH-BRL': 10000,
            'EUR-USD': 1.08,
            'GBP-USD': 1.25,
            'USD-JPY': 148.50,
            'USD-CAD': 1.35,
            'AUD-USD': 0.65
        };
        return basePrices[currency] || 1;
    }

    createChart(data, currency) {
        const ctx = document.getElementById('historic-chart').getContext('2d');
        
        // Destruir gráfico anterior se existir
        if (this.chart) {
            this.chart.destroy();
        }

        const labels = data.map(item => item.date);
        const bidPrices = data.map(item => item.bid);
        const askPrices = data.map(item => item.ask);

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Preço de Compra (Bid)',
                        data: bidPrices,
                        backgroundColor: 'rgba(54, 162, 235, 0.8)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Preço de Venda (Ask)',
                        data: askPrices,
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Histórico de Cotações - ${currency}`,
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const value = context.parsed.y;
                                const formattedValue = this.formatCurrencyValue(currency, value);
                                label += formattedValue;
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data'
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Valor'
                        },
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => {
                                return this.formatCurrencyValue(currency, value);
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    updateTable(data, currency) {
        const tbody = document.querySelector('#historico tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            const variationClass = item.variation >= 0 ? 'positive' : 'negative';
            const variationIcon = item.variation >= 0 ? '↗' : '↘';

            // Usar o método de formatação para cada valor
            const bidFormatted = this.formatCurrencyValue(currency, item.bid);
            const askFormatted = this.formatCurrencyValue(currency, item.ask);
            const highFormatted = this.formatCurrencyValue(currency, item.high);
            const lowFormatted = this.formatCurrencyValue(currency, item.low);

            row.innerHTML = `
                <td>${item.date}</td>
                <td>${bidFormatted}</td>
                <td>${askFormatted}</td>
                <td class="${variationClass}">
                    ${variationIcon} ${Math.abs(item.variation).toFixed(2)}%
                </td>
                <td>${highFormatted}</td>
                <td>${lowFormatted}</td>
            `;
            tbody.appendChild(row);
        });
    }

    showLoading() {
        const chartContainer = document.querySelector('.chart-wrapper');
        if (chartContainer) {
            chartContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        }
    }

    hideLoading() {
        const chartContainer = document.querySelector('.chart-wrapper');
        if (chartContainer) {
            chartContainer.innerHTML = '<canvas id="historic-chart"></canvas>';
        }
    }
}

// Inicializar o gráfico histórico
new HistoricChart();