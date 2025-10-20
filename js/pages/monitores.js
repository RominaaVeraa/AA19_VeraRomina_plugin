let modalCurrentProductId = null;
let modalCurrentProduct = null;
let currentCategory = 'all';
let currentSortBy = 'default';

function safeGetProductById(id) {
  if (typeof window.getProductById === 'function') {
    return window.getProductById(id);
  }
  if (window.PRODUCTOS_DB) {
    const nbs = (window.PRODUCTOS_DB.notebooks || {});
    const mns = (window.PRODUCTOS_DB.monitors || {});
    return nbs[id] || mns[id] || null;
  }
  console.error('No se encuentra PRODUCTOS_DB ni getProductById.');
  return null;
}

function addMonitorToCart(productId, productName, productPrice, productImage) {

  if (typeof window.DigitalPoint !== 'undefined' && typeof window.DigitalPoint.addToCart === 'function') {

    const numericPrice = parseInt(productPrice.replace(/\$|\./g, ''));
    window.DigitalPoint.addToCart(productId, numericPrice, productImage, productName);
  } else {
    console.error('La función addToCart no está disponible');

    alert(`${productName} agregado al carrito`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  wireQuickViewButtons();
  wireViewToggle();
  wireFiltersAndSort();
  wireBackToTop();
  initSearchFunctionality();
  checkUrlParams();
  updateResultsCount();

  replaceAddToCartButtons();
});

function replaceAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  
  addToCartButtons.forEach(button => {
    button.removeAttribute('onclick');
    
    const card = button.closest('.monitor-card');
    if (!card) return;
    
    const productId = card.querySelector('.quick-view-btn')?.getAttribute('data-product');
    const productName = card.querySelector('.monitor-title')?.textContent.trim();
    const productPrice = card.querySelector('.current-price')?.textContent.trim();
    const productImage = card.querySelector('.monitor-image img')?.getAttribute('src');
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (productId && productName && productPrice && productImage) {
        addMonitorToCart(productId, productName, productPrice, productImage);
      } else {
        console.error('Datos del producto incompletos:', {
          productId,
          productName,
          productPrice,
          productImage
        });
      }
    });
  });
}

function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  
  if (category) {
    const normalizedCategory = category.toLowerCase();
    filterByCategory(normalizedCategory);
    updateActiveFilterButton(normalizedCategory);
    
    setTimeout(() => {
      const monitoresSection = document.querySelector('.monitores-grid-section');
      if (monitoresSection) {
        monitoresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }
}

function updateActiveFilterButton(category) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    const btnCategory = btn.getAttribute('data-category');
    
    if (btnCategory === category || (category === 'all' && btnCategory === 'all')) {
      btn.classList.add('active');
    }
  });
}

function filterByCategory(category) {
  currentCategory = category;
  filterMonitors(category);
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
  if (!product) {
    console.warn('Producto no encontrado:', productId);
    return;
  }
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
    specsEl.innerHTML = entries.map(([k,v]) => `
      <span class="spec"><strong>${k}:</strong> ${v}</span>
    `).join('');
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
  if (!modalCurrentProduct || !modalCurrentProductId) return;
  
  const title = modalCurrentProduct.title || '';
  const price = modalCurrentProduct.price != null ? `$${Number(modalCurrentProduct.price).toLocaleString()}` : '$0';
  const image = (modalCurrentProduct.images && modalCurrentProduct.images[0]) ? modalCurrentProduct.images[0] : '';
  
  addMonitorToCart(modalCurrentProductId, title, price, image);
  
  setTimeout(() => {
    closeQuickView();
  }, 500);
}

function viewFullProduct() {
  if (!modalCurrentProductId) {
    console.warn('No hay producto activo en el modal.');
    return;
  }
  window.location.href = `ficha_producto.html?id=${encodeURIComponent(modalCurrentProductId)}`;
}

function wireViewToggle() {
  const viewBtns = document.querySelectorAll('.view-btn');
  const grid = document.getElementById('monitoresGrid');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (grid) {
        grid.classList.toggle('list-view', view === 'list');
      }
    });
  });
}

