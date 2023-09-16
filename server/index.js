require('dotenv').config();
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'pomopup',
  port: process.env.DB_PORT,
  ssl: false,
});

nextApp.prepare().then(() => {
  const app = express();
  app.use(bodyParser.json());

  app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
      res.status(201).send('User registered successfully');
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

      if (user.rows.length > 0) {
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (validPassword) {
          res.status(200).send('Login successful');
        } else {
          res.status(401).send('Invalid credentials');
        }
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

  app.get('/tomato-number/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await pool.query('SELECT tomato_number FROM users WHERE user_id = $1', [userId]);
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

  app.all('*', (req, res) => handle(req, res));

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
