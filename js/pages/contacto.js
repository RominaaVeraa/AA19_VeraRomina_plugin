document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    initializeScrollEffects();
    initializeBackToTop();
    initializeAnimations();
    updateCartIcon();
    initializeBackgroundSlider();
});

const backgroundImages = [
    'images/Notebook/notebook1.png',
    'images/Notebook/notebook3.png',
    'images/Notebook/notebook6.png',
    'images/Notebook/notebook7.png',
    'images/Notebook/notebook10.png',
    'images/Monitores/monitor1.png',
    'images/Monitores/monitor3.png',
    'images/Monitores/monitor5.png',
    'images/Monitores/monitor7.png',
    'images/Monitores/monitor9.png'
];

function initializeBackgroundSlider() {
    const slides = document.querySelectorAll('.background-slide');
    if (slides.length === 0) return;

    let currentIndex = 0;
    let nextIndex = 1;
    let imageIndex = 0;

    if (backgroundImages.length > 0) {
        slides[0].style.backgroundImage = `url('${backgroundImages[0]}')`;
        slides[0].classList.add('active');
        
        if (backgroundImages.length > 1) {
            slides[1].style.backgroundImage = `url('${backgroundImages[1]}')`;
        }
        imageIndex = 1;
    }

    function rotateBackground() {
        slides[currentIndex].classList.remove('active');

        currentIndex = (currentIndex + 1) % 2; 
        nextIndex = (currentIndex + 1) % 2;

        slides[currentIndex].style.backgroundImage = `url('${backgroundImages[imageIndex]}')`;
        
        const nextImageIndex = (imageIndex + 1) % backgroundImages.length;
        slides[nextIndex].style.backgroundImage = `url('${backgroundImages[nextImageIndex]}')`;

        slides[currentIndex].classList.add('active');
        
        imageIndex = (imageIndex + 1) % backgroundImages.length;
    }
    setInterval(rotateBackground, 5000);
}

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageTextarea = document.getElementById('message');
    const charCount = document.querySelector('.char-count');
    
    if (!form) return;
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = 500;
            charCount.textContent = `${currentLength}/${maxLength}`;
            
            if (currentLength > maxLength) {
                charCount.style.color = '#ff4757';
                this.value = this.value.substring(0, maxLength);
            } else if (currentLength > maxLength * 0.9) {
                charCount.style.color = '#ffa502';
            } else {
                charCount.style.color = 'rgba(204, 204, 204, 0.6)';
            }
        });
    }
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

function validateField(field) {
    const errorElement = field.parentElement.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Por favor ingresa un email válido';
        }
    } else if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
        if (!phoneRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Por favor ingresa un número de teléfono válido';
        }
    } else if (field.name === 'message' && field.value.trim().length > 500) {
        isValid = false;
        errorMessage = 'El mensaje no puede exceder los 500 caracteres';
    }
    
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            field.style.borderColor = '#ff4757';
        } else {
            errorElement.classList.remove('show');
            field.style.borderColor = '';
        }
    }
    
    return isValid;
}

function clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement && errorElement.classList.contains('show')) {
        errorElement.classList.remove('show');
        field.style.borderColor = '';
    }
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    const privacyCheckbox = document.getElementById('privacy');
    
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!privacyCheckbox.checked) {
        const errorElement = privacyCheckbox.closest('.form-group').querySelector('.form-error');
        if (errorElement) {
            errorElement.textContent = 'Debes aceptar los términos y condiciones para continuar';
            errorElement.classList.add('show');
        }
        showToast('Por favor acepta la política de privacidad para enviar el formulario', 'error');
        privacyCheckbox.closest('.checkbox-label').style.animation = 'shake 0.5s';
        setTimeout(() => {
            privacyCheckbox.closest('.checkbox-label').style.animation = '';
        }, 500);
        isValid = false;
    }
    
    return isValid;
}

function submitForm() {
    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('contactForm');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    
    const formData = new FormData(form);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || 'No proporcionado',
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on' ? 'Sí' : 'No',
        timestamp: new Date().toLocaleString('es-AR')
    };
    
    setTimeout(() => {
        console.log('=== CONSULTA RECIBIDA ===');
        console.log('Destinatario: tienda.digitalpoint@gmail.com');
        console.log('---');
        console.log(`Nombre: ${data.firstName} ${data.lastName}`);
        console.log(`Email: ${data.email}`);
        console.log(`Teléfono: ${data.phone}`);
        console.log(`Asunto: ${data.subject}`);
        console.log(`Mensaje: ${data.message}`);
        console.log(`Newsletter: ${data.newsletter}`);
        console.log(`Fecha: ${data.timestamp}`);
        console.log('========================');
        
        showToast(`¡Gracias ${data.firstName}! Tu consulta ha sido enviada. Te responderemos a ${data.email} en las próximas 24 horas.`, 'success');
        
        form.reset();
        
        const charCount = document.querySelector('.char-count');
        if (charCount) {
            charCount.textContent = '0/500';
            charCount.style.color = 'rgba(204, 204, 204, 0.6)';
        }
        
        const errorElements = form.querySelectorAll('.form-error.show');
        errorElements.forEach(error => error.classList.remove('show'));
        
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => field.style.borderColor = '');
        
        createConfetti();
        
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        
    }, 2000);
}

function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            item.classList.toggle('active');
        });
    });
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll(`
        .contact-info,
        .contact-form-container,
        .faq-item,
        .footer-section
    `);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 5000);
    
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

function createConfetti() {
    const colors = ['#e8c5d8', '#d4a5c4', '#ffffff', '#b89bb0'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${Math.random() * 2 + 2}s linear forwards;
        `;
        
        confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => {
        if (document.body.contains(confettiContainer)) {
            document.body.removeChild(confettiContainer);
        }
    }, 4000);
}

if (!document.getElementById('confetti-styles')) {
    const confettiStyles = document.createElement('style');
    confettiStyles.id = 'confetti-styles';
    confettiStyles.textContent = `
        @keyframes confettiFall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyles);
}

function updateCartIcon() {
    const cartCount = document.querySelector('.cart-count');
    
    let cartItems = [];
    try {
        cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    } catch (e) {
        cartItems = [];
    }
    
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = 'flex';
        
        if (totalItems === 0) {
            cartCount.classList.add('empty');
        } else {
            cartCount.classList.remove('empty');
        }
    }
}

function navigateTo(page) {
    window.location.href = page;
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

const optimizedScrollHandler = throttle(function() {
    initializeScrollEffects();
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

window.addEventListener('beforeunload', function() {
    const highestTimeoutId = setTimeout(";");
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
});

window.ContactPage = {
    showToast,
    navigateTo,
    createConfetti
};

console.log('Página de contacto inicializada correctamente');