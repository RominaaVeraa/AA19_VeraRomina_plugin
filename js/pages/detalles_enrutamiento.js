(function () {
  const MODAL_ID = 'quickViewModal';
  const modalEl = document.getElementById(MODAL_ID);

  function setModalProductId(productId) {
    if (!modalEl) return;
    modalEl.dataset.productId = productId;
    window.__currentModalProductId = productId;
  }

  function viewFullProduct() {
    const id =
      (modalEl && modalEl.dataset.productId) ||
      window.__currentModalProductId;

    if (!id) {
      console.warn('No hay productId activo en el modal.');
      return;
    }
    window.location.href = `ficha_producto.html?id=${encodeURIComponent(id)}`;
  }

  function goToProduct(productId) {
    if (!productId) return;
    window.location.href = `ficha_producto.html?id=${encodeURIComponent(productId)}`;
  }

  document.addEventListener('click', (e) => {
    const quickBtn = e.target.closest('.quick-view-btn');
    if (quickBtn && quickBtn.dataset && quickBtn.dataset.product) {
      setModalProductId(quickBtn.dataset.product);
    }

    const title = e.target.closest('.notebook-title, .monitor-title');
    if (title) {
      const card = title.closest('.notebook-card, .monitor-card');
      const pid =
        (card && (card.getAttribute('data-product') || card.getAttribute('data-id'))) ||
        (card && card.querySelector('.quick-view-btn')?.dataset?.product) ||
        card?.getAttribute('data-name'); 
      if (pid && /^notebook\d+|monitor\d+$/i.test(pid)) {
        goToProduct(pid);
      }
    }

    const img = e.target.closest('.notebook-image img, .monitor-image img');
    if (img) {
      const card = img.closest('.notebook-card, .monitor-card');
      const pid =
        (card && (card.getAttribute('data-product') || card.getAttribute('data-id'))) ||
        (card && card.querySelector('.quick-view-btn')?.dataset?.product);
      if (pid && /^notebook\d+|monitor\d+$/i.test(pid)) {
        goToProduct(pid);
      }
    }
  });

  window.viewFullProduct = viewFullProduct;
  window.setModalProductId = setModalProductId;
  window.goToProduct = goToProduct;
})();
