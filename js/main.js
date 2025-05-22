const productos_json_url = 'js/productos_ponchoneta.json';
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


const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/300x300.png?text=Producto";

if (openMenuBtn && closeMenuBtn && aside) {
    openMenuBtn.addEventListener("click", () => aside.classList.add("aside-visible"));
    closeMenuBtn.addEventListener("click", () => aside.classList.remove("aside-visible"));

    botonesCategorias.forEach(boton => {
        boton.addEventListener("click", () => {
            if (aside.classList.contains("aside-visible")) {
                aside.classList.remove("aside-visible");
            }
        });
    });
}

if (buscador) {
    buscador.addEventListener("input", e => {
        const textoBusqueda = e.target.value.toLowerCase();

        // Filtrar productos que coincidan en nombre o descripción
        const productosFiltrados = todosLosProductos.filter(producto => {
            return producto.name.toLowerCase().includes(textoBusqueda) ||
                (producto.description && producto.description.toLowerCase().includes(textoBusqueda));
        });

        tituloPrincipal.innerText = textoBusqueda ? `Resultados para "${textoBusqueda}"` : "Todos los productos";
        cargarProductos(productosFiltrados);
    });
}


function cargarProductos(productosAMostrar) {
    if (!contenedorProductos) return console.error("#contenedor-productos no encontrado.");

    contenedorProductos.innerHTML = "";

    productosAMostrar.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");

        const isAgotado = producto.stock === 0 && producto.availability !== 'Por Encargo';
        const buttonHtml = isAgotado
            ? '<p class="producto-agotado">AGOTADO</p>'
            : `<button class="producto-agregar" id="${producto.id}">Agregar</button>`;

        div.innerHTML = `
            <img class="producto-imagen" src="${producto.image_url || PLACEHOLDER_IMAGE_URL}" alt="${producto.name || 'Producto sin nombre'}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.name || 'Sin nombre'}</h3>
                <p class="producto-descripcion">${producto.description || 'Descripción no disponible.'}</p>
                <p class="producto-disponibilidad ${producto.availability === 'Entrega Inmediata' ? 'disponible' : 'por-encargo'}">
                    ${producto.availability || 'No disponible'}
                </p>
                <p class="producto-precio">${formatPrice(producto.price)}</p>
                ${buttonHtml}
            </div>
        `;
        contenedorProductos.appendChild(div);
    });

    actualizarBotonesAgregar();
}

function formatPrice(price) {
    return Number(price).toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", e => {
        if (aside && aside.classList.contains("aside-visible")) aside.classList.remove("aside-visible");

        botonesCategorias.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const categoriaSeleccionada = e.currentTarget.id;

        if (tituloPrincipal) {
            if (categoriaSeleccionada !== "todos") {
                tituloPrincipal.innerText = e.currentTarget.textContent;
                const productosFiltrados = todosLosProductos.filter(p => p.category === categoriaSeleccionada);
                cargarProductos(productosFiltrados);
            } else {
                tituloPrincipal.innerText = "Todos los productos";
                cargarProductos(todosLosProductos);
            }
        }
    });
});

let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];
actualizarNumerito();

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.removeEventListener("click", agregarAlCarrito);
        boton.addEventListener("click", agregarAlCarrito);
    });
}

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

// Carga inicial de productos desde JSON
fetch(productos_json_url)
    .then(resp => {
        if (!resp.ok) throw new Error(`Error HTTP al cargar productos: ${resp.status}`);
        return resp.json();
    })
    .then(data => {
        todosLosProductos = data;
        if (todosLosProductos.length) {
            cargarProductos(todosLosProductos);
        } else {
            if(contenedorProductos) contenedorProductos.innerHTML = "<p>No hay productos disponibles.</p>";
        }
    })
    .catch(err => {
        console.error("Error cargando productos:", err);
        if (contenedorProductos) contenedorProductos.innerHTML = "<p>Error al cargar productos.</p>";
    });
