const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send({ message: 'Username and password required' });
    }
    const existing = await userModel.findByUsername(username);
    if (existing) {
      return res.status(409).send({ message: 'Username already taken' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.create(username, password_hash);
    req.session.userId = user.user_id;
    req.session.username = user.username;
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findByUsername(username);
    if (!user) return res.status(401).send({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).send({ message: 'Invalid credentials' });
    req.session.userId = user.user_id;
    req.session.username = user.username;
    res.send({ user_id: user.user_id, username: user.username });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const me = (req, res) => {
  if (!req.session.userId) return res.status(401).send(null);
  res.send({ user_id: req.session.userId, username: req.session.username });
};

const logout = (req, res) => {
  req.session = null;
  res.send({ message: 'Logged out.' });
};

module.exports = { register, login, me, logout };