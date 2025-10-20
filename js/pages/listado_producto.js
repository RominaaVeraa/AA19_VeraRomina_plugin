let currentView = 'table';
let currentProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 6;
let currentSort = 'nombre';
let currentFilter = '';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando listado de productos...');
    initializeProducts();
    setupEventListeners();
    updateCartCount();
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'cartItems') {
            updateCartCount();
        }
    });
});

function setupEventListeners() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.addEventListener('click', previousPage);
    if (nextBtn) nextBtn.addEventListener('click', nextPage);
    
    setupViewToggle();
    
    const cartBtn = document.querySelector('.cart-btn, .icon-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = 'comprar.html';
        });
    }
}

function setupViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    if (viewBtns.length > 0) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                if (view) {
                    switchView(view);
                    viewBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
}

function getAllProducts() {
    if (typeof PRODUCTOS_DB === 'undefined') {
        console.error('PRODUCTOS_DB no está definido');
        return {};
    }
    
    const allProducts = {};
    
    if (PRODUCTOS_DB.notebooks) {
        Object.assign(allProducts, PRODUCTOS_DB.notebooks);
    }
    
    if (PRODUCTOS_DB.monitors) {
        Object.assign(allProducts, PRODUCTOS_DB.monitors);
    }
    
    return allProducts;
}

function initializeProducts() {
    const allProductsObj = getAllProducts();
    currentProducts = Object.values(allProductsObj).map(product => ({
        id: product.id,
        nombre: product.title,
        precio: product.price,
        categoria: product.category,
        imagen: product.images[0],
        especificaciones: getProductSpecs(product),
        rating: product.rating || 4.0,
        descripcion: product.description
    }));
    
    filteredProducts = [...currentProducts];
    renderProducts();
    updateResultsCount();
}

function getProductSpecs(product) {
    const specs = product.specifications;
    if (product.type === 'notebook') {
        return [
            specs['Procesador'] || 'N/A',
            specs['Memoria RAM'] || 'N/A',
            specs['Almacenamiento'] || 'N/A'
        ];
    } else {
        return [
            specs['Tamaño'] || 'N/A',
            specs['Resolución'] || 'N/A',
            specs['Frecuencia'] || 'N/A'
        ];
    }
}

function renderProducts() {
    if (currentView === 'grid') {
        renderGridView();
    } else {
        renderTableView();
    }
    renderPagination();
}

function renderTableView() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    tableBody.innerHTML = pageProducts.map(product => `
        <tr class="product-row" data-product-id="${product.id}">
            <td>
                <div class="product-image-cell">
                    <img src="${product.imagen}" alt="${product.nombre}" loading="lazy">
                </div>
            </td>
            <td>
                <div class="product-name">${product.nombre}</div>
                <div class="product-specs">
                    ${product.especificaciones.slice(0, 2).join(' • ')}
                </div>
            </td>
            <td>
                <div class="product-price">$${product.precio.toLocaleString('es-AR')}</div>
            </td>
            <td>
                <span class="category-badge">${product.categoria}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-cart" data-product-id="${product.id}">
                        Agregar
                    </button>
                    <button class="btn btn-details" data-product-id="${product.id}">
                        Detalles
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    connectActionButtons();
}

function renderGridView() {
    const container = document.querySelector('.products-table-container');
    if (!container) return;
    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    container.innerHTML = `
        <div class="products-grid">
            ${pageProducts.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="card-image">
                        <img src="${product.imagen}" alt="${product.nombre}" loading="lazy">
                        <div class="card-overlay">
                            <button class="overlay-btn" data-product-id="${product.id}">
                                Vista Rápida
                            </button>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${product.nombre}</h3>
                        <div class="card-specs">
                            ${product.especificaciones.slice(0, 2).map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
                        </div>
                        <div class="card-rating">
                            <div class="stars">
                                ${[1,2,3,4,5].map(i => `<span class="star ${i <= Math.round(product.rating) ? 'filled' : ''}">★</span>`).join('')}
                            </div>
                            <span class="rating-text">(${product.rating})</span>
                        </div>
                        <div class="card-price">$${product.precio.toLocaleString('es-AR')}</div>
                        <div class="card-category">
                            <span class="category-badge">${product.categoria}</span>
                        </div>
                        <button class="card-btn" data-product-id="${product.id}">
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    connectActionButtons();
}

function connectActionButtons() {
    document.querySelectorAll('.btn-cart, .card-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                addToCartById(productId);
            }
        });
    });
    
    document.querySelectorAll('.btn-details, .overlay-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                openProductModal(productId);
            }
        });
    });
}

