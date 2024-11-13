var API_BASE_URL = `https://api-adocao-production.up.railway.app`;

//var API_BASE_URL = `http://localhost:8080`;


const rotas = {
    animal: {
        buscaTodos: API_BASE_URL + '/animal/all',
        buscaUm: API_BASE_URL + '/animal/'
    },
    usuario: {
        login: API_BASE_URL + '/login',
        cadastrarUsuario: API_BASE_URL
    }
};

export default rotas;
