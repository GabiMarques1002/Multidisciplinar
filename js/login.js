document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Limpa mensagens de erro anteriores
    errorMessage.textContent = '';
    
    // Verifica as senhas e redireciona
    if (password === 'AGValuno2025') {
        window.location.href = './aluno.html';
    } else if (password === '@@professor123.@@') {
        window.location.href = './professor.html';
    } else if (password === 'escola123') {
        window.location.href = './admin.html';
    } else {
        errorMessage.textContent = 'Senha incorreta. Tente novamente.';
    }

        // Mostra feedback visual
    buttonText.textContent = 'Verificando...';
    buttonSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    
});


// Função para mostrar/ocultar senha
function togglePassword() {
    const pass = document.getElementById('password');
    pass.type = pass.type === 'password' ? 'text' : 'password';
}

