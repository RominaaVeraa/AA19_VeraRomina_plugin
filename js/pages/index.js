let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
let currentSlide = 0;
let currentReview = 0;
let isAutoSliding = true;
let reviewAutoSlideInterval;

const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;

document.addEventListener('DOMContentLoaded', () => {
  initializeHeroSlider();
  initializeScrollEffects();
  initializeHeaderEffects();
  initializeProductCards();
  initializeNewsletter();
  initializeReviewSlider();
  initializeAnimationObserver();
  initializeSmoothScroll();
  initializeMobileMenu();
  updateCartIcon();
  startAutoSlider();
  startReviewAutoSlide();
});

function initializeHeroSlider() {
  if (totalSlides <= 1) return;
  
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => (isAutoSliding = false));
    heroSection.addEventListener('mouseleave', () => (isAutoSliding = true));
  }
}

function nextSlide() {
  const currentElement = slides[currentSlide];
  
  currentElement?.classList.add('fading-out');
  
  const nextSlideIndex = (currentSlide + 1) % totalSlides;
  const nextElement = slides[nextSlideIndex];
  
  setTimeout(() => {
    currentElement?.classList.remove('active', 'fading-out');
    
    currentSlide = nextSlideIndex;
    
    nextElement?.classList.add('active');
  }, 400);
}

function startAutoSlider() {
  setInterval(() => {
    if (isAutoSliding && totalSlides > 1) nextSlide();
  }, 2000); 
}

