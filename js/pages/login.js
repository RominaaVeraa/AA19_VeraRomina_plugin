if (!window.users) {
    const savedUsers = sessionStorage.getItem('digitalPointUsers');
    if (savedUsers) {
        window.users = JSON.parse(savedUsers);
    } else {
        window.users = [
            {
                id: 1,
                firstName: 'Usuario',
                lastName: 'Demo',
                email: 'demo@digitalpoint.com',
                password: 'demo123',
                phone: '',
                photoUrl: 'images/icons/perfil.png',
                memberSince: '2025',
                orderHistory: []
            }
        ];
        sessionStorage.setItem('digitalPointUsers', JSON.stringify(window.users));
    }
}

const savedEmail = sessionStorage.getItem('currentUserEmail');
if (savedEmail) {
    window.currentUserEmail = savedEmail;
    const user = window.users.find(u => u.email === savedEmail);
    if (user) {
        window.digitalPointUser = user;
    }
}

function getCurrentUser() {
    const email = window.currentUserEmail || sessionStorage.getItem('currentUserEmail');
    if (!email) return null;
    return window.users.find(u => u.email === email);
}

function setCurrentUser(email) {
    window.currentUserEmail = email;
    sessionStorage.setItem('currentUserEmail', email);
    
    const user = window.users.find(u => u.email === email);
    if (user) {
        window.digitalPointUser = user;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (document.getElementById('profileName')) {
        loadProfile();
        loadUserOrders();
    }
    
    setTimeout(() => {
        if (typeof updateProfileButton === 'function') {
            updateProfileButton();
        } else {
            updateHeaderProfileLegacy();
        }
    }, 100);
});

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    
    const user = window.users.find(u => u.email.toLowerCase() === email);
    
    if (!user) {
        alert('Email no registrado');
        return;
    }
    
    if (user.password !== password) {
        alert('Contraseña incorrecta');
        return;
    }
    
    setCurrentUser(user.email);
    
    console.log('Usuario logueado:', user);
    
    alert('¡Bienvenido ' + user.firstName + '!');
    
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    if (!acceptTerms) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }
    
    if (window.users.find(u => u.email.toLowerCase() === email)) {
        alert('Este email ya está registrado');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        phone: '',
        photoUrl: 'images/icons/perfil.png',
        memberSince: new Date().getFullYear().toString(),
        orderHistory: []
    };
    
    window.users.push(newUser);
    sessionStorage.setItem('digitalPointUsers', JSON.stringify(window.users));
    
    setCurrentUser(newUser.email);
    
    console.log('Usuario creado:', newUser);
    
    alert('¡Cuenta creada exitosamente!');
    
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 500);
}

