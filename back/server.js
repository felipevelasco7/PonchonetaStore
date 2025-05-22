require('dotenv').config();
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);


const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

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

    try {
        // Insertar cliente y obtener id
        const [resultCliente] = await pool.query(
            `INSERT INTO clientes (nombre, email, celular, ciudad, direccion) VALUES (?, ?, ?, ?, ?)`,
            [comprador.nombre, comprador.email, comprador.celular, comprador.ciudad, comprador.direccion]
        );

        const clienteId = resultCliente.insertId;

        // Insertar orden con cliente_id
        const sqlOrden = `INSERT INTO orders (cliente_id, productos, fecha) VALUES (?, ?, ?)`;
        const [resultOrden] = await pool.query(sqlOrden, [
            clienteId,
            JSON.stringify(productos),
            new Date()
        ]);

        res.json({ message: 'Orden guardada', orderId: resultOrden.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error guardando la orden' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));


const path = require('path');

app.use(express.static(path.join(__dirname, '../front')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../front/index.html'));
});
