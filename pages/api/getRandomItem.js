import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Items ORDER BY RANDOM() LIMIT 1');
    const item = result.rows[0];
    res.status(200).json(item);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
};
