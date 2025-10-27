// src/scripts/charts.js
let currencyChart;

export function renderChart(historico, currency) {
  const ctx = document.getElementById("currencyChart").getContext("2d");
  if (!ctx) return;

  const labels = historico.map(item =>
    new Date(item.timestamp * 1000).toLocaleDateString("pt-BR")
  );

  const bids = historico.map(item => parseFloat(item.bid));
  const asks = historico.map(item => parseFloat(item.ask));

  const currencyLabel = currency.replace("-", " / ");

  // Destroi o gráfico anterior se já existir
  if (currencyChart) {
    currencyChart.destroy();
  }

  currencyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Compra (Bid)",
          data: bids,
          borderColor: "#1e88e5",
          backgroundColor: "rgba(30, 136, 229, 0.2)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Venda (Ask)",
          data: asks,
          borderColor: "#43a047",
          backgroundColor: "rgba(67, 160, 71, 0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#333" },
        },
        title: {
          display: true,
          text: `Histórico - ${currencyLabel}`,
          color: "#111",
        },
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${parseFloat(context.raw).toFixed(4)}`,
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Data" },
          ticks: { color: "#333" },
        },
        y: {
          title: { display: true, text: "Cotação" },
          ticks: { color: "#333" },
        },
      },
    },
  });
}