function wireFiltersAndSort() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-category');
      filterMonitors(category);
      
      const newURL = category === 'all' 
        ? window.location.pathname 
        : `${window.location.pathname}?category=${encodeURIComponent(category)}`;
      window.history.pushState({category: category}, '', newURL);
    });
  });

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSortBy = e.target.value;
      sortMonitors(e.target.value);
    });
  }
}

window.addEventListener('popstate', function(event) {
  if (event.state && event.state.category) {
    filterByCategory(event.state.category);
    updateActiveFilterButton(event.state.category);
  } else {
    filterByCategory('all');
    updateActiveFilterButton('all');
  }
});

function filterMonitors(category) {
  const cards = document.querySelectorAll('.monitor-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cardCategories = card.getAttribute('data-category') || '';
    const shouldShow = category === 'all' || cardCategories.includes(category);
    
    card.style.display = shouldShow ? 'block' : 'none';
    if (shouldShow) visibleCount++;
  });

  updateResultsCount(visibleCount, category);
  
  if (currentSortBy !== 'default') {
    sortMonitors(currentSortBy);
  }
}

function sortMonitors(sortType) {
  const grid = document.getElementById('monitoresGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.monitor-card'));
  const visibleCards = cards.filter(card => card.style.display !== 'none');

  visibleCards.sort((a, b) => {
    switch (sortType) {
      case 'price-low':
        return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
      case 'price-high':
        return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
      case 'name':
        return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
      case 'size':
        return parseInt(a.getAttribute('data-size')) - parseInt(b.getAttribute('data-size'));
      case 'rating':
        return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
      default:
        return 0;
    }
  });
  visibleCards.forEach(card => grid.appendChild(card));
}

function updateResultsCount(count, category) {
  const resultsEl = document.getElementById('resultsCount');
  if (!resultsEl) return;

  if (count === undefined) {
    const visible = document.querySelectorAll('.monitor-card:not([style*="display: none"])').length;
    count = visible;
  }

  const categoryNames = {
    'all': 'todos los monitores',
    'gaming': 'monitores gaming',
    'oficina': 'monitores de oficina',
    '4k': 'monitores 4K Ultra HD',
    'curved': 'monitores curvos',
    'ultrawide': 'monitores ultrawide',
    'curvos': 'monitores curvos'
  };

  const categoryText = category ? (categoryNames[category] || 'monitores') : 'todos los monitores';
  resultsEl.textContent = `Mostrando ${count} producto${count !== 1 ? 's' : ''} - ${categoryText}`;
}

function wireBackToTop() {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backBtn.classList.add('show');
    } else {
      backBtn.classList.remove('show');
    }
  });
  
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initSearchFunctionality() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  if (searchInput && searchBtn) {
    searchInput.addEventListener('input', debounce(performSearch, 300));
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
}

function performSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const searchTerm = searchInput.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.monitor-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const title = card.querySelector('.monitor-title')?.textContent.toLowerCase() || '';
    const specs = Array.from(card.querySelectorAll('.spec')).map(spec => spec.textContent.toLowerCase()).join(' ');
    const badges = Array.from(card.querySelectorAll('.badge')).map(badge => badge.textContent.toLowerCase()).join(' ');
    
    const searchableText = `${title} ${specs} ${badges}`;
    const categoryMatches = currentCategory === 'all' || card.getAttribute('data-category').includes(currentCategory);
    const searchMatches = searchTerm === '' || searchableText.includes(searchTerm);
    
    const shouldShow = searchMatches && categoryMatches;
    card.style.display = shouldShow ? 'block' : 'none';
    if (shouldShow) visibleCount++;
  });

  if (searchTerm) {
    const resultsEl = document.getElementById('resultsCount');
    if (resultsEl) {
      resultsEl.textContent = `Resultados para "${searchTerm}" (${visibleCount})`;
    }
  } else {
    updateResultsCount(visibleCount, currentCategory);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.addToCartFromModal = addToCartFromModal;
window.viewFullProduct = viewFullProduct;
window.filterByCategory = filterByCategory;
window.addMonitorToCart = addMonitorToCart;