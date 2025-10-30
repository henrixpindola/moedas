// /src/scripts/scripts.js
class CurrencyApp {
  constructor() {
    this.selectedCurrencies = new Set()
    this.historicChart = null
    this.currencySymbols = this.initializeCurrencySymbols()
    this.init()
  }

  initializeCurrencySymbols() {
    return {
      "USD-BRL": { symbol: "BRL", prefix: "R$" },
      "USD-BRLT": { symbol: "BRL", prefix: "R$" },
      "EUR-BRL": { symbol: "BRL", prefix: "R$" },
      "GBP-BRL": { symbol: "BRL", prefix: "R$" },
      "ARS-BRL": { symbol: "BRL", prefix: "R$" },
      "CAD-BRL": { symbol: "BRL", prefix: "R$" },
      "JPY-BRL": { symbol: "BRL", prefix: "R$" },
      "CHF-BRL": { symbol: "BRL", prefix: "R$" },
      "AUD-BRL": { symbol: "BRL", prefix: "R$" },
      "CNY-BRL": { symbol: "BRL", prefix: "R$" },
      "BTC-BRL": { symbol: "BRL", prefix: "R$" },
      "ETH-BRL": { symbol: "BRL", prefix: "R$" },
      "LTC-BRL": { symbol: "BRL", prefix: "R$" },
      "XRP-BRL": { symbol: "BRL", prefix: "R$" },
      "DOGE-BRL": { symbol: "BRL", prefix: "R$" },
      "USD-BRLPTAX": { symbol: "BRL", prefix: "R$" },
      "EUR-BRLPTAX": { symbol: "BRL", prefix: "R$" },
      "XAU-BRL": { symbol: "BRL", prefix: "R$" },
      "XAG-BRL": { symbol: "BRL", prefix: "R$" },
      "EUR-USD": { symbol: "USD", prefix: "US$" },
      "GBP-USD": { symbol: "USD", prefix: "US$" },
      "AUD-USD": { symbol: "USD", prefix: "US$" },
      "NZD-USD": { symbol: "USD", prefix: "US$" },
      "BTC-USD": { symbol: "USD", prefix: "US$" },
      "ETH-USD": { symbol: "USD", prefix: "US$" },
      "XAU-USD": { symbol: "USD", prefix: "US$" },
      "XAG-USD": { symbol: "USD", prefix: "US$" },
      "USD-JPY": { symbol: "JPY", prefix: "¥" },
      "EUR-JPY": { symbol: "JPY", prefix: "¥" },
      "USD-CHF": { symbol: "CHF", prefix: "CHF" },
      "EUR-CHF": { symbol: "CHF", prefix: "CHF" },
      "USD-CAD": { symbol: "CAD", prefix: "C$" },
      "EUR-CAD": { symbol: "CAD", prefix: "C$" },
      "EUR-GBP": { symbol: "GBP", prefix: "£" },
      "BTC-EUR": { symbol: "EUR", prefix: "€" },
      "ETH-EUR": { symbol: "EUR", prefix: "€" },
      "XAU-EUR": { symbol: "EUR", prefix: "€" },
      "USD-MXN": { symbol: "MXN", prefix: "MX$" },
      "USD-ZAR": { symbol: "ZAR", prefix: "R" },
      "USD-TRY": { symbol: "TRY", prefix: "₺" },
      "USD-SGD": { symbol: "SGD", prefix: "S$" },
      "USD-INR": { symbol: "INR", prefix: "₹" },
      "USD-KRW": { symbol: "KRW", prefix: "₩" },
      default: { symbol: "", prefix: "" },
    }
  }

