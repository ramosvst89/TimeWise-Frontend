document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Simulação de autenticação (substituir por chamada à API no futuro)
    if (email === 'admin@timewise.com' && senha === 'qwerty') {
        alert('Login bem-sucedido!');
        // Redirecionar para a página de dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('E-mail ou senha incorretos.');
    }
});