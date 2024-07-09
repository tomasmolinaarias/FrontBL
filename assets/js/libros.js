document.addEventListener("DOMContentLoaded", () => {
    const addBookForm = document.getElementById("addBookForm");
    const editBookForm = document.getElementById("editBookForm");
    const booksList = document.getElementById("booksList");
    const editFormContainer = document.getElementById("editFormContainer");

    // Función para cargar libros
    const loadBooks = async () => {
        try {
            const response = await fetch("http://localhost:3500/api/libros");
            const libros = await response.json();
            booksList.innerHTML = "";
            libros.forEach(libro => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${libro.titulo} - ${libro.autor}</span>
                    <div>
                        <button onclick="editBook(${libro.id_libro}, '${libro.titulo}', '${libro.autor}', '${libro.editorial}', ${libro.ano_publicacion}, '${libro.ISBN}', '${libro.genero}', '${libro.idioma}', '${libro.ubicacion}', ${libro.cantidad_disponible})">Editar</button>
                        <button onclick="deleteBook(${libro.id_libro})">Eliminar</button>
                    </div>
                `;
                booksList.appendChild(li);
            });
        } catch (error) {
            console.error("Error al cargar libros:", error);
        }
    };

    // Función para agregar libro
    addBookForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const bookData = {
            titulo: document.getElementById("titulo").value,
            autor: document.getElementById("autor").value,
            editorial: document.getElementById("editorial").value,
            ano_publicacion: document.getElementById("ano_publicacion").value,
            ISBN: document.getElementById("ISBN").value,
            genero: document.getElementById("genero").value,
            idioma: document.getElementById("idioma").value,
            ubicacion: document.getElementById("ubicacion").value,
            cantidad_disponible: document.getElementById("cantidad_disponible").value
        };

        try {
            const response = await fetch("http://localhost:3500/api/libros", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData)
            });
            if (response.ok) {
                addBookForm.reset();
                loadBooks();
            } else {
                const errorResponse = await response.json();
                console.error("Error al agregar libro:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al agregar libro:", error);
        }
    });

    // Función para mostrar el formulario de edición con los datos del libro
    window.editBook = (id, titulo, autor, editorial, ano_publicacion, ISBN, genero, idioma, ubicacion, cantidad_disponible) => {
        document.getElementById("edit_id_libro").value = id;
        document.getElementById("edit_titulo").value = titulo;
        document.getElementById("edit_autor").value = autor;
        document.getElementById("edit_editorial").value = editorial;
        document.getElementById("edit_ano_publicacion").value = ano_publicacion;
        document.getElementById("edit_ISBN").value = ISBN;
        document.getElementById("edit_genero").value = genero;
        document.getElementById("edit_idioma").value = idioma;
        document.getElementById("edit_ubicacion").value = ubicacion;
        document.getElementById("edit_cantidad_disponible").value = cantidad_disponible;

        editFormContainer.style.display = "block";
    };

    // Función para guardar cambios en el libro
    editBookForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit_id_libro").value;
        const bookData = {
            titulo: document.getElementById("edit_titulo").value,
            autor: document.getElementById("edit_autor").value,
            editorial: document.getElementById("edit_editorial").value,
            ano_publicacion: document.getElementById("edit_ano_publicacion").value,
            ISBN: document.getElementById("edit_ISBN").value,
            genero: document.getElementById("edit_genero").value,
            idioma: document.getElementById("edit_idioma").value,
            ubicacion: document.getElementById("edit_ubicacion").value,
            cantidad_disponible: document.getElementById("edit_cantidad_disponible").value
        };

        try {
            const response = await fetch(`http://localhost:3500/api/libros/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData)
            });
            if (response.ok) {
                editFormContainer.style.display = "none";
                loadBooks();
            } else {
                const errorResponse = await response.json();
                console.error("Error al actualizar libro:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al actualizar libro:", error);
        }
    });

    // Función para eliminar libro
    window.deleteBook = async (id) => {
        try {
            const response = await fetch(`http://localhost:3500/api/libros/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                loadBooks();
            } else {
                const errorResponse = await response.json();
                console.error("Error al eliminar libro:", errorResponse.error);
            }
        } catch (error) {
            console.error("Error al eliminar libro:", error);
        }
    };

    // Cargar libros al iniciar
    loadBooks();
});
