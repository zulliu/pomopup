import bcrypt from 'bcrypt';
import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { username, password, puppyName } = req.body;
    
    // Check if username already exists
    const existingUser = await pool.query('SELECT user_id FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id', [username, hashedPassword]);
    // Extract the user_id from the result
    const userId = result.rows[0].user_id;

    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === '23505') { // PostgreSQL unique constraint violation
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
};
