require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

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

app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo productos' });
    }
});

app.post('/api/orders', async (req, res) => {
    const { productos, comprador } = req.body;

    if (!productos || !comprador) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Insertar cliente
        const [resultCliente] = await connection.query(
            `INSERT INTO clientes (nombre, email, celular, ciudad, direccion) VALUES (?, ?, ?, ?, ?)`,
            [comprador.nombre, comprador.email, comprador.celular, comprador.ciudad, comprador.direccion]
        );

        const clienteId = resultCliente.insertId;

        // Insertar orden con cliente_id, productos y comprador como JSON
        const [resultOrden] = await connection.query(
            `INSERT INTO orders (cliente_id, productos, fecha, comprador) VALUES (?, ?, ?, ?)`,
            [clienteId, JSON.stringify(productos), new Date(), JSON.stringify(comprador)]
        );

        // Restar stock de productos vendidos
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

app.use(express.static(path.join(__dirname, '../front')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
