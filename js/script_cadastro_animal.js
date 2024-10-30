/**
 * Script para gerenciar o cadastro de animais, incluindo interação com o backend,
 * manipulação de modais, validações e exibição dos animais cadastrados.
 */

// --- FUNÇÕES PARA CARREGAR DADOS ---

/**
 * Carrega as espécies do backend e preenche o select de espécies.
 */
function carregarEspecies() {
    console.log("Carregando espécies...");
    fetch('http://localhost:8080/especie/get/all')
        .then(response => {
            if (!response.ok) {
                console.error("Erro na resposta da API:", response.status, response.statusText);
                return response.json().then(errorBody => {
                    throw new Error(errorBody.message || 'Erro ao obter dados das espécies.');
                });
            }
            console.log("Resposta da API (espécies):", response);
            return response.json();
        })
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

            // Chama carregarRacasPorEspecie após carregar as espécies para popular o select de raças
            carregarRacasPorEspecie();
        })
        .catch(error => {
            console.error("Erro na requisição fetch (espécies):", error);
            alert(error.message);
        });
}

/**
 * Carrega as raças do backend e preenche o select de raças, filtradas por espécie.
 */
function carregarRacas() {
    console.log("Carregando raças...");
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
        return; // Se nenhuma espécie selecionada, não faz nada.
    }

    console.log("Carregando raças por espécie...", especieId);

    fetch(`http://localhost:8080/raca/get/especie/${especieId}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Erro na solicitação de raças por espécie.');
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
 * Salva uma nova espécie no backend através de uma requisição POST.
 * Exibe mensagens de sucesso ou erro para o usuário e atualiza a lista de espécies.
 */
function salvarNovaEspecie() {
    // 1. Obtém a descrição da espécie do input
    const descricaoEspecie = document.getElementById('descricaoEspecie').value;

    // 2. Valida se a descrição foi preenchida
    if (!descricaoEspecie) {
        alert("Por favor, preencha a descrição da espécie.");
        return;
    }

    // 3. Cria o objeto JSON para a nova espécie
    const novaEspecie = {
        descricaoEspecie: descricaoEspecie
    };

    // 4. Log para depuração
    console.log("JSON para criar espécie:", JSON.stringify(novaEspecie));

    // 5. Faz a requisição POST para o backend
    fetch('http://localhost:8080/especie/criar', { // Verifique se a URL está correta
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaEspecie)
    })
        .then(response => {
            if (!response.ok) {
                // Em caso de erro, analisa o JSON da resposta para obter a mensagem do backend
                return response.json().then(errorBody => {
                    console.error("Erro do backend (espécie):", errorBody);
                    throw new Error(errorBody.message || "Erro ao criar espécie. Verifique os logs do servidor.");
                });
            }
            return response.json(); // Analisa o JSON da resposta em caso de sucesso
        })
        .then(especieCriada => {
            // 6. Sucesso na criação da espécie
            console.log('Espécie criada:', especieCriada);
            fecharModalNovaEspecie(); // Fecha o modal de nova espécie
            alert('Espécie criada com sucesso!'); // Alerta de sucesso para o usuário
            carregarEspecies(); // Recarrega as espécies no select
            // Limpa o campo de descrição da espécie no modal.
            document.getElementById('descricaoEspecie').value = '';


        })
        .catch(error => {
            // 7. Erro na requisição ou na resposta do backend
            console.error('Erro ao criar espécie:', error);
            alert(error.message); // Exibe a mensagem de erro para o usuário
        });
}

/**
 * Salva uma nova raça no backend através de uma requisição POST.
 * Exibe mensagens de sucesso ou erro para o usuário e atualiza a lista de raças.
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

    // Cria o objeto JSON para a nova raça
    const novaRaca = {
        descricaoRaca: descricaoRaca,
        porteId: porteId,
        especieId: especieId
    };

    // Exibe o JSON no console para depuração
    console.log("JSON para criar raça:", JSON.stringify(novaRaca));

    // Faz a requisição POST para o backend
    fetch('http://localhost:8080/raca/criar', { // Substitua pela URL correta, se necessário
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
            fecharModalNovaRaca(); // Fecha o modal
            alert('Raça criada com sucesso!'); // Exibe alerta de sucesso
            carregarRacas(); // Recarrega as raças no select principal

            // Limpa os campos do modal após o sucesso
            document.getElementById('descricaoRaca').value = '';
            const especieSelect = document.getElementById('especieRaca');
            if (especieSelect) {
                especieSelect.selectedIndex = 0; // Reseta o select de espécie
            } else {
                console.error("Select de espécie não encontrado");
            }
            document.getElementById('porteRaca').selectedIndex = 0; // Reseta o select de porte

            carregarRacasPorEspecie(); // Recarrega as raças na página principal
        })
        .catch(error => {
            console.error("Erro ao criar raça:", error);
            alert(error.message);
        });
}

/**
 * Salva um novo comportamento no backend através de uma requisição POST.
 * Exibe mensagens de sucesso ou erro para o usuário e atualiza a lista de comportamentos.
 */
function salvarNovoComportamento() {
    // Obtém a descrição do comportamento do campo de input
    const descricaoComportamento = document.getElementById('descricaoComportamento').value;

    // Valida se a descrição foi preenchida
    if (!descricaoComportamento) {
        alert("Por favor, preencha a descrição do comportamento.");
        return;
    }

    // Cria o objeto JSON para o novo comportamento
    const novoComportamento = {
        descricaoComportamento: descricaoComportamento
    };

    // Log do JSON para depuração
    console.log("JSON para criar comportamento:", JSON.stringify(novoComportamento));

    // Faz a requisição POST para o backend
    fetch('http://localhost:8080/comportamento/criar', { // Certifique-se de que a URL está correta
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoComportamento)
    })
        .then(response => {
            if (!response.ok) {
                // Lida com erros da resposta
                return response.json().then(errorBody => {
                    console.error("Erro do backend (comportamento):", errorBody);
                    throw new Error(errorBody.message || "Erro ao criar comportamento. Verifique os logs do servidor.");
                });
            }
            return response.json(); // Analisa a resposta JSON em caso de sucesso
        })
        .then(comportamentoCriado => {
            console.log('Comportamento criado:', comportamentoCriado);

            // Fecha o modal de novo comportamento
            fecharModalNovoComportamento();

            // Exibe um alerta de sucesso para o usuário
            alert('Comportamento criado com sucesso!');

            // Recarrega os comportamentos no select
            carregarComportamentos();

            // Limpa o campo de descrição do comportamento no modal
            document.getElementById('descricaoComportamento').value = '';
        })
        .catch(error => {
            console.error('Erro ao criar comportamento:', error);
            // Exibe um alerta de erro para o usuário com a mensagem do erro
            alert(error.message);
        });
}

/**
 * Salva uma nova cirurgia no backend através de uma requisição POST.
 * Exibe mensagens de sucesso ou erro para o usuário e atualiza a lista de cirurgias.
 */
function salvarNovaCirurgia() {
    // 1. Obtém a descrição da cirurgia do input
    const descricaoCirurgia = document.getElementById('descricaoCirurgia').value;

    // 2. Valida se a descrição foi preenchida
    if (!descricaoCirurgia) {
        alert("Por favor, preencha a descrição da cirurgia.");
        return;
    }

    // 3. Cria o objeto JSON para a nova cirurgia
    const novaCirurgia = {
        descricaoCirurgia: descricaoCirurgia
    };

    // 4. Log para depuração
    console.log("JSON para criar cirurgia:", JSON.stringify(novaCirurgia));

    // 5. Faz a requisição POST para o backend
    fetch('http://localhost:8080/cirurgia/criar', { // Verifique se a URL está correta
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaCirurgia)
    })
        .then(response => {
            if (!response.ok) {
                // Lida com a resposta de erro do backend
                return response.json().then(errorBody => {
                    console.error("Erro do backend (cirurgia):", errorBody);
                    throw new Error(errorBody.message || "Erro ao criar cirurgia. Verifique os logs do servidor.");
                });
            }
            return response.json(); // Analisa a resposta JSON em caso de sucesso
        })
        .then(cirurgiaCriada => {
            // 6. Sucesso na criação da cirurgia
            console.log('Cirurgia criada:', cirurgiaCriada);

            // Fecha o modal de nova cirurgia
            fecharModalNovaCirurgia();

            // Exibe um alerta de sucesso para o usuário
            alert('Cirurgia criada com sucesso!');

            // Recarrega as cirurgias no select
            carregarCirurgias();

            // Limpa o campo de descrição da cirurgia no modal
            document.getElementById('descricaoCirurgia').value = '';
        })
        .catch(error => {
            // 7. Trata erros na requisição ou na resposta
            console.error('Erro ao criar cirurgia:', error);
            alert(error.message); // Exibe a mensagem de erro para o usuário
        });

        /**
 * Salva um novo animal ou atualiza um animal existente, enviando os dados para o backend.
 * Realiza validações no frontend antes de enviar a requisição e trata a resposta do servidor.
 */
function salvarAnimal() {
    // 1. Obtém os valores dos campos do formulário
    const animalId = document.getElementById('animalId').value;
    const nome = document.getElementById('nome').value;
    let idade = document.getElementById('idade').value;
    const racaId = parseInt(document.getElementById('raca').value);
    const sexo = document.querySelector('input[name="sexo"]:checked').value;
    const comportamentoId = parseInt(document.getElementById('comportamento').value);
    let cirurgiaId = document.getElementById('cirurgia').value;
    const isCastrado = document.getElementById('isCastrado').checked;
    const isVermifugado = document.getElementById('isVermifugado').checked;
    const isVacinado = document.getElementById('isVacinado').checked;
    const descricaoAnimal = document.getElementById('descricaoAnimal').value;
    const foto = document.getElementById('foto').value;

    // 2. Validações
    if (!sexo) {
        alert("Por favor, selecione o sexo do animal.");
        return;
    }

    if (sexo !== 'MACHO' && sexo !== 'FEMEA' && sexo !== 'DESCONHECIDO') {
        alert("Opção de sexo inválida.");
        return;
    }

    if (isNaN(idade) || idade === "" || idade < 0) {
        alert("Por favor, preencha a idade corretamente. O valor deve ser um número não-negativo.");
        return;
    }
    idade = parseFloat(idade);

    if (!nome || !racaId || !comportamentoId || !descricaoAnimal || !foto) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (cirurgiaId !== "" && !isNaN(cirurgiaId)) {
        cirurgiaId = parseInt(cirurgiaId);
    } else {
        cirurgiaId = null;
    }

    // 3. Cria o objeto JSON para o novo animal ou atualização
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
        foto
    };

    // 4. Log para depuração
    console.log("Dados do animal sendo enviados:", dadosAnimal);

    // 5. Determina o método (POST ou PUT) e a URL da requisição
    const metodo = animalId ? 'PUT' : 'POST';
    const url = animalId ? `http://localhost:8080/animal/put/${animalId}` : 'http://localhost:8080/animal/criar';

    // 6. Faz a requisição fetch
    fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAnimal)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorBody => {
                    console.error("Erro do backend:", errorBody); // Log do erro detalhado do backend
                    throw new Error(errorBody.message || 'Erro na requisição. Verifique os logs do servidor.');
                });
            }
            return response.json();
        })
        .then(animalSalvo => {
            console.log('Animal salvo com sucesso:', animalSalvo);
            carregarAnimais(); // Recarrega a lista de animais
            limparFormulario(); // Limpa o formulário
            alert(animalId ? 'Animal atualizado com sucesso!' : 'Animal criado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao salvar animal:', error);
            alert(error.message); // Exibe um alerta com a mensagem de erro
        });
}
}


