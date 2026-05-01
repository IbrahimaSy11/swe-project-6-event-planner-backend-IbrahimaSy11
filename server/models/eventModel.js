const pool = require('../db/pool');

const list = async () => {
  const result = await pool.query(`
    SELECT events.*, users.username, COUNT(rsvps.rsvp_id) AS rsvp_count
    FROM events
    JOIN users ON events.user_id = users.user_id
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    GROUP BY events.event_id, users.username
    ORDER BY events.date ASC
  `);
  return result.rows;
};

const listByUser = async (user_id) => {
  const result = await pool.query(`
    SELECT events.*, COUNT(rsvps.rsvp_id) AS rsvp_count
    FROM events
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    WHERE events.user_id = $1
    GROUP BY events.event_id
    ORDER BY events.date ASC
  `, [user_id]);
  return result.rows;
};

const find = async (event_id) => {
  const result = await pool.query(
    `SELECT * FROM events WHERE event_id = $1`,
    [event_id]
  );
  return result.rows[0];
};

const create = async ({ title, description, date, location, event_type, max_capacity, user_id }) => {
  const result = await pool.query(`
    INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `, [title, description, date, location, event_type, max_capacity, user_id]);
  return result.rows[0];
};

const update = async (event_id, fields) => {
  const { title, description, date, location, event_type, max_capacity } = fields;
  const result = await pool.query(`
    UPDATE events SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      date = COALESCE($3, date),
      location = COALESCE($4, location),
      event_type = COALESCE($5, event_type),
      max_capacity = COALESCE($6, max_capacity)
    WHERE event_id = $7
    RETURNING *
  `, [title, description, date, location, event_type, max_capacity, event_id]);
  return result.rows[0];
};

const destroy = async (event_id) => {
  const result = await pool.query(
    `DELETE FROM events WHERE event_id = $1 RETURNING *`,
    [event_id]
  );
  return result.rows[0];
};

module.exports = { list, listByUser, find, create, update, destroy };
