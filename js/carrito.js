let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.image_url || 'https://via.placeholder.com/150'}" alt="${producto.name}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.name}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.price.toLocaleString('es-CO')}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${(producto.price * producto.cantidad).toLocaleString('es-CO')}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.removeEventListener("click", eliminarDelCarrito);
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: { x: '1.5rem', y: '1.5rem' },
        onClick: function() {}
    }).showToast();

    const idBoton = parseInt(e.currentTarget.id);
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    if (index !== -1) {
        productosEnCarrito.splice(index, 1);
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito();
    }
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito = [];
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    });
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.price * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado.toLocaleString('es-CO')}`;
}

botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    if (productosEnCarrito.length === 0) {
        Toastify({
            text: "El carrito está vacío",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            style: { background: "linear-gradient(to right, #f44336, #e57373)" }
        }).showToast();
        return;
    }

    Swal.fire({
        title: 'Datos del comprador',
        html:
            `<input type="text" id="nombre" class="swal2-input" placeholder="Nombre completo" />
             <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico" />
             <input type="cel" id="cel" class="swal2-input" placeholder="Numero de contacto" />
             <input type="ciudad" id="ciudad" class="swal2-input" placeholder="Ciudad" />
             <input type="text" id="direccion" class="swal2-input" placeholder="Dirección de envío completa" />`,
        focusConfirm: false,
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value.trim();
            const email = Swal.getPopup().querySelector('#email').value.trim();
            const cel = Swal.getPopup().querySelector('#cel').value.trim();
            const ciudad = Swal.getPopup().querySelector('#ciudad').value.trim();
            const direccion = Swal.getPopup().querySelector('#direccion').value.trim();

            if (!nombre || !email || !direccion) {
                Swal.showValidationMessage(`Por favor completa todos los campos`);
                return false;
            }
            return { nombre, email, cel, ciudad, direccion };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            guardarDatosYFinalizarCompra(result.value);
        }
    });
}

function guardarDatosYFinalizarCompra(datosComprador) {
    const orden = {
        productos: productosEnCarrito,
        comprador: datosComprador,
        fecha: new Date().toISOString()
    };

    // Simula guardar la orden en localStorage
    const ordenesGuardadas = JSON.parse(localStorage.getItem("ordenes")) || [];
    ordenesGuardadas.push(orden);
    localStorage.setItem("ordenes", JSON.stringify(ordenesGuardadas));

    // Limpia carrito
    productosEnCarrito = [];
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

    // Actualiza vista
    cargarProductosCarrito();

    // Muestra mensaje compra finalizada
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.remove("disabled");
}
