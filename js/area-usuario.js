fetch('http://localhost:8080/solicitacao/solicitar/listarTodas')
    .then(response => response.json())
    .then(data => {
        tabelaAdocao(data)
    })
.catch(error => {
    console.error('Erro ao buscar o número de animais para adoção:', error);
});

function tabelaAdocao(data){
    var content = data.content
    var table = document.getElementById('listagem-solicitacoes')

    for(var i = 0; i < content.length; i++){
        var row = `<tr>
        <td>${content[i].id}</td>
        <td>${content[i].nomeInteressado}</td>
        <td>${content[i].telefoneInteressado}</td>
         <td>${content[i].emailInteressado}</td>
        <td>${content[i].animalDTO.nome}</td>
        <td><button onclick="excluirSolicitacao(${content[i].id})">Excluir Solicitação</button></td>
    </tr>`;

        table.innerHTML += row
    }
}