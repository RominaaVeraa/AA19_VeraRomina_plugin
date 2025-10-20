let modalCurrentProductId = null;
let modalCurrentProduct = null;
let currentCategory = 'all';
let currentSortBy = 'default';

function safeGetProductById(id) {
  if (typeof window.getProductById === 'function') return window.getProductById(id);
  if (window.PRODUCTOS_DB) {
    const nbs = (window.PRODUCTOS_DB.notebooks || {});
    const mns = (window.PRODUCTOS_DB.monitors || {});
    return nbs[id] || mns[id] || null;
  }
  console.error('No se encuentra PRODUCTOS_DB ni getProductById.');
  return null;
}

const notify = (typeof window.DigitalPoint?.showNotification === 'function')
  ? window.DigitalPoint.showNotification
  : (typeof window.showToast === 'function')
  ? window.showToast
  : (msg, type) => console.log(`[toast:${type||'info'}]`, msg);

document.addEventListener('DOMContentLoaded', () => {
  wireQuickViewButtons();
  wireViewToggle();
  wireFiltersAndSort();
  wireBackToTop();
  checkUrlParams();
  updateResultsCount();
});

function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  if (category) {
    filterByCategory(category);
    updateActiveFilterButton(category);
    setTimeout(() => {
      const notebooksSection = document.querySelector('.notebooks-grid-section');
      if (notebooksSection) notebooksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

function updateActiveFilterButton(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-category') === category ||
        (category === 'all' && btn.getAttribute('data-category') === 'all')) {
      btn.classList.add('active');
    }
  });
}

function filterByCategory(category) {
  currentCategory = category;
  const cards = document.querySelectorAll('.notebook-card');
  let visibleCount = 0;
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  updateResultsCount(visibleCount);
  updateActiveFilterButton(category);
  if (currentSortBy !== 'default') sortProducts(currentSortBy);
}

function wireFiltersAndSort() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      filterByCategory(category);
    });
  });

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortBy = e.target.value;
      sortProducts(e.target.value);
    });
  }

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') performSearch(); });
  }
  if (searchBtn) searchBtn.addEventListener('click', performSearch);
}

function performSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  const searchTerm = searchInput.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.notebook-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const title = card.querySelector('.notebook-title').textContent.toLowerCase();
    const specs = Array.from(card.querySelectorAll('.spec')).map(s => s.textContent.toLowerCase()).join(' ');
    const matches = title.includes(searchTerm) || specs.includes(searchTerm);
    const categoryMatches = currentCategory === 'all' || card.getAttribute('data-category') === currentCategory;
    if (matches && categoryMatches) { card.style.display = ''; visibleCount++; }
    else card.style.display = 'none';
  });

  updateResultsCount(visibleCount);
}

function sortProducts(sortBy) {
  const grid = document.getElementById('notebooksGrid');
  if (!grid) return;
  const cards = Array.from(document.querySelectorAll('.notebook-card'));
  const visibleCards = cards.filter(card => card.style.display !== 'none');

  visibleCards.sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
      case 'price-high': return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
      case 'name': return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
      case 'rating': return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
      default: return 0;
    }
  });

  visibleCards.forEach(card => grid.appendChild(card));
}

function updateResultsCount(count) {
  const resultsCount = document.getElementById('resultsCount');
  if (!resultsCount) return;
  if (count === undefined) count = document.querySelectorAll('.notebook-card:not([style*="display: none"])').length;
  resultsCount.textContent = `Mostrando ${count} producto${count !== 1 ? 's' : ''}`;
}

function updateCartCount() {
  let cartItems = [];
  try { 
    cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]'); 
    if (!Array.isArray(cartItems)) cartItems = []; 
  } catch { 
    cartItems = []; 
  }
  
  const total = cartItems.reduce((s, i) => s + (i.quantity || 1), 0);
  const el = document.querySelector('.cart-count');
  
  if (el) {
    el.textContent = total;
    if (total === 0) {
      el.classList.remove('show');
    } else {
      el.classList.add('show');
    }
  }
}

function animateCartIcon() {
  const btn = document.querySelector('.cart-btn');
  if (!btn) return;
  
  btn.style.transform = 'scale(1.2) rotate(10deg)';
  setTimeout(() => (btn.style.transform = 'scale(1) rotate(0deg)'), 300);
}

function wireViewToggle() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      const grid = document.getElementById('notebooksGrid');
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (grid) {
        if (view === 'list') grid.classList.add('list-view');
        else grid.classList.remove('list-view');
      }
    });
  });
}

