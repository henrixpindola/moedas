function setupReaderModal() {
  const modal = document.getElementById("readerModal");
  const attentionIcon = document.querySelector(".attention-icon");
  const closeBtn = document.querySelector(".reader-modal-close");

  if (!modal || !attentionIcon) {
    console.warn("Elementos do modal não encontrados");
    return;
  }

  console.log("Modal reader encontrado, configurando eventos...");

  attentionIcon.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Abrindo modal...");
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  });

  function closeModal() {
    console.log("Fechando modal...");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });

  const modalContent = document.querySelector(".reader-modal-content");
  if (modalContent) {
    modalContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  console.log("Modal reader configurado com sucesso");
}

function openReaderModal() {
  const modal = document.getElementById("readerModal");
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeReaderModal() {
  const modal = document.getElementById("readerModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function initializeAll() {
  setupReaderModal();
  window.readerModal = {
    open: openReaderModal,
    close: closeReaderModal,
  };

  console.log("Todos os componentes inicializados com sucesso");
}

document.addEventListener("DOMContentLoaded", initializeAll);
