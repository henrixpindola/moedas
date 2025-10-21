const CURRENCY_PAIRS = [
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
];

class AwesomeAPI {
  constructor(apiKey = null) {
    this.baseURL = "https://economia.awesomeapi.com.br";
    this.apiKey = apiKey || "76d98d2ec82a3d1f0e5decdcb1d3b9cb77bc5c34fa9bd38e48a6d241cdc4f58c";
  }

  async makeRequest(url) {
    try {
      const response = await fetch(url);
      return response.ok ? await response.json() : (() => { throw new Error(`Erro HTTP: ${response.status}`) })();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  }

  async getLastQuotes(currencies) {
    return await this.makeRequest(`${this.baseURL}/json/last/${currencies}`);
  }

  async getDailyQuotes(currency, days = 1) {
    return await this.makeRequest(`${this.baseURL}/json/daily/${currency}/${days}`);
  }

  static formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
  }
}

class CurrencyApp {
  constructor() {
    this.api = new AwesomeAPI();
    this.selectedCurrencies = new Set(["USD-BRL", "EUR-BRL", "BTC-BRL"]);
    this.initializeElements();
    this.setupEventListeners();
    this.loadCurrencyOptions();
    this.updateSelectedList();
    this.loadData();
  }

  initializeElements() {
    this.moedasContainer = document.getElementById("moedas");
    this.historicoTbody = document.querySelector("#historico tbody");
    this.refreshBtn = document.getElementById("refresh-btn");
    this.currencyHistoric = document.getElementById("currency-historic");
    this.lastUpdate = document.getElementById("last-update");
    this.currencySelect = document.getElementById("currency-select");
    this.addCurrencyBtn = document.getElementById("add-currency-btn");
    this.clearAllBtn = document.getElementById("clear-all-btn");
    this.loadQuotesBtn = document.getElementById("load-quotes-btn");
    this.selectedList = document.getElementById("selected-list");
    this.daysSelect = document.getElementById("days-select");
  }

  setupEventListeners() {
    this.refreshBtn.addEventListener("click", () => this.loadData());
    this.daysSelect.addEventListener("change", () => this.loadHistoric());
    this.currencyHistoric.addEventListener("change", () => this.loadHistoric());
    this.addCurrencyBtn.addEventListener("click", () => this.addCurrency());
    this.clearAllBtn.addEventListener("click", () => this.clearAll());
    this.loadQuotesBtn.addEventListener("click", () => this.loadQuotes());
    this.currencySelect.addEventListener("keypress", (e) => e.key === "Enter" && this.addCurrency());
  }

  loadCurrencyOptions() {
    const createOption = (currency) => {
      const option = document.createElement("option");
      option.value = currency.code;
      option.textContent = currency.name;
      return option;
    };

    this.currencySelect.innerHTML = '<option value="">Selecione uma moeda...</option>';
    this.currencyHistoric.innerHTML = '';
    
    CURRENCY_PAIRS.forEach(currency => {
      this.currencySelect.appendChild(createOption(currency));
      this.currencyHistoric.appendChild(createOption(currency));
    });
    
    this.currencyHistoric.value = "USD-BRL";
  }

  addCurrency() {
    const selectedValue = this.currencySelect.value;
    selectedValue && !this.selectedCurrencies.has(selectedValue) 
      ? (this.selectedCurrencies.add(selectedValue), this.updateSelectedList(), this.currencySelect.value = "")
      : null;
  }

  removeCurrency(currencyCode) {
    this.selectedCurrencies.delete(currencyCode);
    this.updateSelectedList();
  }

  clearAll() {
    this.selectedCurrencies.clear();
    this.updateSelectedList();
    this.moedasContainer.innerHTML = "<p>Selecione moedas para exibir as cotações.</p>";
  }

  updateSelectedList() {
    this.selectedList.innerHTML = this.selectedCurrencies.size === 0 
      ? '<span style="color: #666;">Nenhuma moeda selecionada</span>'
      : Array.from(this.selectedCurrencies).map(currencyCode => {
          const currency = CURRENCY_PAIRS.find(c => c.code === currencyCode);
          return `<div class="currency-tag">
                    ${currency ? currency.name : currencyCode}
                    <button type="button" onclick="currencyApp.removeCurrency('${currencyCode}')">×</button>
                  </div>`;
        }).join('');
  }

  async loadData() {
    this.setLoadingState(true);
    try {
      await Promise.all([this.loadQuotes(), this.loadHistoric()]);
      this.updateLastUpdateTime();
    } catch (error) {
      this.showError("Erro ao carregar dados. Tente novamente.");
    } finally {
      this.setLoadingState(false);
    }
  }

