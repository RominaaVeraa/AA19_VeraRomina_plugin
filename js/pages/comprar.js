let appliedDiscount = 0;
let appliedDiscountCode = '';

const discountCodes = {
  'DESCUENTO10': 0.10,
  'VERANO25': 0.25,
  'NUEVO15': 0.15,
  'DIGITAL20': 0.20
};

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_COST = 15000;
const TAX_RATE = 0.21;

document.addEventListener('DOMContentLoaded', () => {
  loadSavedDiscount();
  
  setTimeout(() => {
    renderCart();
    wireSummary();
    wireDiscount();
    renderRelatedProducts();
  }, 200);

  window.addEventListener('cart:updated', () => {
    renderCart();
    renderRelatedProducts();
  });
  
  window.addEventListener('storage', (e) => {
    if (e.key === 'cartItems') {
      renderCart();
      renderRelatedProducts();
    }
  });
});

function el(id) { return document.getElementById(id); }

function loadSavedDiscount() {
  try {
    const savedDiscount = sessionStorage.getItem('appliedDiscount');
    if (savedDiscount) {
      const data = JSON.parse(savedDiscount);
      appliedDiscount = data.percentage || 0;
      appliedDiscountCode = data.code || '';
      
      const input = el('discountCode');
      if (input && appliedDiscountCode) {
        input.disabled = true;
        input.placeholder = `Código ${appliedDiscountCode} aplicado`;
      }
    }
  } catch (error) {
    console.error('Error al cargar descuento guardado:', error);
  }
}

function renderCart() {
  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  const container = el('cartItems');
  const emptyCart = el('emptyCart');
  const cartContainer = el('cartContainer');

  if (!container || !emptyCart || !cartContainer) return;

  if (cart.length === 0) {
    emptyCart.style.display = 'flex';
    cartContainer.style.display = 'none';
    updateSummary(0, 0, 0, 0, 0, 0);
    return;
  }

  emptyCart.style.display = 'none';
  cartContainer.style.display = 'grid';

  container.innerHTML = cart.map(item => {
    const price = item.price;
    const itemTotal = price * item.quantity;
    
    return `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="item-image">
          <img src="${item.image || 'images/placeholder.png'}" 
               alt="${item.name}" 
               onerror="this.src='images/placeholder.png'">
        </div>
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          <div class="item-price">$${window.CartAPI.formatPrice(price)}</div>
          <div class="item-actions">
            <div class="quantity-controls">
              <button class="quantity-btn" data-action="decrease" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn" data-action="increase" ${item.quantity >= 10 ? 'disabled' : ''}>+</button>
            </div>
            <button class="remove-item" data-action="remove">Eliminar</button>
          </div>
          <div class="item-subtotal">Subtotal: $${window.CartAPI.formatPrice(itemTotal)}</div>
        </div>
      </div>
    `;
  }).join('');

  container.onclick = handleCartItemClick;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = Math.round(subtotal * appliedDiscount);
  const taxes = Math.round((subtotal - discount) * TAX_RATE);
  const total = subtotal + shipping - discount + taxes;
  
  updateSummary(
    cart.reduce((a, item) => a + item.quantity, 0),
    subtotal,
    shipping,
    discount,
    taxes,
    total
  );
}

function handleCartItemClick(e) {
  const itemEl = e.target.closest('.cart-item');
  if (!itemEl) return;
  
  const id = itemEl.getAttribute('data-item-id');
  if (!id) return;

  if (e.target.classList.contains('quantity-btn')) {
    const action = e.target.getAttribute('data-action');
    const cart = window.CartAPI.getCart();
    const item = cart.find(x => String(x.id) === String(id));
    if (!item) return;

    let newQty = item.quantity;
    if (action === 'increase') {
      newQty = Math.min(10, item.quantity + 1);
    } else if (action === 'decrease') {
      newQty = Math.max(1, item.quantity - 1);
    }

    window.CartAPI.setQuantity(id, newQty);
    renderCart();
    renderRelatedProducts();
  }

  if (e.target.closest('.remove-item')) {
    const name = itemEl.querySelector('.item-name')?.textContent || 'Producto';
    
    window.CartAPI.removeItem(id);
    renderCart();
    renderRelatedProducts();
    showToast(`${name} eliminado del carrito`, 'success');
  }
}

