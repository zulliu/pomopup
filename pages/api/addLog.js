import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { userId, startTime } = req.body;

    const result = await pool.query(
      'INSERT INTO TimerLogs (user_id, start_time) VALUES ($1, $2) RETURNING log_id',
      [userId, startTime],
    );

    const logId = result.rows[0].log_id;
    res.status(200).json({ logId });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
