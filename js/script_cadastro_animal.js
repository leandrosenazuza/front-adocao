/**
 * Script para gerenciar o cadastro de animais, incluindo interação com o backend e manipulação de modais.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Carrega os dados iniciais quando a página é completamente carregada
    carregarEspecies();
    carregarAnimais();
    carregarComportamentos();
    carregarCirurgias();
    carregarRacas(); 
    carregarSexos();

    // Adiciona evento de submit ao formulário de cadastro de animal
    document.getElementById('formAnimal').addEventListener('submit', (event) => {
        event.preventDefault();
        salvarAnimal();
    });

    // Adiciona evento de mudança ao select de espécie para carregar as raças correspondentes
    document.getElementById('especie').addEventListener('change', () => {
        carregarRacasPorEspecie();
    });

    //  --MODAL--
    // Adiciona ouvintes de eventos para abrir os modais
    document.getElementById('btnNovaEspecie').addEventListener('click', abrirModalNovaEspecie);
    document.getElementById('btnNovaRaca').addEventListener('click', () => {
        abrirModalNovaRaca();
        carregarEspeciesNoModalRaca();
        carregarPortesNoModalRaca();
    });
    document.getElementById('btnNovoComportamento').addEventListener('click', abrirModalNovoComportamento);
    document.getElementById('btnNovaCirurgia').addEventListener('click', abrirModalNovaCirurgia);

    // Event listeners para os formulários dos modais para salvar os dados
    document.getElementById('formNovaEspecie').addEventListener('submit', (event) => {
        event.preventDefault();
        salvarNovaEspecie();
    });
    document.getElementById('formNovaRaca').addEventListener('submit', (event) => {
        event.preventDefault();
        salvarNovaRaca();
    });
    document.getElementById('formNovoComportamento').addEventListener('submit', (event) => {
        event.preventDefault();
        salvarNovoComportamento();
    });
    document.getElementById('formNovaCirurgia').addEventListener('submit', (event) => {
        event.preventDefault();
        salvarNovaCirurgia();
    });
});

// --- FUNÇÕES AUXILIARES ---

// Funções para abrir os modais
function abrirModalNovaEspecie() {
    document.getElementById('modalNovaEspecie').style.display = 'block';
}

function abrirModalNovaRaca() {
    document.getElementById('modalNovaRaca').style.display = 'block';
    carregarEspeciesNoModalRaca();
    carregarPortesNoModalRaca();
}

function abrirModalNovoComportamento() {
    document.getElementById('modalNovoComportamento').style.display = 'block';
}

function abrirModalNovaCirurgia() {
    document.getElementById('modalNovaCirurgia').style.display = 'block';
}

// Funções para fechar os modais
function fecharModalNovaEspecie() {
    document.getElementById('modalNovaEspecie').style.display = 'none';
    document.getElementById('formNovaEspecie').reset();
}

function fecharModalNovaRaca() {
    document.getElementById('modalNovaRaca').style.display = 'none';
    document.getElementById('formNovaRaca').reset();
}

function fecharModalNovoComportamento() {
    document.getElementById('modalNovoComportamento').style.display = 'none';
    document.getElementById('formNovoComportamento').reset();
}

function fecharModalNovaCirurgia() {
    document.getElementById('modalNovaCirurgia').style.display = 'none';
    document.getElementById('formNovaCirurgia').reset();
}

/**
 * Carrega as espécies disponíveis no backend e as adiciona ao select do modal de nova raça.
 */