  formatCurrencyValue(currencyCode, value) {
    const currencyInfo = this.currencySymbols[currencyCode] ?? this.currencySymbols.default
    const flooredValue = Math.floor(value * 100) / 100
    const formattedValue = flooredValue.toFixed(2)
    return currencyInfo.prefix ? `${currencyInfo.prefix} ${formattedValue}` : formattedValue
  }

  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.setupEventListeners()
      this.loadCurrencyOptions()
      this.loadInitialData()
    })
  }

  setupEventListeners() {
    document.getElementById("add-currency-btn")?.addEventListener("click", () => this.addCurrency())
    document.getElementById("load-quotes-btn")?.addEventListener("click", () => {
      this.loadQuotes()
      this.closeModal()
    })
    document.getElementById("clear-all-btn")?.addEventListener("click", () => this.clearAllCurrencies())
    document.getElementById("refresh-btn")?.addEventListener("click", () => this.loadQuotes())
    document.getElementById("btn-selection")?.addEventListener("click", () => this.openModal())

    document.querySelector(".reader-modal-close")?.addEventListener("click", () => this.closeModal())

    document.getElementById("currency-modal")?.addEventListener("click", (e) => {
      e.target.id === "currency-modal" && this.closeModal()
    })

    document.getElementById("currency-select")?.addEventListener("keypress", (e) => {
      e.key === "Enter" && this.addCurrency()
    })

    document.getElementById("load-historic-btn")?.addEventListener("click", () => this.loadHistoricData())

    document.getElementById("days-select")?.addEventListener("change", () => {
      document.getElementById("currency-historic")?.value && this.loadHistoricData()
    })

    document.getElementById("currency-historic")?.addEventListener("change", (e) => {
      e.target.value && this.loadHistoricData()
    })
  }

  openModal() {
    const modal = document.getElementById("currency-modal")
    modal && (modal.style.display = "block")
  }

  closeModal() {
    const modal = document.getElementById("currency-modal")
    modal && (modal.style.display = "none")
  }

  loadCurrencyOptions() {
    const currencies = [
      { code: "USD-BRL", name: "Dólar Americano/Real Brasileiro" },
      { code: "USD-BRLT", name: "Dólar Americano/Real Brasileiro Turismo" },
      { code: "EUR-BRL", name: "Euro/Real Brasileiro" },
      { code: "GBP-BRL", name: "Libra Esterlina/Real Brasileiro" },
      { code: "ARS-BRL", name: "Peso Argentino/Real Brasileiro" },
      { code: "CAD-BRL", name: "Dólar Canadense/Real Brasileiro" },
      { code: "JPY-BRL", name: "Iene Japonês/Real Brasileiro" },
      { code: "CHF-BRL", name: "Franco Suíço/Real Brasileiro" },
      { code: "AUD-BRL", name: "Dólar Australiano/Real Brasileiro" },
      { code: "CNY-BRL", name: "Yuan Chinês/Real Brasileiro" },
      { code: "BTC-BRL", name: "Bitcoin/Real Brasileiro" },
      { code: "ETH-BRL", name: "Ethereum/Real Brasileiro" },
      { code: "LTC-BRL", name: "Litecoin/Real Brasileiro" },
      { code: "XRP-BRL", name: "XRP/Real Brasileiro" },
      { code: "DOGE-BRL", name: "Dogecoin/Real Brasileiro" },
      { code: "EUR-USD", name: "Euro/Dólar Americano" },
      { code: "GBP-USD", name: "Libra Esterlina/Dólar Americano" },
      { code: "USD-JPY", name: "Dólar Americano/Iene Japonês" },
      { code: "USD-CHF", name: "Dólar Americano/Franco Suíço" },
      { code: "USD-CAD", name: "Dólar Americano/Dólar Canadense" },
      { code: "AUD-USD", name: "Dólar Australiano/Dólar Americano" },
      { code: "NZD-USD", name: "Dólar Neozelandês/Dólar Americano" },
      { code: "BTC-USD", name: "Bitcoin/Dólar Americano" },
      { code: "ETH-USD", name: "Ethereum/Dólar Americano" },
      { code: "EUR-GBP", name: "Euro/Libra Esterlina" },
      { code: "EUR-JPY", name: "Euro/Iene Japonês" },
      { code: "EUR-CHF", name: "Euro/Franco Suíço" },
      { code: "EUR-CAD", name: "Euro/Dólar Canadense" },
      { code: "BTC-EUR", name: "Bitcoin/Euro" },
      { code: "ETH-EUR", name: "Ethereum/Euro" },
      { code: "USD-BRLPTAX", name: "Dólar Americano/Real Brasileiro PTAX" },
      { code: "EUR-BRLPTAX", name: "Euro/Real Brasileiro PTAX" },
      { code: "XAU-USD", name: "Ouro/Dólar Americano" },
      { code: "XAU-BRL", name: "Ouro/Real Brasileiro" },
      { code: "XAU-EUR", name: "Ouro/Euro" },
      { code: "XAG-USD", name: "Prata/Dólar Americano" },
      { code: "XAG-BRL", name: "Prata/Real Brasileiro" },
      { code: "USD-MXN", name: "Dólar Americano/Peso Mexicano" },
      { code: "USD-ZAR", name: "Dólar Americano/Rand Sul-Africano" },
      { code: "USD-TRY", name: "Dólar Americano/Nova Lira Turca" },
      { code: "USD-SGD", name: "Dólar Americano/Dólar de Cingapura" },
      { code: "USD-INR", name: "Dólar Americano/Rúpia Indiana" },
      { code: "USD-KRW", name: "Dólar Americano/Won Sul-Coreano" },
    ]

    const currencySelect = document.getElementById("currency-select")
    const historicSelect = document.getElementById("currency-historic")

    currencySelect && (currencySelect.innerHTML = '<option value="">Selecione uma moeda...</option>')
    historicSelect && (historicSelect.innerHTML = '<option value="">Selecione uma moeda...</option>')

    currencies.forEach(({ code, name }) => {
      const optionText = `${code} - ${name}`

      if (currencySelect) {
        const option = document.createElement("option")
        option.value = code
        option.textContent = optionText
        currencySelect.appendChild(option)
      }

      if (historicSelect) {
        const historicOption = document.createElement("option")
        historicOption.value = code
        historicOption.textContent = optionText
        historicSelect.appendChild(historicOption)
      }
    })
  }

  addCurrency() {
    const select = document.getElementById("currency-select")
    const currency = select?.value

    if (!currency) return alert("Por favor, selecione uma moeda.")
    if (this.selectedCurrencies.has(currency)) return alert("Esta moeda já foi adicionada.")

    this.selectedCurrencies.add(currency)
    this.updateSelectedCurrenciesList()
    select.value = ""
  }

  updateSelectedCurrenciesList() {
    const list = document.getElementById("selected-list")
    if (!list) return

    list.innerHTML = ""
    this.selectedCurrencies.forEach((currency) => {
      const tag = document.createElement("div")
      tag.className = "tag"
      tag.innerHTML = `${currency}<button class="remove-btn" data-currency="${currency}">×</button>`
      list.appendChild(tag)
    })

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => this.removeCurrency(e.target.getAttribute("data-currency")))
    })
  }

  removeCurrency(currency) {
    this.selectedCurrencies.delete(currency)
    this.updateSelectedCurrenciesList()
  }

  clearAllCurrencies() {
    this.selectedCurrencies.clear()
    this.updateSelectedCurrenciesList()
    const moedasContainer = document.getElementById("moedas")
    moedasContainer && (moedasContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>')
  }

  async loadQuotes() {
    if (this.selectedCurrencies.size === 0) return alert("Por favor, adicione pelo menos uma moeda.")

    const currenciesArray = Array.from(this.selectedCurrencies).join(",")

    try {
      this.showLoading("moedas")
      const quotes = await this.fetchQuotes(currenciesArray)
      this.displayQuotes(quotes)
      this.updateLastUpdate()
    } catch (error) {
      console.error("Erro ao carregar cotações:", error)
      this.displayError("Erro ao carregar cotações. Tente novamente.")
    } finally {
      this.hideLoading("moedas")
    }
  }

  async fetchQuotes(currencies) {
    let response = await fetch(`https://economia.awesomeapi.com.br/json/last/${currencies}`)

    if (!response.ok) {
      response = await fetch(`https://economia.awesomeapi.com.br/json/last/${currencies}-BRL`)
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
    }

    const data = await response.json()
    return this.processQuotesData(data)
  }

  processQuotesData(apiData) {
    return Object.values(apiData).map((item) => ({
      code: item.code,
      codein: item.codein,
      name: item.name,
      bid: Number.parseFloat(item.bid),
      ask: Number.parseFloat(item.ask),
      high: Number.parseFloat(item.high),
      low: Number.parseFloat(item.low),
      variation: Number.parseFloat(item.pctChange),
      timestamp: item.timestamp,
    }))
  }

  displayQuotes(quotes) {
    const container = document.getElementById("moedas")
    if (!container) return

    container.innerHTML = ""

    quotes.forEach((quote) => {
      const isPositive = quote.variation >= 0
      const variationClass = isPositive ? "positive" : "negative"
      const variationIcon = isPositive ? "↗" : "↘"
      const fullCurrencyCode = `${quote.code}-${quote.codein ?? "BRL"}`

      const card = document.createElement("div")
      card.className = `card ${variationClass}`
      card.innerHTML = `
        <div class="card-header">
          <div class="currency-name">${quote.name}</div>
          <div class="currency-code">${quote.code}</div>
        </div>
        <div class="card-body">
          <div class="quote-row">
            <span class="label">Compra:</span>
            <span class="value">${this.formatCurrencyValue(fullCurrencyCode, quote.bid)}</span>
          </div>
          <div class="quote-row">
            <span class="label">Venda:</span>
            <span class="value">${this.formatCurrencyValue(fullCurrencyCode, quote.ask)}</span>
          </div>
          <div class="quote-row">
            <span class="label">Variação:</span>
            <span class="value ${variationClass}">${variationIcon} ${Math.abs(quote.variation).toFixed(2)}%</span>
          </div>
          <div class="quote-row">
            <span class="label">Máximo:</span>
            <span class="value">${this.formatCurrencyValue(fullCurrencyCode, quote.high)}</span>
          </div>
          <div class="quote-row">
            <span class="label">Mínimo:</span>
            <span class="value">${this.formatCurrencyValue(fullCurrencyCode, quote.low)}</span>
          </div>
        </div>
        <div class="card-footer">
          <small>Atualizado: ${new Date().toLocaleTimeString("pt-BR")}</small>
        </div>
      `
      container.appendChild(card)
    })
  }

  async loadHistoricData() {
    const currency = document.getElementById("currency-historic")?.value
    const days = document.getElementById("days-select")?.value

    if (!currency) return alert("Por favor, selecione uma moeda para o histórico.")

    try {
      this.showLoading("historic")
      const historicData = await this.fetchHistoricData(currency, Number.parseInt(days))
      this.createHistoricChart(historicData, currency)
      this.updateHistoricTable(historicData)
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
      alert("Erro ao carregar dados históricos. Tente novamente.")
    } finally {
      this.hideLoading("historic")
    }
  }

  async fetchHistoricData(currency, days) {
    try {
      const response = await fetch(`https://economia.awesomeapi.com.br/json/daily/${currency}-BRL/${days}`)
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
      const data = await response.json()
      return this.processHistoricData(data)
    } catch (error) {
      console.error("Erro na API, usando dados mock:", error)
      return this.generateMockHistoricData(currency, days)
    }
  }

  processHistoricData(apiData) {
    return apiData
      .map((item) => {
        const date = new Date(Number.parseInt(item.timestamp) * 1000)
        return {
          date: date.toLocaleDateString("pt-BR"),
          timestamp: date,
          bid: Number.parseFloat(item.bid),
          ask: Number.parseFloat(item.ask),
          variation: Number.parseFloat(item.pctChange),
          high: Number.parseFloat(item.high),
          low: Number.parseFloat(item.low),
          open: Number.parseFloat(item.open),
        }
      })
      .reverse()
  }

  generateMockHistoricData(currency, days) {
    const basePrices = { USD: 5.2, EUR: 5.6, GBP: 6.5, JPY: 0.035, BTC: 150000, ETH: 10000, LTC: 500, XRP: 3.0 }
    const baseCurrency = currency.split("-")[0]
    const basePrice = basePrices[baseCurrency] ?? 5.0

    // Usando Array.from with map to simplify loop
    return Array.from({ length: days }, (_, i) => {
      const dayOffset = days - 1 - i
      const date = new Date()
      date.setDate(date.getDate() - dayOffset)

      const variation = (Math.random() - 0.5) * 4
      const price = basePrice * (1 + (variation / 100) * (dayOffset / days))
      const high = price * (1 + Math.random() * 0.03)
      const low = price * (1 - Math.random() * 0.02)
      const bid = price * 0.998
      const ask = price * 1.002

      return {
        date: date.toLocaleDateString("pt-BR"),
        timestamp: date,
        bid: Number.parseFloat(bid.toFixed(2)),
        ask: Number.parseFloat(ask.toFixed(2)),
        variation: Number.parseFloat(variation.toFixed(2)),
        high: Number.parseFloat(high.toFixed(2)),
        low: Number.parseFloat(low.toFixed(2)),
      }
    })
  }

  createHistoricChart(data, currency) {
    const ctx = document.getElementById("historic-chart")
    if (!ctx) return

    this.historicChart?.destroy()

    const labels = data.map((item) => item.date)
    const bidPrices = data.map((item) => item.bid)
    const askPrices = data.map((item) => item.ask)
    const fullCurrencyCode = currency.includes("-") ? currency : `${currency}-BRL`

    if (typeof Chart === "undefined") {
      console.error("Chart.js não está disponível.")
      ctx.parentElement.innerHTML =
        '<p style="text-align: center; padding: 20px;">Para visualizar o gráfico, inclua Chart.js via CDN no HTML.</p>'
      return
    }

    this.historicChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Preço de Compra (Bid)",
            data: bidPrices,
            backgroundColor: "rgba(54, 162, 235, 0.8)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Preço de Venda (Ask)",
            data: askPrices,
            backgroundColor: "rgba(255, 99, 132, 0.8)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            yAxisID: "y",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: `Histórico de Cotações - ${currency}`, font: { size: 16, weight: "bold" } },
          legend: { position: "top" },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label ? `${context.dataset.label}: ` : ""
                return label + this.formatCurrencyValue(fullCurrencyCode, context.parsed.y)
              },
            },
          },
        },
        scales: {
          x: { title: { display: true, text: "Data" }, grid: { display: false } },
          y: {
            title: { display: true, text: "Valor" },
            beginAtZero: false,
            ticks: { callback: (value) => this.formatCurrencyValue(fullCurrencyCode, value) },
          },
        },
        interaction: { mode: "nearest", axis: "x", intersect: false },
      },
    })
  }

  updateHistoricTable(data) {
    const tbody = document.querySelector("#historico tbody")
    if (!tbody) return

    tbody.innerHTML = ""
    const currency = document.getElementById("currency-historic")?.value ?? "USD-BRL"
    const fullCurrencyCode = currency.includes("-") ? currency : `${currency}-BRL`

    data.forEach((item) => {
      const isPositive = item.variation >= 0
      const variationClass = isPositive ? "positive" : "negative"
      const variationIcon = isPositive ? "↗" : "↘"

      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${item.date}</td>
        <td>${this.formatCurrencyValue(fullCurrencyCode, item.bid)}</td>
        <td>${this.formatCurrencyValue(fullCurrencyCode, item.ask)}</td>
        <td class="${variationClass}">${variationIcon} ${Math.abs(item.variation).toFixed(2)}%</td>
        <td>${this.formatCurrencyValue(fullCurrencyCode, item.high)}</td>
        <td>${this.formatCurrencyValue(fullCurrencyCode, item.low)}</td>
      `
      tbody.appendChild(row)
    })
  }

  showLoading(elementId) {
    const element = document.getElementById(elementId)
    element && (element.innerHTML = '<div class="loading"><div class="spinner"></div></div>')
  }

  hideLoading(elementId) {}

  displayError(message) {
    const container = document.getElementById("moedas")
    container && (container.innerHTML = `<div class="error-message"><span>⚠️</span><p>${message}</p></div>`)
  }

  updateLastUpdate() {
    const lastUpdate = document.getElementById("last-update")
    lastUpdate && (lastUpdate.textContent = `Última atualização: ${new Date().toLocaleString("pt-BR")}`)
  }

  loadInitialData() {
    this.selectedCurrencies.add("USD-BRL")
    this.selectedCurrencies.add("EUR-BRL")
    this.selectedCurrencies.add("BTC-BRL")
    this.updateSelectedCurrenciesList()
    setTimeout(() => this.loadQuotes(), 1000)
  }
}

const currencyApp = new CurrencyApp()

typeof module !== "undefined" && module.exports
  ? (module.exports = { CurrencyApp })
  : (window.CurrencyApp = CurrencyApp)