function wireQuickViewButtons() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-view-btn');
    if (!btn) return;
    const productId = btn.getAttribute('data-product');
    if (!productId) return;
    openQuickView(productId);
  });
}

function openQuickView(productId) {
  const product = safeGetProductById(productId);
  if (!product) { console.warn('Producto no encontrado:', productId); return; }
  modalCurrentProductId = productId;
  modalCurrentProduct = product;

  const imgEl = document.getElementById('modalImage');
  const titleEl = document.getElementById('modalTitle');
  const specsEl = document.getElementById('modalSpecs');
  const ratingEl = document.getElementById('modalRating');
  const priceEl = document.getElementById('modalPrice');
  const descEl = document.getElementById('modalDescription');

  if (imgEl) imgEl.src = (product.images && product.images[0]) ? product.images[0] : '';
  if (imgEl) imgEl.alt = product.title || '';
  if (titleEl) titleEl.textContent = product.title || '';
  if (priceEl) priceEl.textContent = product.price != null ? `$${Number(product.price).toLocaleString()}` : '';
  if (descEl) descEl.textContent = product.description || '';

  if (ratingEl) {
    const r = Math.round(product.rating || 0);
    ratingEl.innerHTML = `
      <div class="stars">
        ${[0,1,2,3,4].map(i => `<span class="star ${i<r?'filled':''}">★</span>`).join('')}
      </div>
      <span class="rating-text">(${(product.rating||0).toFixed(1)})</span>
    `;
  }

  if (specsEl) {
    const specs = product.specifications || {};
    const entries = Object.entries(specs).slice(0, 4);
    specsEl.innerHTML = entries.map(([k,v]) => `<span class="spec"><strong>${k}:</strong> ${v}</span>`).join('');
  }

  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.add('show');
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.remove('show');
  modalCurrentProductId = null;
  modalCurrentProduct = null;
}

function addToCartFromModal() {
  if (!modalCurrentProduct) return;

  const id = String(modalCurrentProduct.id || modalCurrentProductId || '');
  const title = String(modalCurrentProduct.title || '');
  const priceNum = Number(modalCurrentProduct.price || 0);
  const image = (modalCurrentProduct.images && modalCurrentProduct.images[0]) ? modalCurrentProduct.images[0] : '';

  if (window.DigitalPoint?.addToCart) {
    window.DigitalPoint.addToCart(id, priceNum, image, title);
  } else {
    let cartItems = [];
    try { 
      cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]'); 
      if (!Array.isArray(cartItems)) cartItems = []; 
    } catch { 
      cartItems = []; 
    }
    
    const existing = cartItems.find(i => String(i.id) === id);
    
    if (existing) {
      existing.quantity = Math.min(10, (existing.quantity || 1) + 1);
      notify(`${title} - Cantidad actualizada en el carrito`);
    } else {
      cartItems.push({
        id: id,
        name: title,
        price: priceNum,
        image: image,
        quantity: 1
      });
      notify(`${title} agregado al carrito`, 'success');
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  try { window.dispatchEvent(new Event('cart:updated')); } catch {}
  animateCartIcon();
  updateCartCount();
}

function viewFullProduct() {
  if (!modalCurrentProductId) { console.warn('No hay producto activo en el modal.'); return; }
  window.location.href = `ficha_producto.html?id=${encodeURIComponent(modalCurrentProductId)}`;
}

function wireBackToTop() {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) backBtn.classList.add('show');
    else backBtn.classList.remove('show');
  });
  backBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

function addToCartFromNotebooks(productId, price, image, name) {
  if (window.DigitalPoint && typeof window.DigitalPoint.addToCart === 'function') {
    window.DigitalPoint.addToCart(productId, price, image, name);
    animateCartIcon();
    updateCartCount();
    return;
  }

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    if (!Array.isArray(cart)) cart = [];
  } catch {
    cart = [];
  }

  const existing = cart.find(item => String(item.id) === String(productId));

  if (existing) {
    existing.quantity = Math.min(10, (existing.quantity || 1) + 1);
    notify(`${name} - Cantidad actualizada en el carrito`);
  } else {
    cart.push({
      id: String(productId),
      name: name,
      price: Number(price),
      image: image,
      quantity: 1
    });
    notify(`${name} agregado al carrito`, 'success');
  }

  localStorage.setItem('cartItems', JSON.stringify(cart));
  
  try {
    window.dispatchEvent(new Event('cart:updated'));
  } catch {}

  animateCartIcon();
  updateCartCount();
}

window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.addToCartFromModal = addToCartFromModal;
window.viewFullProduct = viewFullProduct;
window.filterByCategory = filterByCategory;
window.addToCartFromNotebooks = addToCartFromNotebooks;