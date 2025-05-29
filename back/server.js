require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'poncho',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'ponchonetaDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Obtener productos
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo productos' });
    }
});

// Generar firma de integridad (firma SHA256) para Wompi
app.post('/api/generate-signature', (req, res) => {
    const { reference, amount, currency } = req.body;
    if (!reference || !amount || !currency) {
        return res.status(400).json({ error: 'Faltan datos para la firma' });
    }
    const secret = process.env.WOMPI_SECRET_KEY; // Coloca tu llave secreta en .env

    const data = reference + amount + currency + secret;
    const signature = crypto.createHash('sha256').update(data).digest('hex');
    res.json({ signature });
});

// Crear una orden
app.post('/api/orders', async (req, res) => {
    const { productos, comprador } = req.body;

    if (!productos || !comprador) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Insertar cliente y obtener id
        const [resultCliente] = await connection.query(
            `INSERT INTO clientes (nombre, email, celular, ciudad, direccion) VALUES (?, ?, ?, ?, ?)`,
            [comprador.nombre, comprador.email, comprador.celular, comprador.ciudad, comprador.direccion]
        );
        const clienteId = resultCliente.insertId;

        // Insertar orden con cliente_id
        const sqlOrden = `INSERT INTO orders (cliente_id, productos, fecha, comprador) VALUES (?, ?, ?, ?)`;
        const [resultOrden] = await connection.query(sqlOrden, [
            clienteId,
            JSON.stringify(productos),
            new Date(),
            JSON.stringify(comprador)
        ]);

        // Restar stock
        for (const producto of productos) {
            const [resultStock] = await connection.query(
                `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`,
                [producto.cantidad, producto.id, producto.cantidad]
            );
            if (resultStock.affectedRows === 0) {
                throw new Error(`Stock insuficiente para el producto ID ${producto.id}`);
            }
        }

        await connection.commit();

        res.json({ message: 'Orden guardada y stock actualizado', orderId: resultOrden.insertId });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: error.message || 'Error guardando la orden' });
    } finally {
        connection.release();
    }
});

// Endpoint para recibir webhook de Wompi
app.post('/api/webhook', (req, res) => {
    const transaction = req.body;

    // Aquí puedes validar la firma si quieres, o directamente procesar
    console.log("Webhook recibido:", transaction);

    // Por ejemplo, si status es approved, actualiza estado en DB, envía emails, etc.
    if (transaction.data && transaction.data.status === "APPROVED") {
        console.log("Pago aprobado para la transacción:", transaction.data.id);
        // Actualiza estado o realiza lógica
    } else {
        console.log("Pago no aprobado o en otro estado:", transaction.data.status);
    }

    res.status(200).send('Webhook recibido');
});

// Servir frontend estático
app.use(express.static(path.join(__dirname, '../front')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
