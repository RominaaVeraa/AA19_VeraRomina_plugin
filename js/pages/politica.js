let currentSection = '';
let cookiePreferences = {
    essential: true,
    performance: false,
    marketing: false
};

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    setupTableOfContents();
    initializeScrollSpy();
    updateLastUpdatedDate();
    loadCookiePreferences();
});

function initializePage() {
    console.log('Política de Privacidad - Digital Point inicializada');
    
    updateLastUpdatedDate();
    
    loadCookiePreferences();
    
    setupSmoothScroll();
}

function setupEventListeners() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubscription);
    }

    const cookieModal = document.getElementById('cookieModal');
    if (cookieModal) {
        cookieModal.addEventListener('click', function(e) {
            if (e.target === cookieModal) {
                closeCookieSettings();
            }
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCookieSettings();
        }
    });

    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    window.addEventListener('scroll', debounce(updateActiveSection, 100));
}

function setupTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.policy-section');

    if (sections.length === 0) {
        console.warn('No se encontraron secciones de política');
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveTocLink(sectionId);
            }
        });
    }, {
        rootMargin: '-50px 0px -50px 0px',
        threshold: 0.3
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

function initializeScrollSpy() {
    const sections = document.querySelectorAll('.policy-section');
    const tocLinks = document.querySelectorAll('.toc-link');

    if (sections.length === 0 || tocLinks.length === 0) return;

    window.addEventListener('scroll', debounce(() => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 100) {
                current = section.getAttribute('id');
            }
        });

        if (current && current !== currentSection) {
            currentSection = current;
            updateActiveTocLink(current);
        }
    }, 50));
}

function updateActiveTocLink(sectionId) {
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.warn(`Sección ${sectionId} no encontrada`);
        return;
    }

    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight + 20 : 100;
    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
    });

    if (history.pushState) {
        history.pushState(null, null, `#${sectionId}`);
    }
}

function setupSmoothScroll() {
    if (CSS.supports('scroll-behavior', 'smooth')) {
        return;
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function updateLastUpdatedDate() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        const today = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        lastUpdatedElement.textContent = today.toLocaleDateString('es-ES', options);
    }
}

function openCookieSettings() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        const performanceCheckbox = document.getElementById('performanceCookies');
        const marketingCheckbox = document.getElementById('marketingCookies');
        
        if (performanceCheckbox) {
            performanceCheckbox.checked = cookiePreferences.performance;
        }
        if (marketingCheckbox) {
            marketingCheckbox.checked = cookiePreferences.marketing;
        }
    }
}

function closeCookieSettings() {
    const modal = document.getElementById('cookieModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function saveCookieSettings() {
    const performanceCheckbox = document.getElementById('performanceCookies');
    const marketingCheckbox = document.getElementById('marketingCookies');
    
    if (performanceCheckbox && marketingCheckbox) {
        cookiePreferences.performance = performanceCheckbox.checked;
        cookiePreferences.marketing = marketingCheckbox.checked;
        
        applyCookieSettings();
        
        showToast('Configuración de cookies guardada correctamente', 'success');
        closeCookieSettings();
    }
}

function loadCookiePreferences() {
    applyCookieSettings();
}

function applyCookieSettings() {
    console.log('Configuración de cookies aplicada:', cookiePreferences);
    
    if (cookiePreferences.performance) {
        enablePerformanceCookies();
    } else {
        disablePerformanceCookies();
    }
    
    if (cookiePreferences.marketing) {
        enableMarketingCookies();
    } else {
        disableMarketingCookies();
    }
}

function enablePerformanceCookies() {
    console.log('Cookies de rendimiento habilitadas');
}

function disablePerformanceCookies() {
    console.log('Cookies de rendimiento deshabilitadas');
}

function enableMarketingCookies() {
    console.log('Cookies de marketing habilitadas');
}

function disableMarketingCookies() {
    console.log('Cookies de marketing deshabilitadas');
}

function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '10001';
        toastContainer.style.display = 'flex';
        toastContainer.style.flexDirection = 'column';
        toastContainer.style.gap = '10px';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        background: rgba(26, 26, 26, 0.95);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(85, 85, 85, 0.3);
        min-width: 250px;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    const icon = getToastIcon(type);
    const iconColor = getToastColor(type);
    
    toast.innerHTML = `
        <span style="font-size: 20px; color: ${iconColor};">${icon}</span>
        <span style="flex: 1;">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

function getToastColor(type) {
    const colors = {
        success: '#4ade80',
        error: '#ff4757',
        warning: '#ffa500',
        info: '#e8c5d8'
    };
    return colors[type] || colors.info;
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

function updateActiveSection() {
    const sections = document.querySelectorAll('.policy-section');
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            const sectionId = section.getAttribute('id');
            if (sectionId !== currentSection) {
                currentSection = sectionId;
                updateActiveTocLink(sectionId);
            }
        }
    });
}

function handleExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

function printPolicy() {
    const elementsToHide = [
        '.policy-sidebar',
        '.modal-overlay',
        '.back-to-top',
        '.newsletter',
        'footer'
    ];
    
    elementsToHide.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.style.display = 'none');
    });
    
    window.print();
    
    setTimeout(() => {
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.style.display = '');
        });
    }, 1000);
}

function sharePolicy() {
    if (navigator.share) {
        navigator.share({
            title: 'Política de Privacidad - Digital Point',
            text: 'Conoce cómo Digital Point protege tu información personal',
            url: window.location.href
        }).catch(err => {
            console.log('Error al compartir:', err);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    const url = window.location.href;
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Enlace copiado al portapapeles', 'success');
    } catch (err) {
        showToast('No se pudo copiar el enlace', 'error');
    }
    
    document.body.removeChild(textArea);
}

function checkAccessibility() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
            console.warn('Enlace sin texto descriptivo encontrado:', link);
        }
    });
    
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.getAttribute('alt')) {
            console.warn('Imagen sin texto alternativo encontrada:', img);
        }
    });
}

window.openCookieSettings = openCookieSettings;
window.closeCookieSettings = closeCookieSettings;
window.saveCookieSettings = saveCookieSettings;
window.scrollToSection = scrollToSection;
window.printPolicy = printPolicy;
window.sharePolicy = sharePolicy;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(checkAccessibility, 2000);
}