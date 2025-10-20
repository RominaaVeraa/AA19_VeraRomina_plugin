let currentProduct = null;
let currentImageIndex = 0;
let autoSlideInterval = null;

document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  setupEventListeners();
  repairCartItems();
  updateCartCount();
  addCartAnimationStyles();
});

function initializePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  loadProduct(productId || 'notebook1');
}

function setupEventListeners() {
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) backToTopBtn.classList.add('show');
      else backToTopBtn.classList.remove('show');
    });
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.querySelector('.newsletter-input').value;
      if (email) { showToast('¡Gracias por suscribirte!', 'success'); e.target.reset(); }
    });
  }
  document.addEventListener('keydown', function(e) {
    if (!currentProduct?.images) return;
    if (e.key === 'ArrowLeft') { previousImage(); resetAutoSlide(); }
    else if (e.key === 'ArrowRight') { nextImage(); resetAutoSlide(); }
  });
  window.addEventListener('storage', (e) => {
    if (e.key === 'cartItems' || e.key === 'cart') updateCartCount();
  });
  window.addEventListener('cart:updated', updateCartCount);
}

function loadProduct(productId) {
  const product = getProductById(productId);
  if (product) {
    currentProduct = product;
    displayProduct(product);
    loadRelatedProducts(product);
    showProductContainer(true);
    startAutoSlide();
    return;
  }
  const def = getProductById('notebook1');
  if (def) {
    currentProduct = def;
    displayProduct(def);
    loadRelatedProducts(def);
    showProductContainer(true);
    startAutoSlide();
    window.history.replaceState({}, '', `ficha_producto.html?id=notebook1`);
  }
}

function getProductById(id) {
  if (typeof PRODUCTOS_DB === 'undefined') return null;
  return (PRODUCTOS_DB.notebooks?.[id]) || (PRODUCTOS_DB.monitors?.[id]) || null;
}

function startAutoSlide() { stopAutoSlide(); autoSlideInterval = setInterval(nextImage, 4000); }
function stopAutoSlide() { if (autoSlideInterval) { clearInterval(autoSlideInterval); autoSlideInterval = null; } }
function resetAutoSlide() { startAutoSlide(); }

function displayProduct(product) {
  updateBreadcrumb(product);
  document.title = `${product.title} - Digital Point`;
  displayBadges(product.badges || []);
  const t = document.getElementById('product-title');
  const p = document.getElementById('product-price');
  const d = document.getElementById('product-description');
  if (t) t.textContent = product.title;
  if (p) p.textContent = `$${Number(product.price || 0).toLocaleString()}`;
  if (d) d.textContent = product.description || '';
  displayMainSpecs(product.specifications || {});
  displayImages(product.images || []);
  displayRating(product.rating || 0, product.reviews || 0);
  displayTechnicalDetails(product.specifications || {});
  displaySpecificationsTable(product.specifications || {});
  displayReviews(product);
}

function updateBreadcrumb(product) {
  const cat = document.getElementById('category-breadcrumb');
  const pb = document.getElementById('product-breadcrumb');
  if (cat) {
    if (product.type === 'notebook') { cat.textContent = 'Notebooks'; cat.onclick = () => location.href = 'notebooks.html'; }
    else { cat.textContent = 'Monitores'; cat.onclick = () => location.href = 'monitores.html'; }
    cat.style.cursor = 'pointer';
  }
  if (pb) pb.textContent = product.title;
}

function displayBadges(badges) {
  const c = document.getElementById('product-badges');
  if (!c) return;
  c.innerHTML = badges.map(b => {
    let text = b;
    if (b==='gaming') text='Gaming';
    else if (b==='oficina') text='Oficina';
    else if (b==='new') text='Nuevo';
    else if (b==='popular') text='Popular';
    else if (b==='premium') text='Premium';
    else if (b==='value') text='Mejor Precio';
    else if (b==='4k') text='4K';
    else if (b==='curved') text='Curvo';
    else if (b==='ultrawide') text='Ultra Ancho';
    else if (b==='flagship') text='Flagship';
    return `<span class="badge ${b}">${text}</span>`;
  }).join('');
}

