function realizarLogin(event) {
    //event.preventDefault();  
    let url = "http://localhost:8080/usuario/login";
    let usuarioSistema = document.getElementById("usuarioSistema").value;
    let senha = document.getElementById("senha").value;

    const requestLogin = new RequestLogin(usuarioSistema, senha);
    realizaRequest("POST", url, requestLogin);
}