function carregarEspeciesNoModalRaca() {
    fetch('http://localhost:8080/especie/get/all')
        .then(response => response.json())
        .then(especies => {
            const selectEspecieRaca = document.getElementById('especieRaca');
            selectEspecieRaca.innerHTML = '';

            especies.forEach(especie => {
                const option = document.createElement('option');
                option.value = especie.id;
                option.textContent = especie.descricaoEspecie;
                selectEspecieRaca.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar espécies para o modal de raça:', error);
            alert('Erro ao carregar espécies. Verifique o console.');
        });
}

/**
 * Carrega os portes disponíveis no backend e as adiciona ao select do modal de nova raça.
 */
function carregarPortesNoModalRaca() {
    fetch('http://localhost:8080/porte/get/all')
        .then(response => response.json())
        .then(portes => {
            const selectPorteRaca = document.getElementById('porteRaca');
            selectPorteRaca.innerHTML = ''; 

            portes.forEach(porte => {
                const option = document.createElement('option');
                option.value = porte.id;
                option.textContent = porte.descricaoPorte;
                selectPorteRaca.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar portes para o modal de raça:', error);
            alert('Erro ao carregar portes. Verifique o console.');
        });
}

// --- FUNÇÕES PARA SALVAR ---

/**
 * Salva uma nova espécie no backend.
 */
function salvarNovaEspecie() {
    const descricaoEspecie = document.getElementById('descricaoEspecie').value;

    fetch('http://localhost:8080/especie/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricaoEspecie: descricaoEspecie })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar espécie');
        }
        return response.json();
    })
    .then(novaEspecie => {
        console.log('Espécie criada:', novaEspecie);
        fecharModalNovaEspecie();
        alert('Espécie criada com sucesso!');
        carregarEspecies(); // Recarrega e reordena as espécies
    })
    .catch(error => {
        console.error('Erro ao criar espécie:', error);
        alert('Erro ao criar espécie. Verifique o console.');
    });
}

/**
 * Salva uma nova raça no backend.
 */
function salvarNovaRaca() {
    const descricaoRaca = document.getElementById('descricaoRaca').value;
    const especieId = parseInt(document.getElementById('especieRaca').value);
    const porteId = parseInt(document.getElementById('porteRaca').value);

    const novaRaca = {
        descricaoRaca: descricaoRaca,
        especie: { id: especieId },
        porte: { id: porteId }
    };

    fetch('http://localhost:8080/raca/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaRaca)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar raça');
        }
        return response.json();
    })
    .then(racaCriada => {
        console.log('Raça criada:', racaCriada);
        fecharModalNovaRaca();
        alert('Raça criada com sucesso!');
        carregarRacas(); // Recarrega e reordena as raças
    })
    .catch(error => {
        console.error('Erro ao criar raça:', error);
        alert('Erro ao criar raça. Verifique o console.');
    });
}

/**
 * Salva um novo comportamento no backend.
 */
function salvarNovoComportamento() {
    const descricaoComportamento = document.getElementById('descricaoComportamento').value;
    fetch('http://localhost:8080/comportamento/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricaoComportamento: descricaoComportamento })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar comportamento');
        }
        return response.json();
    })
    .then(novoComportamento => {
        console.log('Comportamento criado:', novoComportamento);
        fecharModalNovoComportamento();
        alert('Comportamento criado com sucesso!');
        carregarComportamentos(); 
    })
    .catch(error => {
        console.error('Erro ao criar comportamento:', error);
        alert('Erro ao criar comportamento. Verifique o console.');
    });
}

/**
 * Salva uma nova cirurgia no backend.
 */
function salvarNovaCirurgia() {
    const descricaoCirurgia = document.getElementById('descricaoCirurgia').value;
    fetch('http://localhost:8080/cirurgia/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricaoCirurgia: descricaoCirurgia })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar cirurgia');
        }
        return response.json();
    })
    .then(novaCirurgia => {
        console.log('Cirurgia criada:', novaCirurgia);
        fecharModalNovaCirurgia();
        alert('Cirurgia criada com sucesso!');
        carregarCirurgias(); 
    })
    .catch(error => {
        console.error('Erro ao criar cirurgia:', error);
        alert('Erro ao criar cirurgia. Verifique o console.');
    });
}

// --- FUNÇÕES PARA CARREGAR ---

/**
 * Carrega a lista de animais do backend e exibe em cards.
 */
