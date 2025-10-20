let checkoutData = {
  shipping: 15000,
  shippingMethod: 'standard'
};

const notify = (typeof showToast === 'function')
  ? showToast
  : (msg, type) => console.log(`[toast:${type || 'info'}]`, msg);

const fmt = (n) => (window.CartAPI?.formatPrice ? window.CartAPI.formatPrice(n) : Math.round(n).toString());

document.addEventListener('DOMContentLoaded', () => {
  setupMenuOverlay();
  checkAuth();
  loadUserData();
  renderOrderSummary();
  setupShippingOptions();
  setupFormSubmit();
});

function setupMenuOverlay() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navigation = document.querySelector('.navigation');
  
  if (!menuToggle || !navigation) return;
  
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = navigation.classList.contains('active');
    
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  function openMenu() {
    const overlay = document.createElement('div');
    overlay.id = 'mobile-menu-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:999;cursor:pointer;';
    
    overlay.addEventListener('click', closeMenu);
    
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    
    menuToggle.classList.add('active');
    navigation.classList.add('active');
  }
  
  function closeMenu() {
    const overlay = document.getElementById('mobile-menu-overlay');
    if (overlay) {
      overlay.remove();
    }
    
    document.body.style.overflow = '';
    menuToggle.classList.remove('active');
    navigation.classList.remove('active');
  }
  
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 909) {
      closeMenu();
    }
  });
}

function checkAuth() {
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  
  if (!currentUserEmail) {
    notify('Debes iniciar sesión para continuar con la compra', 'error');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=comprar.html';
    }, 2000);
    return;
  }
  
  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  if (cart.length === 0) {
    notify('Tu carrito está vacío', 'warning');
    setTimeout(() => {
      window.location.href = 'comprar.html';
    }, 2000);
  }
}

function loadUserData() {
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return;
  
  const savedUsers = sessionStorage.getItem('digitalPointUsers');
  if (!savedUsers) return;
  
  const users = JSON.parse(savedUsers);
  const user = users.find(u => u.email === currentUserEmail);
  
  if (!user) return;
  
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  
  form.email.value = user.email || '';
  form.firstName.value = user.firstName || '';
  form.lastName.value = user.lastName || '';
  
  if (user.address) {
    form.address.value = user.address.street || '';
    form.city.value = user.address.city || '';
    form.postalCode.value = user.address.postalCode || '';
    form.province.value = user.address.province || 'Misiones';
    form.phone.value = user.address.phone || '';
  }
}

function renderOrderSummary() {
  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  const itemsContainer = document.getElementById('orderItems');
  
  if (!itemsContainer) return;
  
  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5);">No hay productos</p>';
    return;
  }
  
  itemsContainer.innerHTML = cart.map(item => `
    <div class="order-item">
      <div class="order-item-image">
        <img src="${item.image || 'images/placeholder.png'}" 
             alt="${item.name}">
      </div>
      <div class="order-item-details">
        <div class="order-item-name" title="${item.name}">${item.name}</div>
        <div class="order-item-quantity">Cantidad: ${item.quantity}</div>
      </div>
      <div class="order-item-price">$${fmt(item.price * item.quantity)}</div>
    </div>
  `).join('');
  
  updateSummaryTotals();
}

