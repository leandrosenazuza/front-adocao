import rotas from './rotas.js'; 

document.addEventListener("DOMContentLoaded", function() {
    fetch(rotas.animal.buscaTodos)
        .then(response => response.json())
        .then(data => {
            const cardContainer = document.getElementById('card-container');
            cardContainer.innerHTML = ""; // Limpa o contêiner antes de adicionar novos cards
            data.forEach(animal => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <img src="${animal.foto}" alt="${animal.nome}">
                    <h3>${animal.nome}</h3>
                    <p>Idade: ${animal.idade} anos</p>
                    <p>Raça: ${animal.raca.nome}</p>
                    <p>${animal.descricaoAnimal}</p>
                    <p>Castrado: ${animal.isCastrado ? "Sim" : "Não"}</p>
                    <p>Vermifugado: ${animal.isVermifugado ? "Sim" : "Não"}</p>
                    <p>Vacinado: ${animal.isVacinado ? "Sim" : "Não"}</p>
                    <a href="#" class="adopt-button">Quero adotar!</a>
                `;
                cardContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Erro ao buscar animais:', error));
});
