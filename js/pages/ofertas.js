document.addEventListener('DOMContentLoaded', function() {
    initializeOffers();
    initializeCountdown();
    initializeFilters();
    initializeScrollAnimations();
    initializeBackgroundSlider(); 
});

const backgroundImages = [
    'images/Notebook/notebook1.png',
    'images/Notebook/notebook2.png',
    'images/Notebook/notebook3.png',
    'images/Notebook/notebook6.png',
    'images/Notebook/notebook10.png',
    'images/Monitores/monitor1.png',
    'images/Monitores/monitor2.png',
    'images/Monitores/monitor4.png',
    'images/Monitores/monitor5.png',
    'images/Monitores/monitor7.png'
];

const offersData = {
    notebook1: {
        id: 'notebook1',
        name: 'MSI Modern 15 A11',
        category: ['notebooks', 'office'],
        originalPrice: 89999,
        offerPrice: 71999,
        discount: 20,
        image: 'images/Notebook/notebook1.png',
        specs: 'Intel i5 • 8GB RAM • SSD 256GB',
        rating: 4,
        reviews: 42,
        featured: false,
        hot: false
    },
    notebook6: {
        id: 'notebook6',
        name: 'MSI GF63 Thin',
        category: ['notebooks', 'gaming'],
        originalPrice: 179999,
        offerPrice: 152999,
        discount: 15,
        image: 'images/Notebook/notebook6.png',
        specs: 'Intel i7 • GTX 1650 • 16GB RAM',
        rating: 5,
        reviews: 67,
        featured: false,
        hot: false
    },
    notebook10: {
        id: 'notebook10',
        name: 'MSI Pulse 15',
        category: ['notebooks', 'gaming'],
        originalPrice: 199999,
        offerPrice: 149999,
        discount: 25,
        image: 'images/Notebook/notebook10.png',
        specs: 'Intel i7 • RTX 3060 • 16GB RAM',
        rating: 5,
        reviews: 89,
        featured: true,
        hot: false
    },
    monitor1: {
        id: 'monitor1',
        name: 'MSI Optix G27C7 27" 240Hz',
        category: ['monitors', 'gaming'],
        originalPrice: 89999,
        offerPrice: 62999,
        discount: 30,
        image: 'images/Monitores/monitor1.png',
        specs: 'QHD • 240Hz • Curvo • Gaming',
        rating: 5,
        reviews: 124,
        featured: false,
        hot: false
    },
    monitor4: {
        id: 'monitor4',
        name: 'MSI Modern MD272Q 27" 4K',
        category: ['monitors', 'office'],
        originalPrice: 179999,
        offerPrice: 147599,
        discount: 18,
        image: 'images/Monitores/monitor4.png',
        specs: '4K UHD • IPS • USB-C • Oficina',
        rating: 4,
        reviews: 78,
        featured: false,
        hot: false
    },
    monitor5: {
        id: 'monitor5',
        name: 'MSI G24C4 24" 144Hz Gaming',
        category: ['monitors', 'gaming'],
        originalPrice: 64999,
        offerPrice: 42249,
        discount: 35,
        image: 'images/Monitores/monitor5.png',
        specs: '144Hz • IPS • Curvo • Gaming',
        rating: 5,
        reviews: 156,
        featured: false,
        hot: true
    }
};

function initializeBackgroundSlider() {
    const slides = document.querySelectorAll('.background-slide');
    if (slides.length === 0) return;

    let currentIndex = 0;
    let nextIndex = 1;

    if (backgroundImages.length > 0) {
        slides[0].style.backgroundImage = `url('${backgroundImages[0]}')`;
        slides[0].classList.add('active');
        
        if (backgroundImages.length > 1) {
            slides[1].style.backgroundImage = `url('${backgroundImages[1]}')`;
        }
    }

    function rotateBackground() {
        slides[currentIndex].classList.remove('active');

        currentIndex = (currentIndex + 1) % 2; 
        nextIndex = (currentIndex + 1) % 2;

        const imageIndex = Math.floor((Date.now() / 2000) % backgroundImages.length);
        const nextImageIndex = (imageIndex + 1) % backgroundImages.length;

        slides[currentIndex].style.backgroundImage = `url('${backgroundImages[imageIndex]}')`;
        slides[nextIndex].style.backgroundImage = `url('${backgroundImages[nextImageIndex]}')`;

        slides[currentIndex].classList.add('active');
    }
    setInterval(rotateBackground, 2000);
}

