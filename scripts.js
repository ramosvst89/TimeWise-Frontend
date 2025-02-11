document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita o envio do formulário

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Envia os dados para o backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login bem-sucedido!');
            // Redireciona para outra página, por exemplo:
            window.location.href = '/dashboard';
        } else {
            document.getElementById('errorMessage').textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});