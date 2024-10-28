/**
 * Script para gerenciar o cadastro de animais, incluindo interação com o backend, 
 * manipulação de modais, validações e exibição dos animais cadastrados.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a página carregando dados e configurando eventos
    carregarEspecies();
    carregarAnimais();
    carregarComportamentos();
    carregarCirurgias();
    carregarRacas();
    carregarSexos();

    // Evento de submit do formulário de animal
    document.getElementById('formAnimal').addEventListener('submit', (event) => {
        event.preventDefault();
        salvarAnimal();
    });

    // Evento de mudança no select de espécie para atualizar as raças
    document.getElementById('especie').addEventListener('change', () => {
        carregarRacasPorEspecie();
    });

    // Eventos para abrir os modais
    document.getElementById('btnNovaEspecie').addEventListener('click', abrirModalNovaEspecie);
    document.getElementById('btnNovaRaca').addEventListener('click', () => {
        abrirModalNovaRaca();
        carregarEspeciesNoModalRaca();
        carregarPortesNoModalRaca();
    });
    document.getElementById('btnNovoComportamento').addEventListener('click', abrirModalNovoComportamento);
    document.getElementById('btnNovaCirurgia').addEventListener('click', abrirModalNovaCirurgia);

    // Event listeners para salvar os dados dos modais
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
            selectEspecieRaca.innerHTML = ''; // Limpa o select antes de adicionar opções

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
            alert('Espécie criada com Sucesso!');
            carregarEspecies(); // Recarrega e reordena as espécies
        })
        .catch(error => {
            console.error('Erro ao criar espécie:', error);
            alert('Erro ao criar espécie. Verifique o console.');
        });
}

/**
 * Salva uma nova raça no backend através de uma requisição POST.
 * Exibe mensagens de sucesso ou erro para o usuário e atualiza a lista de raças.
 */
