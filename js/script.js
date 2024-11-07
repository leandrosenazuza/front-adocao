var API_BASE_URL = `http://localhost:8080`;

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
    fetch(API_BASE_URL + `/animal/get/all`)
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
    fetch(API_BASE_URL + `/raca/get/all`)
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
    fetch(API_BASE_URL + `/comportamento/get/all`)
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
    fetch(API_BASE_URL + `/cirurgia/get/all`)
        .then(response => response.json())
        .then(cirurgias => {
            const selectCirurgia = document.getElementById('cirurgia');
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
    const url = animalId ? API_BASE_URL + `/animal/put/${animalId}` : API_BASE_URL + `/animal/criar`;

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
    fetch(API_BASE_URL + `/animal/delete/${id}`, {
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

/*
*****************************************************************************
*/

/* adote */

/* script_adote.js */
document.addEventListener('DOMContentLoaded', () => {
    carregarAnimais();
    carregarRacas();
    carregarComportamentos();
    carregarCirurgias();

    document.getElementById('filtroEspecie').addEventListener('change', () => {
        carregarAnimais();
    });
});

function carregarAnimais() {
    if(document.getElementById('filtroEspecie').value != null){

        const especieId = document.getElementById('filtroEspecie').value;
        let url = API_BASE_URL + `/animal/get/all`;

        // Se uma espécie específica foi selecionada, altera a URL da requisição
        if (especieId !== 'todos') {
            url = API_BASE_URL + `/animal/get/especie/${especieId}`; 
        }
    
        fetch(url)
            .then(response => response.json())
            .then(animais => {
                const animalGallery = document.getElementById('animalGallery');
                animalGallery.innerHTML = ''; // Limpa a galeria antes de adicionar os cards
    
                animais.forEach(animal => {
                    // Cria o card
                    const card = document.createElement('div');
                    card.classList.add('animal-card');
    
                    // Imagem
                    const img = document.createElement('img');
                    img.src = animal.foto || 'placeholder.jpg'; // Imagem de placeholder se não houver
                    img.alt = animal.nome;
                    card.appendChild(img);
    
                    // Conteúdo do Card
                    const content = document.createElement('div');
                    content.classList.add('content');
                    content.innerHTML = `
                        <h3>${animal.nome}</h3>
                        <p>Idade: ${animal.idade} anos</p>
                        <p>Raça: ${animal.raca.descricaoRaca}</p>
                        <p>Comportamento: ${animal.comportamento.descricaoComportamento}</p>
                        <p>Cirurgia: ${animal.cirurgia ? animal.cirurgia.descricaoCirurgia : '-'}</p>
                        <p>Castrado: ${animal.isCastrado ? 'Sim' : 'Não'}</p>
                        <p>Vermifugado: ${animal.isVermifugado ? 'Sim' : 'Não'}</p>
                        <p>Vacinado: ${animal.isVacinado ? 'Sim' : 'Não'}</p>
                        <p>Cirurgia Realizada: ${animal.isCirurgia ? 'Sim' : 'Não'}</p>
                        <p>${animal.descricaoAnimal}</p>
                    `;
    
                    // Botão "Quero Adotar!"
                    const botaoAdotar = document.createElement('button');
                    botaoAdotar.classList.add('botao-adotar');
                    botaoAdotar.textContent = 'Quero Adotar!';
                    //botaoAdotar.addEventListener('click', abrirModalAdocao(animal.id));           
                    botaoAdotar.addEventListener('click', () => abrirModalAdocao(animal.id));
                    content.appendChild(botaoAdotar); 
    
                    card.appendChild(content);
                    animalGallery.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar animais:', error);
                const animalGallery = document.getElementById('animalGallery');
                animalGallery.innerHTML = '<p>Erro ao carregar os animais. Por favor, tente novamente mais tarde.</p>';
            });


    }
}


function carregarRacas() {
    // ... (implementação para carregar raças)
}

function carregarComportamentos() {
    // ... (implementação para carregar comportamentos)
}

function carregarCirurgias() {
    // ... (implementação para carregar cirurgias)
}


/**
 * Abre o modal para adicionar uma nova raça.
 */
function abrirModalAdocao(animalId) {
    let modal = document.getElementById('modalAdocao');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalAdocao';
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.setAttribute('role', 'dialog');
        
        modal.innerHTML = `<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Formulário de Adoção</h3>
        </div>
        <div class="modal-body">
            <form id="adocaoForm">
                <input type="hidden" name="animalId" value="${animalId}">
                <div class="form-group">
                    <label class="form-label">Nome do Interessado</label>
                    <input type="text" name="nomeInteressado" placeholder="Digite seu nome" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Telefone do Interessado</label>
                    <input type="tel" name="telefoneInteressado" placeholder="Digite seu telefone" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email do Interessado</label>
                    <input type="email" name="emailInteressado" placeholder="Digite seu email" required>
                </div>
                <div class="button-group">
                    <button type="button" onclick="document.getElementById('modalAdocao').style.display='none'" class="close">Fechar</button>
                    <button type="submit" class="submit">Enviar</button>
                </div>
            </form>
        </div>
    </div>
</div>

        `;

        document.body.appendChild(modal);

        document.getElementById('adocaoForm').onsubmit = function(event) {
            event.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            fetch(API_BASE_URL + `/solicitacao/solicitar/criar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                alert('Formulário enviado com sucesso!');
                modal.style.display = 'none';
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        };
    } else {
        // Se o modal já existir, apenas exibe e atualiza o valor de animalId
        modal.querySelector('input[name="animalId"]').value = animalId;
        modal.style.display = 'block';
    }
}






