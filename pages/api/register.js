import bcrypt from 'bcrypt';
import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id', [username, hashedPassword]);
    // Extract the user_id from the result
    const userId = result.rows[0].user_id;

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
