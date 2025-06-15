document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('login-error');
    
    // Credenciais válidas (em produção, usar autenticação segura)
    const validCredentials = {
        password: 'escola123'
    };
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Verificar credenciais
            if (username === validCredentials.username && password === validCredentials.password) {
                // Login bem-sucedido
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                errorMessage.textContent = 'Usuário ou senha incorretos.';
            }
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'index.html';
        });
    }
    
    // Verificar autenticação ao acessar admin.html
    if (window.location.pathname.includes('admin.html')) {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        }
    }
});