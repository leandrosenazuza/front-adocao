var API_BASE_URL = `https://21d625ab07a06090387fcb2d756378e3.serveo.net`;

fetch(API_BASE_URL + `/animal/animaisAdocao`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('animais-para-adocao').textContent = data.numeroAnimalAdocao;
    })
.catch(error => {
    console.error('Erro ao buscar o número de animais para adoção:', error);
});