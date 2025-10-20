function initializeGlobalComponents() {
  initializeHeader();
  initializeMobileMenu();
  initializeSearch();
  updateCartCount();
  if (typeof initializeScrollEffects === 'function') {
    initializeScrollEffects();
  }
  setupBackToTop();
  updateProfileButton();
}

function initializeHeader() {
  const header = document.querySelector('.header');
  const topBar = document.querySelector('.top-bar');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      if (topBar) {
        topBar.classList.add('hidden');
      }
      if (header) {
        header.classList.add('top-hidden');
        header.classList.add('scrolled');
      }
    } else {
      if (topBar) {
        topBar.classList.remove('hidden');
      }
      if (header) {
        header.classList.remove('top-hidden');
        header.classList.remove('scrolled');
      }
    }
    
    lastScrollTop = scrollTop;
  });
}

function initializeSearch() {
  const searchInput = document.querySelector('.search-input-inline');
  const searchContainer = document.querySelector('.search-container-inline');
  const searchBtnOpen = document.querySelector('.search-btn-open');
  const searchBtnClose = document.querySelector('.search-btn-close');
  const logo = document.querySelector('.logo');
  const headerIcons = document.querySelector('.header-icons');
  const menuToggle = document.querySelector('.mobile-menu-toggle');

  if (searchBtnOpen && searchContainer) {
    searchBtnOpen.addEventListener('click', (e) => {
      e.stopPropagation();
      searchContainer.classList.add('active');
      searchBtnOpen.classList.add('hidden');
      
      if (window.innerWidth <= 700) {
        if (logo) {
          logo.classList.add('hide-mobile');
        }
        if (headerIcons) {
          headerIcons.classList.add('hide-mobile');
        }
        if (menuToggle) {
          menuToggle.classList.add('hide-mobile');
        }
      }
      
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
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
        const query = e.target.value.trim();
        window.location.href = `listado_producto.html?search=${encodeURIComponent(query)}`;
        closeSearch();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (searchContainer && searchContainer.classList.contains('active')) {
      if (!searchContainer.contains(e.target) && 
          (!searchBtnOpen || !searchBtnOpen.contains(e.target))) {
        closeSearch();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchContainer && searchContainer.classList.contains('active')) {
      closeSearch();
    }
  });

  function closeSearch() {
    if (searchContainer) {
      searchContainer.classList.remove('active');
    }
    if (searchBtnOpen) {
      searchBtnOpen.classList.remove('hidden');
    }
    if (searchInput) {
      searchInput.value = '';
    }
    
    if (logo) {
      logo.classList.remove('hide-mobile');
    }
    if (headerIcons) {
      headerIcons.classList.remove('hide-mobile');
    }
    if (menuToggle) {
      menuToggle.classList.remove('hide-mobile');
    }
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

function updateCartCount() {
  let cartItems = [];
  
  if (window.CartAPI && typeof window.CartAPI.getCart === 'function') {
    cartItems = window.CartAPI.getCart();
  } else {
    try {
      const raw = localStorage.getItem('cartItems');
      cartItems = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(cartItems)) cartItems = [];
    } catch {
      cartItems = [];
    }
  }
  
  let totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = totalItems;
    
    if (totalItems === 0) {
      cartCount.classList.add('empty');
    } else {
      cartCount.classList.remove('empty');
    }
  }
}

window.addEventListener('cart:updated', () => {
  updateCartCount();
});

setInterval(() => {
  updateCartCount();
}, 2000);

window.addEventListener('storage', (e) => {
  if (e.key === 'cartItems') {
    updateCartCount();
  }
});

function showToast(message, type = 'info') {
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
  }, 3500);
  
  const toasts = toastContainer.querySelectorAll('.toast');
  if (toasts.length > 3) {
    const oldest = toasts[0];
    oldest.classList.remove('show');
    setTimeout(() => oldest.remove(), 300);
  }
}

function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  
  if (!backToTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function getCurrentUserForHeader() {
  const savedEmail = sessionStorage.getItem('currentUserEmail');
  if (!savedEmail) return null;
  
  const savedUsers = sessionStorage.getItem('digitalPointUsers');
  if (!savedUsers) return null;
  
  const users = JSON.parse(savedUsers);
  return users.find(u => u.email === savedEmail);
}

function updateProfileButton() {
  const profileBtn = document.querySelector('.profile-btn');
  if (!profileBtn) {
    return;
  }
  
  const user = getCurrentUserForHeader();
  
  if (user && user.firstName && user.lastName) {
    profileBtn.innerHTML = '<img src="images/icons/perfil.png" alt="Perfil">';
    profileBtn.classList.add('has-photo');
    profileBtn.classList.remove('initial-hidden');
    profileBtn.onclick = function() { window.location.href = 'profile.html'; };
    profileBtn.title = user.firstName + ' ' + user.lastName;
  } else {
    profileBtn.innerHTML = '<img src="images/icons/usuario.png" alt="Perfil">';
    profileBtn.classList.remove('has-photo');
    profileBtn.classList.remove('initial-hidden');
    profileBtn.onclick = function() { window.location.href = 'login.html'; };
    profileBtn.title = 'Iniciar sesión';
  }
}

function logout() {
  sessionStorage.removeItem('currentUserEmail');
  
  window.currentUserEmail = null;
  window.digitalPointUser = null;

  try { localStorage.removeItem('cartItems'); } catch {}
  try { sessionStorage.removeItem('appliedDiscount'); } catch {}
  try { window.dispatchEvent(new Event('cart:updated')); } catch {}

  showToast('Sesión cerrada', 'info');
  
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

window.showToast = showToast;
window.updateCartCount = updateCartCount;
window.initializeGlobalComponents = initializeGlobalComponents;
window.updateProfileButton = updateProfileButton;
window.getCurrentUserForHeader = getCurrentUserForHeader;
window.logout = logout;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGlobalComponents);
} else {
  initializeGlobalComponents();
}

window.addEventListener('storage', (e) => {
  if (e.key === 'currentUserEmail' || e.key === 'digitalPointUsers') {
    updateProfileButton();
  }
});