function loadProfile() {
    setTimeout(() => {
        const user = getCurrentUser();
        if (!user) {
            alert('Debes iniciar sesión primero');
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('memberSince').textContent = user.memberSince;

        const profilePhoto = document.getElementById('profilePhoto');
        profilePhoto.src = 'images/icons/perfil.png';

        const photoUpload = document.getElementById('photoUpload');
        if (photoUpload) photoUpload.disabled = true;
        
        const overlay = document.querySelector('.photo-overlay');
        if (overlay) overlay.style.display = 'none';
        
        const photoWrapper = document.querySelector('.profile-photo-wrapper');
        if (photoWrapper) {
            photoWrapper.style.cursor = 'default';
            photoWrapper.classList.add('no-effects');
        }

        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone || '';

        setupProfileEvents();
    }, 100);
}

function loadUserOrders() {
    const user = getCurrentUser();
    if (!user) return;

    if (!user.orderHistory) {
        user.orderHistory = [];
    }

    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;

    if (user.orderHistory.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-orders">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>No tienes pedidos aún</p>
                <p style="font-size: 0.9rem; margin-top: 5px;">Comienza a comprar para ver tu historial aquí</p>
            </div>
        `;
        return;
    }

    const sortedOrders = [...user.orderHistory].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    ordersList.innerHTML = sortedOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Pedido #${order.orderId}</div>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="order-date">${formatDate(order.date)}</div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-row">
                        <img src="${item.image || 'images/placeholder.png'}" 
                             alt="${item.name}" 
                             class="order-item-image"
                             onerror="this.src='images/placeholder.png'">
                        <div class="order-item-info">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-quantity">Cantidad: ${item.quantity}</div>
                        </div>
                        <div class="order-item-price">$${formatPrice(item.price * item.quantity)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-total">Total: <span>$${formatPrice(order.pricing.total)}</span></div>
                <button class="view-order-btn" onclick="viewOrderDetails('${order.orderId}')">Ver Detalles</button>
            </div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'completed': 'Completado',
        'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-AR', options);
}

function formatPrice(num) {
    return new Intl.NumberFormat('es-AR').format(Math.round(num));
}

function viewOrderDetails(orderId) {
    const user = getCurrentUser();
    if (!user) return;

    const order = user.orderHistory.find(o => o.orderId === orderId);
    if (!order) return;

    alert(`Detalles del Pedido #${order.orderId}\n\n` +
          `Estado: ${getStatusText(order.status)}\n` +
          `Fecha: ${formatDate(order.date)}\n` +
          `Total: $${formatPrice(order.pricing.total)}\n\n` +
          `Productos:\n` +
          order.items.map(item => `- ${item.name} x${item.quantity}`).join('\n'));
}

function setupProfileEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabId = this.dataset.tab + 'Tab';
            document.getElementById(tabId).classList.add('active');
            
            if (this.dataset.tab === 'orders') {
                loadUserOrders();
            }
        });
    });
    
    document.getElementById('personalInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const user = getCurrentUser();
        
        user.firstName = document.getElementById('editFirstName').value.trim();
        user.lastName = document.getElementById('editLastName').value.trim();
        user.email = document.getElementById('editEmail').value.trim();
        user.phone = document.getElementById('editPhone').value.trim();
        
        sessionStorage.setItem('digitalPointUsers', JSON.stringify(window.users));
        
        setCurrentUser(user.email);
        document.getElementById('profileName').textContent = user.firstName + ' ' + user.lastName;
        document.getElementById('profileEmail').textContent = user.email;
        
        if (typeof updateProfileButton === 'function') {
            updateProfileButton();
        } else {
            updateHeaderProfileLegacy();
        }
        
        alert('Información actualizada');
    });
    
    document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const user = getCurrentUser();
        
        const currentPass = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmNewPassword').value;
        
        if (user.password !== currentPass) {
            alert('Contraseña actual incorrecta');
            return;
        }
        
        if (newPass !== confirmPass) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        if (newPass.length < 6) {
            alert('Mínimo 6 caracteres');
            return;
        }
        
        user.password = newPass;
        sessionStorage.setItem('digitalPointUsers', JSON.stringify(window.users));
        
        alert('Contraseña actualizada');
        this.reset();
    });
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

function updateHeaderProfileLegacy() {
    setTimeout(() => {
        const profileBtn = document.querySelector('.profile-btn');
        if (!profileBtn) return;

        const user = getCurrentUser();

        if (user && user.firstName && user.lastName) {
            profileBtn.innerHTML = '<img src="images/icons/perfil.png" alt="Perfil">';
            profileBtn.classList.add('has-photo');
            profileBtn.onclick = function() { window.location.href = 'profile.html'; };
            profileBtn.title = `${user.firstName} ${user.lastName}`;
        } else {
            profileBtn.innerHTML = '<img src="images/icons/usuario.png" alt="Perfil">';
            profileBtn.classList.remove('has-photo');
            profileBtn.onclick = function() { window.location.href = 'login.html'; };
            profileBtn.title = 'Iniciar sesión';
        }
    }, 100);
}

function logout() {
    window.currentUserEmail = null;
    window.digitalPointUser = null;
    sessionStorage.removeItem('currentUserEmail');

    try { localStorage.removeItem('cartItems'); } catch {}
    try { sessionStorage.removeItem('appliedDiscount'); } catch {}
    try { window.dispatchEvent(new Event('cart:updated')); } catch {}

    alert('Sesión cerrada');
    window.location.href = 'login.html';
}

function switchForm(type) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (type === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    const icon = button.querySelector('img');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.src = 'images/icons/ojo-cerrado.png';
    } else {
        input.type = 'password';
        if (icon) icon.src = 'images/icons/ojo.png';
    }
}

window.switchForm = switchForm;
window.togglePassword = togglePassword;
window.logout = logout;
window.updateHeaderProfile = updateHeaderProfileLegacy;
window.getCurrentUser = getCurrentUser;
window.viewOrderDetails = viewOrderDetails;
window.loadUserOrders = loadUserOrders;