document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const alumnosBody = document.getElementById('alumnosBody');

    // Función para obtener y mostrar los alumnos
    const obtenerAlumnos = async () => {
        try {
            const response = await fetch('http://localhost:3500/api/alumnos');
            const alumnos = await response.json();

            // Mostrar los alumnos en la tabla
            mostrarAlumnos(alumnos);
        } catch (error) {
            console.error('Error al obtener los alumnos:', error);
        }
    };

    // Función para mostrar los alumnos en la tabla
    const mostrarAlumnos = (alumnos) => {
        alumnosBody.innerHTML = '';

        alumnos.forEach(alumno => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${alumno.id_alumno}</td>
                <td>${alumno.rut}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.correo_electronico}</td>
            `;
            alumnosBody.appendChild(row);
        });
    };

    // Evento para filtrar los alumnos
    searchInput.addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();

        const rows = alumnosBody.querySelectorAll('tr');
        rows.forEach(row => {
            const nombre = row.cells[2].textContent.toLowerCase();
            const apellido = nombre.split(' ')[1];

            if (nombre.includes(searchText) || (apellido && apellido.includes(searchText))) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Obtener los alumnos al cargar la página
    obtenerAlumnos();
});
