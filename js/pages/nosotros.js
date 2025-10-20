let isAnimating = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
    setupScrollAnimations();
    setupCounterAnimations();
    setupNewsletterForm();
    setupSmoothScrolling();
    updateCartCount();
    addCartAnimationStyles();
});

function initializeAboutPage() {
    console.log('Digital Point - Sobre Nosotros inicializado');
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

function setupSmoothScrolling() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('.historia-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

function setupIntersectionObserver() {
    const options = { root: null, rootMargin: '-10% 0px -10% 0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                if (entry.target.closest('.stats-grid')) {
                    animateCounters();
                }
            }
        });
    }, options);
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

function setupScrollAnimations() {
    window.addEventListener('scroll', function() {
        if (isAnimating) return;
        requestAnimationFrame(() => {
            updateScrollEffects();
            isAnimating = false;
        });
        isAnimating = true;
    });
}

function updateScrollEffects() {
    const scrollY = window.scrollY;
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
    const header = document.querySelector('.header');
    if (header) {
        if (scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = 'none';
        }
    }
}

function setupCounterAnimations() {}

function animateCounters() {
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
        if (counter.dataset.animated) return;
        const target = parseInt(counter.dataset.target);
        const increment = target / 100;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 20);
        counter.dataset.animated = 'true';
    });
}

function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', handleNewsletterSubmission);
}

async function handleNewsletterSubmission(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('.newsletter-input');
    const button = form.querySelector('.newsletter-btn');
    const email = input.value.trim();
    if (!isValidEmail(email)) {
        showToast('Por favor, ingresa un email válido', 'error');
        return;
    }
    const originalText = button.textContent;
    button.textContent = 'Suscribiendo...';
    button.disabled = true;
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        showToast('¡Te has suscrito exitosamente!', 'success');
        input.value = '';
        form.style.transform = 'scale(0.95)';
        setTimeout(() => { form.style.transform = 'scale(1)'; }, 200);
    } catch (error) {
        showToast('Error al suscribirse. Intenta nuevamente.', 'error');
    } finally {
        button.textContent = originalText;
        button.disabled = false;
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
    setTimeout(() => { toast.classList.add('show'); }, 100);
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
        setTimeout(() => { cartBtn.style.animation = ''; }, 600);
    }
    if (cartCount) {
        cartCount.style.animation = 'cartBounce 0.4s ease-out';
        setTimeout(() => { cartCount.style.animation = ''; }, 400);
    }
}

function addCartAnimationStyles() {
    if (document.getElementById('cartAnimationStyles')) return;
    const style = document.createElement('style');
    style.id = 'cartAnimationStyles';
    style.textContent = `
        @keyframes cartBounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .cart-btn { transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .cart-count { transition: all 0.3s ease; }
        .cart-count.show { display: flex !important; opacity: 1 !important; }
        .cart-count.empty { opacity: 0.7; }
    `;
    document.head.appendChild(style);
}

function onCardEnter(e) {
    e.currentTarget.style.transform = 'translateX(15px) scale(1.02)';
}

function onCardLeave(e) {
    e.currentTarget.style.transform = 'translateX(10px) scale(1)';
}

function setupCardAnimations() {
    const cards = document.querySelectorAll('.trust-item, .shipping-item');
    cards.forEach((card) => {
        card.addEventListener('mouseenter', onCardEnter);
        card.addEventListener('mouseleave', onCardLeave);
    });
}

function createParticleEffect(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = 'rgba(232, 197, 216, 0.7)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    const x = Math.random() * container.offsetWidth;
    const y = Math.random() * container.offsetHeight;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    container.appendChild(particle);
    particle.animate(
        [
            { opacity: 0, transform: 'translateY(0px) scale(1)' },
            { opacity: 1, transform: 'translateY(-50px) scale(1.5)' },
            { opacity: 0, transform: 'translateY(-100px) scale(0.5)' }
        ],
        { duration: 3000, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    ).onfinish = () => { particle.remove(); };
}

function onImageMouseEnter(e) {
    const target = e.currentTarget;
    for (let j = 0; j < 3; j++) {
        setTimeout(createParticleEffect, j * 200, target);
    }
}


function setupImageEffects() {
    const imageContainers = document.querySelectorAll('.image-container');
    imageContainers.forEach((container) => {
        container.addEventListener('mouseenter', onImageMouseEnter);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

window.addEventListener('load', function() {
    setupCardAnimations();
    setupImageEffects();
    setTimeout(() => { updateCartCount(); }, 500);
    setTimeout(() => { document.body.classList.add('page-loaded'); }, 1000);
});

window.addEventListener('resize', function() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => { updateScrollEffects(); }, 250);
});

let konamiCode = [];
const correctCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > correctCode.length) {
        konamiCode.shift();
    }
    if (konamiCode.length === correctCode.length && konamiCode.every((code, i) => code === correctCode[i])) {
        showToast('¡Código secreto activado! ¡Eres un verdadero gamer!', 'success');
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => { document.body.style.filter = 'none'; }, 3000);
        konamiCode = [];
    }
});
