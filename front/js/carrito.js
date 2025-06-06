(() => {
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
            onClick: function () { }
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

    async function comprarCarrito() {
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

        // Mostrar formulario para ingresar datos del comprador
        const { value: datosComprador } = await Swal.fire({
            title: 'Datos del comprador',
            html:
                `<input type="text" id="nombre" class="swal2-input" placeholder="Nombre" />
                 <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico" />
                 <input type="tel" id="celular" class="swal2-input" placeholder="Celular" />
                 <select id="legalIdType" class="swal2-select">
                     <option value="" disabled selected>Tipo de documento</option>
                     <option value="RUC">RUC</option>
                     <option value="RG">RG</option>
                     <option value="OTHER">OTHER</option>
                     <option value="RC">RC</option>
                     <option value="TI">TI</option>
                     <option value="CC">CC</option>
                     <option value="TE">TE</option>
                     <option value="CE">CE</option>
                     <option value="NIT">NIT</option>
                     <option value="PP">PP</option>
                     <option value="DNI">DNI</option>
                 </select>
                 <input type="text" id="legalId" class="swal2-input" placeholder="Número de documento" />
                 <input type="text" id="ciudad" class="swal2-input" placeholder="Ciudad" />
                 <input type="text" id="region" class="swal2-input" placeholder="Departamento" />
                 <input type="text" id="direccion" class="swal2-input" placeholder="Dirección de envío completa" />`,
            focusConfirm: false,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value.trim();
                const email = Swal.getPopup().querySelector('#email').value.trim();
                const celular = Swal.getPopup().querySelector('#celular').value.trim();
                const legalIdType = Swal.getPopup().querySelector('#legalIdType').value;
                const legalId = Swal.getPopup().querySelector('#legalId').value.trim();
                const ciudad = Swal.getPopup().querySelector('#ciudad').value.trim();
                const region = Swal.getPopup().querySelector('#region').value.trim();
                const direccion = Swal.getPopup().querySelector('#direccion').value.trim();

                if (!nombre || !email || !celular || !legalIdType || !legalId || !ciudad || !region || !direccion) {
                    Swal.showValidationMessage(`Por favor completa todos los campos`);
                    return false;
                }

                return { nombre, email, celular, legalIdType, legalId, ciudad, region, direccion };
            }
        });

        if (!datosComprador) return; // Si cancela

        const reference = 'payment_' + Date.now();
        const amount = productosEnCarrito.reduce((total, producto) => total + (producto.price * producto.cantidad), 0) * 100; // En centavos
        const currency = "COP";

        try {
            const expirationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // +15 minutos

// Obtener firma desde backend con expirationTime
            //const response = await fetch('http://localhost:3000/api/generate-signature', {
            const response = await fetch('/api/generate-signature', {

                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference, amount, currency, expirationTime })
            });
            const data = await response.json();
            const signature = data.signature;
            console.log(`${window.location.origin}/pagos/respuesta`);

            const checkout = new WidgetCheckout({
                currency: currency,
                amountInCents: amount,
                reference,
                publicKey: 'pub_test_7OBPgywA4RKSR7r3HiLFdZk6D3iTcV8I', // Tu llave pública Wompi
                signature: { integrity: signature },
                //redirectUrl: 'http://localhost:3000/pagos/respuesta',
                redirectUrl: `${window.location.origin}/pagos/respuesta`,
                expirationTime: expirationTime,
                customerData: {
                    email: datosComprador.email,
                    fullName: datosComprador.nombre,
                    phoneNumber: datosComprador.celular,
                    phoneNumberPrefix: '+57',
                    legalId: datosComprador.legalId,
                    legalIdType: datosComprador.legalIdType
                },
                shippingAddress: {
                    addressLine1: datosComprador.direccion,
                    city: datosComprador.ciudad,
                    phoneNumber: datosComprador.celular,
                    region: datosComprador.region,
                    country: 'CO'
                }
            });

            checkout.open(result => {
                console.log("Resultado de la transacción:", result);

                if (result.transaction && result.transaction.status === "APPROVED") {
                    // Guardar orden en backend
                    //fetch('http://localhost:3000/api/orders', {
                    fetch('/api/orders', {

                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            productos: productosEnCarrito,
                            comprador: datosComprador
                        })
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            console.log('Orden guardada:', data);
                            productosEnCarrito = [];
                            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                            // Actualizar UI del carrito
                        })
                        .catch(err => {
                            console.error('Error guardando la orden:', err);
                        });
                } else {
                    alert("Pago no aprobado o cancelado.");
                }
            });
        } catch (error) {
            console.error("Error generando firma o abriendo el widget:", error);
            alert("No se pudo iniciar el pago. Intente más tarde.");
        }
    }
})();
