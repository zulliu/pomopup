import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send('User ID is required');
    }

    const result = await pool.query(`
    WITH ActivePuppy AS (
        SELECT user_id, puppy_name
        FROM puppy
        WHERE active = TRUE
    )
    SELECT
      u.*,
      json_agg(DISTINCT tl.*) AS timerlogs,
      json_agg(DISTINCT ui.*) AS useritems,
      json_agg(DISTINCT p.*) AS puppies,
      ap.puppy_name AS active_puppy_name
    FROM users u
    LEFT JOIN timerlogs tl ON u.user_id = tl.user_id
    LEFT JOIN useritems ui ON u.user_id = ui.user_id
    LEFT JOIN puppy p ON u.user_id = p.user_id
    LEFT JOIN ActivePuppy ap ON u.user_id = ap.user_id
    WHERE u.user_id = $1
    GROUP BY u.user_id, ap.puppy_name
  `, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).send('User not found');
    }

    const userData = result.rows[0];
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
