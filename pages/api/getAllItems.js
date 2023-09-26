import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Items');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
};