function getProductById(productId) {
    if (typeof PRODUCTOS_DB === 'undefined') {
        console.error('PRODUCTOS_DB no está definido');
        return null;
    }

    if (PRODUCTOS_DB.notebooks && PRODUCTOS_DB.notebooks[productId]) {
        return PRODUCTOS_DB.notebooks[productId];
    }
    
    if (PRODUCTOS_DB.monitors && PRODUCTOS_DB.monitors[productId]) {
        return PRODUCTOS_DB.monitors[productId];
    }
    
    return null;
}

function addToCartById(productId) {
    const productData = getProductById(productId);
    if (!productData) {
        console.error('Producto no encontrado:', productId);
        showToast('Producto no encontrado', 'error');
        return;
    }
    
    if (typeof window.DigitalPoint !== 'undefined' && typeof window.DigitalPoint.addToCart === 'function') {
        const title = productData.title;
        const price = productData.price; 
        const image = productData.images[0];
        
        window.DigitalPoint.addToCart(productId, price, image, title);
        animateCartIcon();
        return;
    }
    
    let cart = [];
    try {
        const stored = localStorage.getItem('cartItems');
        cart = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch (error) {
        console.error('Error al leer carrito:', error);
        cart = [];
    }
    
    const existingItem = cart.find(item => String(item.id) === String(productId));
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
        showToast(`${productData.title} - Cantidad actualizada en el carrito`, 'success');
    } else {
        cart.push({
            id: productId,
            name: productData.title,
            price: productData.price,
            image: productData.images[0],
            quantity: 1
        });
        showToast(`${productData.title} agregado al carrito`, 'success');
    }
    
    try {
        localStorage.setItem('cartItems', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart:updated'));
        updateCartCount();
        animateCartIcon();
    } catch (error) {
        console.error('Error al guardar carrito:', error);
        showToast('Error al agregar al carrito', 'error');
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (!cartCount) return;
    
    let cart = [];
    try {
        const stored = localStorage.getItem('cartItems');
        cart = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(cart)) cart = [];
    } catch {
        cart = [];
    }
    
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    cartCount.textContent = totalItems;
    
    if (totalItems === 0) {
        cartCount.classList.add('empty');
    } else {
        cartCount.classList.remove('empty');
    }
}

function animateCartIcon() {
    const cartBtn = document.querySelector('.cart-btn, .icon-btn');
    if (!cartBtn) return;
    
    cartBtn.style.transform = 'scale(1.2) rotate(10deg)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
}

function switchView(view) {
    currentView = view;
    const container = document.querySelector('.products-table-container');
    if (!container) return;
    
    if (view === 'grid') {
        container.classList.add('grid-view');
        container.classList.remove('table-view');
    } else {
        container.classList.add('table-view');
        container.classList.remove('grid-view');
        container.innerHTML = `
            <div class="tabla_box">
                <table class="products-table" id="productsTable">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="productsTableBody">
                    </tbody>
                </table>
            </div>
        `;
    }
    
    renderProducts();
}

function handleSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    currentSort = sortSelect.value;
    
    filteredProducts.sort((a, b) => {
        switch (currentSort) {
            case 'precio_asc':
                return a.precio - b.precio;
            case 'precio_desc':
                return b.precio - a.precio;
            case 'nombre':
                return a.nombre.localeCompare(b.nombre);
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
    
    currentPage = 1;
    renderProducts();
    scrollToProducts();
}

function filterByCategory(category) {
    if (category === 'all') {
        filteredProducts = [...currentProducts];
    } else {
        filteredProducts = currentProducts.filter(product => product.categoria === category);
    }
    
    currentPage = 1;
    renderProducts();
    updateResultsCount();
    scrollToProducts();
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
}

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${filteredProducts.length} productos encontrados`;
    }
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginationContainer = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!paginationContainer) return;
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    let paginationHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-number ${i === currentPage ? 'active' : ''}" 
                    onclick="goToPage(${i})">${i}</button>
        `;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
        scrollToProducts();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        scrollToProducts();
    }
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
    scrollToProducts();
}

function scrollToProducts() {
    const controls = document.querySelector('.controls');
    if (controls) {
        const offset = 150;
        const elementPosition = controls.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

function openProductModal(productId) {
    window.location.href = `ficha_producto.html?id=${productId}`;
}

function showToast(message, type = 'info') {
    if (typeof window.DigitalPoint !== 'undefined' && typeof window.DigitalPoint.showNotification === 'function') {
        window.DigitalPoint.showNotification(message, type);
        return;
    }
    
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) {
        console.log('Toast:', message);
        return;
    }
    
    toast.className = 'toast';
    if (type === 'success') toast.classList.add('success');
    if (type === 'error') toast.classList.add('error');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

window.filterByCategory = filterByCategory;
window.openProductModal = openProductModal;
window.goToPage = goToPage;
window.addToCartById = addToCartById;