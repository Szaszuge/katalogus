require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/assets', express.static('assets'));

var pool = mysql.createPool({
    connectionLimit: process.env.CONNECTIONLIMIT,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

// Get API version
app.get('/', (req, res) => {
    res.send(`API version : ${process.env.VERSION}`);
});

// List all books
app.get('/books', (req, res) => {
    pool.query('SELECT * FROM books', (err, results) => {
        if (err) {
            res.status(500).send('Adatbázis probléma!');
            return;
        }
        res.status(200).send(results);
    });
});

// Könyv törlése
app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM books WHERE book_id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).send('Probléma a könyv törlése közben!');
            return;
        }
        res.status(200).send('Könyv sikeresen törölve!');
    });
});

// Új könyv hozzáadása
app.post('/books', (req, res) => {
    const { title, publication_year, isbn } = req.body;

    // ISBN szám validáció
    const isbnRegex = /^\d{13}$/;
    if (!isbnRegex.test(isbn)) {
        return res.status(400).send('Az ISBN szám 13 számjegyből áll!');
    }

    // Címbe csak betűk lehetnek
    const titleRegex = /^[A-Za-záéíóöőüúűÁÉÍÓÖŐÜÚŰ\s]+$/;
    if (!titleRegex.test(title)) {
        return res.status(400).send('Helytelen formátum a címben. Csak betűk elfogadhatók!');
    }

    // Kiadás éve validáció
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(publication_year) || publication_year < 1000 || publication_year > new Date().getFullYear()) {
        return res.status(400).send('Kiadás éve nem megfelelő formátum');
    }

    pool.query(
        'INSERT INTO books (title, publish_year, isbn) VALUES (?, ?, ?)',
        [title, publication_year, isbn],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Probléma a könyv hozzáadása közben!');
                return;
            }
            res.status(201).send({ message: 'Könyv sikeresen hozzáadva!', id: result.insertId });
        }
    );
});

// List all authors
app.get('/authors', (req, res) => {
    pool.query('SELECT * FROM authors', (err, results) => {
        if (err) {
            res.status(500).send('Adatbázis probléma!');
            return;
        }
        res.status(200).send(results);
    });
});

// Szerző törlése
app.delete('/authors/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM authors WHERE author_id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).send('Probléma a szerző törlése közben!');
            return;
        }
        res.status(200).send('Szerző sikeresen törölve!');
    });
});

// Új szerző hozzáadása
app.post('/authors', (req, res) => {
    const { name, birth_date } = req.body;

    pool.query(
        'INSERT INTO authors (name, birth_date) VALUES (?, ?)',
        [name, birth_date],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Probléma a szerző hozzáadása közben!');
                return;
            }
            res.status(201).send({ message: 'Szerző sikeresen hozzáadva!', id: result.insertId });
        }
    );
});

// Szerző frissítése
app.put('/authors/:id', (req, res) => {
    const { id } = req.params;
    const { name, birth_date } = req.body;

    pool.query(
        'UPDATE authors SET name = ?, birth_date = ? WHERE author_id = ?',
        [name, birth_date, id],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Probléma a szerző frissítése közben!');
                return;
            }
            res.status(200).send({ message: 'Szerző sikeresen frissítve!' });
        }
    );
});

// Szerzők displayelése
app.get('/authorsOf/:bookID/', (req, res) => {
    if (!req.params.bookID) {
        res.status(203).send('Hiányzó adatok!');
        return;
    }
    pool.query(`SELECT name FROM authors INNER JOIN book_authors ON authors.author_id = book_authors.author_id INNER JOIN books ON book_authors.book_id = books.book_id WHERE books.book_id = ?`, [req.params.bookID], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
        }
        if (results.length == 0) {
            res.status(203).send('Nincsenek írók regisztrálva a könyvhöz!');
            return;
        }
        res.status(202).send(results);
        return;
    });
});


// Könyv módosítása
app.put('/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, publication_year, isbn } = req.body;

    // ISBN szám validáció
    const isbnRegex = /^\d{13}$/;
    if (!isbnRegex.test(isbn)) {
        return res.status(400).send('Az ISBN szám 13 számjegyből áll!');
    }

    // Címbe csak betűk lehetnek
    const titleRegex = /^[A-Za-záéíóöőüúűÁÉÍÓÖŐÜÚŰ\s]+$/;
    if (!titleRegex.test(title)) {
        return res.status(400).send('Helytelen formátum a címben. Csak betűk elfogadhatók!');
    }

    // Kiadás éve validáció
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(publication_year) || publication_year < 1000 || publication_year > new Date().getFullYear()) {
        return res.status(400).send('Kiadás éve nem megfelelő formátum');
    }

    pool.query(
        'UPDATE books SET title = ?, publish_year = ?, isbn = ? WHERE book_id = ?',
        [title, publication_year, isbn, id],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Probléma a könyv frissítése közben!');
                return;
            }
            res.status(200).send({ message: 'Könyv sikeresen frissítve!' });
        }
    );
});
