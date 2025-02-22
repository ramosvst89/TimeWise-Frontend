document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('lancamento-form');
    const lancamentosBody = document.getElementById('lancamentos-body');
    const totalHorasElement = document.getElementById('total-horas');
    const projetosAtivosElement = document.getElementById('projetos-ativos');
    const cardsProjetosElement = document.getElementById('cards-projetos');
    const projetosList = document.getElementById('projetos-list');
    const atividadesList = document.getElementById('atividades-list');

    let lancamentos = [];
    let totalHoras = 0;
    let projetosAtivos = new Set();
    let horasPorProjeto = {};

    // Função para preencher a data de início com o dia atual
    function preencherDataAtual() {
        const agora = new Date();
        const dataAtual = agora.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        document.getElementById('data-inicio').value = dataAtual;
    }

    // Função para preencher a hora de fim com o horário atual (HH:MM)
    function preencherHoraAtual() {
        const agora = new Date();
        const horaAtual = agora.toTimeString().split(' ')[0].substring(0, 5); // Formato HH:MM
        document.getElementById('hora-fim').value = horaAtual;
    }

    // Preenche os campos de data e hora ao carregar a página
    preencherDataAtual();
    preencherHoraAtual();

    // Função para atualizar as sugestões de projetos e atividades
    function atualizarSugestoes() {
        // Limpa as listas de sugestões
        projetosList.innerHTML = '';
        atividadesList.innerHTML = '';

        // Obtém valores únicos de projetos e atividades já lançados
        const projetosUnicos = [...new Set(lancamentos.map(l => l.projeto))];
        const atividadesUnicas = [...new Set(lancamentos.map(l => l.atividade))];

        // Adiciona os projetos únicos ao datalist de projetos
        projetosUnicos.forEach(projeto => {
            const option = document.createElement('option');
            option.value = projeto;
            projetosList.appendChild(option);
        });

        // Adiciona as atividades únicas ao datalist de atividades
        atividadesUnicas.forEach(atividade => {
            const option = document.createElement('option');
            option.value = atividade;
            atividadesList.appendChild(option);
        });
    }

    // Função para calcular o total de horas entre duas datas
    function calcularTotalHoras(inicio, fim) {
        const diff = fim - inicio; // Diferença em milissegundos
        return (diff / (1000 * 60 * 60)).toFixed(2); // Converter para horas
    }

    // Função para atualizar os cards do dashboard
    function atualizarDashboard() {
        totalHorasElement.textContent = `${totalHoras}h`;
        projetosAtivosElement.textContent = projetosAtivos.size;

        // Atualiza os cards de horas por projeto
        cardsProjetosElement.innerHTML = '';
        for (const [projeto, horas] of Object.entries(horasPorProjeto)) {
            const card = document.createElement('div');
            card.className = 'card project-card animate-card';
            card.innerHTML = `
                <h2>${projeto}</h2>
                <p>${horas}h</p>
            `;
            // Remove a classe de animação após 300ms para permitir nova animação em atualizações futuras
            setTimeout(() => {
                card.classList.remove('animate-card');
            }, 300);
            cardsProjetosElement.appendChild(card);
        }
    }

    // Função para adicionar um lançamento na tabela
    function adicionarLancamento(lancamento) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${lancamento.projeto}</td>
            <td>${lancamento.atividade}</td>
            <td>${lancamento.dataInicio}</td>
            <td>${lancamento.horaInicio}</td>
            <td>${lancamento.horaFim}</td>
            <td>${lancamento.totalHoras}h</td>
            <td>${lancamento.descricao}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editarLancamento(${lancamento.id})">Editar</button>
                <button class="btn-delete" onclick="excluirLancamento(${lancamento.id})">Excluir</button>
            </td>
        `;
        lancamentosBody.appendChild(newRow);
    }

    // Função para editar um lançamento (preenche o formulário com os dados e remove o lançamento atual)
    window.editarLancamento = function (id) {
        const lancamento = lancamentos.find(l => l.id === id);
        if (lancamento) {
            document.getElementById('projeto').value = lancamento.projeto;
            document.getElementById('atividade').value = lancamento.atividade;
            document.getElementById('data-inicio').value = lancamento.dataInicio;
            document.getElementById('hora-inicio').value = lancamento.horaInicio;
            document.getElementById('hora-fim').value = lancamento.horaFim;
            document.getElementById('descricao').value = lancamento.descricao;
            excluirLancamento(id);
        }
    };

    // Função para excluir um lançamento e atualizar os valores
    window.excluirLancamento = function (id) {
        const lancamento = lancamentos.find(l => l.id === id);
        if (lancamento) {
            totalHoras -= parseFloat(lancamento.totalHoras);
            projetosAtivos.delete(lancamento.projeto);
            horasPorProjeto[lancamento.projeto] -= parseFloat(lancamento.totalHoras);
            if (horasPorProjeto[lancamento.projeto] <= 0) {
                delete horasPorProjeto[lancamento.projeto];
            }
            lancamentos = lancamentos.filter(l => l.id !== id);
            lancamentosBody.innerHTML = '';
            lancamentos.forEach(adicionarLancamento);
            atualizarDashboard();
            atualizarSugestoes(); // Atualiza as sugestões após exclusão
        }
    };

    // Ao submeter o formulário, captura os dados, calcula as horas e atualiza o dashboard
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const projeto = document.getElementById('projeto').value;
        const atividade = document.getElementById('atividade').value;
        const dataInicio = document.getElementById('data-inicio').value;
        const horaInicio = document.getElementById('hora-inicio').value;
        const horaFim = document.getElementById('hora-fim').value;
        const descricao = document.getElementById('descricao').value;

        const inicio = new Date(`${dataInicio}T${horaInicio}`);
        const fim = new Date(`${dataInicio}T${horaFim}`);
        const totalHorasLancamento = calcularTotalHoras(inicio, fim);

        const lancamento = {
            id: Date.now(), // Gera um ID único com base no timestamp
            projeto,
            atividade,
            dataInicio,
            horaInicio,
            horaFim,
            totalHoras: totalHorasLancamento,
            descricao
        };

        lancamentos.push(lancamento);
        totalHoras += parseFloat(totalHorasLancamento);
        projetosAtivos.add(projeto);
        if (horasPorProjeto[projeto]) {
            horasPorProjeto[projeto] += parseFloat(totalHorasLancamento);
        } else {
            horasPorProjeto[projeto] = parseFloat(totalHorasLancamento);
        }
        adicionarLancamento(lancamento);
        atualizarDashboard();
        atualizarSugestoes(); // Atualiza as sugestões após adicionar um novo lançamento
        form.reset();
        preencherDataAtual();
        preencherHoraAtual();
    });
});