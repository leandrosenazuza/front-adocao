    let currentPage = 0;
    let totalPages = 0;
    let pageSize = 5; // Quantidade de itens por página

    // Função para carregar os dados da página atual
    function carregarTabelaAdocao(page) {
        fetchData(page, pageSize).then(data => {
            currentPage = data.pageable.pageNumber;
            totalPages = data.totalPages;
            exibirTabela(data);
        });
    }

    // Função para atualizar a tabela com os dados recebidos
    function exibirTabela(data) {
        var content = data.content;
        var table = document.getElementById('listagem-solicitacoes');
        
        // Limpa a tabela antes de inserir novos dados
        table.innerHTML = '';

        for (var i = 0; i < content.length; i++) {
            var row = `<tr>
                <td>${content[i].id}</td>
                <td>${content[i].nomeInteressado}</td>
                <td>${content[i].telefoneInteressado}</td>
                <td>${content[i].emailInteressado}</td>
                <td>${content[i].animalDTO.nome}</td>
                <td><button onclick="excluirSolicitacao(${content[i].id})">Excluir Solicitação</button></td>
            </tr>`;

            table.innerHTML += row;
        }

        // Atualiza o estado dos botões de paginação e o número da página atual
        document.getElementById('prevButton').disabled = currentPage === 0;
        document.getElementById('nextButton').disabled = currentPage === totalPages - 1;
        document.getElementById('pageInfo').textContent = `Página ${currentPage + 1} de ${totalPages}`;
    }

    // Funções de navegação para as páginas
    function paginaAnterior() {
        if (currentPage > 0) {
            carregarTabelaAdocao(currentPage - 1);
        }
    }

    function proximaPagina() {
        if (currentPage < totalPages - 1) {
            carregarTabelaAdocao(currentPage + 1);
        }
    }

    // Função para buscar os dados da página no servidor (mockup)
    function fetchData(page, size) {
        // Substitua pelo código de chamada à API que retorna os dados com paginação
        return fetch(`http://localhost:8080/solicitacao/solicitar/listarTodas?page=${page}&pageSize=${size}`)
            .then(response => response.json());
    }

    function excluirSolicitacao(id){
        return fetch(`http://localhost:8080/solicitacao/solicitar/apagar/${id}`)
        .then(response => response.json());
    }

    // Carregar a primeira página ao iniciar
    document.addEventListener('DOMContentLoaded', (event) => {
        carregarTabelaAdocao(currentPage);
    });