'use strict';

const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const e = require('express');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(cors());
app.use(express.json());


// MySQL Conn
const connection = mysql.createConnection({
    host: 'ventas.cpvmvbyr3oku.sa-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '.Ventas_2021',
    database: 'Tienda'
})

//Check connect
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running')
});

// Routes
app.get('/', (req, res) => {
    res.send('Bienvendo a mi API!')
});

app.get('/productos', (req, res) => {
    const sql = 'SELECT * FROM Productos'
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('No hay resultados');
        }
    });
    //let products = JSON.parse(fs.readFileSync('db/productos.json'));
    //console.log(products);

    // res.send(products);
});

app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM Productos WHERE id = ${id}`;
    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.send('No hay resultados');
        }
    });

});

app.post('/productos', (req, res) => {
    const sql = "INSERT INTO Productos SET ?";

    const _object = {
        nombre: req.body.nombre,
        precio: req.body.precio
    }

    connection.query(sql, _object, error => {
        if (error) throw error;
        connection.query('SELECT LAST_INSERT_ID();', (error, results) => {
            if (error) throw error;
            res.json(results[0])
        });
    });

});

app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    const sql = `UPDATE Productos SET nombre = '${nombre}', precio = '${precio}' WHERE id = ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Producto actualizado')
    });
});


app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Productos WHERE id = ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Producto eliminado')
    });
});


app.get('/usuarios/validar/:correo', (req, res) => {
    const { correo } = req.params;
    const sql = `SELECT * FROM Usuarios WHERE correo LIKE '${correo}'`;

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.send('No hay resultados');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});