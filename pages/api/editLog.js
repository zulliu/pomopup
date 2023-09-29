import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { logId, endTime, memo } = req.body;

    await pool.query(
      'UPDATE TimerLogs SET end_time = $1, memo = $2 WHERE log_id = $3',
      [endTime, memo, logId],
    );

    res.status(200).send('Log updated successfully');
  } catch (err) {
    res.status(500).send('Server error');
  }
};
