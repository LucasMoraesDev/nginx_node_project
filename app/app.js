const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  const name = `Name_${Math.floor(Math.random() * 1000)}`;
  const queryInsert = `INSERT INTO people(name) VALUES('${name}')`;

  db.query(queryInsert, err => {
    if (err) {
      console.error('Error inserting into database:', err);
      res.send('Error inserting into database');
      return;
    }

    db.query('SELECT * FROM people', (err, results) => {
      if (err) {
        console.error('Error fetching from database:', err);
        res.send('Error fetching from database');
        return;
      }

      let response = `<h1>Full Cycle Rocks!</h1>`;
      response += `<ul>`;
      results.forEach(person => {
        response += `<li>${person.name}</li>`;
      });
      response += `</ul>`;

      res.send(response);
    });
  });
});

app.listen(port, () => {
  console.log(`Node.js app running on port ${port}`);
});