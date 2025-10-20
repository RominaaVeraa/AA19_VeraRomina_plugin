let paymentData = {
  method: 'credit_card',
  orderData: null
};

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadCheckoutData();
  renderOrderSummary();
  renderShippingInfo();
  setupPaymentMethods();
  setupPlaceOrder();
});

function checkAuth() {
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  
  if (!currentUserEmail) {
    showToast('Debes iniciar sesión para continuar', 'error');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=comprar.html';
    }, 2000);
    return;
  }
  
  const checkoutInfo = sessionStorage.getItem('checkoutInfo');
  if (!checkoutInfo) {
    showToast('No hay información de checkout', 'error');
    setTimeout(() => {
      window.location.href = 'comprar.html';
    }, 2000);
    return;
  }
  
  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  if (cart.length === 0) {
    showToast('Tu carrito está vacío', 'warning');
    setTimeout(() => {
      window.location.href = 'comprar.html';
    }, 2000);
  }
}

function loadCheckoutData() {
  try {
    const checkoutInfo = JSON.parse(sessionStorage.getItem('checkoutInfo'));
    if (!checkoutInfo) return;
    
    paymentData.orderData = checkoutInfo;
  } catch (error) {
    console.error('Error al cargar datos de checkout:', error);
  }
}

function renderOrderSummary() {
  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  const itemsContainer = document.getElementById('orderItemsSummary');
  
  if (!itemsContainer) return;
  
  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5);">No hay productos</p>';
    return;
  }
  
  itemsContainer.innerHTML = cart.map(item => `
    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(85, 85, 85, 0.3); font-size: clamp(0.85rem, 2vw, 0.95rem);">
      <div style="color: rgba(255, 255, 255, 0.9);">
        ${item.name} <span style="color: rgba(255, 255, 255, 0.6);">x${item.quantity}</span>
      </div>
      <div style="color: #e8c5d8; font-weight: 600;">$${window.CartAPI.formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');
  
  updateTotals();
}

function updateTotals() {
  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const discountInfo = getDiscountFromCart();
  const discount = discountInfo.amount;
  
  const checkoutInfo = paymentData.orderData;
  const shipping = checkoutInfo ? (checkoutInfo.shippingCost || 0) : 0;
  
  const TAX_RATE = 0.21;
  const taxes = Math.round((subtotal - discount) * TAX_RATE);
  
  const total = subtotal + shipping - discount + taxes;
  
  if (document.getElementById('subtotalAmount')) {
    document.getElementById('subtotalAmount').textContent = `$${window.CartAPI.formatPrice(subtotal)}`;
  }
  if (document.getElementById('shippingAmount')) {
    const shippingEl = document.getElementById('shippingAmount');
    if (shipping > 0) {
      shippingEl.textContent = `$${window.CartAPI.formatPrice(shipping)}`;
      shippingEl.style.color = '';
    } else {
      shippingEl.textContent = 'GRATIS';
      shippingEl.style.color = '#4ade80';
    }
  }
  if (document.getElementById('taxesAmount')) {
    document.getElementById('taxesAmount').textContent = `$${window.CartAPI.formatPrice(taxes)}`;
  }
  if (document.getElementById('totalAmount')) {
    document.getElementById('totalAmount').textContent = `$${window.CartAPI.formatPrice(total)}`;
  }
  
  const discountRow = document.getElementById('discountRow');
  const discountAmount = document.getElementById('discountAmount');
  
  if (discountRow && discountAmount) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountAmount.textContent = `-$${window.CartAPI.formatPrice(discount)}`;
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

function renderShippingInfo() {
  const checkoutInfo = paymentData.orderData;
  if (!checkoutInfo) return;
  
  const shippingContainer = document.getElementById('shippingInfoDetails');
  if (!shippingContainer) return;
  
  const shippingMethodText = {
    'standard': 'Envío Estándar (5-7 días hábiles)',
    'express': 'Envío Express (2-3 días hábiles)',
    'pickup': 'Retiro en Local'
  };
  
  shippingContainer.innerHTML = `
    <div class="info-section">
      <div class="info-section-title">Destinatario</div>
      <p class="info-text">${checkoutInfo.firstName} ${checkoutInfo.lastName}</p>
      <p class="info-text">${checkoutInfo.email}</p>
    </div>
    <div class="info-section">
      <div class="info-section-title">Dirección</div>
      <p class="info-text">${checkoutInfo.address}</p>
      <p class="info-text">${checkoutInfo.city}, ${checkoutInfo.province} ${checkoutInfo.postalCode}</p>
    </div>
    <div class="info-section">
      <div class="info-section-title">Teléfono</div>
      <p class="info-text">${checkoutInfo.phone}</p>
    </div>
    <div class="info-section">
      <div class="info-section-title">Método de Envío</div>
      <p class="info-text">${shippingMethodText[checkoutInfo.shippingMethod] || 'Envío Estándar'}</p>
    </div>
  `;
}

function setupPaymentMethods() {
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      paymentData.method = e.target.value;
    });
  });
  
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const value = e.target.getAttribute('data-copy');
      if (value) {
        navigator.clipboard.writeText(value).then(() => {
          showToast('Copiado al portapapeles', 'success');
        }).catch(() => {
          showToast('No se pudo copiar', 'error');
        });
      }
    });
  });
}

function setupPlaceOrder() {
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  
  if (!placeOrderBtn) return;
  
  placeOrderBtn.addEventListener('click', () => {
    if (paymentData.method === 'credit_card') {
      if (!validateCreditCardForm()) {
        return;
      }
    }
    
    processOrder();
  });
}

function validateCreditCardForm() {
  if (paymentData.method !== 'credit_card') return true;
  
  const cardNumber = document.getElementById('cardNumber');
  const cardName = document.getElementById('cardName');
  const expiryDate = document.getElementById('expiryDate');
  const cvv = document.getElementById('cvv');
  
  let isValid = true;
  
  if (!cardNumber || !cardNumber.value.trim()) {
    isValid = false;
    if (cardNumber) cardNumber.style.borderColor = '#ff4757';
  }
  
  if (!cardName || !cardName.value.trim()) {
    isValid = false;
    if (cardName) cardName.style.borderColor = '#ff4757';
  }
  
  if (!expiryDate || !expiryDate.value.trim()) {
    isValid = false;
    if (expiryDate) expiryDate.style.borderColor = '#ff4757';
  }
  
  if (!cvv || !cvv.value.trim()) {
    isValid = false;
    if (cvv) cvv.style.borderColor = '#ff4757';
  }
  
  if (!isValid) {
    showToast('Por favor completa todos los campos de la tarjeta', 'error');
    return false;
  }
  
  const cardNum = cardNumber.value.replace(/\s/g, '');
  if (cardNum.length < 13 || cardNum.length > 19) {
    showToast('Número de tarjeta inválido', 'error');
    cardNumber.style.borderColor = '#ff4757';
    return false;
  }
  
  if (cvv.value.length < 3 || cvv.value.length > 4) {
    showToast('CVV inválido', 'error');
    cvv.style.borderColor = '#ff4757';
    return false;
  }
  
  return true;
}

function processOrder() {
  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  const checkoutInfo = paymentData.orderData;
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  
  if (!checkoutInfo || !currentUserEmail || cart.length === 0) {
    showToast('Error al procesar el pedido', 'error');
    return;
  }
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountInfo = getDiscountFromCart();
  const discount = discountInfo.amount;
  const shipping = checkoutInfo.shippingCost || 0;
  const TAX_RATE = 0.21;
  const taxes = Math.round((subtotal - discount) * TAX_RATE);
  const total = subtotal + shipping - discount + taxes;
  
  const order = {
    orderId: 'DP' + Date.now(),
    date: new Date().toISOString(),
    userEmail: currentUserEmail,
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    })),
    shippingInfo: {
      firstName: checkoutInfo.firstName,
      lastName: checkoutInfo.lastName,
      email: checkoutInfo.email,
      address: checkoutInfo.address,
      city: checkoutInfo.city,
      postalCode: checkoutInfo.postalCode,
      province: checkoutInfo.province,
      phone: checkoutInfo.phone,
      shippingMethod: checkoutInfo.shippingMethod
    },
    paymentMethod: paymentData.method,
    pricing: {
      subtotal: subtotal,
      shipping: shipping,
      discount: discount,
      discountCode: discountInfo.code,
      taxes: taxes,
      total: total
    },
    status: 'pending'
  };
  
  console.log('=== PROCESANDO PEDIDO ===');
  console.log('Pedido creado:', order);
  console.log('Usuario actual:', currentUserEmail);
  
  saveOrder(order);
  saveOrderToUserHistory(order);
  
  console.log('Vaciando carrito...');
  if (window.CartAPI && window.CartAPI.clearCart) {
    window.CartAPI.clearCart();
  } else {
    try { localStorage.removeItem('cartItems'); } catch {}
    try { window.dispatchEvent(new Event('cart:updated')); } catch {}
  }
  console.log('Carrito vaciado correctamente');
  
  sessionStorage.removeItem('checkoutInfo');
  sessionStorage.removeItem('appliedDiscount');
  console.log('Datos temporales eliminados');
  
  showConfirmationModal(order);
}

function saveOrder(order) {
  let orders = [];
  try {
    const savedOrders = sessionStorage.getItem('digitalPointOrders');
    if (savedOrders) {
      orders = JSON.parse(savedOrders);
    }
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  }
  
  orders.push(order);
  sessionStorage.setItem('digitalPointOrders', JSON.stringify(orders));
  console.log('Pedido guardado en digitalPointOrders. Total de pedidos:', orders.length);
}

function saveOrderToUserHistory(order) {
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  if (!currentUserEmail) {
    console.error('No hay usuario logueado');
    return;
  }
  
  try {
    const savedUsers = sessionStorage.getItem('digitalPointUsers');
    if (!savedUsers) {
      console.error('No hay usuarios en sessionStorage');
      return;
    }
    
    const users = JSON.parse(savedUsers);
    const userIndex = users.findIndex(u => u.email === currentUserEmail);
    
    if (userIndex === -1) {
      console.error('Usuario no encontrado');
      return;
    }
    
    if (!users[userIndex].orderHistory) {
      users[userIndex].orderHistory = [];
    }
    
    users[userIndex].orderHistory.push(order);
    
    sessionStorage.setItem('digitalPointUsers', JSON.stringify(users));
    
    if (window.users) {
      window.users = users;
    }
    
    if (window.digitalPointUser && window.digitalPointUser.email === currentUserEmail) {
      window.digitalPointUser.orderHistory = users[userIndex].orderHistory;
    }
    
    console.log('Pedido guardado en historial del usuario. Total de pedidos del usuario:', users[userIndex].orderHistory.length);
    console.log('Historial completo:', users[userIndex].orderHistory);
  } catch (error) {
    console.error('Error al guardar pedido en historial:', error);
  }
}

function showConfirmationModal(order) {
  const modal = document.getElementById('confirmationModal');
  if (!modal) return;
  
  document.getElementById('modalOrderNumber').textContent = order.orderId;
  
  const detailsContainer = document.getElementById('modalOrderDetails');
  detailsContainer.innerHTML = order.items.map(item => `
    <div class="modal-item">
      <div class="modal-item-image">
        <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}">
      </div>
      <div class="modal-item-info">
        <div class="modal-item-name">${item.name}</div>
        <div class="modal-item-quantity">Cantidad: ${item.quantity}</div>
      </div>
      <div class="modal-item-price">$${window.CartAPI.formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('');
  
  document.getElementById('modalSubtotal').textContent = `$${window.CartAPI.formatPrice(order.pricing.subtotal)}`;
  document.getElementById('modalShipping').textContent = order.pricing.shipping > 0 ? `$${window.CartAPI.formatPrice(order.pricing.shipping)}` : 'GRATIS';
  document.getElementById('modalTaxes').textContent = `$${window.CartAPI.formatPrice(order.pricing.taxes)}`;
  document.getElementById('modalTotal').textContent = `$${window.CartAPI.formatPrice(order.pricing.total)}`;
  
  const modalDiscountRow = document.getElementById('modalDiscountRow');
  if (order.pricing.discount > 0) {
    modalDiscountRow.style.display = 'flex';
    document.getElementById('modalDiscount').textContent = `-$${window.CartAPI.formatPrice(order.pricing.discount)}`;
  } else {
    modalDiscountRow.style.display = 'none';
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

document.addEventListener('input', (e) => {
  if (e.target.id === 'cardNumber') {
    let value = e.target.value.replace(/\s/g, '');
    let formatted = value.match(/.{1,4}/g);
    e.target.value = formatted ? formatted.join(' ') : value;
    e.target.style.borderColor = '';
  }
  
  if (e.target.id === 'expiryDate') {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
    e.target.style.borderColor = '';
  }
  
  if (e.target.id === 'cardName' || e.target.id === 'cvv') {
    e.target.style.borderColor = '';
  }
});


