require('dotenv').config();
const express = require('express');
const mysql = require('mysql'); // MySQL modul importálása
const cors = require('cors');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/assets', express.static('assets'));

var pool  = mysql.createPool({
    connectionLimit : process.env.CONNECTIONLIMIT,
    host            : process.env.DBHOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASS,
    database        : process.env.DBNAME
  });


app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});

//get API version
app.get('/', (req, res) => {
    res.send(`API version : ${process.env.VERSION}`);
  });

//összes könyv listázása

app.get('/books', (req, res) =>{
    pool.query('SELECT * FROM books', (err, results) => {
        if(err){
            res.status(500).send('Hiba történt az adatbázisművelet közben!');
            return;
        }
        res.status(200).send(results)
        return;
    });
});

app.post('/books', (req, res) =>{
    
})