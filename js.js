
// Lista completa de moedas (apenas as principais para exemplo)
const CURRENCY_PAIRS = [
  // Principais pares com BRL
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

  // Criptomoedas com BRL
  { code: "BTC-BRL", name: "Bitcoin/Real Brasileiro" },
  { code: "ETH-BRL", name: "Ethereum/Real Brasileiro" },
  { code: "LTC-BRL", name: "Litecoin/Real Brasileiro" },
  { code: "XRP-BRL", name: "XRP/Real Brasileiro" },
  { code: "DOGE-BRL", name: "Dogecoin/Real Brasileiro" },

  // Principais pares com USD
  { code: "EUR-USD", name: "Euro/Dólar Americano" },
  { code: "GBP-USD", name: "Libra Esterlina/Dólar Americano" },
  { code: "USD-JPY", name: "Dólar Americano/Iene Japonês" },
  { code: "USD-CHF", name: "Dólar Americano/Franco Suíço" },
  { code: "USD-CAD", name: "Dólar Americano/Dólar Canadense" },
  { code: "AUD-USD", name: "Dólar Australiano/Dólar Americano" },
  { code: "NZD-USD", name: "Dólar Neozelandês/Dólar Americano" },

  // Criptomoedas com USD
  { code: "BTC-USD", name: "Bitcoin/Dólar Americano" },
  { code: "ETH-USD", name: "Ethereum/Dólar Americano" },

  // Principais pares com EUR
  { code: "EUR-GBP", name: "Euro/Libra Esterlina" },
  { code: "EUR-JPY", name: "Euro/Iene Japonês" },
  { code: "EUR-CHF", name: "Euro/Franco Suíço" },
  { code: "EUR-CAD", name: "Euro/Dólar Canadense" },

  // Criptomoedas com EUR
  { code: "BTC-EUR", name: "Bitcoin/Euro" },
  { code: "ETH-EUR", name: "Ethereum/Euro" },

  // PTAX e outras cotações especiais
  { code: "USD-BRLPTAX", name: "Dólar Americano/Real Brasileiro PTAX" },
  { code: "EUR-BRLPTAX", name: "Euro/Real Brasileiro PTAX" },

  // Metais preciosos
  { code: "XAU-USD", name: "Ouro/Dólar Americano" },
  { code: "XAU-BRL", name: "Ouro/Real Brasileiro" },
  { code: "XAU-EUR", name: "Ouro/Euro" },
  { code: "XAG-USD", name: "Prata/Dólar Americano" },
  { code: "XAG-BRL", name: "Prata/Real Brasileiro" },

  // Outros pares importantes
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
    this.apiKey =
      apiKey ||
      "76d98d2ec82a3d1f0e5decdcb1d3b9cb77bc5c34fa9bd38e48a6d241cdc4f58c";
  }

  async makeRequest(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  }

  async getLastQuotes(currencies) {
    const url = `${this.baseURL}/json/last/${currencies}`;
    return await this.makeRequest(url);
  }

  async getDailyQuotes(currency, days = 1) {
    const url = `${this.baseURL}/json/daily/${currency}/${days}`;
    return await this.makeRequest(url);
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
    // Elementos principais
    this.moedasContainer = document.getElementById("moedas");
    this.historicoTbody = document.querySelector("#historico tbody");
    this.refreshBtn = document.getElementById("refresh-btn");
    this.currencyHistoric = document.getElementById("currency-historic");
    this.lastUpdate = document.getElementById("last-update");

    // Elementos de seleção
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
    this.currencyHistoric.addEventListener("change", () =>
      this.loadHistoric()
    );

    // Eventos de seleção
    this.addCurrencyBtn.addEventListener("click", () =>
      this.addCurrency()
    );
    this.clearAllBtn.addEventListener("click", () => this.clearAll());
    this.loadQuotesBtn.addEventListener("click", () => this.loadQuotes());

    // Permitir adicionar com Enter no select
    this.currencySelect.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addCurrency();
      }
    });
  }

  loadCurrencyOptions() {
    // Preencher dropdown de seleção
    this.currencySelect.innerHTML =
      '<option value="">Selecione uma moeda...</option>';
    CURRENCY_PAIRS.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency.code;
      option.textContent = currency.name;
      this.currencySelect.appendChild(option);
    });

    // Preencher select do histórico
    this.currencyHistoric.innerHTML = "";
    CURRENCY_PAIRS.forEach((currency) => {
      const option = document.createElement("option");
      option.value = currency.code;
      option.textContent = currency.name;
      this.currencyHistoric.appendChild(option);
    });
    this.currencyHistoric.value = "USD-BRL";
  }

  addCurrency() {
    const selectedValue = this.currencySelect.value;
    if (selectedValue && !this.selectedCurrencies.has(selectedValue)) {
      this.selectedCurrencies.add(selectedValue);
      this.updateSelectedList();
      this.currencySelect.value = "";
    }
  }

  removeCurrency(currencyCode) {
    this.selectedCurrencies.delete(currencyCode);
    this.updateSelectedList();
  }

  clearAll() {
    this.selectedCurrencies.clear();
    this.updateSelectedList();
    this.moedasContainer.innerHTML =
      "<p>Selecione moedas para exibir as cotações.</p>";
  }

  updateSelectedList() {
    this.selectedList.innerHTML = "";

    if (this.selectedCurrencies.size === 0) {
      this.selectedList.innerHTML =
        '<span style="color: #666;">Nenhuma moeda selecionada</span>';
      return;
    }

    this.selectedCurrencies.forEach((currencyCode) => {
      const currency = CURRENCY_PAIRS.find(
        (c) => c.code === currencyCode
      );
      const tag = document.createElement("div");
      tag.className = "currency-tag";
      tag.innerHTML = `
                ${currency ? currency.name : currencyCode}
                <button type="button" onclick="currencyApp.removeCurrency('${currencyCode}')">×</button>
            `;
      this.selectedList.appendChild(tag);
    });
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
    if (this.selectedCurrencies.size === 0) {
      this.moedasContainer.innerHTML =
        "<p>Selecione pelo menos uma moeda para exibir as cotações.</p>";
      return;
    }

    const selectedCurrenciesString = Array.from(
      this.selectedCurrencies
    ).join(",");

    try {
      const moedas = await this.api.getLastQuotes(
        selectedCurrenciesString
      );
      this.renderQuotes(moedas);
    } catch (error) {
      this.moedasContainer.innerHTML = this.getErrorMessage(
        "Erro ao carregar cotações."
      );
    }
  }

  async loadHistoric() {
    const currency = this.currencyHistoric.value;
    const days = parseInt(this.daysSelect.value);

    try {
      const historico = await this.api.getDailyQuotes(currency, days);
      this.renderHistoric(historico, currency);
    } catch (error) {
      this.historicoTbody.innerHTML = `<tr><td colspan="6">${this.getErrorMessage(
        "Erro ao carregar histórico."
      )}</td></tr>`;
    }
  }

  renderQuotes(moedas) {
    this.moedasContainer.innerHTML = "";

    for (const [key, data] of Object.entries(moedas)) {
      const card = document.createElement("div");
      card.classList.add("card");

      const variationClass =
        data.pctChange >= 0 ? "positive" : "negative";

      card.innerHTML = `
                <h2>${data.name}</h2>
                <p>
                    <span class="label">Compra:</span>
                    <span class="value">${this.formatCurrencyValue(
        data.bid,
        data.codein
      )}</span>
                </p>
                <p>
                    <span class="label">Venda:</span>
                    <span class="value">${this.formatCurrencyValue(
        data.ask,
        data.codein
      )}</span>
                </p>
                <p>
                    <span class="label">Variação:</span>
                    <span class="value ${variationClass}">
                        <span class="variation-indicator">${data.pctChange
        }%</span>
                    </span>
                </p>
                <p>
                    <span class="label">Mínimo:</span>
                    <span class="value">${this.formatCurrencyValue(
          data.low,
          data.codein
        )}</span>
                </p>
                <p>
                    <span class="label">Máximo:</span>
                    <span class="value">${this.formatCurrencyValue(
          data.high,
          data.codein
        )}</span>
                </p>
                <p>
                    <span class="label">Atualizado:</span>
                    <span class="value">${this.formatDisplayDate(
          data.create_date
        )}</span>
                </p>
            `;
      this.moedasContainer.appendChild(card);
    }
  }

  renderHistoric(historico, currency) {
    this.historicoTbody.innerHTML = "";

    if (!historico || historico.length === 0) {
      this.historicoTbody.innerHTML = `<tr><td colspan="6">Nenhum dado histórico disponível.</td></tr>`;
      return;
    }

    const targetCurrency = currency.split("-")[1];

    historico.forEach((dia) => {
      const data =
        dia.create_date ||
        new Date(dia.timestamp * 1000).toLocaleDateString("pt-BR");
      const variacao = parseFloat(dia.pctChange);
      const variationClass = variacao >= 0 ? "positive" : "negative";

      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${data}</td>
                <td>${this.formatCurrencyValue(dia.bid, targetCurrency)}</td>
                <td>${this.formatCurrencyValue(dia.ask, targetCurrency)}</td>
                <td class="${variationClass}">
                    <span class="variation-indicator">${variacao}%</span>
                </td>
                <td>${this.formatCurrencyValue(dia.high, targetCurrency)}</td>
                <td>${this.formatCurrencyValue(dia.low, targetCurrency)}</td>
            `;
      this.historicoTbody.appendChild(tr);
    });
  }

  formatCurrencyValue(value, currencyCode) {
    const numericValue = parseFloat(value);

    if (currencyCode === "BRL") {
      return `R$ ${numericValue.toFixed(4)}`;
    } else if (currencyCode === "USD") {
      return `US$ ${numericValue.toFixed(4)}`;
    } else if (currencyCode === "EUR") {
      return `€ ${numericValue.toFixed(4)}`;
    } else if (currencyCode === "JPY") {
      return `¥ ${numericValue.toFixed(2)}`;
    } else if (currencyCode === "GBP") {
      return `£ ${numericValue.toFixed(4)}`;
    } else {
      return `${numericValue.toFixed(4)} ${currencyCode}`;
    }
  }

  formatDisplayDate(dateString) {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
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

    if (isLoading) {
      this.refreshBtn.disabled = true;
      btnText.textContent = "Carregando...";
      btnIcon.textContent = "⟳";
      btnIcon.style.animation = "spin 1s linear infinite";
    } else {
      this.refreshBtn.disabled = false;
      btnText.textContent = "Atualizar";
      btnIcon.textContent = "↻";
      btnIcon.style.animation = "";
    }
  }

  updateLastUpdateTime() {
    const now = new Date();
    this.lastUpdate.textContent = `Última atualização: ${now.toLocaleString(
      "pt-BR"
    )}`;
  }

  showError(message) {
    const existingError = document.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    const firstTitle = document.querySelector(".section-title");
    firstTitle.parentNode.insertBefore(errorDiv, firstTitle.nextSibling);

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  getErrorMessage(message) {
    return `
            <div class="error-message">
                ${message}
            </div>
        `;
  }
}

// Inicializar a aplicação quando o DOM estiver carregado
let currencyApp;
document.addEventListener("DOMContentLoaded", () => {
  currencyApp = new CurrencyApp();
});