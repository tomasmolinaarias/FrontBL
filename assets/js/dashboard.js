document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.rol === 'jefe_bibliotecario') {
            document.getElementById('gestionUsuarios').style.display = 'block';
        }
    } else {
        alert('No se encontró el token. Por favor, inicia sesión de nuevo.');
        window.location.href = '../index.html';
    }
});