function carregarAnimais() {
    fetch('http://localhost:8080/animal/get/all')
        .then(response => response.json())
        .then(animais => {
            exibirAnimaisEmCards(animais);
        })
        .catch(error => {
            console.error('Erro ao carregar animais:', error);
            const animalGallery = document.getElementById('animalGallery');
            animalGallery.innerHTML = '<p>Erro ao carregar os animais. Por favor, tente novamente mais tarde.</p>';
        });
}

// --- LISTA DE RAÇAS ---

/**
 * Carrega a lista de raças do backend e preenche o select de raças.
 */
function carregarRacas() {
    fetch('http://localhost:8080/raca/get/all')
        .then(response => response.json())
        .then(racas => {
            // Ordena as raças em ordem alfabética
            racas.sort((a, b) => a.descricaoRaca.localeCompare(b.descricaoRaca));

            const selectRaca = document.getElementById('raca');
            selectRaca.innerHTML = '<option value="">Selecione</option>';

            racas.forEach(raca => {
                const option = document.createElement('option');
                option.value = raca.id;
                option.textContent = raca.descricaoRaca;
                selectRaca.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar raças:', error);
            alert('Erro ao carregar raças. Por favor, verifique o console.');
        });
}

/**
 * Carrega as raças do backend, filtradas pela espécie selecionada, e as exibe no select de raças.
 */
function carregarRacasPorEspecie() {
    const especieId = parseInt(document.getElementById('especie').value);
    const selectRaca = document.getElementById('raca');
    selectRaca.innerHTML = '<option value="">Selecione</option>'; 

    if (especieId === '') {
        return;
    }

    // Busca as raças da espécie usando a nova rota
    fetch(`http://localhost:8080/raca/get/especie/${especieId}`) 
        .then(response => response.json())
        .then(racas => {
            // Ordena as raças em ordem alfabética
            racas.sort((a, b) => a.descricaoRaca.localeCompare(b.descricaoRaca));

            racas.forEach(raca => {
                const option = document.createElement('option');
                option.value = raca.id;
                option.textContent = raca.descricaoRaca;
                selectRaca.appendChild(option);

                // Botão para excluir a raça
                const btnExcluirRaca = document.createElement('button');
                btnExcluirRaca.textContent = 'Excluir';
                btnExcluirRaca.classList.add('botao-excluir-raca');
                btnExcluirRaca.addEventListener('click', () => {
                    if (confirm(`Tem certeza que deseja excluir a raça ${raca.descricaoRaca}?`)) {
                        excluirRaca(raca.id);
                    }
                });
                selectRaca.parentNode.insertBefore(btnExcluirRaca, selectRaca.nextSibling);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar raças por espécie:', error);
            alert('Erro ao carregar raças. Por favor, verifique o console.');
        });
}

/**
 * Exclui uma raça do backend.
 * @param {number} racaId - O ID da raça a ser excluída.
 */
function excluirRaca(racaId) {
    fetch(`http://localhost:8080/raca/delete/${racaId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Raça excluída com sucesso!');
            carregarRacasPorEspecie(); // Recarrega as raças após a exclusão
        } else {
            throw new Error('Erro ao excluir raça');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir raça:', error);
        alert('Erro ao excluir raça. Verifique o console.');
    });
}

// --- FIM DA LISTA DE RAÇAS ---

/**
 * Carrega as opções de sexo no select.
 */
function carregarSexos() {
    const selectSexo = document.getElementById('sexo');
    selectSexo.innerHTML = '<option value="">Selecione</option>';

    const sexos = ['Macho', 'Fêmea'];
    sexos.forEach(sexo => {
        const option = document.createElement('option');
        option.value = sexo;
        option.textContent = sexo;
        selectSexo.appendChild(option);
    });
}

/**
 * Carrega a lista de comportamentos do backend e preenche o select.
 */
function carregarComportamentos() {
    fetch('http://localhost:8080/comportamento/get/all')
        .then(response => response.json())
        .then(comportamentos => {
            //ordena os comportamentos em ordem alfabética
            comportamentos.sort((a,b) => a.descricaoComportamento.localeCompare(b.descricaoComportamento));

            const selectComportamento = document.getElementById('comportamento');
            selectComportamento.innerHTML = '<option value="">Selecione</option>'; 

            comportamentos.forEach(comportamento => {
                const option = document.createElement('option');
                option.value = comportamento.id;
                option.textContent = comportamento.descricaoComportamento;
                selectComportamento.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar comportamentos:', error));
}

/**
 * Carrega a lista de cirurgias do backend e preenche o select.
 */
function carregarCirurgias() {
    fetch('http://localhost:8080/cirurgia/get/all')
        .then(response => response.json())
        .then(cirurgias => {

            //ordena as Cirurgias em ordem alfabética
            cirurgias.sort((a, b) => a.descricaoCirurgia.localeCompare(b.descricaoCirurgia));

            const selectCirurgia = document.getElementById('cirurgia');
            selectCirurgia.innerHTML = '<option value="">Selecione</option>'; 

            cirurgias.forEach(cirurgia => {
                const option = document.createElement('option');
                option.value = cirurgia.id;
                option.textContent = cirurgia.descricaoCirurgia;
                selectCirurgia.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar cirurgias:', error));
}

/**
 * Salva um novo animal ou atualiza um animal existente.
 */
function salvarAnimal() {
    const animalId = document.getElementById('animalId').value;
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const racaId = document.getElementById('raca').value;
    const sexo = document.getElementById('sexo').value;
    const comportamentoId = document.getElementById('comportamento').value;
    const cirurgiaId = document.getElementById('cirurgia').value ? document.getElementById('cirurgia').value : null;
    const isCastrado = document.getElementById('isCastrado').checked;
    const isVermifugado = document.getElementById('isVermifugado').checked;
    const isVacinado = document.getElementById('isVacinado').checked;
    const isCirurgia = document.getElementById('isCirurgia').checked;
    const descricaoAnimal = document.getElementById('descricaoAnimal').value;
    const foto = document.getElementById('foto').value;

    // Validação dos campos obrigatórios
    if (sexo === "" || racaId === "" || comportamentoId === "") {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // Cria o objeto dadosAnimal com os valores corretos
    const dadosAnimal = {
        nome: nome,
        idade: idade,
        racaId: racaId !== "" ? parseInt(racaId) : null, // Envia null se "Selecione" for escolhido
        sexo: sexo,
        comportamentoId: comportamentoId !== "" ? parseInt(comportamentoId) : null, // Envia null se "Selecione" for escolhido
        cirurgiaId: cirurgiaId, // cirurgiaId já está sendo tratado corretamente
        isCastrado: isCastrado,
        isVermifugado: isVermifugado,
        isVacinado: isVacinado,
        isCirurgia: isCirurgia,
        descricaoAnimal: descricaoAnimal,
        foto: foto
    };

    console.log("Dados do animal sendo enviados:", dadosAnimal);

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

            // Exibe o alerta de sucesso se o animalId existir (edição)
            if (animalId) {
                alert('Animal atualizado com sucesso!');
            } else {
                alert('Animal criado com sucesso!');
            }
        })
        .catch(error => {
            console.error('Erro ao salvar animal:', error);
            alert('Erro ao salvar animal. Verifique o console para mais detalhes.');
        });
}

/**
 * Preenche o formulário com os dados do animal a ser editado.
 * @param {Object} animal - Objeto contendo os dados do animal.
 */
function preencherFormulario(animal) {
    document.getElementById('animalId').value = animal.id;
    document.getElementById('nome').value = animal.nome;
    document.getElementById('idade').value = animal.idade;
    document.getElementById('raca').value = animal.raca.id;
    document.getElementById('sexo').value = animal.sexo;
    document.getElementById('comportamento').value = animal.comportamento.id;
    document.getElementById('cirurgia').value = animal.cirurgia ? animal.cirurgia.id : '';
    document.getElementById('isCastrado').checked = animal.isCastrado;
    document.getElementById('isVermifugado').checked = animal.isVermifugado;
    document.getElementById('isVacinado').checked = animal.isVacinado;
    document.getElementById('isCirurgia').checked = animal.isCirurgia;
    document.getElementById('descricaoAnimal').value = animal.descricaoAnimal;
    document.getElementById('foto').value = animal.foto;
    document.getElementById('animalForm').scrollIntoView({behavior: 'smooth', block: 'start'});
}

/**
 * Exclui um animal do backend.
 * @param {number} id - ID do animal a ser excluído.
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
 * Limpa os campos do formulário de cadastro de animais.
 */
function limparFormulario() {
    document.getElementById('animalId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
    document.getElementById('raca').value = '';
    document.getElementById('sexo').value = '';
    document.getElementById('comportamento').value = '';
    document.getElementById('cirurgia').value = '';
    document.getElementById('isCastrado').checked = false;
    document.getElementById('isVermifugado').checked = false;
    document.getElementById('isVacinado').checked = false;
    document.getElementById('isCirurgia').checked = false;
    document.getElementById('descricaoAnimal').value = '';
    document.getElementById('foto').value = '';
}

/**
 * Carrega a lista de espécies do backend e preenche o select de espécies.
 */
function carregarEspecies() {
    fetch('http://localhost:8080/especie/get/all')
        .then(response => response.json())
        .then(especies => {

            // Ordena as espécies em ordem alfabética
            especies.sort((a, b) => a.descricaoEspecie.localeCompare(b.descricaoEspecie));

            const selectEspecie = document.getElementById('especie');
            selectEspecie.innerHTML = '<option value="">Selecione</option>';

            especies.forEach(especie => {
                const option = document.createElement('option');
                option.value = especie.id;
                option.textContent = especie.descricaoEspecie;
                selectEspecie.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar espécies:', error));
}

/**
 * Exibe os animais em cards na página.
 * @param {Array} animais - A lista de animais a ser exibida.
 */
function exibirAnimaisEmCards(animais) {
    const animalGallery = document.getElementById('animalGallery');
    animalGallery.innerHTML = ''; // Limpa a galeria

    animais.forEach(animal => {
        const card = document.createElement('div');
        card.classList.add('animal-card');

        const img = document.createElement('img');
        img.src = animal.foto || 'placeholder.jpg';
        img.alt = animal.nome;
        card.appendChild(img);

        const content = document.createElement('div');
        content.classList.add('content');
        content.innerHTML = `
            <h3>${animal.nome}</h3>
            <p>Idade: ${animal.idade} anos</p>
            <p>Raça: ${animal.raca.descricaoRaca}</p>
            <p>Sexo: ${animal.sexo}</p>
            <p>Comportamento: ${animal.comportamento.descricaoComportamento}</p>
            <p>Cirurgia: ${animal.cirurgia ? animal.cirurgia.descricaoCirurgia : '-'}</p>
            <p>Castrado: ${animal.isCastrado ? 'Sim' : 'Não'}</p>
            <p>Vermifugado: ${animal.isVermifugado ? 'Sim' : 'Não'}</p>
            <p>Vacinado: ${animal.isVacinado ? 'Sim' : 'Não'}</p>
            <p>Cirurgia Realizada: ${animal.isCirurgia ? 'Sim' : 'Não'}</p>
            <p>${animal.descricaoAnimal}</p>
        `;

        // Botões de ação
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('botao-acao', 'botao-editar'); // Classe para estilização
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => preencherFormulario(animal));
        content.appendChild(btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('botao-acao', 'botao-excluir'); // Classe para estilização
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => excluirAnimal(animal.id));
        content.appendChild(btnExcluir);

        const btnAdotado = document.createElement('button');
        btnAdotado.classList.add('botao-acao', 'botao-adotado'); // Classe para estilização
        btnAdotado.textContent = 'Adotado';
        // Adicione a lógica para o botão "Adotado" aqui
        btnAdotado.addEventListener('click', () => {
            // Implemente a lógica para marcar o animal como adotado
            alert(`Implementar lógica para marcar o animal ${animal.nome} como adotado`);
        });
        content.appendChild(btnAdotado);

        card.appendChild(content);
        animalGallery.appendChild(card);
    });
}