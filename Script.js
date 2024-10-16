// Função para exibir a seção correta e ocultar as outras
function showSection(sectionId) {
    // Esconde todas as seções
    document.querySelectorAll('.content-section').forEach(function(section) {
        section.style.display = 'none';
    });

    // Exibe a seção correspondente ao ID passado como parâmetro
    document.getElementById(sectionId).style.display = 'block';

    // Atualiza a URL sem recarregar a página
    history.pushState(null, '', '#' + sectionId);
}

// Função para carregar a seção correta com base na URL ao carregar a página
function loadSectionFromHash() {
    const sectionId = location.hash.replace('#', '') || 'home';
    showSection(sectionId);
}

// Restaura o estado correto da página quando o usuário utiliza os botões de "voltar" ou "avançar" do navegador
window.onpopstate = function() {
    loadSectionFromHash();
};

// Mostra a seção correta ao carregar a página
window.onload = function() {
    loadSectionFromHash();
};
