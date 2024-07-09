document.addEventListener("DOMContentLoaded", () => {
    const reservationFormContainer = document.getElementById("reservationFormContainer");
    const reservationForm = document.getElementById("reservationForm");
    const editFormContainer = document.getElementById("editFormContainer");
    const editReservationForm = document.getElementById("editReservationForm");
    const salasList = document.getElementById("salasList");
    const reservationsList = document.getElementById("reservationsList");

    // Función para obtener el ID del bibliotecario por su RUT
    const getBibliotecarioIdByRut = async (rut) => {
        try {
            const response = await fetch(`http://localhost:3500/api/bibliotecario/${rut}`);
            const bibliotecario = await response.json();
            return bibliotecario.id_bibliotecario;
        } catch (error) {
            console.error("Error al obtener ID del bibliotecario por RUT:", error);
            return null;
        }
    };
    const getAlumnoIdByRut = async (rut) => {
        try {
            const response = await fetch(`http://localhost:3500/api/alumnos/${rut}`);
            const alumno = await response.json();
            return alumno.id_alumno;
        } catch (error) {
            console.error("Error al obtener ID del alumno por RUT:", error);
            return null;
        }
    };

    // Función para cargar reservas
    const loadReservations = async () => {
        try {
            const response = await fetch("http://localhost:3500/api/reservas");
            const reservas = await response.json();
            reservationsList.innerHTML = "";
            reservas.forEach(reserva => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${reserva.SalaEstudio.nombre_sala} - ${reserva.Alumno.nombre} - ${reserva.hora_inicio} - ${reserva.hora_fin}</span>
                    <div>
                        <button onclick="editReservation(${reserva.id_reserva}, ${reserva.id_sala}, '${reserva.Alumno.rut}', '${reserva.hora_inicio}', '${reserva.hora_fin}')">Editar</button>
                        <button onclick="deleteReservation(${reserva.id_reserva})">Eliminar</button>
                    </div>
                `;
                reservationsList.appendChild(li);
            });
        } catch (error) {
            console.error("Error al cargar reservas:", error);
        }
    };

    const loadSalas = async () => {
        try {
            const response = await fetch("http://localhost:3500/api/salas");
            const salas = await response.json();
            salasList.innerHTML = "";
            salas.forEach(sala => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${sala.nombre_sala} - ${sala.capacidad} - ${sala.equipamiento}</span>
                    <div>
                        <button onclick="showReservationForm(${sala.id_sala})">Reservar</button>
                    </div>
                `;
                salasList.appendChild(li);
            });
        } catch (error) {
            console.error("Error al cargar salas:", error);
        }
    };

    window.showReservationForm = (id_sala) => {
        reservationFormContainer.classList.remove("hidden");
        document.getElementById("id_sala").value = id_sala;
    };

    reservationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const rutBibliotecario = document.getElementById("rut_bibliotecario").value;
        const id_bibliotecario = await getBibliotecarioIdByRut(rutBibliotecario);
        const rutAlumno = document.getElementById("rut_alumno").value;
        const id_alumno = await getAlumnoIdByRut(rutAlumno);
 

        if (!id_bibliotecario) {
            console.error("No se pudo obtener el ID del bibliotecario.");
            return;
        }

        const reservationData = {
            id_sala: document.getElementById("id_sala").value,
            id_alumno,
            hora_inicio: document.getElementById("hora_inicio").value,
            hora_fin: document.getElementById("hora_fin").value,
            estado: 'devuelta', // Estado se establece automáticamente como 'devuelta'
            id_bibliotecario
        };

        try {
            const response = await fetch("http://localhost:3500/api/reservas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reservationData)
            });
            if (response.ok) {
                reservationForm.reset();
                reservationFormContainer.classList.add("hidden");
                loadReservations();
            } else {
                const errorResponse = await response.json();
                console.error("Error al agregar reserva:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al agregar reserva:", error);
        }
    });

    window.editReservation = async (id_reserva, id_sala, rut_alumno, hora_inicio, hora_fin) => {
        document.getElementById("edit_id_reserva").value = id_reserva;
        document.getElementById("edit_id_sala").value = id_sala;
        document.getElementById("edit_rut_alumno").value = rut_alumno;
        document.getElementById("edit_hora_inicio").value = hora_inicio;
        document.getElementById("edit_hora_fin").value = hora_fin;
        editFormContainer.classList.remove("hidden");
    };

    editReservationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id_reserva = document.getElementById("edit_id_reserva").value;
        const rutBibliotecario = document.getElementById("edit_rut_bibliotecario").value;
        const id_bibliotecario = await getBibliotecarioIdByRut(rutBibliotecario);

        if (!id_bibliotecario) {
            console.error("No se pudo obtener el ID del bibliotecario.");
            return;
        }

        const reservationData = {
            id_sala: document.getElementById("edit_id_sala").value,
            rut_alumno: document.getElementById("edit_rut_alumno").value,
            hora_inicio: document.getElementById("edit_hora_inicio").value,
            hora_fin: document.getElementById("edit_hora_fin").value,
            estado: document.getElementById("edit_estado").value,
            id_bibliotecario
        };

        try {
            const response = await fetch(`http://localhost:3500/api/reservas/${id_reserva}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reservationData)
            });
            if (response.ok) {
                editReservationForm.reset();
                editFormContainer.classList.add("hidden");
                loadReservations();
            } else {
                const errorResponse = await response.json();
                console.error("Error al actualizar reserva:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al actualizar reserva:", error);
        }
    });

    window.deleteReservation = async (id_reserva) => {
        try {
            const response = await fetch(`http://localhost:3500/api/reservas/${id_reserva}`, {
                method: "DELETE"
            });
            if (response.ok) {
                loadReservations();
            } else {
                const errorResponse = await response.json();
                console.error("Error al eliminar reserva:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al eliminar reserva:", error);
        }
    };

    document.getElementById("hora_inicio").addEventListener("change", (e) => {
        const horaInicio = e.target.value;
        const horaFin = new Date(`1970-01-01T${horaInicio}:00`);
        horaFin.setHours(horaFin.getHours() + 1);
        document.getElementById("hora_fin").value = horaFin.toTimeString().slice(0, 5);
    });

    document.getElementById("edit_hora_inicio").addEventListener("change", (e) => {
        const horaInicio = e.target.value;
        const horaFin = new Date(`1970-01-01T${horaInicio}:00`);
        horaFin.setHours(horaFin.getHours() + 1);
        document.getElementById("edit_hora_fin").value = horaFin.toTimeString().slice(0, 5);
    });

    loadSalas();
    loadReservations();
});
