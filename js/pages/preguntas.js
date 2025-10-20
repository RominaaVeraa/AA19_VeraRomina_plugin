let allFaqItems = [];
let currentCategory = 'all';
let searchTimeout = null;
let isAnimating = false;

const searchSuggestions = [
    'garantía', 'envío', 'pago', 'devolución', 'soporte', 
    'productos nuevos', 'cuotas', 'factura', 'tiempo entrega',
    'notebooks gaming', 'monitores', 'reparación', 'stock'
];

document.addEventListener('DOMContentLoaded', function() {
    initializeFaqPage();
    setupSearch();
    setupCategories();
    setupFaqItems();
    setupBackToTop();
    updateCartCount();
    setupIntersectionObserver();
    addCartAnimationStyles();
});

function initializeFaqPage() {
    console.log('Digital Point - FAQ inicializado');
    allFaqItems = Array.from(document.querySelectorAll('.faq-item'));
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    updateCategoryCounts();
}

function setupSearch() {
    const searchInput = document.getElementById('faqSearch');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        searchTimeout = setTimeout(() => {
            performSearch(query);
            if (query.length > 0) {
                showSuggestions(query, suggestionsContainer);
            } else {
                hideSuggestions(suggestionsContainer);
            }
        }, 300);
    });

    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
            searchInput.blur();
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                performSearch(query);
                this.blur();
                hideSuggestions(suggestionsContainer);
            }
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSuggestions(suggestionsContainer);
        }
    });
}

function showSuggestions(query, container) {
    if (!container) return;
    const filteredSuggestions = searchSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(query.toLowerCase()) &&
        suggestion.toLowerCase() !== query.toLowerCase()
    );

    if (filteredSuggestions.length === 0) {
        hideSuggestions(container);
        return;
    }

    container.innerHTML = filteredSuggestions
        .slice(0, 5)
        .map(suggestion =>
            `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
        ).join('');

    container.classList.add('show');
}

function hideSuggestions(container) {
    if (container) {
        container.classList.remove('show');
    }
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.value = suggestion;
        performSearch(suggestion);
        hideSuggestions(document.getElementById('searchSuggestions'));
    }
}

function performSearch(query) {
    if (!query) {
        filterByCategory(currentCategory);
        return;
    }

    const regex = new RegExp(query, 'gi');
    let foundResults = false;

    allFaqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent;
        const answer = item.querySelector('.faq-answer').textContent;
        const hasMatch = regex.test(question) || regex.test(answer);

        if (hasMatch) {
            showFaqItem(item);
            highlightSearchTerm(item, regex);
            foundResults = true;
        } else {
            hideFaqItem(item);
        }
    });

    const noResults = document.getElementById('noResults');
    if (!foundResults) {
        if (noResults) noResults.style.display = 'block';
        showToast(`No se encontraron resultados para "${query}"`, 'warning');
    } else {
        if (noResults) noResults.style.display = 'none';
        showToast(`Se encontraron ${countVisibleItems()} resultados`, 'success');
    }

    setActiveCategory('all');
}

function highlightSearchTerm(item, regex) {
    const question = item.querySelector('.faq-question h3');
    const answer = item.querySelector('.faq-answer');

    removeHighlights(item);
    question.innerHTML = question.textContent.replace(regex, '<span class="highlight">$&</span>');

    const textNodes = getTextNodes(answer);
    textNodes.forEach(node => {
        if (regex.test(node.textContent)) {
            const highlightedText = node.textContent.replace(regex, '<span class="highlight">$&</span>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedText;
            node.parentNode.replaceChild(wrapper, node);
        }
    });
}

function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while ((node = walker.nextNode())) {
        if (node.textContent.trim()) {
            textNodes.push(node);
        }
    }
    return textNodes;
}

function removeHighlights(item) {
    const highlights = item.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

function setupCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            setActiveCategory(category);
            filterByCategory(category);
            const searchInput = document.getElementById('faqSearch');
            if (searchInput) {
                searchInput.value = '';
            }
        });
    });
}

function setActiveCategory(category) {
    currentCategory = category;
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
}

function filterByCategory(category) {
    const noResults = document.getElementById('noResults');
    allFaqItems.forEach(item => {
        removeHighlights(item);
        if (category === 'all' || item.dataset.category === category) {
            showFaqItem(item);
        } else {
            hideFaqItem(item);
        }
    });
    if (noResults) {
        noResults.style.display = 'none';
    }
}

function showFaqItem(item) {
    item.classList.remove('hidden');
    item.style.display = 'block';
}

function hideFaqItem(item) {
    item.classList.add('hidden');
    setTimeout(() => {
        if (item.classList.contains('hidden')) {
            item.style.display = 'none';
        }
    }, 300);
}

function countVisibleItems() {
    return allFaqItems.filter(item => !item.classList.contains('hidden')).length;
}

function setupFaqItems() {
    allFaqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            toggleFaqItem(item);
        });
    });
}

function toggleFaqItem(item) {
    const isActive = item.classList.contains('active');
    if (isActive) {
        closeFaqItem(item);
    } else {
        openFaqItem(item);
    }
}

function openFaqItem(item) {
    item.classList.add('active');
    setTimeout(() => {
        const rect = item.getBoundingClientRect();
        const headerHeight = document.querySelector('.header').offsetHeight;
        if (rect.top < headerHeight) {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 300);
}

function closeFaqItem(item) {
    item.classList.remove('active');
}

function updateCategoryCounts() {
    const categories = ['all', 'productos', 'compras', 'envios', 'soporte'];
    categories.forEach(category => {
        const count = category === 'all' ? allFaqItems.length : allFaqItems.filter(item => item.dataset.category === category).length;
        const countElement = document.getElementById(`count${category.charAt(0).toUpperCase() + category.slice(1)}`);
        if (countElement) {
            countElement.textContent = count;
        }
    });
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

function setupIntersectionObserver() {
    const options = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, options);
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
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

function addCartAnimationStyles() {
    if (document.getElementById('cartAnimationStyles')) return;
    const style = document.createElement('style');
    style.id = 'cartAnimationStyles';
    style.textContent = `
        @keyframes cartBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        .cart-btn { transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .cart-count { transition: all 0.3s ease; }
        .cart-count.show { display: flex !important; opacity: 1 !important; }
        .cart-count.empty { opacity: 0.7; }
    `;
    document.head.appendChild(style);
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

function setupScrollEffects() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', debounce(function() {
        const scrollY = window.scrollY;
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
    }, 16));
}

function setupAccessibility() {
    allFaqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${index}`);
        const answer = item.querySelector('.faq-answer');
        answer.setAttribute('id', `faq-answer-${index}`);
        answer.setAttribute('role', 'region');
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaqItem(item);
                const isActive = item.classList.contains('active');
                question.setAttribute('aria-expanded', isActive.toString());
            }
        });
    });
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', 'false');
    });
}

