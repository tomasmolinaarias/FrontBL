document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const correo_electronico = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;

    const response = await fetch('http://localhost:3500/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo_electronico, contrasena }),
    });

    const data = await response.json();
    console.log("🚀 ~ document.getElementById ~ data:", data)
    if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Inicio de sesión exitoso");
        window.location.href = '../../assets/page/dashboard.html'; 
    } else {
        alert(data.message || 'Error al iniciar sesión');
    }
});
