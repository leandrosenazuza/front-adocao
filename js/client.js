function realizaRequest(verbo, URL, body) {
    fetch(URL, {
        method: verbo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }
        return response.json();  // Se a resposta for em JSON, você pode usar .json() em vez de .text()
    })
    .then(data => {
        console.log("Resposta do servidor:", data);
        // Aqui você pode adicionar lógica para lidar com a resposta recebida, como redirecionamento
    })
    .catch(error => {
        console.error("Erro na requisição:", error);
        // Adicionar lógica para tratar o erro, como exibir uma mensagem ao usuário
    });
}
