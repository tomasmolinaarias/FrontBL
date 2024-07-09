document.getElementById('generateTokenBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const response = await fetch('http://localhost:3500/api/recuperar-contrasena', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo_electronico: email }),
    });

    const data = await response.json();
    if (response.ok) {
        document.getElementById('token').value = data.token;
        document.getElementById('tokenContainer').style.display = 'block';
    } else {
        alert(data.message || 'Error al generar token');
    }
});

document.getElementById('resetPasswordBtn').addEventListener('click', async () => {
    const token = document.getElementById('token').value;
    const newPassword = document.getElementById('newPassword').value;
    const response = await fetch('http://localhost:3500/api/restablecer-contrasena', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, nuevaContrasena: newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Contraseña restablecida exitosamente');
        document.getElementById('redirectBtn').style.display = 'block';
    } else {
        alert(data.message || 'Error al restablecer contraseña');
    }
});

document.getElementById('redirectBtn').addEventListener('click', () => {
    window.location.href = '../.././index.html';
});
