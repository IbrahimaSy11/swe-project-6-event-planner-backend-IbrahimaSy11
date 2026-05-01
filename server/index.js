require('dotenv').config();
const express = require('express');
const session = require('express-session');
const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');

const authControllers = require('./controllers/authControllers');
const userControllers = require('./controllers/userControllers');
const eventControllers = require('./controllers/eventControllers');
const rsvpControllers = require('./controllers/rsvpControllers');

const app = express();

app.use(express.json());
app.use(express.static('../frontend/dist'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  }
}));
app.use(logRoutes);

app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.get('/api/auth/me', authControllers.me);
app.delete('/api/auth/logout', authControllers.logout);


app.patch('/api/users/:user_id', checkAuthentication, userControllers.update);
app.delete('/api/users/:user_id', checkAuthentication, userControllers.destroy);

app.get('/api/events', eventControllers.list);
app.post('/api/events', checkAuthentication, eventControllers.create);
app.patch('/api/events/:event_id', checkAuthentication, eventControllers.update);
app.delete('/api/events/:event_id', checkAuthentication, eventControllers.destroy);
app.get('/api/users/:user_id/events', eventControllers.listByUser);


app.post('/api/events/:event_id/rsvps', checkAuthentication, rsvpControllers.create);
app.delete('/api/events/:event_id/rsvps', checkAuthentication, rsvpControllers.destroy);
app.get('/api/users/:user_id/rsvps', rsvpControllers.listByUser);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));