function salvarNovaRaca() {
    // Obtém os valores dos campos do formulário de nova raça
    const descricaoRaca = document.getElementById('descricaoRaca').value;
    const porteId = parseInt(document.getElementById('porteRaca').value);
    const especieId = parseInt(document.getElementById('especieRaca').value);

    // Valida se os campos foram preenchidos
    if (!descricaoRaca || porteId === "" || porteId === 0 || especieId === "" || especieId === 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Cria o objeto JSON para a nova raça
    const novaRaca = {
        descricaoRaca: descricaoRaca,
        porteId: porteId,
        especieId: especieId
    };

    // Exibe o JSON no console de depuração
    console.log("JSON para criar raça", JSON.stringify(novaRaca));

    // Faz a requisição POST para o backend
    fetch('http://localhost:8080/raca/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaRaca)
    })
        .then(response => {
            // Verifica se a resposta não foi bem sucedida
            if (!response.ok) {
                // Se houver um erro, analisa o corpo da resposta como JSON
                return response.json().then(errorBody => {
                    // Exibe o erro completo do backend no console
                    console.error("Erro no backend: ", errorBody);
                    // Lança um erro com a mensagem do backend ou uma mensagem genérica
                    throw new Error(errorBody.message || "Erro ao criar a raça. Verifique os logs do servidor");
                });
            }
            // Se a resposta for bem-sucedida, retorna a resposta como JSON
            return response.json();
        })
        .then(racaCriada => {
            // Exibe mensagem de sucesso no console de depuração
            console.log('Raça criada:', racaCriada);
            //fecha o modal de nova raça
            fecharModalNovaRaca();
            // Exibe mensagem de sucesso para o usuário
            alert('Raça Criada com sucesso!');
            // Atualiza a lista de raças no formulário principal
            carregarRacas();

            // Limpa os campos do modal de raça após o sucesso
            document.getElementById('descricaoRaca').value = ''; // Limpa o campo de descrição de raça

            const especieSelect = document.getElementById('especieRaca');
            if (especieSelect) {
                especieSelect.selectedIndex = 0; // Limpa o select de especie
            } else {
                console.error("Select de espécie não encontrado")
            }

            document.getElementById('porteRaca').selectedIndex = 0; // Limpa o select de porte


            // Recarrega as raças na página de cadastro de animal
            carregarRacasPorEspecie();
        })
        .catch(error => {
            // Em caso de erro, exibe a mensagem de erro para o usuário
            console.error('Erro ao criar raça:', error);
            alert(error.message); // Exibe a mensagem de erro do backend ou a mensagem genérica
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
    selectRaca.innerHTML = '<option value="">Selecione</option>'; // Limpa o select de raças

    if (isNaN(especieId) || especieId === '') {
        return;
    }

    fetch(`http://localhost:8080/raca/get/especie/${especieId}`)
        .then(response => {
             if (!response.ok) {
                 return response.json().then(err => {
                    throw new Error(err.message || 'Erro na solicitação');
                 });
             }
             return response.json();
         })        
        .then(racas => {
            if (Array.isArray(racas)) {
                racas.sort((a, b) => a.descricaoRaca.localeCompare(b.descricaoRaca));

                racas.forEach(raca => {
                    const option = document.createElement('option');
                    option.value = raca.id;
                    option.textContent = raca.descricaoRaca;
                    selectRaca.appendChild(option);
                });

            } else {
                console.error("A resposta da API não é um array de raças:", racas);
            }

            if (!document.querySelector('.botao-excluir-raca')) {
                const btnExcluirRaca = document.createElement('button');
                btnExcluirRaca.textContent = 'Excluir';
                btnExcluirRaca.classList.add('botao-excluir-raca');
                btnExcluirRaca.addEventListener('click', () => {
                    const racaSelecionadaId = selectRaca.value;
                    if (racaSelecionadaId !== "") {
                        if (confirm(`Tem certeza que deseja excluir a raça selecionada?`)) {
                            excluirRaca(racaSelecionadaId);
                        }
                    } else {
                        alert("Por favor, selecione uma raça para excluir.");
                    }
                });
                selectRaca.parentNode.insertBefore(btnExcluirRaca, selectRaca.nextSibling);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar raças por espécie:', error);
            alert(error.message);
        });
}


// --- FIM DA LISTA DE RAÇAS ---

/**
 * Carrega as opções de sexo no grupo de radio buttons.
 */
function carregarSexos() {
    const radioMacho = document.getElementById('sexoMacho');
    const radioFemea = document.getElementById('sexoFemea');
    const radioDesconhecido = document.getElementById('sexoDesconhecido'); // Adicionado input para "DESCONHECIDO"

    // Define o valor default como femea
    radioFemea.checked = true;

    // Verifica se os radios buttons existem
    if (!radioMacho || !radioFemea || !radioDesconhecido) {
        console.error("Radio Buttons de sexo não encontrados");
        return; // Encerra a função se os elementos não forem encontrados
    }
    
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
 * Preenche o formulário de animal com os dados de um animal para edição.
 */
function preencherFormulario(animal) {
    document.getElementById('animalId').value = animal.id;
    document.getElementById('nome').value = animal.nome;
    document.getElementById('idade').value = animal.idade;
    document.getElementById('raca').value = animal.raca.id;

    // Define o valor do radio button sexo de acordo com o animal
    const sexoRadios = document.querySelectorAll('input[name="sexo"]');
    sexoRadios.forEach(radio => {
        radio.checked = radio.value === animal.sexo;
    });

    document.getElementById('comportamento').value = animal.comportamento.id;
    document.getElementById('cirurgia').value = animal.cirurgia ? animal.cirurgia.id : '';
    document.getElementById('isCastrado').checked = animal.isCastrado;
    document.getElementById('isVermifugado').checked = animal.isVermifugado;
    document.getElementById('isVacinado').checked = animal.isVacinado;
    document.getElementById('isCirurgia').checked = animal.isCirurgia; // Define o valor do checkbox isCirurgia
    document.getElementById('descricaoAnimal').value = animal.descricaoAnimal;
    document.getElementById('foto').value = animal.foto;
    document.getElementById('animalForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    // Limpa a seleção do radio button sexo
    const sexoRadios = document.querySelectorAll('input[name="sexo"]');
    sexoRadios.forEach(radio => radio.checked = false);


    document.getElementById('comportamento').value = '';
    document.getElementById('cirurgia').value = '';
    document.getElementById('isCastrado').checked = false;
    document.getElementById('isVermifugado').checked = false;
    document.getElementById('isVacinado').checked = false;
    document.getElementById('isCirurgia').checked = false; // Limpa o checkbox isCirurgia
    document.getElementById('descricaoAnimal').value = '';
    document.getElementById('foto').value = '';
}


/**
 * Exibe os animais em cards na página.
 * @param {Array} animais - A lista de animais a ser exibida.
 */
function exibirAnimaisEmCards(animais) {
    const animalGallery = document.getElementById('animalGallery');
    animalGallery.innerHTML = ''; // Limpa a galeria

    animais.forEach(animal => {
        // ... (código para criar os cards dos animais - sem alterações em relação à versão anterior)
    });
}