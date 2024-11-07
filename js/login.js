var API_BASE_URL = `https://21d625ab07a06090387fcb2d756378e3.serveo.net`;

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const username = document.getElementById('usarioSistema').value;
    const password = document.getElementById('senha').value;

    const data = {
        usarioSistema: username,
        senha: password
    };

    fetch(API_BASE_URL + `/usuario/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Erro na solicitação');
    })
    .then(result => {
        console.log('Sucesso:', result);
        alert('Login bem-sucedido!');
        localStorage.setItem('isLoggedIn', 'true');
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Falha no login! Verifique suas credenciais.');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        document.getElementById('login-pendente').style.display = 'none';
        document.getElementById('login-sucesso').style.display = 'block';
    }else{
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
    
            localStorage.setItem('isLoggedIn', 'true');
    
            document.getElementById('login-pendente').style.display = 'none';
            document.getElementById('login-sucesso').style.display = 'block';
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
        document.getElementById('login-pendente').style.display = 'block';
        document.getElementById('login-sucesso').style.display = 'none';
    }else{
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
    
            localStorage.setItem('isLoggedIn', 'true');
    
            document.getElementById('login-pendente').style.display = 'none';
            document.getElementById('login-sucesso').style.display = 'block';
        });
    }
});

const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', function() {
    localStorage.removeItem('isLoggedIn');
    location.reload();
});