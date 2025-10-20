let isAnimating = false;
let activeSection = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeTermsPage();
    setupScrollAnimations();
    setupTableOfContents();
    setupSmoothScrolling();
    setupBackToTop();
    updateCartCount();
    setupReadingProgress();
    initializeBackgroundSlider();
});

function initializeTermsPage() {
    console.log('Digital Point - Términos y Condiciones inicializado');
    initializeEntranceAnimations();
    setupIntersectionObserver();
}

function initializeEntranceAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
}

function initializeBackgroundSlider() {
    const sliderContainer = document.querySelector('.hero-background-slider');
    if (!sliderContainer) return;

    if (typeof PRODUCTOS_DB === 'undefined') {
        console.warn('Base de datos de productos no disponible');
        return;
    }

    const allImages = [];
    
    if (PRODUCTOS_DB.notebooks) {
        Object.values(PRODUCTOS_DB.notebooks).forEach(product => {
            if (product.images && product.images.length > 0) {
                allImages.push(product.images[0]);
            }
        });
    }
    
    if (PRODUCTOS_DB.monitors) {
        Object.values(PRODUCTOS_DB.monitors).forEach(product => {
            if (product.images && product.images.length > 0) {
                allImages.push(product.images[0]);
            }
        });
    }

    if (allImages.length === 0) {
        console.warn('No se encontraron imágenes de productos');
        return;
    }

    const shuffledImages = allImages.sort(() => Math.random() - 0.5);
    
    shuffledImages.forEach((imgSrc, index) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.className = 'slider-image';
        img.alt = 'Product background';
        if (index === 0) {
            img.classList.add('active');
        }
        sliderContainer.appendChild(img);
    });

    let currentIndex = 0;
    const images = sliderContainer.querySelectorAll('.slider-image');
    
    setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }, 3000);
}

function setupSmoothScrolling() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('.toc-section');
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

function setupTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'translateX(10px)';
                }, 100);
                
                const headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                highlightSection(targetSection);
            }
        });
    });
}

function highlightSection(section) {
    section.style.borderColor = 'rgba(232, 197, 216, 0.5)';
    section.style.boxShadow = '0 0 20px rgba(232, 197, 216, 0.2)';
    section.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
        section.style.borderColor = '';
        section.style.boxShadow = '';
        section.style.transform = '';
    }, 2000);
}

function setupIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                updateActiveTOC(entry.target);
            }
        });
    }, options);

    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    const termSections = document.querySelectorAll('.term-section');
    termSections.forEach(section => {
        observer.observe(section);
    });
}

function updateActiveTOC(activeSection) {
    const sectionId = activeSection.id;
    if (!sectionId) return;
    
    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
        link.classList.remove('active');
        link.style.color = '';
        link.style.background = '';
    });
    
    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.style.color = '#e8c5d8';
        activeLink.style.background = 'rgba(232, 197, 216, 0.1)';
    }
}

function setupScrollAnimations() {
    window.addEventListener('scroll', function() {
        if (isAnimating) return;
        
        requestAnimationFrame(() => {
            updateScrollEffects();
            updateReadingProgress();
            isAnimating = false;
        });
        
        isAnimating = true;
    });
}

function updateScrollEffects() {
    const scrollY = window.scrollY;
    
    const header = document.querySelector('.header');
    if (header) {
        if (scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = 'none';
            header.style.backdropFilter = 'blur(10px)';
        }
    }
}

function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function setupReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(progressBar);
}

function updateReadingProgress() {
    const progressFill = document.querySelector('.reading-progress-fill');
    const timeElement = document.getElementById('timeRemaining');
    
    if (!progressFill) return;
    
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    
    progressFill.style.width = Math.min(progress, 100) + '%';
    
    if (timeElement) {
        const remainingTime = Math.max(1, Math.ceil(8 * (1 - progress / 100)));
        timeElement.textContent = remainingTime;
    }
}
function showNotification(message, type = 'info') {
    showToast(message, type);
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return showToast(message, type);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    if (type === 'cart' || type === 'success' || message.toLowerCase().includes('carrito')) {
        animateCartIcon();
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
    
    const toasts = toastContainer.querySelectorAll('.toast');
    if (toasts.length > 3) {
        const oldestToast = toasts[0];
        oldestToast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(oldestToast)) {
                toastContainer.removeChild(oldestToast);
            }
        }, 300);
    }
}

function animateCartIcon() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartCount = document.querySelector('.cart-count');
    
    if (cartBtn) {
        cartBtn.style.animation = 'cartBounce 0.6s ease-out';
        setTimeout(() => {
            cartBtn.style.animation = '';
        }, 600);
    }
    
    if (cartCount) {
        cartCount.style.animation = 'cartBounce 0.4s ease-out';
        setTimeout(() => {
            cartCount.style.animation = '';
        }, 400);
    }
}

function setupReadingDetector() {
    const termSections = document.querySelectorAll('.term-section');
    const readSections = new Set();
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
                readSections.add(entry.target.id);
                
                if (readSections.size === termSections.length) {
                    setTimeout(() => {
                        showToast('Has leído todos los términos y condiciones. Eres una persona muy responsable.', 'success');
                    }, 2000);
                }
            }
        });
    }, {
        threshold: 0.8,
        rootMargin: '-50px'
    });
    
    termSections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });
}

window.addEventListener('load', function() {
    setTimeout(() => {
        updateCartCount();
    }, 500);
    
    setTimeout(() => {
        setupReadingDetector();
    }, 3000);
    
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 1500);
});

window.addEventListener('resize', function() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
        updateScrollEffects();
    }, 250);
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}