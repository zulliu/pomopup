import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const result = await pool.query('UPDATE users SET tomato_number = tomato_number + 1 WHERE user_id = $1 RETURNING tomato_number', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).send('User not found');
    }

    res.status(200).send('Tomato number updated successfully');
  } catch (err) {
    res.status(500).send('Server error');
  }
};
