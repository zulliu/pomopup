import bcrypt from 'bcrypt';
import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).send('Server error');
  }
};
