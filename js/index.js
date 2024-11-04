fetch('http://localhost:8080/animal/animaisAdocao')
    .then(response => response.json())
    .then(data => {
        document.getElementById('animais-para-adocao').textContent = data.numeroAnimalAdocao;
    })
.catch(error => {
    console.error('Erro ao buscar o número de animais para adoção:', error);
});