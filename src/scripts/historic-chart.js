// /src/scripts/historic-chart.js
import Chart from 'chart.js/auto';

class HistoricChart {
    constructor() {
        this.chart = null;
        this.init();
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
            this.updateTable(data);
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
            'USD': 5.20,
            'EUR': 5.60,
            'GBP': 6.50,
            'JPY': 0.035,
            'BTC': 150000,
            'ETH': 10000
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
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(context.parsed.y);
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
                            text: 'Valor (R$)'
                        },
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }).format(value);
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

    updateTable(data) {
        const tbody = document.querySelector('#historico tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.date}</td>
                <td>${item.bid.toFixed(4)}</td>
                <td>${item.ask.toFixed(4)}</td>
                <td class="${item.variation >= 0 ? 'positive' : 'negative'}">
                    ${item.variation.toFixed(2)}%
                </td>
                <td>${item.high.toFixed(4)}</td>
                <td>${item.low.toFixed(4)}</td>
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