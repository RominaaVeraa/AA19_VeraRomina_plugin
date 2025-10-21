// --- Proceso de Pago ---
// Fallbacks (por si no existen showToast o CartAPI.formatPrice)
const notify = (typeof window.showToast === 'function')
  ? window.showToast
  : (msg, type) => console.log(`[toast:${type || 'info'}]`, msg);

const fmt = (n) => (window.CartAPI?.formatPrice ? window.CartAPI.formatPrice(n) : Math.round(n).toString());

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

// --- Auth / flujo ---
function checkAuth() {
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  if (!currentUserEmail) {
    notify('Debes iniciar sesión para continuar', 'error');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=comprar.html';
    }, 2000);
    return;
  }

  const checkoutInfo = sessionStorage.getItem('checkoutInfo');
  if (!checkoutInfo) {
    notify('No hay información de checkout', 'error');
    setTimeout(() => { window.location.href = 'comprar.html'; }, 2000);
    return;
  }

  const cart = window.CartAPI ? window.CartAPI.getCart() : [];
  if (cart.length === 0) {
    notify('Tu carrito está vacío', 'warning');
    setTimeout(() => { window.location.href = 'comprar.html'; }, 2000);
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

// --- Resumen y totales ---
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
      <div style="color: #e8c5d8; font-weight: 600;">$${fmt(item.price * item.quantity)}</div>
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

  const elSubtotal = document.getElementById('subtotalAmount');
  const elShipping  = document.getElementById('shippingAmount');
  const elTaxes     = document.getElementById('taxesAmount');
  const elTotal     = document.getElementById('totalAmount');

  if (elSubtotal) elSubtotal.textContent = `$${fmt(subtotal)}`;
  if (elShipping) {
    if (shipping > 0) {
      elShipping.textContent = `$${fmt(shipping)}`;
      elShipping.style.color = '';
    } else {
      elShipping.textContent = 'GRATIS';
      elShipping.style.color = '#4ade80';
    }
  }
  if (elTaxes) elTaxes.textContent = `$${fmt(taxes)}`;
  if (elTotal) elTotal.textContent = `$${fmt(total)}`;

  const discountRow = document.getElementById('discountRow');
  const discountAmount = document.getElementById('discountAmount');
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
    return { amount, code: data.code || '', percentage: data.percentage || 0 };
  } catch {
    return { amount: 0, code: '' };
  }
}

// --- Envío ---
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

// --- Métodos de pago + UI ---
function setupPaymentMethods() {
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      paymentData.method = e.target.value;
    });
  });

  // Click en las tarjetas de método (sin script inline en HTML)
  document.addEventListener('click', (e) => {
    const box = e.target.closest('.payment-content[data-for]');
    if (!box) return;
    const id = box.getAttribute('data-for');
    const radio = document.getElementById(id);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Botones "copiar" para transferencia
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const value = e.currentTarget.getAttribute('data-copy');
      if (value) {
        navigator.clipboard.writeText(value).then(
          () => notify('Copiado al portapapeles', 'success'),
          () => notify('No se pudo copiar', 'error')
        );
      }
    });
  });
}

// --- Confirmar pedido ---
function setupPlaceOrder() {
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener('click', () => {
    if (paymentData.method === 'credit_card') {
      if (!validateCreditCardForm()) return;
    }
    processOrder();
  });
}

