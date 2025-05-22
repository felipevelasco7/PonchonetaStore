require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        console.log('Conexión exitosa a MySQL');
        await connection.end();
    } catch (error) {
        console.error('Error conectando a MySQL:', error.message);
    }
}

testConnection();
