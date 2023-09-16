import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    // Assuming you're sending the user's ID in the request's body or query
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(400).send('User ID is required');
    }

    // Query to get logs for the specified user
    const result = await pool.query('SELECT * FROM TimerLogs WHERE user_id = $1', [userId]);

    if (result.rowCount === 0) {
      return res.status(404).send('No logs found for this user');
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).send('Server error');
  }
};