function displayMainSpecs(specs) {
  const c = document.getElementById('specs-grid');
  if (!c) return;
  const specEntries = Object.entries(specs).slice(0, 4);
  c.innerHTML = specEntries.map(([k,v]) => `
    <div class="spec-item">
      <div class="spec-label">${k}</div>
      <div class="spec-value">${v}</div>
    </div>
  `).join('');
}

function displayImages(images) {
  if (!images?.length) return;
  const main = document.getElementById('mainProductImage');
  const gal = document.getElementById('thumbnail-gallery');
  if (main) {
    main.src = images[0];
    main.alt = currentProduct.title;
    main.onerror = () => { main.src = 'images/placeholder.png'; };
  }
  if (gal) {
    gal.innerHTML = images.map((img,i)=>`
      <div class="thumbnail ${i===0?'active':''}" onclick="selectImage(${i})">
        <img src="${img}" alt="${currentProduct.title} - Imagen ${i+1}" onerror="this.src='images/placeholder.png'">
      </div>
    `).join('');
  }
  currentImageIndex = 0;
}

function selectImage(index) {
  if (!currentProduct?.images) return;
  const main = document.getElementById('mainProductImage');
  const thumbs = document.querySelectorAll('.thumbnail');
  if (main) {
    main.src = currentProduct.images[index];
    main.onerror = () => { main.src = 'images/placeholder.png'; };
    main.classList.add('fade-in');
    setTimeout(()=>main.classList.remove('fade-in'),500);
  }
  thumbs.forEach((t,i)=>t.classList.toggle('active', i===index));
  currentImageIndex = index;
}

function previousImage() {
  if (!currentProduct?.images) return;
  const i = currentImageIndex>0 ? currentImageIndex-1 : currentProduct.images.length-1;
  selectImage(i);
}
function nextImage() {
  if (!currentProduct?.images) return;
  const i = currentImageIndex<currentProduct.images.length-1 ? currentImageIndex+1 : 0;
  selectImage(i);
}

function displayRating(rating, reviews) {
  const stars = document.getElementById('product-stars');
  const txt = document.getElementById('rating-text');
  if (stars) stars.querySelectorAll('.star').forEach((s,i)=>s.classList.toggle('filled', i < Math.floor(rating)));
  if (txt) txt.textContent = `(${rating}/5) - ${reviews} reseñas`;
}

