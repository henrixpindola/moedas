# MoneyLens

Aplicação web para **consulta de cotações de moedas e criptoativos em tempo real**, com visualização histórica, seleção dinâmica de pares e interface responsiva.
Dados obtidos pela **AwesomeAPI**.

> **Deploy:** [https://financial-lac-pi.vercel.app/](https://financial-lac-pi.vercel.app/)
> **Documentação da API:** [https://docs.awesomeapi.com.br/api-de-moedas](https://docs.awesomeapi.com.br/api-de-moedas)

---

## 🎯 Objetivo

Facilitar o acompanhamento de taxas de câmbio e criptoativos, apresentando valores (compra/venda), variação percentual e histórico de forma clara e acessível. Ideal para estudantes, investidores e usuários que acompanham o câmbio.

---

## ✨ Funcionalidades

* Seleção de múltiplas moedas
* Cards em tempo real com compra, venda, variação e timestamp
* Histórico de preços (7, 15 ou 30 dias)
* Gráficos e tabelas dinâmicas
* Atualização manual das cotações
* Menu responsivo com dropdown
* Estados de loading e tratamento de erros

---

## 🛠 Tecnologias

* **HTML5** — Estrutura semântica e acessível das páginas
* **CSS3** — Estilização moderna com layout responsivo
* **JavaScript (ES6+)** — Lógica dinâmica, manipulação do DOM e consumo da API
* **Chart.js** — Renderização de gráficos de linha para histórico de cotações
* **AwesomeAPI** — Fonte oficial das cotações de moedas e criptoativos
* **Node.js + Express** — Backend simples para proxy (evita problemas de CORS e protege requisições)

  * Arquivo: `server/routes/proxy.js`
* **Vercel** — Hospedagem e deploy contínuo

---

## 📊 Moedas e Pares Suportados

### Moedas e Cripto em Real (BRL)

* USD-BRL — Dólar Americano → Real
* USD-BRLT — Dólar Turismo → Real
* EUR-BRL — Euro → Real
* GBP-BRL — Libra Esterlina → Real
* ARS-BRL — Peso Argentino → Real
* CAD-BRL — Dólar Canadense → Real
* JPY-BRL — Iene Japonês → Real
* CHF-BRL — Franco Suíço → Real
* AUD-BRL — Dólar Australiano → Real
* CNY-BRL — Yuan Chinês → Real
* BTC-BRL — Bitcoin → Real
* ETH-BRL — Ethereum → Real
* LTC-BRL — Litecoin → Real
* XRP-BRL — XRP (Ripple) → Real
* DOGE-BRL — Dogecoin → Real
* USD-BRLPTAX — Dólar PTAX → Real
* EUR-BRLPTAX — Euro PTAX → Real
* XAU-BRL — Ouro → Real
* XAG-BRL — Prata → Real

### Pares com Dólar Americano (USD)

* EUR-USD — Euro → Dólar
* GBP-USD — Libra → Dólar
* USD-JPY — Dólar → Iene Japonês
* USD-CHF — Dólar → Franco Suíço
* USD-CAD — Dólar → Dólar Canadense
* AUD-USD — Dólar Australiano → Dólar
* NZD-USD — Dólar Neozelandês → Dólar
* BTC-USD — Bitcoin → Dólar
* ETH-USD — Ethereum → Dólar
* XAU-USD — Ouro → Dólar
* XAG-USD — Prata → Dólar
* USD-MXN — Dólar → Peso Mexicano
* USD-ZAR — Dólar → Rand Sul-Africano
* USD-TRY — Dólar → Lira Turca
* USD-SGD — Dólar → Dólar de Cingapura
* USD-INR — Dólar → Rúpia Indiana
* USD-KRW — Dólar → Won Sul-Coreano

### Pares com Euro (EUR)

* EUR-GBP — Euro → Libra
* EUR-JPY — Euro → Iene
* EUR-CHF — Euro → Franco Suíço
* EUR-CAD — Euro → Dólar Canadense
* BTC-EUR — Bitcoin → Euro
* ETH-EUR — Ethereum → Euro
* XAU-EUR — Ouro → Euro

---

## 🚀 Como Executar Localmente

```bash
git clone <url-do-repositorio>
cd moedas
# Abra com Live Server, Vite dev server, ou outro servidor local
```

> Observação: algumas chamadas à API podem exigir servidor (proxy) por CORS ou por segurança da chave.

---

## 🗂 Estrutura do Projeto

```
├── 📁 .vercel
│   └── ⚙️ project.json
├── 📁 img
│   └── 🖼️ logo.png
├── 📁 pages
│   ├── 🌐 converter.html
│   ├── 🌐 exchange.html
│   ├── 🌐 index.html
│   ├── 🌐 investments.html
│   └── 🌐 whoweare.html
├── 📁 server
│   ├── 📁 routes
│   │   ├── 📄 hello.js
│   │   └── 📄 proxy.js
│   └── 📄 server.js
├── 📁 src
│   ├── 📁 assets
│   │   └── 🖼️ logo.png
│   ├── 📁 scripts
│   │   ├── 📄 attention.js
│   │   ├── 📄 historic-chart.js
│   │   ├── 📄 menu-bar.js
│   │   ├── 📄 menu.js
│   │   └── 📄 scripts.js
│   └── 📁 styles
│       └── 🎨 style.css
├── ⚙️ .gitignore
├── ⚙️ .vercelignore
├── 📝 README.md
├── ⚙️ nodemon.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── ⚙️ vercel.json
└── 📄 vite.config.js
```

---

## 👥 Equipe

* **Henrique Espindola** — [https://github.com/henrixpindola](https://github.com/henrixpindola)
* **André Penha** — [https://github.com/andrepenhakotlin](https://github.com/andrepenhakotlin)
* **Valesca** — [https://github.com/val751](https://github.com/val751)

---

## 🙏 Agradecimentos

Agradecimento especial ao professor **Matheus Pedrow** — [https://github.com/matheuspedrow](https://github.com/matheuspedrow)

---

## 🔗 Links Úteis

* Deploy: [https://financial-lac-pi.vercel.app/](https://financial-lac-pi.vercel.app/)
* Docs AwesomeAPI: [https://docs.awesomeapi.com.br/api-de-moedas](https://docs.awesomeapi.com.br/api-de-moedas)

---

## 📄 Licença

Uso livre para fins educacionais, estudo e demonstração. Ajuste conforme necessidade do projeto.
