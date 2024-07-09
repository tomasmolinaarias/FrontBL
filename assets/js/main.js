function showSection(section) {
    document.getElementById('content').innerHTML = '';

    switch (section) {
        case 'usuarios':
            loadUsuarios();
            break;
        case 'bibliotecarios':
            loadBibliotecarios();
            break;
        case 'prestamos':
            loadPrestamos();
            break;
        case 'reservas':
            loadReservas();
            break;
        default:
            break;
    }
}

async function loadUsuarios() {
    const response = await fetch('http://localhost:3500/api/usuarios', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const usuarios = await response.json();
    displayData(usuarios, 'Usuarios');
}

async function loadBibliotecarios() {
    const response = await fetch('http://localhost:3500/api/bibliotecarios', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const bibliotecarios = await response.json();
    displayData(bibliotecarios, 'Bibliotecarios');
}

async function loadPrestamos() {
    const response = await fetch('http://localhost:3500/api/prestamos', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const prestamos = await response.json();
    displayData(prestamos, 'Préstamos');
}

async function loadReservas() {
    const response = await fetch('http://localhost:3500/api/reservas', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const reservas = await response.json();
    displayData(reservas, 'Reservas');
}

function displayData(data, title) {
    const content = document.getElementById('content');
    content.innerHTML = `<h2>${title}</h2>`;
    const table = document.createElement('table');
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header];
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    content.appendChild(table);
}