function updateSummaryTotals() {
  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const discountInfo = getDiscountFromCart();
  const discount = discountInfo.amount;
  
  const FREE_SHIPPING_THRESHOLD = 500000;
  let shipping = checkoutData.shipping;
  
  if (checkoutData.shippingMethod === 'pickup') {
    shipping = 0;
  } else if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    shipping = 0;
  }
  
  const TAX_RATE = 0.21;
  const taxes = Math.round((subtotal - discount) * TAX_RATE);
  
  const total = subtotal + shipping - discount + taxes;
  
  if (document.getElementById('itemCount')) {
    document.getElementById('itemCount').textContent = itemCount;
  }
  if (document.getElementById('subtotal')) {
    document.getElementById('subtotal').textContent = `$${fmt(subtotal)}`;
  }
  if (document.getElementById('shipping')) {
    const shippingEl = document.getElementById('shipping');
    if (shipping > 0) {
      shippingEl.textContent = `$${fmt(shipping)}`;
      shippingEl.style.color = '';
    } else {
      shippingEl.textContent = 'GRATIS';
      shippingEl.style.color = '#4ade80';
    }
  }
  if (document.getElementById('taxes')) {
    document.getElementById('taxes').textContent = `$${fmt(taxes)}`;
  }
  if (document.getElementById('total')) {
    document.getElementById('total').textContent = `$${fmt(total)}`;
  }
  
  const discountRow = document.getElementById('discountRow');
  const discountAmount = document.getElementById('discount');
  
  if (discountRow && discountAmount) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountAmount.textContent = `-$${fmt(discount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
}

function getDiscountFromCart() {
  const discountData = sessionStorage.getItem('appliedDiscount');
  if (!discountData) return { amount: 0, code: '' };
  
  try {
    const data = JSON.parse(discountData);
    const cart = window.CartAPI ? window.CartAPI.getCart() : [];
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const amount = Math.round(subtotal * (data.percentage || 0));
    
    return {
      amount: amount,
      code: data.code || '',
      percentage: data.percentage || 0
    };
  } catch {
    return { amount: 0, code: '' };
  }
}

function setupShippingOptions() {
  const shippingRadios = document.querySelectorAll('input[name="shipping"]');
  
  shippingRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const value = e.target.value;
      
      if (value === 'standard') {
        checkoutData.shipping = 15000;
        checkoutData.shippingMethod = 'standard';
      } else if (value === 'express') {
        checkoutData.shipping = 25000;
        checkoutData.shippingMethod = 'express';
      } else if (value === 'pickup') {
        checkoutData.shipping = 0;
        checkoutData.shippingMethod = 'pickup';
      }
      
      updateSummaryTotals();
    });
  });
  
  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const FREE_SHIPPING_THRESHOLD = 500000;
  
  const standardPriceEl = document.getElementById('standardShippingPrice');
  if (standardPriceEl && subtotal >= FREE_SHIPPING_THRESHOLD) {
    standardPriceEl.textContent = 'GRATIS';
    standardPriceEl.style.color = '#4ade80';
    checkoutData.shipping = 0;
  }
}

function setupFormSubmit() {
  const form = document.getElementById('checkoutForm');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateForm(form)) {
      return;
    }
    
    const formData = new FormData(form);
    const checkoutInfo = {
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      address: formData.get('address'),
      city: formData.get('city'),
      postalCode: formData.get('postalCode'),
      province: formData.get('province'),
      phone: formData.get('phone'),
      shippingMethod: checkoutData.shippingMethod,
      shippingCost: checkoutData.shipping
    };
    
    sessionStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
    
    updateUserAddress(checkoutInfo);

    setTimeout(() => {
      window.location.href = 'proceso_pago.html';
    }, 1200);
  });
}

function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = '#ff4757';
      
      setTimeout(() => {
        field.style.borderColor = '';
      }, 3000);
    }
  });
  
  if (!isValid) {
    notify('Por favor completa todos los campos requeridos', 'error');
    
    const firstInvalid = form.querySelector('[required]:invalid, [required][value=""]');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalid.focus();
    }
  }
  
  return isValid;
}

function updateUserAddress(checkoutInfo) {
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return;
  
  const savedUsers = sessionStorage.getItem('digitalPointUsers');
  if (!savedUsers) return;
  
  const users = JSON.parse(savedUsers);
  const userIndex = users.findIndex(u => u.email === currentUserEmail);
  
  if (userIndex === -1) return;
  
  users[userIndex].address = {
    street: checkoutInfo.address,
    city: checkoutInfo.city,
    postalCode: checkoutInfo.postalCode,
    province: checkoutInfo.province,
    phone: checkoutInfo.phone
  };
  
  sessionStorage.setItem('digitalPointUsers', JSON.stringify(users));
}

window.addEventListener('cart:updated', () => {
  renderOrderSummary();
});

window.addEventListener('storage', (e) => {
  if (e.key === 'cartItems') {
    renderOrderSummary();
  }
});