// import some dependencies / packages

// HTTP framework for handling request
const express = require('express');
//instance of express framework
const app =  express();
// DBMS 
const mysql = require('mysql2');
// Cross Origin resource sharing
const cors = require ('cors');
// Environment variable doc
const dotenv = require ('dotenv');


app.use(express.json());
app.use(cors());
dotenv.config();

// connect to the database
const db = mysql.createConnection({
host: process.env.DB_HOST,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME
});

// Check if there is a connection
db.connect((err)=> {
    //If there is no connection 
    if(err) return console.log('Error connecting to mysql');


    //if connection works successfully
    console.log('Connected to MYSQL as id: ', db.threadId);
})

// <YOUR code goes down here
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


// Data.ejs file is in the views folder
app.get('/patients', (req,res) => {

    // QUESTION 1
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
        if (err){
            console.error(err);
            res.status(500).send('Error retrieving data')
        } else { 
            // display the records 
            res.render('patients',{results: results});
        }
        });
});

// QUESTION 2
app.get('/providers', (req,res) => {

    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
        if (err){
            console.error(err);
            res.status(500).send('Error retrieving data')
        } else { 
            res.render('providers',{results: results});
        }
        });
});

// QUESTION 3

app.get('/patients/firstname/:first_name', (req, res) => {
    const firstName = req.params.first_name;

   
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
          
            res.render('patients', { results: results });

        }
    });
});

// QUESTION 4

app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;

    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    
    db.query(query, [specialty], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving providers by specialty');
        } else {
         
            res.render('providers', { results: results });

        }
    });
});

// <YOUR code goes up there

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server listeningg on port ${process.env.PORT}`);

// Sending a message to the browser
console.log('Sending message to browser...')
app.get('/', (req,res) => {
    res.send('Server Started Successfully!');
});

})