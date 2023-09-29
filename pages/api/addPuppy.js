import pool from '../../src/app/lib/db';

export default async (req, res) => {
  try {
    const { user_id, mesh_id, puppy_name } = req.body;
    await pool.query('INSERT INTO puppy (user_id, mesh_id, puppy_name, active) VALUES ($1, $2, $3, TRUE)', [user_id, mesh_id, puppy_name]);
    res.status(201).send('Puppy information added successfully');
  } catch (err) {
    res.status(500).send('Server error');
  }
};
