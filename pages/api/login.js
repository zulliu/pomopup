import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Log attempt (remove in production)
    console.log(`Login attempt for user: ${username}`);
    
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].password);
      if (validPassword) {
        const { password: userPassword, ...userData } = user.rows[0];

        // Create a JWT token with user data
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '1h', // token will expire in 1 hour
        });

        // Send token back to the client
        res.status(200).json({ token });
      } else {
        console.log(`Invalid password for user: ${username}`);
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      console.log(`User not found: ${username}`);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
