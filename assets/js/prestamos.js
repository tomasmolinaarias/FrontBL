document.addEventListener("DOMContentLoaded", () => {
    const addLoanForm = document.getElementById("addLoanForm");
    const editLoanForm = document.getElementById("editLoanForm");
    const loansList = document.getElementById("loansList");
    const editFormContainer = document.getElementById("editFormContainer");

    // Función para cargar préstamos
    const loadLoans = async () => {
        try {
            const response = await fetch("http://localhost:3500/api/prestamos");
            const prestamos = await response.json();
            loansList.innerHTML = "";
            prestamos.forEach(prestamo => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${prestamo.Alumno.nombre} - ${prestamo.Libro.titulo} - ${prestamo.fecha_prestamo} - ${prestamo.estado_devolucion}</span>
                    <div>
                        <button onclick="editLoan(${prestamo.id_prestamo}, '${prestamo.Alumno.rut}', ${prestamo.id_libro}, '${prestamo.fecha_prestamo}', '${prestamo.estado_devolucion}', '${prestamo.Bibliotecario.rut}')">Editar</button>
                        <button onclick="deleteLoan(${prestamo.id_prestamo})">Eliminar</button>
                    </div>
                `;
                loansList.appendChild(li);
            });
        } catch (error) {
            console.error("Error al cargar préstamos:", error);
        }
    };

    // Función para obtener el ID del alumno por su RUT
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

    // Función para agregar préstamo
    addLoanForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const rutAlumno = document.getElementById("rut_alumno").value;
        const rutBibliotecario = document.getElementById("rut_bibliotecario").value;

        const id_alumno = await getAlumnoIdByRut(rutAlumno);
        const id_bibliotecario = await getBibliotecarioIdByRut(rutBibliotecario);
        console.log("ID del alumno:", id_alumno);
        console.log("ID del bibliotecario:", id_bibliotecario);

        const loanData = {
            id_alumno,
            id_libro: document.getElementById("id_libro").value,
            id_bibliotecario,
            fecha_prestamo: new Date().toISOString().split('T')[0], 
            estado_devolucion: "pendiente" // Estado de devolución siempre pendiente
        };

        try {
            const response = await fetch("http://localhost:3500/api/prestamos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loanData)
            });
            if (response.ok) {
                addLoanForm.reset();
                loadLoans();
            } else {
                const errorResponse = await response.json();
                console.error("Error al agregar préstamo:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al agregar préstamo:", error);
        }
    });

    // Función para mostrar el formulario de edición con los datos del préstamo
    window.editLoan = async (id, rut_alumno, id_libro, fecha_prestamo, estado_devolucion, rut_bibliotecario) => {
        const id_alumno = await getAlumnoIdByRut(rut_alumno);
        const id_bibliotecario = await getBibliotecarioIdByRut(rut_bibliotecario);

        document.getElementById("edit_id_prestamo").value = id;
        document.getElementById("edit_rut_alumno").value = rut_alumno;
        document.getElementById("edit_id_libro").value = id_libro;
        document.getElementById("edit_fecha_prestamo").value = fecha_prestamo;
        document.getElementById("edit_estado_devolucion").value = estado_devolucion;
        document.getElementById("edit_rut_bibliotecario").value = rut_bibliotecario;

        editFormContainer.style.display = "block";
    };

    // Función para guardar cambios en el préstamo
    editLoanForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit_id_prestamo").value;
        const rutAlumno = document.getElementById("edit_rut_alumno").value;
        const rutBibliotecario = document.getElementById("edit_rut_bibliotecario").value;

        const id_alumno = await getAlumnoIdByRut(rutAlumno);
        const id_bibliotecario = await getBibliotecarioIdByRut(rutBibliotecario);
        const loanData = {
            id_alumno,
            id_libro: document.getElementById("edit_id_libro").value,
            id_bibliotecario,
            fecha_prestamo: document.getElementById("edit_fecha_prestamo").value,
            estado_devolucion: document.getElementById("edit_estado_devolucion").value
        };

        try {
            const response = await fetch(`http://localhost:3500/api/prestamos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loanData)
            });
            if (response.ok) {
                editFormContainer.style.display = "none";
                loadLoans();
            } else {
                const errorResponse = await response.json();
                console.error("Error al actualizar préstamo:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al actualizar préstamo:", error);
        }
    });

    // Función para eliminar préstamo
    window.deleteLoan = async (id) => {
        try {
            const response = await fetch(`http://localhost:3500/api/prestamos/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                loadLoans();
            } else {
                const errorResponse = await response.json();
                console.error("Error al eliminar préstamo:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al eliminar préstamo:", error);
        }
    };

    // Cargar préstamos al iniciar
    loadLoans();
});