function trackFaqInteraction(action, category, question) {
    console.log('FAQ Interaction:', {
        action: action,
        category: category,
        question: question,
        timestamp: new Date().toISOString()
    });
}

function setupAnalytics() {
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            if (e.target.value.length > 2) {
                trackFaqInteraction('search', 'query', e.target.value);
            }
        }, 1000));
    }
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            trackFaqInteraction('category_select', this.dataset.category, '');
        });
    });
    allFaqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const questionText = this.querySelector('h3').textContent;
            trackFaqInteraction('question_expand', item.dataset.category, questionText);
        });
    });
}

function setupEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let userInput = [];
    document.addEventListener('keydown', function(e) {
        userInput.push(e.code);
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        if (userInput.join(',') === konamiCode.join(',')) {
            showToast('🎮 ¡Código Konami activado! Eres un verdadero gamer.', 'success');
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
            userInput = [];
        }
    });
}

window.addEventListener('load', function() {
    setupScrollEffects();
    setupAccessibility();
    setupAnalytics();
    setupEasterEgg();
    setTimeout(() => {
        updateCartCount();
    }, 500);
});

window.addEventListener('resize', debounce(function() {
    const searchSuggestions = document.getElementById('searchSuggestions');
    if (searchSuggestions && searchSuggestions.classList.contains('show')) {
        if (window.innerWidth < 768) {
            searchSuggestions.style.left = '10px';
            searchSuggestions.style.right = '10px';
        }
    }
}, 250));

function formatDate(date) {
    return new Intl.DateTimeFormat('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