function displayTechnicalDetails(specs) {
  const c = document.getElementById('tech-specs');
  if (!c) return;
  const groups = chunkSpecs(specs, 4);
  c.innerHTML = groups.map((g,gi)=>`
    <div class="spec-group">
      <h4>Especificaciones ${gi===0?'Generales':'Técnicas'}</h4>
      <ul class="spec-list">
        ${g.map(([k,v])=>`<li><span class="spec-name">${k}:</span><span class="spec-value-detail">${v}</span></li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function chunkSpecs(specs,size){
  const e = Object.entries(specs); const out=[];
  for(let i=0;i<e.length;i+=size) out.push(e.slice(i,i+size));
  return out;
}

function displaySpecificationsTable(specs) {
  const c = document.getElementById('spec-table');
  if (!c) return;
  c.innerHTML = `
    <table>
      <thead><tr><th>Característica</th><th>Especificación</th></tr></thead>
      <tbody>
        ${Object.entries(specs).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

function displayReviews(product) {
  const c = document.getElementById('reviews-list');
  if (!c) return;
  const r = [
    {name:"Carlos M.", date:"15 de marzo, 2025", rating:5, text:`Excelente ${product.type==='notebook'?'notebook':'monitor'}. La calidad es excepcional y el rendimiento supera mis expectativas. Muy recomendado.`},
    {name:"Ana L.", date:"10 de marzo, 2025", rating:4, text:`Muy buena compra. La relación calidad-precio es muy buena. El envío fue rápido y llegó en perfecto estado.`},
    {name:"Miguel R.", date:"5 de marzo, 2025", rating:4, text:`Cumple con lo esperado. ${product.type==='notebook'?'La batería dura lo prometido y es muy portable.':'Los colores se ven muy bien y no hay ghosting.'}`}
  ];
  c.innerHTML = r.map(rv=>`
    <div class="review-item">
      <div class="review-header"><span class="reviewer-name">${rv.name}</span><span class="review-date">${rv.date}</span></div>
      <div class="review-rating"><div class="stars">
        ${Array.from({length:5},(_,i)=>`<span class="star ${i<rv.rating?'filled':''}">★</span>`).join('')}
      </div></div>
      <div class="review-text">${rv.text}</div>
    </div>
  `).join('');
}

function changeQuantity(delta) {
  const input = document.querySelector('.quantity-input');
  if (!input) return;
  const v = parseInt(input.value)||1;
  input.value = Math.max(1, Math.min(10, v + delta));
}

function addToCartFromDetail() {
  if (!currentProduct?.id) { showToast('Producto inválido', 'error'); return; }

  const qEl = document.querySelector('.quantity-input');
  const qty = Math.max(1, Math.min(10, parseInt(qEl?.value || 1)));
  const img0 = currentProduct.images?.[0] || '';
  const priceNum = Number(currentProduct.price || 0);
  const title = String(currentProduct.title || '');

  for (let i = 0; i < qty; i++) {
    if (window.DigitalPoint && typeof window.DigitalPoint.addToCart === 'function') {
      window.DigitalPoint.addToCart(currentProduct.id, priceNum, img0, title);
    } else if (window.CartAPI && typeof window.CartAPI.addToCartById === 'function') {
      window.CartAPI.addToCartById(currentProduct.id);
    } else {
      let cart = [];
      try { cart = JSON.parse(localStorage.getItem('cartItems') || '[]'); if (!Array.isArray(cart)) cart = []; } catch { cart = []; }
      const idx = cart.findIndex(it => String(it.id) === String(currentProduct.id));
      if (idx >= 0) {
        cart[idx].quantity = Math.min(10, (parseInt(cart[idx].quantity,10) || 1) + 1);
        cart[idx].name = cart[idx].name || title;
        cart[idx].price = typeof cart[idx].price === 'number' ? cart[idx].price : priceNum;
        cart[idx].image = cart[idx].image || img0;
      } else {
        cart.push({ id: String(currentProduct.id), name: title, price: priceNum, image: img0, quantity: 1 });
      }
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }
  }

  try { window.dispatchEvent(new Event('cart:updated')); } catch {}
  animateCartIcon();
  updateCartCount();
  if (qEl) qEl.value = 1;
}


function buyNow() { addToCartFromDetail(); setTimeout(()=>{ location.href='comprar.html'; },500); }

function repairCartItems() {
  try {
    let cart = JSON.parse(localStorage.getItem('cartItems')||'[]');
    if (!Array.isArray(cart) || cart.length===0) return;

    let changed = false;
    const all = { ...(PRODUCTOS_DB?.notebooks||{}), ...(PRODUCTOS_DB?.monitors||{}) };

    cart = cart.map((it, i) => {
      const fixed = { ...it };
      if (!fixed.name || fixed.name === 'Producto' || fixed.name === 'undefined') {
        const p = all[String(fixed.id)] || null;
        if (p?.title) { fixed.name = p.title; changed = true; }
      }
      if (fixed.title && !fixed.name) { fixed.name = fixed.title; changed = true; }
      if (typeof fixed.price === 'string') {
        const digits = fixed.price.replace(/[^\d]/g,'');
        fixed.price = digits ? parseInt(digits,10) : 0;
        changed = true;
      }
      if (!fixed.quantity) { fixed.quantity = 1; changed = true; }
      return fixed;
    });

    if (changed) {
      localStorage.setItem('cartItems', JSON.stringify(cart));
      try { window.dispatchEvent(new Event('cart:updated')); } catch {}
    }
  } catch {}
}

function updateCartCount() {
  if (window.CartAPI?.getCart) {
    const total = window.CartAPI.getCart().reduce((s,i)=>s+(i.quantity||1),0);
    const el = document.querySelector('.cart-count');
    if (el) { el.textContent = total; if (total===0) el.classList.add('empty'); else el.classList.remove('empty'); }
    return;
  }
  let cart=[]; try{ cart = JSON.parse(localStorage.getItem('cartItems')||'[]'); if(!Array.isArray(cart)) cart=[]; }catch{ cart=[]; }
  const total = cart.reduce((s,i)=>s+(i.quantity||1),0);
  const el = document.querySelector('.cart-count');
  if (el) {
    el.textContent = total;
    if (total===0) el.classList.add('empty'); else el.classList.remove('empty');
    el.style.animation = 'cartBounce 0.4s ease-out'; setTimeout(()=>{ el.style.animation=''; },400);
  }
}

function animateCartIcon() {
  const btn = document.querySelector('.cart-btn');
  const cnt = document.querySelector('.cart-count');
  if (btn) { btn.style.animation='cartBounce 0.6s ease-out'; setTimeout(()=>{ btn.style.animation=''; },600); }
  if (cnt) { cnt.style.animation='cartBounce 0.4s ease-out'; setTimeout(()=>{ cnt.style.animation=''; },400); }
}

function addCartAnimationStyles() {
  if (document.getElementById('cartAnimationStyles')) return;
  const style = document.createElement('style');
  style.id = 'cartAnimationStyles';
  style.textContent = `
    @keyframes cartBounce {0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
    @keyframes fadeIn {from{opacity:0}to{opacity:1}}
    .fade-in{animation:fadeIn .5s ease-in-out}
    .cart-btn{transition:transform .3s cubic-bezier(.68,-.55,.265,1.55)}
    .cart-count{transition:all .3s ease}
    .cart-count.show{display:flex!important;opacity:1!important}
  `;
  document.head.appendChild(style);
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  const ab = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
  if (ab) ab.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  const ap = document.getElementById(`${tabName}-tab`);
  if (ap) ap.classList.add('active');
}

function loadRelatedProducts(product) {
  const c = document.getElementById('related-grid');
  const s = document.getElementById('related-products');
  if (!c || !s) return;
  const items = generateRelatedProducts(product);
  c.innerHTML = items.map(r=>`
    <div class="related-item" onclick="goToProduct('${r.id}')">
      <div class="related-image">
        <img src="${r.image || 'images/placeholder.png'}" alt="${r.title}" onerror="this.src='images/placeholder.png'">
      </div>
      <div class="related-title">${r.title}</div>
      <div class="related-price">$${Number(r.price||0).toLocaleString()}</div>
    </div>
  `).join('');
  s.style.display = 'block';
}

function generateRelatedProducts(cp) {
  if (typeof PRODUCTOS_DB === 'undefined') return [];
  const src = cp.type==='notebook' ? PRODUCTOS_DB.notebooks : PRODUCTOS_DB.monitors;
  if (!src) return [];
  const primary = Object.values(src).filter(p=>p.id!==cp.id && p.category===cp.category).slice(0,3);
  if (primary.length<3) {
    const rest = Object.values(src).filter(p=>p.id!==cp.id && !primary.includes(p)).slice(0,3-primary.length);
    primary.push(...rest);
  }
  return primary.map(p=>({ id:p.id, title:p.title, price:p.price, image:(p.images&&p.images[0])||'' }));
}

function goToProduct(id) { stopAutoSlide(); location.href = `ficha_producto.html?id=${id}`; }

function showProductContainer(show) {
  const pc = document.getElementById('product-container');
  const ds = document.getElementById('product-details-section');
  if (pc) pc.style.display = show ? 'grid' : 'none';
  if (ds) ds.style.display = show ? 'block' : 'none';
}

function showToast(message, type='success') {
  if (typeof window.showToast === 'function' && window.showToast !== showToast) { window.showToast(message, type); return; }
  const c = document.getElementById('toastContainer'); if (!c) return;
  const t = document.createElement('div'); t.className = `toast ${type}`; t.textContent = message;
  c.appendChild(t);
  setTimeout(()=>t.classList.add('show'),100);
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>{ if(c.contains(t)) c.removeChild(t); },300); },3000);
}

window.addEventListener('beforeunload', stopAutoSlide);

window.selectImage = selectImage;
window.previousImage = previousImage;
window.nextImage = nextImage;
window.changeQuantity = changeQuantity;
window.addToCartFromDetail = addToCartFromDetail;
window.buyNow = buyNow;
window.switchTab = switchTab;
window.goToProduct = goToProduct;
