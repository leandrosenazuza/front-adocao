document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Obtém os valores dos campos de entrada
    const username = document.getElementById('usarioSistema').value;
    const password = document.getElementById('senha').value;

    // Cria o objeto com os dados no formato requerido
    const data = {
        usarioSistema: username,
        senha: password
    };

    // Envia a requisição POST usando fetch
    fetch('http://localhost:8080/usuario/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Converte o objeto em JSON
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Erro na solicitação');
    })
    .then(result => {
        // Lida com o resultado da resposta
        console.log('Sucesso:', result);
        alert('Login bem-sucedido!');
    })
    .catch(error => {
        // Lida com quaisquer erros
        console.error('Erro:', error);
        alert('Falha no login! Verifique suas credenciais.');
    });
});
