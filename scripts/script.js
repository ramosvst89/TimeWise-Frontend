document.addEventListener('DOMContentLoaded', function () {
    const dashboardContent = document.getElementById('dashboard');
    const gerenciamentoContent = document.getElementById('gerenciamento');
    const navbarLinks = document.querySelectorAll('.navbar ul li a');

    const formUsuario = document.getElementById('form-usuario');
    const listaUsuarios = document.getElementById('lista-usuarios');
    const formProjeto = document.getElementById('form-projeto');
    const listaProjetos = document.getElementById('lista-projetos');

    let usuarios = [];
    let projetos = [];

    // Alternar entre Dashboard e Gerenciamento
    navbarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            dashboardContent.classList.add('hidden');
            gerenciamentoContent.classList.add('hidden');
            target.classList.remove('hidden');
        });
    });

    // Adicionar Usuário
    formUsuario.addEventListener('submit', function (event) {
        event.preventDefault();
        const nome = document.getElementById('nome-usuario').value;
        const email = document.getElementById('email-usuario').value;
        const senha = document.getElementById('senha-usuario').value;
        const perfil = document.getElementById('perfil-usuario').value;

        const usuario = { nome, email, senha, perfil };
        usuarios.push(usuario);
        atualizarListaUsuarios();
        formUsuario.reset();
    });

    // Atualizar Lista de Usuários
    function atualizarListaUsuarios() {
        listaUsuarios.innerHTML = '';
        usuarios.forEach(usuario => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <p><strong>Nome:</strong> ${usuario.nome}</p>
                <p><strong>E-mail:</strong> ${usuario.email}</p>
                <p><strong>Perfil:</strong> ${usuario.perfil}</p>
            `;
            listaUsuarios.appendChild(div);
        });
    }

    // Adicionar Projeto
    formProjeto.addEventListener('submit', function (event) {
        event.preventDefault();
        const nome = document.getElementById('nome-projeto').value;
        const descricao = document.getElementById('descricao-projeto').value;
        const dataInicio = document.getElementById('data-inicio-projeto').value;
        const dataFim = document.getElementById('data-fim-projeto').value;
        const status = document.getElementById('status-projeto').value;
        const prioridade = document.getElementById('prioridade-projeto').value;

        const projeto = { nome, descricao, dataInicio, dataFim, status, prioridade };
        projetos.push(projeto);
        atualizarListaProjetos();
        formProjeto.reset();
    });

    // Atualizar Lista de Projetos
    function atualizarListaProjetos() {
        listaProjetos.innerHTML = '';
        projetos.forEach(projeto => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `
                <p><strong>Nome:</strong> ${projeto.nome}</p>
                <p><strong>Descrição:</strong> ${projeto.descricao}</p>
                <p><strong>Data Início:</strong> ${projeto.dataInicio}</p>
                <p><strong>Data Fim:</strong> ${projeto.dataFim}</p>
                <p><strong>Status:</strong> ${projeto.status}</p>
                <p><strong>Prioridade:</strong> ${projeto.prioridade}</p>
            `;
            listaProjetos.appendChild(div);
        });
    }
});