function initializeReviewSlider() {
  const reviews = document.querySelectorAll('.review-content');
  const dotsContainer = document.querySelector('.review-dots');
  const prevBtn = document.querySelector('.review-prev');
  const nextBtn = document.querySelector('.review-next');
  
  if (!reviews.length || !dotsContainer) return;
  
  reviews.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = `review-dot ${index === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToReview(index);
      resetAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const reviews = document.querySelectorAll('.review-content');
      const prevIndex = currentReview === 0 ? reviews.length - 1 : currentReview - 1;
      goToReview(prevIndex);
      resetAutoSlide();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const reviews = document.querySelectorAll('.review-content');
      const nextIndex = (currentReview + 1) % reviews.length;
      goToReview(nextIndex);
      resetAutoSlide();
    });
  }
}

function goToReview(index) {
  const reviews = document.querySelectorAll('.review-content');
  const dots = document.querySelectorAll('.review-dot');
  
  if (!reviews[index]) return;
  
  reviews.forEach(r => r.classList.remove('active-review'));
  dots.forEach(d => d.classList.remove('active'));
  
  reviews[index].classList.add('active-review');
  dots[index]?.classList.add('active');
  
  currentReview = index;
}

function resetAutoSlide() {
  clearInterval(reviewAutoSlideInterval);
  setTimeout(() => {
    startReviewAutoSlide();
  }, 10000);
}

function startReviewAutoSlide() {
  clearInterval(reviewAutoSlideInterval);
  reviewAutoSlideInterval = setInterval(() => {
    const reviews = document.querySelectorAll('.review-content');
    const nextIndex = (currentReview + 1) % reviews.length;
    goToReview(nextIndex);
  }, 2000);
}

function initializeScrollEffects() {
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    const y = window.pageYOffset || document.documentElement.scrollTop;
    header?.classList.toggle('scrolled', y > 100);
  });
}

function initializeHeaderEffects() {
  const searchInput = document.querySelector('.search-input-inline');
  const searchContainer = document.querySelector('.search-container-inline');
  const searchBtnOpen = document.querySelector('.search-btn-open');
  const searchBtnClose = document.querySelector('.search-btn-close');

  if (searchBtnOpen && searchContainer) {
    searchBtnOpen.addEventListener('click', (e) => {
      e.stopPropagation();
      searchContainer.classList.add('active');
      searchBtnOpen.classList.add('hidden');
      setTimeout(() => searchInput?.focus(), 100);
    });
  }

  if (searchBtnClose && searchContainer) {
    searchBtnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', e => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        performSearch(e.target.value.trim());
        closeSearch();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (searchContainer?.classList.contains('active') &&
        !searchContainer.contains(e.target) &&
        !searchBtnOpen.contains(e.target)) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchContainer?.classList.contains('active')) {
      closeSearch();
    }
  });

  function closeSearch() {
    searchContainer?.classList.remove('active');
    searchBtnOpen?.classList.remove('hidden');
    if (searchInput) searchInput.value = '';
  }
}

function initializeMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navigation = document.querySelector('.navigation');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!menuToggle || !navigation) return;
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
    document.body.style.overflow = navigation.classList.contains('active') ? 'hidden' : '';
  });
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navigation.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
  
  document.addEventListener('click', (e) => {
    if (navigation.classList.contains('active') && 
        !navigation.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      navigation.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navigation.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navigation.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function initializeProductCards() {
  const cards = document.querySelectorAll('.product-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
      if (window.innerWidth <= 768) return;
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / 10;
      const rotateY = (rect.width / 2 - x) / 10;
      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    });
    
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });

    const img = card.querySelector('.product-image img');
    if (img) {
      img.addEventListener('load', function () {
        this.style.opacity = '1';
        this.style.transform = 'scale(1)';
      });
    }
  });
}

function addToCart(productId, price, image, name) {
  const existing = cartItems.find(i => i.id === productId);
  
  if (existing) {
    existing.quantity += 1;
    showNotification(`${name} - Cantidad actualizada en el carrito`);
  } else {
    cartItems.push({
      id: productId,
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
    showNotification(`${name} agregado al carrito`, 'success');
  }
  
  updateCartIcon();
  saveCartToStorage();
  animateCartIcon();
}

function updateCartIcon() {
  const cartCount = document.querySelector('.cart-count');
  const total = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  
  if (cartCount) {
    cartCount.textContent = total;
    if (total > 0) {
      cartCount.classList.add('show');
    } else {
      cartCount.classList.remove('show');
    }
  }
}

function animateCartIcon() {
  const cartBtn = document.querySelector('.cart-btn');
  if (!cartBtn) return;
  
  cartBtn.style.transform = 'scale(1.2) rotate(10deg)';
  setTimeout(() => (cartBtn.style.transform = 'scale(1) rotate(0deg)'), 300);
}

function saveCartToStorage() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function initializeNewsletter() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  const btn = form?.querySelector('.newsletter-btn');
  
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    
    if (!email) {
      return showNotification('Por favor ingresa tu email', 'error');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showNotification('Por favor ingresa un email válido', 'error');
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Enviando...';
    }
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('_subject', 'Nueva suscripción a Newsletter - Digital Point');
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      
      const response = await fetch('https://formsubmit.co/tienda_digitalpoint@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showNotification('¡Gracias por suscribirte! Recibirás nuestras mejores ofertas.', 'success');
        input.value = '';
        
        const subscribed = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
        if (!subscribed.includes(email)) {
          subscribed.push(email);
          localStorage.setItem('subscribedEmails', JSON.stringify(subscribed));
        }
      } else {
        throw new Error('Error en el envío');
      }
    } catch (error) {
      console.error('Error al enviar:', error);
      
      const subject = encodeURIComponent('Nueva suscripción a Newsletter');
      const body = encodeURIComponent(`Email suscrito: ${email}\nFecha: ${new Date().toLocaleString()}`);
      const mailtoLink = `mailto:tienda_digitalpoint@gmail.com?subject=${subject}&body=${body}`;
      
      showNotification('Por favor, confirma tu suscripción manualmente', 'info');
      
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 1000);
      
      const subscribed = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
      if (!subscribed.includes(email)) {
        subscribed.push(email);
        localStorage.setItem('subscribedEmails', JSON.stringify(subscribed));
      }
      
      input.value = '';
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Suscribirse';
      }
    }
  });
}

function showNotification(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  
  if (!toastContainer) {
    console.warn('Toast container no encontrado');
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
  
  const toasts = toastContainer.querySelectorAll('.toast');
  if (toasts.length > 3) {
    const oldest = toasts[0];
    oldest.classList.remove('show');
    setTimeout(() => oldest.remove(), 300);
  }
}

function initializeAnimationObserver() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    },
    { threshold: 0.1, rootMargin: '50px' }
  );
  
  document
    .querySelectorAll(
      '.section-title, .category-card, .product-card, .feature-card, .review-content, .newsletter-content, .footer-section'
    )
    .forEach(el => observer.observe(el));
}

function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      
      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    })
  );
}

window.DigitalPoint = {
  addToCart,
  showNotification,
  nextSlide,
  goToReview,
  scrollToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  scrollToSection: id => {
    const section = document.getElementById(id);
    if (!section) return;
    const headerH = document.querySelector('.header')?.offsetHeight || 0;
    const top = section.getBoundingClientRect().top + window.pageYOffset - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

function cleanup() {
  saveCartToStorage();
  localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  localStorage.setItem('lastVisit', Date.now());
}

window.addEventListener('beforeunload', cleanup);