  async loadQuotes() {
    this.selectedCurrencies.size === 0
      ? this.moedasContainer.innerHTML = "<p>Selecione pelo menos uma moeda para exibir as cotações.</p>"
      : (async () => {
          try {
            const moedas = await this.api.getLastQuotes(Array.from(this.selectedCurrencies).join(","));
            this.renderQuotes(moedas);
          } catch (error) {
            this.moedasContainer.innerHTML = this.getErrorMessage("Erro ao carregar cotações.");
          }
        })();
  }

  async loadHistoric() {
    const currency = this.currencyHistoric.value;
    const days = parseInt(this.daysSelect.value);

    try {
      const historico = await this.api.getDailyQuotes(currency, days);
      this.renderHistoric(historico, currency);
    } catch (error) {
      this.historicoTbody.innerHTML = `<tr><td colspan="6">${this.getErrorMessage("Erro ao carregar histórico.")}</td></tr>`;
    }
  }

  renderQuotes(moedas) {
    this.moedasContainer.innerHTML = Object.entries(moedas).map(([key, data]) => {
      const variationClass = data.pctChange >= 0 ? "positive" : "negative";
      return `<div class="card">
                <h2>${data.name}</h2>
                <p><span class="label">Compra:</span><span class="value">${this.formatCurrencyValue(data.bid, data.codein)}</span></p>
                <p><span class="label">Venda:</span><span class="value">${this.formatCurrencyValue(data.ask, data.codein)}</span></p>
                <p><span class="label">Variação:</span><span class="value ${variationClass}"><span class="variation-indicator">${data.pctChange}%</span></span></p>
                <p><span class="label">Mínimo:</span><span class="value">${this.formatCurrencyValue(data.low, data.codein)}</span></p>
                <p><span class="label">Máximo:</span><span class="value">${this.formatCurrencyValue(data.high, data.codein)}</span></p>
                <p><span class="label">Atualizado:</span><span class="value">${this.formatDisplayDate(data.create_date)}</span></p>
              </div>`;
    }).join('');
  }

  renderHistoric(historico, currency) {
    this.historicoTbody.innerHTML = !historico || historico.length === 0
      ? `<tr><td colspan="6">Nenhum dado histórico disponível.</td></tr>`
      : historico.map(dia => {
          const data = dia.create_date || new Date(dia.timestamp * 1000).toLocaleDateString("pt-BR");
          const variacao = parseFloat(dia.pctChange);
          const variationClass = variacao >= 0 ? "positive" : "negative";
          const targetCurrency = currency.split("-")[1];
          
          return `<tr>
                    <td>${data}</td>
                    <td>${this.formatCurrencyValue(dia.bid, targetCurrency)}</td>
                    <td>${this.formatCurrencyValue(dia.ask, targetCurrency)}</td>
                    <td class="${variationClass}"><span class="variation-indicator">${variacao}%</span></td>
                    <td>${this.formatCurrencyValue(dia.high, targetCurrency)}</td>
                    <td>${this.formatCurrencyValue(dia.low, targetCurrency)}</td>
                  </tr>`;
        }).join('');
  }

  formatCurrencyValue(value, currencyCode) {
    const numericValue = parseFloat(value);
    const currencySymbols = {
      'BRL': 'R$',
      'USD': 'US$', 
      'EUR': '€',
      'JPY': '¥',
      'GBP': '£'
    };
    
    const symbol = currencySymbols[currencyCode] || currencyCode;
    const decimals = currencyCode === 'JPY' ? 2 : 4;
    
    return `${symbol} ${numericValue.toFixed(decimals)}`;
  }

  formatDisplayDate(dateString) {
    return !dateString ? "N/A" : new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  setLoadingState(isLoading) {
    const btnText = this.refreshBtn.querySelector(".btn-text");
    const btnIcon = this.refreshBtn.querySelector(".btn-icon");
    
    this.refreshBtn.disabled = isLoading;
    btnText.textContent = isLoading ? "Carregando..." : "Atualizar";
    btnIcon.textContent = isLoading ? "⟳" : "↻";
    btnIcon.style.animation = isLoading ? "spin 1s linear infinite" : "";
  }

  updateLastUpdateTime() {
    this.lastUpdate.textContent = `Última atualização: ${new Date().toLocaleString("pt-BR")}`;
  }

  showError(message) {
    const existingError = document.querySelector(".error-message");
    existingError?.remove();

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    const firstTitle = document.querySelector(".section-title");
    firstTitle.parentNode.insertBefore(errorDiv, firstTitle.nextSibling);

    setTimeout(() => errorDiv.parentNode?.removeChild(errorDiv), 5000);
  }

  getErrorMessage(message) {
    return `<div class="error-message">${message}</div>`;
  }
}

let currencyApp;
document.addEventListener("DOMContentLoaded", () => {
  currencyApp = new CurrencyApp();
});