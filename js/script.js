/*cadastro_animal */

/**
 * Executa as ações iniciais ao carregar a página.
 */
document.addEventListener('DOMContentLoaded', () => {
    carregarAnimais();
    carregarRacas();
    carregarComportamentos();
    carregarCirurgias();

    // Adiciona evento de submit ao formulário
    document.getElementById('formAnimal').addEventListener('submit', (event) => {
        event.preventDefault();
        salvarAnimal();
    });
});

/**
 * Carrega a lista de animais do backend e a exibe na tabela.
 */
function carregarAnimais() {
    fetch('http://localhost:8080/animal/get/all')
        .then(response => response.json())
        .then(animais => {
            const tbody = document.querySelector('#tabelaAnimais tbody');
            tbody.innerHTML = '';

            animais.forEach(animal => {
                const row = tbody.insertRow();
                row.insertCell().textContent = animal.id;
                row.insertCell().textContent = animal.nome;
                row.insertCell().textContent = animal.idade;
                row.insertCell().textContent = animal.raca.descricaoRaca;
                row.insertCell().textContent = animal.comportamento.descricaoComportamento;
                row.insertCell().textContent = animal.cirurgia ? animal.cirurgia.descricaoCirurgia : '-';
                row.insertCell().textContent = animal.isCastrado ? 'Sim' : 'Não';
                row.insertCell().textContent = animal.isVermifugado ? 'Sim' : 'Não';
                row.insertCell().textContent = animal.isVacinado ? 'Sim' : 'Não';
                row.insertCell().textContent = animal.isCirurgia ? 'Sim' : 'Não';
                row.insertCell().textContent = animal.descricaoAnimal;
                const fotoCell = row.insertCell();

                if (animal.foto) {
                    const img = document.createElement('img');
                    img.src = animal.foto;
                    img.alt = animal.nome;
                    fotoCell.appendChild(img);
                }

                const acoesCell = row.insertCell();

                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.addEventListener('click', () => preencherFormulario(animal));
                acoesCell.appendChild(btnEditar);

                const btnExcluir = document.createElement('button');
                btnExcluir.textContent = 'Excluir';
                btnExcluir.addEventListener('click', () => excluirAnimal(animal.id));
                acoesCell.appendChild(btnExcluir);
            });
        });
}

/**
 * Carrega a lista de raças do backend e preenche o select correspondente.
 */
function carregarRacas() {
    fetch('http://localhost:8080/raca/get/all')
        .then(response => response.json())
        .then(racas => {
            const selectRaca = document.getElementById('raca');
            racas.forEach(raca => {
                const option = document.createElement('option');
                option.value = raca.id;
                option.textContent = raca.descricaoRaca;
                selectRaca.appendChild(option);
            });
        });
}

/**
 * Carrega a lista de comportamentos do backend e preenche o select correspondente.
 */
function carregarComportamentos() {
    fetch('http://localhost:8080/comportamento/get/all')
        .then(response => response.json())
        .then(comportamentos => {
            const selectComportamento = document.getElementById('comportamento');
            comportamentos.forEach(comportamento => {
                const option = document.createElement('option');
                option.value = comportamento.id;
                option.textContent = comportamento.descricaoComportamento;
                selectComportamento.appendChild(option);
            });
        });
}

/**
 * Carrega a lista de cirurgias do backend e preenche o select correspondente.
 */
function carregarCirurgias() {
    fetch('http://localhost:8080/cirurgia/get/all')
        .then(response => response.json())
        .then(cirurgias => {
            const selectCirurgia = document.getElementById('cirurgia');
            // Adiciona uma opção vazia
            const emptyOption = document.createElement('option');
            emptyOption.value = ''; 
            emptyOption.textContent = 'Selecione (opcional)'; 
            selectCirurgia.appendChild(emptyOption);

            cirurgias.forEach(cirurgia => {
                const option = document.createElement('option');
                option.value = cirurgia.id;
                option.textContent = cirurgia.descricaoCirurgia;
                selectCirurgia.appendChild(option);
            });
        });
}

/**
 * Salva um novo animal ou atualiza um animal existente.
 */
function salvarAnimal() {
    const animalId = document.getElementById('animalId').value;
    const dadosAnimal = {
        nome: document.getElementById('nome').value,
        idade: document.getElementById('idade').value,
        racaId: document.getElementById('raca').value,
        comportamentoId: document.getElementById('comportamento').value,
        cirurgiaId: document.getElementById('cirurgia').value ? document.getElementById('cirurgia').value : null,
        isCastrado: document.getElementById('isCastrado').checked,
        isVermifugado: document.getElementById('isVermifugado').checked,
        isVacinado: document.getElementById('isVacinado').checked,
        isCirurgia: document.getElementById('isCirurgia').checked,
        descricaoAnimal: document.getElementById('descricaoAnimal').value,
        foto: document.getElementById('foto').value
    };

    const metodo = animalId ? 'PUT' : 'POST';
    const url = animalId ? `http://localhost:8080/animal/put/${animalId}` : 'http://localhost:8080/animal/criar';

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAnimal)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao salvar animal'); 
        }
        return response.json(); 
    })
    .then(animalSalvo => {
        console.log('Animal salvo com sucesso:', animalSalvo);
        carregarAnimais(); // Recarrega a lista de animais
        limparFormulario(); // Limpa o formulário
    })
    .catch(error => {
        console.error('Erro ao salvar animal:', error);
        alert('Erro ao salvar animal. Verifique o console para mais detalhes.'); 
    });
}

/**
 * Preenche o formulário com os dados de um animal para edição.
 * @param {Object} animal - O objeto animal a ser editado.
 */
function preencherFormulario(animal) {
    document.getElementById('animalId').value = animal.id;
    document.getElementById('nome').value = animal.nome;
    document.getElementById('idade').value = animal.idade;
    document.getElementById('raca').value = animal.raca.id;
    document.getElementById('comportamento').value = animal.comportamento.id;
    document.getElementById('cirurgia').value = animal.cirurgia ? animal.cirurgia.id : '';
    document.getElementById('isCastrado').checked = animal.isCastrado;
    document.getElementById('isVermifugado').checked = animal.isVermifugado;
    document.getElementById('isVacinado').checked = animal.isVacinado;
    document.getElementById('isCirurgia').checked = animal.isCirurgia;
    document.getElementById('descricaoAnimal').value = animal.descricaoAnimal;
    document.getElementById('foto').value = animal.foto;
}

/**
 * Exclui um animal do backend.
 * @param {number} id - O ID do animal a ser excluído.
 */
function excluirAnimal(id) {
    fetch(`http://localhost:8080/animal/delete/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir animal');
        }
        console.log('Animal excluído com sucesso');
        carregarAnimais(); // Recarrega a lista de animais
    })
    .catch(error => {
        console.error('Erro ao excluir animal:', error);
        alert('Erro ao excluir animal. Verifique o console para mais detalhes.');
    });
}

/**
 * Limpa os campos do formulário.
 */
function limparFormulario() {
    document.getElementById('animalId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('raca').value = ''; 
    document.getElementById('comportamento').value = ''; 
    document.getElementById('cirurgia').value = ''; 
    document.getElementById('isCastrado').checked = false;
    document.getElementById('isVermifugado').checked = false;
    document.getElementById('isVacinado').checked = false;
    document.getElementById('isCirurgia').checked = false;
    document.getElementById('descricaoAnimal').value = '';
    document.getElementById('foto').value = '';
}