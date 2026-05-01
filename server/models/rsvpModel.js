const pool = require('../db/pool');

const create = async (user_id, event_id) => {
  const result = await pool.query(`
    INSERT INTO rsvps (user_id, event_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *
  `, [user_id, event_id]);
  return result.rows[0] || null;
};

const destroy = async (user_id, event_id) => {
  const result = await pool.query(`
    DELETE FROM rsvps WHERE user_id = $1 AND event_id = $2
    RETURNING *
  `, [user_id, event_id]);
  return result.rows[0] || null;
};

const listByUser = async (user_id) => {
  const result = await pool.query(`
    SELECT events.*, users.username, COUNT(r2.rsvp_id) AS rsvp_count
    FROM rsvps
    JOIN events ON rsvps.event_id = events.event_id
    JOIN users ON events.user_id = users.user_id
    LEFT JOIN rsvps r2 ON events.event_id = r2.event_id
    WHERE rsvps.user_id = $1
    GROUP BY events.event_id, users.username
    ORDER BY events.date ASC
  `, [user_id]);
  return result.rows;
};

module.exports = { create, destroy, listByUser };