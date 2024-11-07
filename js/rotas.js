var API_BASE_URL = `https://21d625ab07a06090387fcb2d756378e3.serveo.net`;


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
