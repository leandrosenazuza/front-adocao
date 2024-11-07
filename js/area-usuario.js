let currentPage = 0;
let totalPages = 0;
let pageSize = 5;

function carregarTabelaAdocao(page) {
    console.log(page)

    fetchData(page, pageSize).then(data => {
        currentPage = data.pageNumber;
        totalPages = data.totalPages;
        console.log("currentPage" + currentPage)
        console.log("totalPages" + totalPages)
        exibirTabela(data);
    });
}

function exibirTabela(data) {
    let content = data.content;
    let table = document.getElementById('listagem-solicitacoes');
    
    // Limpar tabela antes de renderizar novos dados
    table.innerHTML = '';

    for (let i = 0; i < content.length; i++) {
        let row = `<tr>
            <td>${content[i].id}</td>
            <td>${content[i].nomeInteressado}</td>
            <td>${content[i].telefoneInteressado}</td>
            <td>${content[i].emailInteressado}</td>
            <td>${content[i].animalDTO.nome}</td>
            <td><button onclick="excluirSolicitacao(${content[i].id})">Excluir Solicitação</button></td>
        </tr>`;

        table.innerHTML += row;
    }

    // Atualizar o estado dos botões de navegação
    document.getElementById('prevButton').disabled = currentPage === 0;
        document.getElementById('nextButton').disabled = currentPage >= totalPages - 1;
    
    document.getElementById('pageInfo').textContent = `Página ${currentPage + 1} de ${totalPages}`;
}

function fetchData(page, size) {
    return fetch(`http://localhost:8080/solicitacao/solicitar/listarTodas?page=${page}&pageSize=${size}`)
        .then(response => response.json());
}

function excluirSolicitacao(id) {
    return fetch(`http://localhost:8080/solicitacao/solicitar/apagar/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert('Solicitação deletada com sucesso!');
            carregarTabelaAdocao(currentPage);  
            return response.json();
        }
        throw new Error('Erro na solicitação');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha ao apagar a solicitação!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarTabelaAdocao(currentPage);
});

document.getElementById('nextButton').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        carregarTabelaAdocao(currentPage + 1);
    }
});

document.getElementById('prevButton').addEventListener('click', () => {
    if (currentPage > 0) {
        carregarTabelaAdocao(currentPage - 1);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
        alert('Acesso negado! Faça login para acessar esta página.');
        window.location.href = '/login.html';
    }
});
