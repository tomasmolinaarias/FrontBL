document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userTableBody = document.getElementById('userTableBody');

    // Función para obtener usuarios
    const obtenerUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3500/api/bibliotecarios');
            const usuarios = await response.json();
            userTableBody.innerHTML = '';
            usuarios.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.nombre}</td>
                    <td>${usuario.correo_electronico}</td>
                    <td>${usuario.rol}</td>
                    <td>${usuario.rut}</td>
                    <td class="actions">
                        <button onclick="eliminarUsuario('${usuario.rut}')">Eliminar</button>
                    </td>
                `;
                userTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    // Función para agregar o editar usuario
    const guardarUsuario = async (event) => {
        event.preventDefault();
        const userId = document.getElementById('userId').value;
        const nombre = document.getElementById('nombre').value;
        const correo_electronico = document.getElementById('correo_electronico').value;
        const rol = document.getElementById('rol').value;
        const rut = document.getElementById('rut').value;
        const contrasena = document.getElementById('contrasena').value;

        const usuario = { nombre, correo_electronico, rol, rut, contrasena };
        const url = 'http://localhost:3500/api/usuarios';
        const method =   'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });

            if (response.ok) {
                userForm.reset();
                document.getElementById('userId').value = '';
                obtenerUsuarios();
            } else {
                console.error('Error al guardar usuario:', await response.text());
            }
        } catch (error) {
            console.error('Error al guardar usuario:', error);
        }
    };


    // Función para eliminar usuario
    window.eliminarUsuario = async (rut) => {
        try {
            const response = await fetch(`http://localhost:3500/api/usuarios/${rut}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                obtenerUsuarios();
            } else {
                console.error('Error al eliminar usuario:', await response.text());
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    userForm.addEventListener('submit', guardarUsuario);
    obtenerUsuarios();
});
