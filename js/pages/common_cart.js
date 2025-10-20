(function () {
  let cartItems = [];

  function normalizePrice(value) {
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
    if (typeof value === 'string') {
      const digits = value.replace(/[^\d]/g, '');
      return digits ? parseInt(digits, 10) : 0;
    }
    return 0;
  }

  function formatPrice(num) {
    return new Intl.NumberFormat('es-AR').format(normalizePrice(num));
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem('cartItems');
      if (!raw || raw === 'null' || raw === 'undefined') {
        cartItems = [];
        return;
      }
      const parsed = JSON.parse(raw);
      cartItems = Array.isArray(parsed) && parsed.length > 0 ? parsed.map((it, i) => ({
        id: String(it.id ?? it.productId ?? (it.name + '|' + i)),
        name: String(it.name ?? it.title ?? 'Producto'),
        price: normalizePrice(it.price),
        image: String(it.image ?? ''),
        quantity: Math.max(1, parseInt(it.quantity ?? 1, 10) || 1),
      })) : [];
    } catch {
      cartItems = [];
      localStorage.removeItem('cartItems');
    }
  }

  function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new CustomEvent('cart:updated'));
  }

  function updateHeaderCartCount() {
    const el = document.querySelector('.cart-count');
    if (!el) return;
    const total = cartItems.reduce((acc, it) => acc + (parseInt(it.quantity, 10) || 0), 0);
    el.textContent = total;
    el.style.display = 'flex';
    
    if (total === 0) {
      el.classList.add('empty');
    } else {
      el.classList.remove('empty');
    }
  }

  function showToast(msg, type = 'info') {
    const c = document.getElementById('toastContainer');
    if (!c) return console.log(`[toast:${type}]`, msg);
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.classList.add('show'), 50);
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  function addRawToCart({ id, name, price, image }) {
    loadCart();
    const idx = cartItems.findIndex(it => String(it.id) === String(id));
    if (idx >= 0) {
      if (cartItems[idx].quantity < 10) {
        cartItems[idx].quantity += 1;
      } else {
        showToast('Cantidad máxima alcanzada', 'warning');
        return;
      }
    } else {
      cartItems.push({
        id: String(id),
        name,
        price: normalizePrice(price),
        image: image || '',
        quantity: 1
      });
      showToast(`${name} agregado al carrito`, 'success');
    }
    saveCart();
    updateHeaderCartCount();
  }

  function addToCartById(productId) {
    if (typeof PRODUCTOS_DB === 'undefined') {
      console.error('PRODUCTOS_DB no está definido.');
      return;
    }
    const all = { ...(PRODUCTOS_DB?.notebooks || {}), ...(PRODUCTOS_DB?.monitors || {}) };
    const p = all[productId];
    if (!p) {
      console.error(`Producto ${productId} no encontrado en PRODUCTOS_DB`);
      return;
    }
    const image = Array.isArray(p.images) && p.images.length ? p.images[0] : '';
    addRawToCart({ id: p.id, name: p.title, price: p.price, image });
  }

  function addToCart(name, price, image = '', id = null) {
    if (typeof PRODUCTOS_DB !== 'undefined') {
      const all = { ...(PRODUCTOS_DB?.notebooks || {}), ...(PRODUCTOS_DB?.monitors || {}) };
      const match = Object.values(all).find(p => String(p.title).toLowerCase() === String(name).toLowerCase());
      if (match) {
        return addToCartById(match.id);
      }
    }
    addRawToCart({
      id: id || (name + '|' + normalizePrice(price)),
      name,
      price,
      image
    });
  }

  function setQuantity(itemId, qty) {
    loadCart();
    const i = cartItems.findIndex(it => String(it.id) === String(itemId));
    if (i === -1) return;
    const newQty = Math.max(1, Math.min(10, parseInt(qty, 10) || 1));
    cartItems[i].quantity = newQty;
    saveCart();
    updateHeaderCartCount();
  }

  function removeItem(itemId) {
    loadCart();
    const i = cartItems.findIndex(it => String(it.id) === String(itemId));
    if (i === -1) return;
    cartItems.splice(i, 1);
    saveCart();
    updateHeaderCartCount();
  }

  function clearCart() {
    cartItems = [];
    
    localStorage.removeItem('cartItems');
    
    setTimeout(() => {
      localStorage.setItem('cartItems', JSON.stringify([]));
      
      window.dispatchEvent(new CustomEvent('cart:updated'));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'cartItems',
        newValue: '[]',
        oldValue: null,
        url: window.location.href
      }));
      
      updateHeaderCartCount();
    }, 10);
  }

  function getCart() {
    loadCart();
    return [...cartItems];
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateHeaderCartCount();

    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-add-to-cart]');
      if (btn) {
        const id = btn.dataset.productId;
        const name = btn.dataset.productName;
        const price = btn.dataset.productPrice;
        const image = btn.dataset.productImage;

        if (id) return addToCartById(id);
        if (name) return addToCart(name, price, image);
      }
    });
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'cartItems') {
      loadCart();
      updateHeaderCartCount();
    }
  });

  window.addEventListener('cart:updated', () => {
    loadCart();
    updateHeaderCartCount();
  });

  window.CartAPI = {
    addToCartById,
    addToCart,    
    setQuantity,
    removeItem,
    clearCart,
    getCart,
    formatPrice,
    normalizePrice
  };

  window.addToCart = (name, price, image) => addToCart(name, price, image);
})();
