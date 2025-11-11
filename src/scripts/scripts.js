class CurrencyApp {
  constructor() {
      this.selectedCurrencies = new Set(['USD-BRL', 'EUR-BRL', 'BTC-BRL'])
      this.historicChart = null
      this.currencySymbols = this.initializeCurrencySymbols()
      this.init()
  }

  initializeCurrencySymbols() {
      const symbols = {
          'USD': 'US$', 'BRL': 'R$', 'EUR': '€', 'GBP': '£', 'JPY': '¥',
          'CHF': 'CHF', 'CAD': 'C$', 'MXN': 'MX$', 'ZAR': 'R', 'TRY': '₺',
          'SGD': 'S$', 'INR': '₹', 'KRW': '₩'
      }
      
      const mappings = {
          'USD-BRL': 'BRL', 'USD-BRLT': 'BRL', 'EUR-BRL': 'BRL', 'GBP-BRL': 'BRL',
          'ARS-BRL': 'BRL', 'CAD-BRL': 'BRL', 'JPY-BRL': 'BRL', 'CHF-BRL': 'BRL',
          'AUD-BRL': 'BRL', 'CNY-BRL': 'BRL', 'BTC-BRL': 'BRL', 'ETH-BRL': 'BRL',
          'LTC-BRL': 'BRL', 'XRP-BRL': 'BRL', 'DOGE-BRL': 'BRL', 'USD-BRLPTAX': 'BRL',
          'EUR-BRLPTAX': 'BRL', 'XAU-BRL': 'BRL', 'XAG-BRL': 'BRL', 'EUR-USD': 'USD',
          'GBP-USD': 'USD', 'AUD-USD': 'USD', 'NZD-USD': 'USD', 'BTC-USD': 'USD',
          'ETH-USD': 'USD', 'XAU-USD': 'USD', 'XAG-USD': 'USD', 'USD-JPY': 'JPY',
          'EUR-JPY': 'JPY', 'USD-CHF': 'CHF', 'EUR-CHF': 'CHF', 'USD-CAD': 'CAD',
          'EUR-CAD': 'CAD', 'EUR-GBP': 'GBP', 'BTC-EUR': 'EUR', 'ETH-EUR': 'EUR',
          'XAU-EUR': 'EUR', 'USD-MXN': 'MXN', 'USD-ZAR': 'ZAR', 'USD-TRY': 'TRY',
          'USD-SGD': 'SGD', 'USD-INR': 'INR', 'USD-KRW': 'KRW'
      }

      return Object.fromEntries(
          Object.entries(mappings).map(([code, currency]) => [
              code,
              { symbol: currency, prefix: symbols[currency] }
          ])
      )
  }

  // NOVO: Método para validar se uma moeda é válida
  isValidCurrency(currency) {
      return Object.keys(this.currencySymbols).includes(currency)
  }

  formatCurrencyValue(currencyCode, value) {
      const { prefix } = this.currencySymbols[currencyCode] || {}
      const formattedValue = (Math.floor(value * 100) / 100).toFixed(2)
      return prefix ? `${prefix} ${formattedValue}` : formattedValue
  }

  // NOVO: Sistema de notificações para substituir alerts
  showNotification(message, type = 'info') {
      // Remove notificação existente para evitar duplicatas
      const existingNotification = document.querySelector('.notification')
      if (existingNotification) {
          existingNotification.remove()
      }

      const notification = document.createElement('div')
      notification.className = `notification ${type}`
      notification.innerHTML = `
          <span>${message}</span>
          <button onclick="this.parentElement.remove()">×</button>
      `
      
      document.body.appendChild(notification)
      // Remove automaticamente após 5 segundos
      setTimeout(() => notification.remove(), 5000)
  }

  // NOVO: Debounce para otimizar performance em eventos frequentes
  debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
          const later = () => {
              clearTimeout(timeout)
              func(...args)
          }
          clearTimeout(timeout)
          timeout = setTimeout(later, wait)
      }
  }

  init() {
      document.addEventListener('DOMContentLoaded', () => {
          this.setupEventListeners()
          this.loadCurrencyOptions()
          this.updateSelectedCurrenciesList()
          setTimeout(() => this.loadQuotes(), 1000)
      })
  }

  setupEventListeners() {
      const events = [
          ['#add-currency-btn', 'click', () => this.addCurrency()],
          ['#load-quotes-btn', 'click', () => { this.loadQuotes(); this.closeModal() }],
          ['#clear-all-btn', 'click', () => this.clearAllCurrencies()],
          ['#refresh-btn', 'click', () => this.loadQuotes()],
          ['#btn-selection', 'click', () => this.openModal()],
          ['.reader-modal-close', 'click', () => this.closeModal()],
          ['#currency-modal', 'click', (e) => e.target.id === 'currency-modal' && this.closeModal()],
          ['#currency-select', 'keypress', (e) => e.key === 'Enter' && this.addCurrency()],
          ['#load-historic-btn', 'click', () => this.loadHistoricData()],
          // MUDANÇA: Adicionado debounce para evitar múltiplas chamadas durante change
          ['#days-select, #currency-historic', 'change', this.debounce(() => 
              document.getElementById('currency-historic')?.value && this.loadHistoricData(), 300)]
      ]

      events.forEach(([selector, event, handler]) => 
          document.querySelector(selector)?.addEventListener(event, handler))
  }

  openModal() {
      document.getElementById('currency-modal').style.display = 'block'
  }

  closeModal() {
      document.getElementById('currency-modal').style.display = 'none'
  }

  loadCurrencyOptions() {
      const currencies = [
          'USD-BRL:Dólar Americano/Real Brasileiro', 'USD-BRLT:Dólar Americano/Real Brasileiro Turismo',
          'EUR-BRL:Euro/Real Brasileiro', 'GBP-BRL:Libra Esterlina/Real Brasileiro',
          'ARS-BRL:Peso Argentino/Real Brasileiro', 'CAD-BRL:Dólar Canadense/Real Brasileiro',
          'JPY-BRL:Iene Japonês/Real Brasileiro', 'CHF-BRL:Franco Suíço/Real Brasileiro',
          'AUD-BRL:Dólar Australiano/Real Brasileiro', 'CNY-BRL:Yuan Chinês/Real Brasileiro',
          'BTC-BRL:Bitcoin/Real Brasileiro', 'ETH-BRL:Ethereum/Real Brasileiro',
          'LTC-BRL:Litecoin/Real Brasileiro', 'XRP-BRL:XRP/Real Brasileiro',
          'DOGE-BRL:Dogecoin/Real Brasileiro', 'EUR-USD:Euro/Dólar Americano',
          'GBP-USD:Libra Esterlina/Dólar Americano', 'USD-JPY:Dólar Americano/Iene Japonês',
          'USD-CHF:Dólar Americano/Franco Suíço', 'USD-CAD:Dólar Americano/Dólar Canadense',
          'AUD-USD:Dólar Australiano/Dólar Americano', 'NZD-USD:Dólar Neozelandês/Dólar Americano',
          'BTC-USD:Bitcoin/Dólar Americano', 'ETH-USD:Ethereum/Dólar Americano',
          'EUR-GBP:Euro/Libra Esterlina', 'EUR-JPY:Euro/Iene Japonês',
          'EUR-CHF:Euro/Franco Suíço', 'EUR-CAD:Euro/Dólar Canadense',
          'BTC-EUR:Bitcoin/Euro', 'ETH-EUR:Ethereum/Euro',
          'USD-BRLPTAX:Dólar Americano/Real Brasileiro PTAX', 'EUR-BRLPTAX:Euro/Real Brasileiro PTAX',
          'XAU-USD:Ouro/Dólar Americano', 'XAU-BRL:Ouro/Real Brasileiro',
          'XAU-EUR:Ouro/Euro', 'XAG-USD:Prata/Dólar Americano',
          'XAG-BRL:Prata/Real Brasileiro', 'USD-MXN:Dólar Americano/Peso Mexicano',
          'USD-ZAR:Dólar Americano/Rand Sul-Africano', 'USD-TRY:Dólar Americano/Nova Lira Turca',
          'USD-SGD:Dólar Americano/Dólar de Cingapura', 'USD-INR:Dólar Americano/Rúpia Indiana',
          'USD-KRW:Dólar Americano/Won Sul-Coreano'
      ]

      const createOptions = (selectId) => {
          const select = document.getElementById(selectId)
          if (!select) return
          
          select.innerHTML = '<option value="">Selecione uma moeda...</option>'
          currencies.forEach(item => {
              const [code, name] = item.split(':')
              const option = document.createElement('option')
              option.value = code
              option.textContent = `${code} - ${name}`
              select.appendChild(option)
          })
      }

      createOptions('currency-select')
      createOptions('currency-historic')
  }

  // MUDANÇA: Substituído alert por notificações e adicionada validação de moeda
  addCurrency() {
      const currency = document.getElementById('currency-select')?.value
      if (!currency) return this.showNotification('Por favor, selecione uma moeda.', 'error')
      // NOVO: Validação se a moeda é válida
      if (!this.isValidCurrency(currency)) return this.showNotification('Moeda inválida selecionada.', 'error')
      if (this.selectedCurrencies.has(currency)) return this.showNotification('Esta moeda já foi adicionada.', 'error')
      
      this.selectedCurrencies.add(currency)
      this.updateSelectedCurrenciesList()
      document.getElementById('currency-select').value = ''
      // NOVO: Feedback positivo quando adiciona com sucesso
      this.showNotification('Moeda adicionada com sucesso!', 'success')
  }

  updateSelectedCurrenciesList() {
      const list = document.getElementById('selected-list')
      if (!list) return

      list.innerHTML = ''
      this.selectedCurrencies.forEach(currency => {
          const tag = document.createElement('div')
          tag.className = 'tag'
          tag.innerHTML = `${currency}<button class="remove-btn" data-currency="${currency}">×</button>`
          tag.querySelector('.remove-btn').addEventListener('click', () => 
              this.removeCurrency(currency))
          list.appendChild(tag)
      })
  }

  // MUDANÇA: Adicionado feedback ao remover moeda
  removeCurrency(currency) {
      this.selectedCurrencies.delete(currency)
      this.updateSelectedCurrenciesList()
      this.showNotification('Moeda removida.', 'info')
  }

  // MUDANÇA: Adicionado feedback ao limpar todas as moedas
  clearAllCurrencies() {
      this.selectedCurrencies.clear()
      this.updateSelectedCurrenciesList()
      this.showLoading('moedas')
      this.showNotification('Todas as moedas foram removidas.', 'info')
  }

  async loadQuotes() {
      if (this.selectedCurrencies.size === 0) {
          // MUDANÇA: Substituído alert por notificação
          this.showNotification('Por favor, adicione pelo menos uma moeda.', 'error')
          return
      }
      
      try {
          this.showLoading('moedas')
          const quotes = await this.fetchQuotes(Array.from(this.selectedCurrencies).join(','))
          this.displayQuotes(quotes)
          this.updateLastUpdate()
          // NOVO: Feedback de sucesso
          this.showNotification('Cotações atualizadas com sucesso!', 'success')
      } catch (error) {
          console.error('Erro ao carregar cotações:', error)
          this.displayError('Erro ao carregar cotações. Tente novamente.')
          // NOVO: Notificação de erro
          this.showNotification('Erro ao carregar cotações.', 'error')
      }
  }

  // MUDANÇA: Adicionado timeout e AbortController para evitar requisições pendentes
  async fetchQuotes(currencies) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos de timeout
      
      try {
          let response = await fetch(`https://economia.awesomeapi.com.br/json/last/${currencies}`, {
              signal: controller.signal // NOVO: Adicionado signal para cancelamento
          })
          
          if (!response.ok) {
              response = await fetch(`https://economia.awesomeapi.com.br/json/last/${currencies}-BRL`, {
                  signal: controller.signal // NOVO: Adicionado signal para cancelamento
              })
              if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
          }
          
          const data = await response.json()
          return Object.values(data).map(item => ({
              code: item.code,
              codein: item.codein,
              name: item.name,
              bid: +item.bid,
              ask: +item.ask,
              high: +item.high,
              low: +item.low,
              variation: +item.pctChange,
              timestamp: item.timestamp,
          }))
      } finally {
          // NOVO: Cleanup do timeout
          clearTimeout(timeoutId)
      }
  }

  displayQuotes(quotes) {
      const container = document.getElementById('moedas')
      if (!container) return

      container.innerHTML = quotes.map(quote => {
          const isPositive = quote.variation >= 0
          const variationClass = isPositive ? 'positive' : 'negative'
          const variationIcon = isPositive ? '↗' : '↘'
          const fullCurrencyCode = `${quote.code}-${quote.codein || 'BRL'}`

          return `
              <div class="card ${variationClass}">
                  <div class="card-header">
                      <div class="currency-name">${quote.name}</div>
                      <div class="currency-code">${quote.code}</div>
                  </div>
                  <div class="card-body">
                      ${this.createQuoteRow('Compra:', this.formatCurrencyValue(fullCurrencyCode, quote.bid))}
                      ${this.createQuoteRow('Venda:', this.formatCurrencyValue(fullCurrencyCode, quote.ask))}
                      ${this.createQuoteRow('Variação:', `${variationIcon} ${Math.abs(quote.variation).toFixed(2)}%`, variationClass)}
                      ${this.createQuoteRow('Máximo:', this.formatCurrencyValue(fullCurrencyCode, quote.high))}
                      ${this.createQuoteRow('Mínimo:', this.formatCurrencyValue(fullCurrencyCode, quote.low))}
                  </div>
                  <div class="card-footer">
                      <small>Atualizado: ${new Date().toLocaleTimeString('pt-BR')}</small>
                  </div>
              </div>
          `
      }).join('')
  }

  createQuoteRow(label, value, className = '') {
      return `<div class="quote-row"><span class="label">${label}</span><span class="value ${className}">${value}</span></div>`
  }

  async loadHistoricData() {
      const currency = document.getElementById('currency-historic')?.value
      const days = document.getElementById('days-select')?.value

      if (!currency) {
          // MUDANÇA: Substituído alert por notificação
          this.showNotification('Por favor, selecione uma moeda para o histórico.', 'error')
          return
      }

      try {
          this.showLoading('historic')
          const historicData = await this.fetchHistoricData(currency, +days)
          this.createHistoricChart(historicData, currency)
          this.updateHistoricTable(historicData)
          // NOVO: Feedback de sucesso
          this.showNotification('Histórico carregado com sucesso!', 'success')
      } catch (error) {
          console.error('Erro ao carregar histórico:', error)
          // MUDANÇA: Substituído alert por notificação
          this.showNotification('Erro ao carregar dados históricos. Tente novamente.', 'error')
      }
  }

  // MUDANÇA: Adicionado timeout e AbortController para histórico também
  async fetchHistoricData(currency, days) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos para histórico
      
      try {
          const response = await fetch(`https://economia.awesomeapi.com.br/json/daily/${currency}-BRL/${days}`, {
              signal: controller.signal // NOVO: Adicionado signal para cancelamento
          })
          if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
          const data = await response.json()
          return data.map(item => ({
              date: new Date(+item.timestamp * 1000).toLocaleDateString('pt-BR'),
              timestamp: new Date(+item.timestamp * 1000),
              bid: +item.bid,
              ask: +item.ask,
              variation: +item.pctChange,
              high: +item.high,
              low: +item.low,
          })).reverse()
      } catch (error) {
          console.error('Erro na API, usando dados mock:', error)
          // NOVO: Notificação informativa quando usa dados mock
          this.showNotification('Usando dados simulados para o histórico.', 'info')
          return this.generateMockHistoricData(currency, days)
      } finally {
          // NOVO: Cleanup do timeout
          clearTimeout(timeoutId)
      }
  }

  generateMockHistoricData(currency, days) {
      const basePrices = { USD: 5.2, EUR: 5.6, GBP: 6.5, JPY: 0.035, BTC: 150000, ETH: 10000 }
      const basePrice = basePrices[currency.split('-')[0]] || 5.0

      return Array.from({ length: days }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (days - 1 - i))
          
          const variation = (Math.random() - 0.5) * 4
          const price = basePrice * (1 + (variation / 100) * ((days - 1 - i) / days))
          
          return {
              date: date.toLocaleDateString('pt-BR'),
              timestamp: date,
              bid: +(price * 0.998).toFixed(2),
              ask: +(price * 1.002).toFixed(2),
              variation: +variation.toFixed(2),
              high: +(price * (1 + Math.random() * 0.03)).toFixed(2),
              low: +(price * (1 - Math.random() * 0.02)).toFixed(2),
          }
      })
  }

  createHistoricChart(data, currency) {
      const ctx = document.getElementById('historic-chart')
      if (!ctx) return

      this.historicChart?.destroy()

      if (typeof Chart === 'undefined') {
          ctx.parentElement.innerHTML = '<p style="text-align: center; padding: 20px;">Para visualizar o gráfico, inclua Chart.js via CDN no HTML.</p>'
          return
      }

      const fullCurrencyCode = currency.includes('-') ? currency : `${currency}-BRL`
      this.historicChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: data.map(item => item.date),
              datasets: [
                  {
                      label: 'Preço de Compra (Bid)',
                      data: data.map(item => item.bid),
                      backgroundColor: 'rgba(54, 162, 235, 0.8)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                  },
                  {
                      label: 'Preço de Venda (Ask)',
                      data: data.map(item => item.ask),
                      backgroundColor: 'rgba(255, 99, 132, 0.8)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1,
                  }
              ]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  title: { display: true, text: `Histórico de Cotações - ${currency}` },
                  tooltip: {
                      callbacks: {
                          label: (context) => 
                              `${context.dataset.label}: ${this.formatCurrencyValue(fullCurrencyCode, context.parsed.y)}`
                      }
                  }
              },
              scales: {
                  y: {
                      ticks: {
                          callback: (value) => this.formatCurrencyValue(fullCurrencyCode, value)
                      }
                  }
              }
          }
      })
  }

  updateHistoricTable(data) {
      const tbody = document.querySelector('#historico tbody')
      if (!tbody) return

      const currency = document.getElementById('currency-historic')?.value || 'USD-BRL'
      const fullCurrencyCode = currency.includes('-') ? currency : `${currency}-BRL`

      tbody.innerHTML = data.map(item => {
          const isPositive = item.variation >= 0
          const variationClass = isPositive ? 'positive' : 'negative'
          const variationIcon = isPositive ? '↗' : '↘'

          return `
              <tr>
                  <td>${item.date}</td>
                  <td>${this.formatCurrencyValue(fullCurrencyCode, item.bid)}</td>
                  <td>${this.formatCurrencyValue(fullCurrencyCode, item.ask)}</td>
                  <td class="${variationClass}">${variationIcon} ${Math.abs(item.variation).toFixed(2)}%</td>
                  <td>${this.formatCurrencyValue(fullCurrencyCode, item.high)}</td>
                  <td>${this.formatCurrencyValue(fullCurrencyCode, item.low)}</td>
              </tr>
          `
      }).join('')
  }

  showLoading(elementId) {
      const element = document.getElementById(elementId)
      element && (element.innerHTML = '<div class="loading"><div class="spinner"></div></div>')
  }

  displayError(message) {
      const container = document.getElementById('moedas')
      container && (container.innerHTML = `<div class="error-message"><span>⚠️</span><p>${message}</p></div>`)
  }

  updateLastUpdate() {
      const lastUpdate = document.getElementById('last-update')
      lastUpdate && (lastUpdate.textContent = `Última atualização: ${new Date().toLocaleString('pt-BR')}`)
  }
}

const currencyApp = new CurrencyApp()