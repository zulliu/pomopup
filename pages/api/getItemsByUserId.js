import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send('User ID is required');
    }

    const result = await pool.query(
      `
      SELECT i.item_id, i.name, i.description, i.scale, i.position, u.quantity 
      FROM Items i 
      JOIN UserItems u ON i.item_id = u.item_id 
      WHERE u.user_id = $1
      `,
      [userId],
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
};
