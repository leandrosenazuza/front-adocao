const ambiente = "http://localhost:8080";


const rotas = {
    animal: {
        buscaTodos: ambiente + '/animal/all',
        buscaUm: ambiente + '/animal/'
    },
    usuario: {
        login: ambiente + '/login',
        cadastrarUsuario: ambiente
    }
};

export default rotas;
