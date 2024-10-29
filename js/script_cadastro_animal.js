/**
 * Script para gerenciar o cadastro de animais, incluindo interação com o backend,
 * manipulação de modais, validações e exibição dos animais cadastrados.
 */

// --- FUNÇÕES PARA CARREGAR DADOS ---

/**
 * Carrega as espécies do backend e preenche o select de espécies.
 * Declarada antes do DOMContentLoaded para evitar erros de referência.
 */
function carregarEspecies() {
    fetch('http://localhost:8080/especie/get/all')
        .then(response => response.json())
        .then(especies => {
            especies.sort((a, b) => a.descricaoEspecie.localeCompare(b.descricaoEspecie));
            const selectEspecie = document.getElementById('especie');
            selectEspecie.innerHTML = '<option value="">Selecione</option>'; // Limpa o select

            especies.forEach(especie => {
                const option = document.createElement('option');
                option.value = especie.id;
                option.textContent = especie.descricaoEspecie;
                selectEspecie.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar espécies:', error);
            alert('Erro ao carregar espécies. Por favor, verifique o console e o backend.');
        });
}

/**
 * Carrega as raças do backend e preenche o select de raças, filtradas por espécie.
 */
function carregarRacas() {
    fetch('http://localhost:8080/raca/get/all')
        .then(response => response.json())
        .then(racas => {
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
 * Carrega as raças do backend com base na espécie selecionada e as exibe no select de raças.
 */
function carregarRacasPorEspecie() {
    const especieId = parseInt(document.getElementById('especie').value);
    const selectRaca = document.getElementById('raca');
    selectRaca.innerHTML = '<option value="">Selecione</option>'; // Limpa o select

    if (isNaN(especieId) || especieId === '') {
        return;
    }

    fetch(`http://localhost:8080/raca/get/especie/${especieId}`)
        .then(response => response.json())
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
                alert("Erro ao carregar raças. A resposta da API não é um array.");
            }

            // Adiciona botão "Excluir Raça" (apenas uma vez)
            if (!document.querySelector('.botao-excluir-raca')) {
                const btnExcluirRaca = document.createElement('button');
                btnExcluirRaca.textContent = 'Excluir Raça';
                btnExcluirRaca.classList.add('botao-excluir-raca');
                btnExcluirRaca.addEventListener('click', () => {
                    const racaSelecionadaId = selectRaca.value;
                    if (racaSelecionadaId !== "") {
                        if (confirm('Tem certeza que deseja excluir a raça?')) {
                            excluirRaca(racaSelecionadaId);
                        }
                    } else {
                        alert("Selecione uma raça para excluir.");
                    }
                });
                selectRaca.parentNode.insertBefore(btnExcluirRaca, selectRaca.nextSibling);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar raças por espécie:', error);
            alert(error.message); // Exibe a mensagem de erro da requisição fetch
        });
}


/**
 * Exclui uma raça do backend.
 * @param {number} racaId - O ID da raça a ser excluída.
 */
function excluirRaca(racaId) {
    fetch(`http://localhost:8080/raca/delete/${racaId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                console.log('Raça excluída com sucesso!');
                carregarRacasPorEspecie(); // Recarrega as raças após a exclusão
            } else {
                return response.json().then(errorBody => {
                    console.error("Erro ao excluir raça:", errorBody);
                    throw new Error(errorBody.message || 'Erro ao excluir raça');
                });
            }
        })
        .catch(error => {
            console.error('Erro ao excluir raça:', error);
            alert(error.message || 'Erro ao excluir raça. Por favor, tente novamente.');
        });
}

/**
 * Carrega as opções de sexo e define o valor padrão.
 */
function carregarSexos() {
    const radioMacho = document.getElementById('sexoMacho');
    const radioFemea = document.getElementById('sexoFemea');
    const radioDesconhecido = document.getElementById('sexoDesconhecido');

    // Define "Fêmea" como sexo padrão
    radioFemea.checked = true;

    // Valida se os radio buttons existem
    if (!radioMacho || !radioFemea || !radioDesconhecido) {
        console.error("Radio buttons de sexo não encontrados!");
    }
}

/**
 * Carrega os comportamentos do backend e preenche o select de comportamentos.
 */
function carregarComportamentos() {
    fetch('http://localhost:8080/comportamento/get/all')
        .then(response => response.json())
        .then(comportamentos => {
            // Ordena os comportamentos em ordem alfabética
            comportamentos.sort((a, b) => a.descricaoComportamento.localeCompare(b.descricaoComportamento));

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
 * Carrega as cirurgias do backend e preenche o select de cirurgias.
 */
function carregarCirurgias() {
    fetch('http://localhost:8080/cirurgia/get/all')
        .then(response => response.json())
        .then(cirurgias => {
            // Ordena as cirurgias em ordem alfabética
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
            carregarEspecies(); // Recarrega as espécies
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
    const porteId = parseInt(document.getElementById('porteRaca').value);
    const especieId = parseInt(document.getElementById('especieRaca').value);

    // Valida se os campos foram preenchidos
    if (!descricaoRaca || !porteId || !especieId) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const novaRaca = {
        descricaoRaca,
        porteId,
        especieId
    };

    console.log("JSON para criar raça:", JSON.stringify(novaRaca));

    fetch('http://localhost:8080/raca/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaRaca)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorBody => {
                    console.error("Erro do backend:", errorBody);
                    throw new Error(errorBody.message || "Erro ao criar raça. Verifique os logs do servidor.");
                });
            }
            return response.json();
        })
        .then(racaCriada => {
            console.log('Raça criada:', racaCriada);
            fecharModalNovaRaca();
            alert('Raça criada com sucesso!');
            carregarRacas(); // Recarrega as raças
            // Limpa os campos do modal e atualiza selects
            document.getElementById('descricaoRaca').value = '';
            document.getElementById('especieRaca').selectedIndex = 0;
            document.getElementById('porteRaca').selectedIndex = 0;
            carregarRacasPorEspecie();
        })
        .catch(error => {
            console.error("Erro ao criar raça:", error);
            alert(error.message);
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
        carregarComportamentos(); // Recarrega comportamentos
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
            carregarCirurgias(); // Recarrega cirurgias
        })
        .catch(error => {
            console.error('Erro ao criar cirurgia:', error);
            alert('Erro ao criar cirurgia. Verifique o console.');
        });
}


/**
 * Salva um novo animal ou atualiza um animal existente.
 */
function salvarAnimal() {
    const animalId = document.getElementById('animalId').value;
    const nome = document.getElementById('nome').value;
    const idade = parseFloat(document.getElementById('idade').value);
    const racaId = parseInt(document.getElementById('raca').value);
    const comportamentoId = parseInt(document.getElementById('comportamento').value);
    let cirurgiaId = document.getElementById('cirurgia').value;

    if (cirurgiaId !== "" && !isNaN(cirurgiaId)) {
        cirurgiaId = parseInt(cirurgiaId)
    } else {
        cirurgiaId = null
    }

    const isCastrado = document.getElementById('isCastrado').checked;
    const isVermifugado = document.getElementById('isVermifugado').checked;
    const isVacinado = document.getElementById('isVacinado').checked;
    const isCirurgia = document.getElementById('isCirurgia').checked;
    const descricaoAnimal = document.getElementById('descricaoAnimal').value;
    const foto = document.getElementById('foto').value;

    const sexoSelecionado = document.querySelector('input[name="sexo"]:checked');
    if (!sexoSelecionado) {
        alert("Por favor, selecione o sexo do animal.");
        return;
    }
    const sexo = sexoSelecionado.value;
    if (sexo !== 'MACHO' && sexo !== 'FEMEA' && sexo !== 'DESCONHECIDO') {
        alert("Opção de sexo inválida.");
        return;
    }

    // Validação dos campos obrigatórios
    if (!nome || isNaN(idade) || idade === "" || idade < 0 || !racaId || !sexo || !comportamentoId || !descricaoAnimal || !foto) {
        alert("Por favor, preencha todos os campos obrigatórios corretamente.");
        return;
    }

    const dadosAnimal = {
        nome,
        idade,
        racaId,
        sexo,
        comportamentoId,
        cirurgiaId,
        isCastrado,
        isVermifugado,
        isVacinado,
        descricaoAnimal,
        foto,
    };

    console.log("Dados do animal sendo enviados:", dadosAnimal);

    const metodo = animalId ? 'PUT' : 'POST';
    const url = animalId ? `http://localhost:8080/animal/put/${animalId}` : 'http://localhost:8080/animal/criar';

    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAnimal)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorBody => {
                    throw new Error(errorBody.message || 'Erro na requisição. Verifique os logs do servidor.');
                });
            }
            return response.json();
        })
        .then(animalSalvo => {
            console.log('Animal salvo com sucesso:', animalSalvo);
            carregarAnimais(); // Recarrega a lista de animais
            limparFormulario();
            alert(animalId ? 'Animal atualizado com sucesso!' : 'Animal criado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao salvar animal:', error);
            alert(error.message);
        });
}