/**
 * Carrega os animais do backend e os exibe em cards.
 */
function carregarAnimais() {
    fetch('http://localhost:8080/animal/get/all')
        .then(response => {
            if (!response.ok) {
                console.error("Erro na resposta da API (animais):", response.status, response.statusText);
                return response.json().then(errorBody => {
                    throw new Error(errorBody.message || 'Erro ao obter dados dos animais.');
                });
            }

            console.log("Resposta da API (animais):", response);
            return response.json();
        })
        .then(animais => {
            exibirAnimaisEmCards(animais);
        })
        .catch(error => {
            console.error("Erro na requisição fetch (animais):", error);
            const animalGallery = document.getElementById('animalGallery');

            animalGallery.innerHTML = `<p>Erro ao carregar os animais: ${error.message}. Por favor, verifique o console e o backend.</p>`;
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

    const sexoRadios = document.querySelectorAll('input[name="sexo"]');
    sexoRadios.forEach(radio => {
        radio.checked = radio.value === animal.sexo;
    });

    document.getElementById('comportamento').value = animal.comportamento.id;
    document.getElementById('cirurgia').value = animal.cirurgia ? animal.cirurgia.id : '';
    document.getElementById('isCastrado').checked = animal.isCastrado;
    document.getElementById('isVermifugado').checked = animal.isVermifugado;
    document.getElementById('isVacinado').checked = animal.isVacinado;
    document.getElementById('isCirurgia').checked = animal.isCirurgia;
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
                return response.json().then(errorBody => {
                    throw new Error(errorBody.message || 'Erro na requisição');
                });
            }
            console.log('Animal excluído com sucesso');
            carregarAnimais();
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

    const sexoRadios = document.querySelectorAll('input[name="sexo"]');
    sexoRadios.forEach(radio => radio.checked = false);


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
 * Exibe os animais em cards na página.
 * @param {Array} animais - A lista de animais a ser exibida.
 */
function exibirAnimaisEmCards(animais) {
    const animalGallery = document.getElementById('animalGallery');
    animalGallery.innerHTML = ''; // Limpa a galeria antes de exibir os animais

    // Verifica se o array de animais é válido e não está vazio
    if (!animais || !Array.isArray(animais) || animais.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.textContent = 'Nenhum animal encontrado.';
        animalGallery.appendChild(mensagem);
        return; // Sai da função se não houver animais
    }

    animais.forEach(animal => {
        // Cria o card do animal
        const card = document.createElement('div');
        card.classList.add('animal-card');

        // Cria a imagem do animal
        const img = document.createElement('img');
        img.src = animal.foto || 'placeholder.jpg'; // Usa uma imagem placeholder se não houver foto
        img.alt = animal.nome;
        img.style.maxWidth = '100%'; // Garante que a imagem não vai estourar o card
        img.style.maxHeight = '200px'; // Define uma altura máxima para a imagem
        card.appendChild(img); // Adiciona a imagem ao card

        // Cria o conteúdo do card
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
            <p>Teve Cirurgia: ${animal.isCirurgia ? 'Sim' : 'Não'}</p>
            <p>Descrição: ${animal.descricaoAnimal}</p>
        `;
        card.appendChild(content); // Adiciona o conteúdo ao card


        // Cria os botões de ação (Editar, Excluir, Adotado)
        const botoesContainer = document.createElement('div'); // Container para os botões

        // Botão Editar
        const btnEditar = document.createElement('button');
        btnEditar.classList.add('botao-acao', 'botao-editar');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => preencherFormulario(animal));
        botoesContainer.appendChild(btnEditar);

        // Botão Excluir
        const btnExcluir = document.createElement('button');
        btnExcluir.classList.add('botao-acao', 'botao-excluir');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.addEventListener('click', () => excluirAnimal(animal.id));
        botoesContainer.appendChild(btnExcluir);

        // Botão Adotado
        const btnAdotado = document.createElement('button');
        btnAdotado.classList.add('botao-acao', 'botao-adotado');
        btnAdotado.textContent = 'Adotado';
        btnAdotado.addEventListener('click', () => {
            // Lógica para marcar como adotado (implementar)
            alert(`Implementar lógica para marcar o animal ${animal.nome} como adotado`);
        });
        botoesContainer.appendChild(btnAdotado);

        // Adiciona os botões ao card
        content.appendChild(botoesContainer);

        // Adiciona o card à galeria
        animalGallery.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Carrega dados iniciais ao carregar a página
    carregarEspecies();
    carregarRacas();
    carregarComportamentos();
    carregarCirurgias();
    carregarAnimais();
    carregarSexos();

    // --- Event Listener para o formulário de cadastro de animal ---
    const formAnimal = document.getElementById('formAnimal');
    if (formAnimal) {
        formAnimal.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário
            salvarAnimal();
        });
    } else {
        console.error("Formulário 'formAnimal' não encontrado!");
    }

    // --- Event Listener para o select de espécie ---
    const especieSelect = document.getElementById('especie');
    if (especieSelect) {
        especieSelect.addEventListener('change', carregarRacasPorEspecie);
    } else {
        console.error("Select 'especie' não encontrado!");
    }

    // --- Event Listeners para abrir os modais ---
    const btnNovaEspecie = document.getElementById('btnNovaEspecie');
    if (btnNovaEspecie) {
        btnNovaEspecie.addEventListener('click', abrirModalNovaEspecie);
    } else {
        console.error("Botão 'btnNovaEspecie' não encontrado!");
    }

    const btnNovaRaca = document.getElementById('btnNovaRaca');
    if (btnNovaRaca) {
        btnNovaRaca.addEventListener('click', () => {
            abrirModalNovaRaca();
            carregarEspeciesNoModalRaca();
            carregarPortesNoModalRaca();
        });
    } else {
        console.error("Botão 'btnNovaRaca' não encontrado!");
    }

    const btnNovoComportamento = document.getElementById('btnNovoComportamento');
    if (btnNovoComportamento) {
        btnNovoComportamento.addEventListener('click', abrirModalNovoComportamento);
    } else {
        console.error("Botão 'btnNovoComportamento' não encontrado!");
    }

    const btnNovaCirurgia = document.getElementById('btnNovaCirurgia');
    if (btnNovaCirurgia) {
        btnNovaCirurgia.addEventListener('click', abrirModalNovaCirurgia);
    } else {
        console.error("Botão 'btnNovaCirurgia' não encontrado!");
    }

   
});

// Funções para abrir os modais

/**
 * Abre o modal para adicionar uma nova espécie.
 */
function abrirModalNovaEspecie() {
    const modal = document.getElementById('modalNovaEspecie');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Modal 'modalNovaEspecie' não encontrado!");
    }
}

/**
 * Abre o modal para adicionar uma nova raça.
 */
function abrirModalNovaRaca() {
    const modal = document.getElementById('modalNovaRaca');
    if (modal) {
        modal.style.display = 'block';
        carregarEspeciesNoModalRaca(); // Carrega as espécies no select do modal
        carregarPortesNoModalRaca();   // Carrega os portes no select do modal
    } else {
        console.error("Modal 'modalNovaRaca' não encontrado!");
    }
}

/**
 * Abre o modal para adicionar um novo comportamento.
 */
function abrirModalNovoComportamento() {
    const modal = document.getElementById('modalNovoComportamento');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Modal 'modalNovoComportamento' não encontrado!");
    }
}

/**
 * Abre o modal para adicionar uma nova cirurgia.
 */
function abrirModalNovaCirurgia() {
    const modal = document.getElementById('modalNovaCirurgia');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Modal 'modalNovaCirurgia' não encontrado!");
    }
}


/**
 * Carrega as espécies disponíveis no backend e as adiciona ao select do modal de nova raça.
 */
function carregarEspeciesNoModalRaca() {
    fetch('http://localhost:8080/especie/get/all')
        .then(response => response.json())
        .then(especies => {
            const selectEspecieRaca = document.getElementById('especieRaca');
            if (selectEspecieRaca) {
                selectEspecieRaca.innerHTML = ''; // Limpa o select antes de adicionar opções

                especies.forEach(especie => {
                    const option = document.createElement('option');
                    option.value = especie.id;
                    option.textContent = especie.descricaoEspecie;
                    selectEspecieRaca.appendChild(option);
                });
            } else {
                console.error("Select 'especieRaca' não encontrado no modal!");
            }
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
            if (selectPorteRaca) {
                selectPorteRaca.innerHTML = '';

                portes.forEach(porte => {
                    const option = document.createElement('option');
                    option.value = porte.id;
                    option.textContent = porte.descricaoPorte;
                    selectPorteRaca.appendChild(option);
                });
            } else {
                console.error("Select 'porteRaca' não encontrado no modal!");
            }
        })
        .catch(error => {
            console.error('Erro ao carregar portes para o modal de raça:', error);
            alert('Erro ao carregar portes. Verifique o console.');
        });
}

// Funções para fechar os modais

/**
 * Fecha o modal de nova espécie e limpa o formulário.
 */
function fecharModalNovaEspecie() {
    const modal = document.getElementById('modalNovaEspecie');
    const form = document.getElementById('formNovaEspecie');

    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Modal 'modalNovaEspecie' não encontrado!");
    }

    if (form) {
        form.reset(); // Limpa os campos do formulário
    } else {
        console.error("Formulário 'formNovaEspecie' não encontrado!");
    }
}

/**
 * Fecha o modal de nova raça e limpa o formulário.
 */
function fecharModalNovaRaca() {
    const modal = document.getElementById('modalNovaRaca');
    const form = document.getElementById('formNovaRaca');

    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Modal 'modalNovaRaca' não encontrado!");
    }

    if (form) {
        form.reset(); // Limpa os campos do formulário
    } else {
        console.error("Formulário 'formNovaRaca' não encontrado!");
    }
}

/**
 * Fecha o modal de novo comportamento e limpa o formulário.
 */
function fecharModalNovoComportamento() {
    const modal = document.getElementById('modalNovoComportamento');
    const form = document.getElementById('formNovoComportamento');

    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Modal 'modalNovoComportamento' não encontrado!");
    }

    if (form) {
        form.reset(); // Limpa os campos do formulário
    } else {
        console.error("Formulário 'formNovoComportamento' não encontrado!");
    }
}


/**
 * Fecha o modal de nova cirurgia e limpa o formulário.
 */
function fecharModalNovaCirurgia() {
    const modal = document.getElementById('modalNovaCirurgia');
    const form = document.getElementById('formNovaCirurgia');

    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Modal 'modalNovaCirurgia' não encontrado!");
    }

    if (form) {
        form.reset(); // Limpa os campos do formulário
    } else {
        console.error("Formulário 'formNovaCirurgia' não encontrado!");
    }
}


 // --- Event listeners para os formulários dos modais ---
 const formNovaEspecie = document.getElementById('formNovaEspecie');
 if (formNovaEspecie) {
     formNovaEspecie.addEventListener('submit', (event) => {
         event.preventDefault();
         salvarNovaEspecie();
     });
 } else {
     console.error("Formulário 'formNovaEspecie' não encontrado!");
 }

 const formNovaRaca = document.getElementById('formNovaRaca');
 if (formNovaRaca) {
     formNovaRaca.addEventListener('submit', (event) => {
         event.preventDefault();
         salvarNovaRaca();
     });
 } else {
     console.error("Formulário 'formNovaRaca' não encontrado!");
 }

 const formNovoComportamento = document.getElementById('formNovoComportamento');
 if (formNovoComportamento) {
     formNovoComportamento.addEventListener('submit', (event) => {
         event.preventDefault();
         salvarNovoComportamento();
     });
 } else {
     console.error("Formulário 'formNovoComportamento' não encontrado!");
 }

 const formNovaCirurgia = document.getElementById('formNovaCirurgia');
 if (formNovaCirurgia) {
     formNovaCirurgia.addEventListener('submit', (event) => {
         event.preventDefault();
         salvarNovaCirurgia();
     });
 } else {
     console.error("Formulário 'formNovaCirurgia' não encontrado!");
 }