function updateSummary(itemCount, subtotal, shipping, discount, taxes, total) {
  if (el('itemCount')) el('itemCount').textContent = itemCount || 0;
  if (el('subtotal')) el('subtotal').textContent = `$${window.CartAPI.formatPrice(subtotal || 0)}`;
  if (el('shipping')) el('shipping').textContent = shipping > 0 ? `$${window.CartAPI.formatPrice(shipping)}` : 'GRATIS';
  if (el('taxes')) el('taxes').textContent = `$${window.CartAPI.formatPrice(taxes || 0)}`;
  if (el('total')) el('total').textContent = `$${window.CartAPI.formatPrice(total || 0)}`;

  const discountRow = el('discountRow');
  const discountAmount = el('discount');
  
  if (discountRow && discountAmount) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountAmount.textContent = `-$${window.CartAPI.formatPrice(discount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
}

function wireSummary() {
  const checkoutBtn = el('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      const cart = window.CartAPI.getCart();
      if (cart.length === 0) {
        showToast('Tu carrito está vacío', 'warning');
        return;
      }

      if (appliedDiscount > 0 && appliedDiscountCode) {
        sessionStorage.setItem('appliedDiscount', JSON.stringify({
          code: appliedDiscountCode,
          percentage: appliedDiscount
        }));
        console.log('Descuento guardado:', appliedDiscountCode, appliedDiscount);
      }
      
      setTimeout(() => {
        window.location.href = 'checkout.html';
      }, 1200);
    };
  }

  const clearCartBtn = el('clearCartBtn');
  if (clearCartBtn) {
    clearCartBtn.onclick = () => {
      const cart = window.CartAPI.getCart();
      if (cart.length === 0) {
        showToast('El carrito ya está vacío', 'warning');
        return;
      }
      
      if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
        window.CartAPI.clearCart();
        appliedDiscount = 0;
        appliedDiscountCode = '';
        
        sessionStorage.removeItem('appliedDiscount');

        const input = el('discountCode');
        if (input) {
          input.disabled = false;
          input.placeholder = 'Ingresa tu código';
        }
        
        renderCart();
        renderRelatedProducts();
        showToast('Carrito vaciado exitosamente', 'success');
      }
    };
  }

  const continueShoppingBtn = el('continueShoppingBtn');
  if (continueShoppingBtn) {
    continueShoppingBtn.onclick = () => {
      window.location.href = 'index.html';
    };
  }
}

function wireDiscount() {
  const applyBtn = el('applyDiscountBtn');
  const input = el('discountCode');
  
  if (!applyBtn || !input) return;

  applyBtn.onclick = applyDiscount;
  input.onkeypress = (e) => { 
    if (e.key === 'Enter') applyDiscount(); 
  };

  function applyDiscount() {
    const code = String(input.value || '').trim().toUpperCase();
    
    if (!code) {
      showToast('Por favor ingresa un código de descuento', 'warning');
      return;
    }
    
    if (!discountCodes[code]) {
      showToast('Código de descuento inválido', 'error');
      return;
    }
    
    if (appliedDiscountCode === code) {
      showToast('Este código ya está aplicado', 'warning');
      return;
    }

    appliedDiscount = discountCodes[code];
    appliedDiscountCode = code;
    input.value = '';
    input.disabled = true;
    input.placeholder = `Código ${code} aplicado`;
    
    sessionStorage.setItem('appliedDiscount', JSON.stringify({
      code: appliedDiscountCode,
      percentage: appliedDiscount
    }));
    
    showToast(`¡Código ${code} aplicado! ${Math.round(appliedDiscount * 100)}% de descuento`, 'success');
    renderCart();
  }
}

function addRelatedToCart(productId) {
  if (!productId) {
    console.error('ID de producto no proporcionado');
    showToast('Error al agregar producto', 'error');
    return;
  }

  let productData = null;
  
  if (typeof PRODUCTOS_DB !== 'undefined') {
    if (PRODUCTOS_DB.notebooks && PRODUCTOS_DB.notebooks[productId]) {
      productData = PRODUCTOS_DB.notebooks[productId];
    } else if (PRODUCTOS_DB.monitors && PRODUCTOS_DB.monitors[productId]) {
      productData = PRODUCTOS_DB.monitors[productId];
    }
  }

  if (!productData) {
    console.error('Producto no encontrado:', productId);
    showToast('Producto no encontrado', 'error');
    return;
  }

  if (typeof window.DigitalPoint !== 'undefined' && typeof window.DigitalPoint.addToCart === 'function') {
    window.DigitalPoint.addToCart(productId, productData.price, productData.images[0], productData.title);
    showToast(`${productData.title} agregado al carrito`, 'success');
    
    setTimeout(() => {
      renderCart();
      renderRelatedProducts();
    }, 100);
    return;
  }

  if (window.CartAPI && typeof window.CartAPI.addToCartById === 'function') {
    window.CartAPI.addToCartById(productId);
    
    setTimeout(() => {
      renderCart();
      renderRelatedProducts();
    }, 100);
    return;
  }

  try {
    let cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    const existingItem = cart.find(item => String(item.id) === String(productId));
    
    if (existingItem) {
      existingItem.quantity += 1;
      showToast(`${productData.title} - Cantidad actualizada`, 'success');
    } else {
      cart.push({
        id: productId,
        name: productData.title,
        price: productData.price,
        image: productData.images[0],
        quantity: 1
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart:updated'));
    
    setTimeout(() => {
      renderCart();
      renderRelatedProducts();
    }, 100);
    
  } catch (error) {
    console.error('Error al agregar producto:', error);
    showToast('Error al agregar al carrito', 'error');
  }
}

function renderRelatedProducts() {
  const grid = el('relatedGrid');
  const relatedSection = el('relatedProducts');
  
  if (!grid || typeof PRODUCTOS_DB === 'undefined') {
    if (relatedSection) relatedSection.style.display = 'none';
    return;
  }

  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  
  if (cart.length === 0) {
    if (relatedSection) relatedSection.style.display = 'none';
    return;
  }
  
  if (relatedSection) relatedSection.style.display = 'block';
  
  const takenIds = new Set(cart.map(it => String(it.id)));

  const allProducts = [
    ...Object.values(PRODUCTOS_DB.notebooks || {}),
    ...Object.values(PRODUCTOS_DB.monitors || {})
  ];

  const candidates = allProducts.filter(p => !takenIds.has(String(p.id)));

  if (candidates.length === 0) {
    grid.innerHTML = '<div class="related-empty">No hay más productos disponibles en este momento.</div>';
    return;
  }

  const cartCategories = new Set(
    cart.map(item => {
      const product = allProducts.find(p => String(p.id) === String(item.id));
      return product?.category || '';
    }).filter(Boolean)
  );
  
  const cartTypes = new Set(
    cart.map(item => {
      const product = allProducts.find(p => String(p.id) === String(item.id));
      return product?.type || '';
    }).filter(Boolean)
  );

  let sortedCandidates = candidates;
  if (cartCategories.size > 0 || cartTypes.size > 0) {
    const sameTypeAndCategory = candidates.filter(p => 
      cartTypes.has(p.type) && cartCategories.has(p.category)
    );
    const sameType = candidates.filter(p => 
      cartTypes.has(p.type) && !cartCategories.has(p.category)
    );
    const sameCategory = candidates.filter(p => 
      !cartTypes.has(p.type) && cartCategories.has(p.category)
    );
    const rest = candidates.filter(p => 
      !cartTypes.has(p.type) && !cartCategories.has(p.category)
    );
    
    sortedCandidates = [...sameTypeAndCategory, ...sameType, ...sameCategory, ...rest];
  }

  const pick = sortedCandidates.slice(0, 4);

  grid.innerHTML = pick.map(p => `
    <div class="related-product" onclick="window.location.href='ficha_producto.html?id=${p.id}'">
      <div class="related-image">
        <img src="${p.images && p.images[0] ? p.images[0] : 'images/placeholder.png'}" 
             alt="${p.title}" 
             onerror="this.src='images/placeholder.png'">
      </div>
      <h4 class="related-name">${p.title}</h4>
      <div class="related-price">$${window.CartAPI.formatPrice(p.price)}</div>
      <div class="related-actions">
        <button class="add-related" 
                data-product-id="${p.id}"
                data-product-name="${p.title}"
                onclick="event.stopPropagation(); addRelatedToCart('${p.id}');">
          Agregar al Carrito
        </button>
        <button class="see-related" onclick="event.stopPropagation(); window.location.href='ficha_producto.html?id=${p.id}'">
          Ver Detalles
        </button>
      </div>
    </div>
  `).join('');
}

function showToast(message, type = 'info') {
  if (typeof window.DigitalPoint !== 'undefined' && typeof window.DigitalPoint.showNotification === 'function') {
    window.DigitalPoint.showNotification(message, type);
    return;
  }
  
  const toastContainer = document.getElementById('toastContainer');
  
  if (!toastContainer) {
    console.log('Toast:', message);
    return;
  }
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 50);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

window.addRelatedToCart = addRelatedToCart;