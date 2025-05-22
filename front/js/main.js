document.addEventListener("DOMContentLoaded", () => {
    const productos_json_url = 'http://localhost:3000/api/products';
    let todosLosProductos = [];

    const contenedorProductos = document.querySelector("#contenedor-productos");
    const botonesCategorias = document.querySelectorAll(".boton-categoria");
    const tituloPrincipal = document.querySelector("#titulo-principal");
    let botonesAgregar = [];
    const numerito = document.querySelector("#numerito");
    const aside = document.querySelector("aside");
    const openMenuBtn = document.querySelector("#open-menu");
    const closeMenuBtn = document.querySelector("#close-menu");
    const buscador = document.querySelector("#buscador");

    const PLACEHOLDER_IMAGE_URL = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";

    // Función para cerrar menú lateral (si visible)
    function cerrarMenu() {
        if (aside.classList.contains("aside-visible")) {
            aside.classList.remove("aside-visible");
        }
    }

    // MENU LATERAL FUNCIONALIDAD
    if (openMenuBtn && closeMenuBtn && aside) {
        openMenuBtn.addEventListener("click", () => {
            aside.classList.add("aside-visible");
        });
        closeMenuBtn.addEventListener("click", () => {
            aside.classList.remove("aside-visible");
        });

        botonesCategorias.forEach(boton => {
            boton.addEventListener("click", e => {
                e.preventDefault();
                cerrarMenu();

                botonesCategorias.forEach(b => b.classList.remove("active"));
                boton.classList.add("active");

                const categoriaSeleccionada = boton.id.toLowerCase();

                if (categoriaSeleccionada === "todos") {
                    tituloPrincipal.innerText = "Todos los productos";
                    cargarProductos(todosLosProductos);
                } else if (categoriaSeleccionada === "otros") {
                    // Mostrar productos que NO son Camiseta ni Medias (puedes adaptar según categorías reales)
                    const productosFiltrados = todosLosProductos.filter(p => {
                        const cat = (p.category || '').toLowerCase();
                        return cat !== 'camiseta' && cat !== 'medias';
                    });
                    tituloPrincipal.innerText = "Más Productos";
                    cargarProductos(productosFiltrados);
                } else {
                    // Categorías específicas (Camiseta, Medias)
                    const productosFiltrados = todosLosProductos.filter(p => (p.category || '').toLowerCase() === categoriaSeleccionada);
                    tituloPrincipal.innerText = boton.textContent.trim();
                    cargarProductos(productosFiltrados);
                }
            });
        });
    }

    // BUSCADOR FUNCIONALIDAD
    if (buscador) {
        buscador.addEventListener("input", e => {
            const textoBusqueda = e.target.value.toLowerCase();

            const productosFiltrados = todosLosProductos.filter(producto => {
                return (producto.name && producto.name.toLowerCase().includes(textoBusqueda)) ||
                    (producto.description && producto.description.toLowerCase().includes(textoBusqueda));
            });

            tituloPrincipal.innerText = textoBusqueda ? `Resultados para "${textoBusqueda}"` : "Todos los productos";
            cargarProductos(productosFiltrados);
        });
    }

    // FUNCION QUE CARGA PRODUCTOS AL DOM
    function cargarProductos(productosAMostrar) {
        if (!contenedorProductos) {
            console.error("#contenedor-productos no encontrado.");
            return;
        }

        contenedorProductos.innerHTML = "";

        productosAMostrar.forEach(producto => {
            const priceNum = Number(producto.price) || 0;
            const imageUrl = producto.image_url && producto.image_url.trim() !== "" ? producto.image_url : PLACEHOLDER_IMAGE_URL;
            const availability = producto.availability || 'No disponible';
            const isAgotado = (producto.stock === 0 || producto.stock === '0') && availability !== 'Por Encargo';

            const buttonHtml = isAgotado
                ? '<p class="producto-agotado">AGOTADO</p>'
                : `<button class="producto-agregar" id="${producto.id}">Agregar</button>`;

            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img class="producto-imagen" src="${imageUrl}" alt="${producto.name || 'Producto sin nombre'}">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.name || 'Sin nombre'}</h3>
                    <p class="producto-descripcion">${producto.description || 'Descripción no disponible.'}</p>
                    <p class="producto-disponibilidad ${availability === 'Entrega Inmediata' ? 'disponible' : 'por-encargo'}">
                        ${availability}
                    </p>
                    <p class="producto-precio">${priceNum.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}</p>
                    ${buttonHtml}
                </div>
            `;
            contenedorProductos.appendChild(div);
        });

        actualizarBotonesAgregar();
    }

    // ACTUALIZAR LOS BOTONES AGREGAR PARA QUE RESPONDAN AL CLICK
    function actualizarBotonesAgregar() {
        botonesAgregar = document.querySelectorAll(".producto-agregar");
        botonesAgregar.forEach(boton => {
            boton.removeEventListener("click", agregarAlCarrito);
            boton.addEventListener("click", agregarAlCarrito);
        });
    }

    // VARIABLES Y FUNCIONES PARA CARRITO (simplificado)
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
    actualizarNumerito();

    function agregarAlCarrito(e) {
        const idBoton = parseInt(e.currentTarget.id);
        const productoAgregado = todosLosProductos.find(p => p.id === idBoton);

        if (!productoAgregado) return console.error("Producto no encontrado con ID:", idBoton);

        const productoEnCarritoExistente = productosEnCarrito.find(item => item.id === idBoton);
        if (productoEnCarritoExistente) {
            productoEnCarritoExistente.cantidad++;
        } else {
            productosEnCarrito.push({ ...productoAgregado, cantidad: 1 });
        }

        actualizarNumerito();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

        Toastify({
            text: "Producto agregado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #4a605b, #51af8e)",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem"
            }
        }).showToast();
    }

    function actualizarNumerito() {
        if (!numerito) return;
        const totalCantidad = productosEnCarrito.reduce((acc, p) => acc + p.cantidad, 0);
        numerito.innerText = totalCantidad;
        numerito.style.display = totalCantidad > 0 ? "inline-block" : "none";
    }

    // Carga inicial de productos desde API
    fetch(productos_json_url)
        .then(resp => resp.json())
        .then(data => {
            todosLosProductos = data;
            cargarProductos(todosLosProductos);
        })
        .catch(err => {
            console.error("Error cargando productos:", err);
            if (contenedorProductos) contenedorProductos.innerHTML = "<p>Error al cargar productos.</p>";
        });
});