// Validación mínima tarjeta (además de Inputmask)
function validateCreditCardForm() {
  if (paymentData.method !== 'credit_card') return true;

  const cardNumber = document.getElementById('cardNumber');
  const cardName = document.getElementById('cardName');
  const expiryDate = document.getElementById('expiryDate');
  const cvv = document.getElementById('cvv');

  let isValid = true;

  if (!cardNumber || !cardNumber.value.trim()) { isValid = false; if (cardNumber) cardNumber.style.borderColor = '#ff4757'; }
  if (!cardName || !cardName.value.trim())     { isValid = false; if (cardName) cardName.style.borderColor = '#ff4757'; }
  if (!expiryDate || !expiryDate.value.trim()) { isValid = false; if (expiryDate) expiryDate.style.borderColor = '#ff4757'; }
  if (!cvv || !cvv.value.trim())               { isValid = false; if (cvv) cvv.style.borderColor = '#ff4757'; }

  if (!isValid) { notify('Por favor completa todos los campos de la tarjeta', 'error'); return false; }

  const cardNum = cardNumber.value.replace(/\s/g, '');
  if (cardNum.length < 13 || cardNum.length > 19) {
    notify('Número de tarjeta inválido', 'error');
    cardNumber.style.borderColor = '#ff4757';
    return false;
  }

  if (cvv.value.length < 3 || cvv.value.length > 4) {
    notify('CVV inválido', 'error');
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
    notify('Error al procesar el pedido', 'error');
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
      subtotal,
      shipping,
      discount,
      discountCode: discountInfo.code,
      taxes,
      total
    },
    status: 'pending'
  };

  // Guardar pedido
  saveOrder(order);
  saveOrderToUserHistory(order);

  // Vaciar carrito
  if (window.CartAPI?.clearCart) {
    window.CartAPI.clearCart();
  } else {
    try { localStorage.removeItem('cartItems'); } catch {}
    try { window.dispatchEvent(new Event('cart:updated')); } catch {}
  }

  // Limpiar temporales
  sessionStorage.removeItem('checkoutInfo');
  sessionStorage.removeItem('appliedDiscount');

  // Mostrar modal
  showConfirmationModal(order);
}

// Persistencias
function saveOrder(order) {
  let orders = [];
  try {
    const savedOrders = sessionStorage.getItem('digitalPointOrders');
    if (savedOrders) orders = JSON.parse(savedOrders);
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  }
  orders.push(order);
  sessionStorage.setItem('digitalPointOrders', JSON.stringify(orders));
}

function saveOrderToUserHistory(order) {
  const currentUserEmail = sessionStorage.getItem('currentUserEmail');
  if (!currentUserEmail) return;

  try {
    const savedUsers = sessionStorage.getItem('digitalPointUsers');
    if (!savedUsers) return;

    const users = JSON.parse(savedUsers);
    const userIndex = users.findIndex(u => u.email === currentUserEmail);
    if (userIndex === -1) return;

    if (!Array.isArray(users[userIndex].orderHistory)) {
      users[userIndex].orderHistory = [];
    }
    users[userIndex].orderHistory.push(order);
    sessionStorage.setItem('digitalPointUsers', JSON.stringify(users));

    if (window.users) window.users = users;
    if (window.digitalPointUser && window.digitalPointUser.email === currentUserEmail) {
      window.digitalPointUser.orderHistory = users[userIndex].orderHistory;
    }
  } catch (error) {
    console.error('Error al guardar pedido en historial:', error);
  }
}

// Modal de confirmación
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
      <div class="modal-item-price">$${fmt(item.price * item.quantity)}</div>
    </div>
  `).join('');

  document.getElementById('modalSubtotal').textContent = `$${fmt(order.pricing.subtotal)}`;
  document.getElementById('modalShipping').textContent = order.pricing.shipping > 0 ? `$${fmt(order.pricing.shipping)}` : 'GRATIS';
  document.getElementById('modalTaxes').textContent = `$${fmt(order.pricing.taxes)}`;
  document.getElementById('modalTotal').textContent = `$${fmt(order.pricing.total)}`;

  const modalDiscountRow = document.getElementById('modalDiscountRow');
  if (order.pricing.discount > 0) {
    modalDiscountRow.style.display = 'flex';
    document.getElementById('modalDiscount').textContent = `-$${fmt(order.pricing.discount)}`;
  } else {
    modalDiscountRow.style.display = 'none';
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Formateos en vivo de inputs
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

// --- jQuery: máscaras + validación básica de tarjeta ---
$(function(){
  try {
    Inputmask({ mask: "9999 9999 9999 9999[ 9999]" }).mask('#cardNumber');
    Inputmask({ mask: "99/99" }).mask('#expiryDate');
    Inputmask({ mask: "999[9]" }).mask('#cvv');
  } catch(e){}

  // Validación con jQuery Validation (opcional, refuerza la validación nativa)
  if ($('#cardNumber').length) {
    // Creamos un form virtual para aprovechar validate sin romper el layout
    const $virtualForm = $('<form id="paymentCardVirtualForm" novalidate></form>');
    $('#cardNumber, #cardName, #expiryDate, #cvv').each(function(){ $virtualForm.append($(this).clone()); });
    // No lo agregamos al DOM; solo usamos reglas por campo real
    $('#cardNumber, #cardName, #expiryDate, #cvv').each(function(){
      $(this).rules && $(this).rules('add', { required: true });
    });
  }
});