/**
 * Carrega os animais do backend e os exibe em cards.
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
    fetch(`http://localhost:8080/animal/delete/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                // Lidar com o erro da requisição
                return response.json().then(errorBody => {
                    throw new Error(errorBody.message || 'Erro na requisição');
                });
            }
            console.log('Animal excluído com sucesso');

            carregarAnimais(); // Recarrega a lista de animais

        })
        .catch(error => {
            console.error('Erro ao excluir animal:', error);
            alert(error.message || 'Erro ao excluir animal. Por favor, tente novamente.');
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
        const card = document.createElement('div');
        card.classList.add('animal-card');

        const img = document.createElement('img');
        img.src = animal.foto || 'placeholder.jpg'; // Imagem de placeholder se não houver
        img.alt = animal.nome;
        img.style.maxWidth = '100%'; // garante que a imagem não vai estourar o card
        img.style.height = '200px'; // altura da imagem
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
            <p>Teve Cirurgia: ${animal.isCirurgia ? 'Sim' : 'Não'}</p> <p>Descrição: ${animal.descricaoAnimal}</p>
        `;

        const btnEditar = document.createElement('button');
        btnEditar.classList.add('botao-acao', 'botao-editar');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => preencherFormulario(animal));
        content.appendChild(btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('botao-acao', 'botao-excluir');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => excluirAnimal(animal.id));
        content.appendChild(btnExcluir);

        // Novo Botão para marcar como adotado.
        const btnAdotado = document.createElement('button');
        btnAdotado.classList.add('botao-acao', 'botao-adotado');
        btnAdotado.textContent = 'Adotado';
        btnAdotado.addEventListener('click', () => {
            // Lógica para marcar como adotado (implementar)
            alert(`Implementar lógica para marcar o animal ${animal.nome} como adotado`);
        });
        content.appendChild(btnAdotado);

        card.appendChild(content);
        animalGallery.appendChild(card);
    });
}