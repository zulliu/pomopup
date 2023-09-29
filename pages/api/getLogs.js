import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).send('User ID is required');
    }

    // Query to get logs for the specified user
    const result = await pool.query('SELECT * FROM TimerLogs WHERE user_id = $1', [userId]);

    // If there are no logs for this user, return an empty array instead of a 404 error
    if (result.rowCount === 0) {
      return res.status(200).json([]);
    }

    // Return the logs for this user
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
