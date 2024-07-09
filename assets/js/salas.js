document.addEventListener("DOMContentLoaded", () => {
    const addRoomForm = document.getElementById("addRoomForm");
    const editRoomForm = document.getElementById("editRoomForm");
    const roomsList = document.getElementById("roomsList");
    const editFormContainer = document.getElementById("editFormContainer");

    // Función para cargar salas de estudio
    const loadRooms = async () => {
        try {
            const response = await fetch("http://localhost:3500/api/salas");
            const salas = await response.json();
            roomsList.innerHTML = "";
            salas.forEach(sala => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${sala.nombre_sala} - Capacidad: ${sala.capacidad} - Equipamiento: ${sala.equipamiento}</span>
                    <div>
                        <button onclick="editRoom(${sala.id_sala}, '${sala.nombre_sala}', ${sala.capacidad}, '${sala.equipamiento}')">Editar</button>
                        <button onclick="deleteRoom(${sala.id_sala})">Eliminar</button>
                    </div>
                `;
                roomsList.appendChild(li);
            });
        } catch (error) {
            console.error("Error al cargar salas de estudio:", error);
        }
    };

    // Función para agregar sala de estudio
    addRoomForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const roomData = {
            nombre_sala: document.getElementById("nombre_sala").value,
            capacidad: document.getElementById("capacidad").value,
            equipamiento: document.getElementById("equipamiento").value
        };

        try {
            const response = await fetch("http://localhost:3500/api/salas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(roomData)
            });
            if (response.ok) {
                addRoomForm.reset();
                loadRooms();
            } else {
                const errorResponse = await response.json();
                console.error("Error al agregar sala:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al agregar sala:", error);
        }
    });

    // Función para mostrar el formulario de edición con los datos de la sala
    window.editRoom = (id, nombre_sala, capacidad, equipamiento) => {
        document.getElementById("edit_id_sala").value = id;
        document.getElementById("edit_nombre_sala").value = nombre_sala;
        document.getElementById("edit_capacidad").value = capacidad;
        document.getElementById("edit_equipamiento").value = equipamiento;

        editFormContainer.style.display = "block";
    };

    // Función para guardar cambios en la sala de estudio
    editRoomForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit_id_sala").value;
        const roomData = {
            nombre_sala: document.getElementById("edit_nombre_sala").value,
            capacidad: document.getElementById("edit_capacidad").value,
            equipamiento: document.getElementById("edit_equipamiento").value
        };

        try {
            const response = await fetch(`http://localhost:3500/api/salas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(roomData)
            });
            if (response.ok) {
                editFormContainer.style.display = "none";
                loadRooms();
            } else {
                const errorResponse = await response.json();
                console.error("Error al actualizar sala:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al actualizar sala:", error);
        }
    });

    // Función para eliminar sala de estudio
    window.deleteRoom = async (id) => {
        try {
            const response = await fetch(`http://localhost:3500/api/salas/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                loadRooms();
            } else {
                const errorResponse = await response.json();
                console.error("Error al eliminar sala:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al eliminar sala:", error);
        }
    };

    // Cargar salas al iniciar
    loadRooms();
});
