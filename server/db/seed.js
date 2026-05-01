require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./pool');

const seed = async () => {
  try {
    await pool.query(`DROP TABLE IF EXISTS rsvps CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS events CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS users CASCADE`);

    await pool.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE events (
        event_id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        event_type TEXT NOT NULL,
        max_capacity INTEGER NOT NULL,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE rsvps (
        rsvp_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
        UNIQUE (user_id, event_id)
      )
    `);

    const password_hash = await bcrypt.hash('password123', 10);

    const usersResult = await pool.query(`
      INSERT INTO users (username, password_hash) VALUES
        ('alice', $1),
        ('bob', $1),
        ('carlos', $1)
      RETURNING user_id
    `, [password_hash]);

    const [alice, bob, carlos] = usersResult.rows;

    const eventsResult = await pool.query(`
      INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) VALUES
        ('React Workshop', 'Hands-on React session', '2025-06-01', 'New York, NY', 'workshop', 30, $1),
        ('Networking Night', 'Meet local devs', '2025-06-15', 'Brooklyn, NY', 'networking', 50, $2),
        ('Charity Run', 'Fun 5k for a cause', '2025-07-04', 'Central Park, NY', 'fundraiser', 100, $3),
        ('Jazz Concert', 'Live jazz evening', '2025-07-20', 'Manhattan, NY', 'concert', 75, $1),
        ('Coding Bootcamp', 'Intro to coding', '2025-08-01', 'Queens, NY', 'conference', 40, $2)
      RETURNING event_id
    `, [alice.user_id, bob.user_id, carlos.user_id]);

    const [e1, e2, e3] = eventsResult.rows;

    await pool.query(`
      INSERT INTO rsvps (user_id, event_id) VALUES
        ($1, $2),
        ($3, $2),
        ($1, $4)
    `, [bob.user_id, e1.event_id, carlos.user_id, e2.event_id]);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();