function initializeOffers() {
    updateOffersCount();
}

function initializeCountdown() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(23, 59, 59, 999);

    const countdownElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (countdownElements.days) countdownElements.days.textContent = days.toString().padStart(2, '0');
            if (countdownElements.hours) countdownElements.hours.textContent = hours.toString().padStart(2, '0');
            if (countdownElements.minutes) countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
            if (countdownElements.seconds) countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
        } else {
            targetDate.setTime(new Date().getTime() + (3 * 24 * 60 * 60 * 1000));
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const selectedCategory = this.getAttribute('data-category');
            filterOffers(selectedCategory);
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function filterOffers(category) {
    const offerCards = document.querySelectorAll('.offer-card');
    let visibleCount = 0;

    offerCards.forEach((card, index) => {
        const cardCategories = card.getAttribute('data-category').split(' ');
        const shouldShow = category === 'all' || cardCategories.includes(category);
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
            
            visibleCount++;
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    setTimeout(() => {
        updateOffersCount(visibleCount);
    }, 400);
}

function updateOffersCount(count = null) {
    const offersCountElement = document.getElementById('offers-count');
    if (offersCountElement) {
        const totalOffers = count !== null ? count : document.querySelectorAll('.offer-card').length;
        offersCountElement.textContent = `${totalOffers} ofertas disponibles`;
        
        offersCountElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            offersCountElement.style.transform = 'scale(1)';
        }, 200);
    }
}

function addToCartOffer(productId) {
    const offer = offersData[productId];
    if (!offer) {
        console.error('Oferta no encontrada:', productId);
        return;
    }

    if (window.CartAPI && typeof window.CartAPI.addToCartById === 'function') {
        window.CartAPI.addToCartById(productId);
    } else if (typeof window.addToCart === 'function') {
        window.addToCart(offer.name, offer.offerPrice, offer.image);
    } else {
        console.error('CartAPI no disponible');
    }

    const button = event?.target?.closest?.('.add-to-cart-offer');
    if (button) {
        button.style.transform = 'scale(0.95)';
        const originalHTML = button.innerHTML;
        button.innerHTML = '<img src="images/icons/carrito-de-compras.png" alt="Carrito">¡Agregado!';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.innerHTML = originalHTML;
        }, 1500);
    }

    try { 
        window.dispatchEvent(new CustomEvent('cart:updated')); 
    } catch {}
}

function addToCartLocal(title, price, image) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    const newItem = {
        title: title,
        price: price,
        image: image,
        quantity: 1,
        id: Date.now()
    };
    
    const existingItemIndex = cartItems.findIndex(item => item.title === title);
    
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
    } else {
        cartItems.push(newItem);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
}

function showToast(message, type = 'info') {
    if (window.showToast && typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }

    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll('.offer-card, .promo-banner, .newsletter');
    animatableElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.offers-hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            
            if (scrolled < heroSection.offsetHeight) {
                const heroOverlay = document.querySelector('.hero-overlay');
                if (heroOverlay) {
                    const rate = scrolled * 0.3;
                    heroOverlay.style.opacity = 0.6 + (rate / 1000);
                }
            }
        });
    }

    const offerCards = document.querySelectorAll('.offer-card');
    offerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});

function handleImageError(img) {
    img.style.display = 'none';
    const parent = img.closest('.offer-image');
    if (parent) {
        parent.style.background = 'linear-gradient(135deg, #333, #555)';
        parent.innerHTML += '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #ccc; font-size: 14px;">Imagen no disponible</div>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.offer-image img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
    
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});

function goToProductDetail(productId) {
    window.location.href = `ficha_producto.html?id=${productId}`;
}

if (typeof window !== 'undefined') {
    window.addToCartOffer = addToCartOffer;
    window.goToProductDetail = goToProductDetail;
}