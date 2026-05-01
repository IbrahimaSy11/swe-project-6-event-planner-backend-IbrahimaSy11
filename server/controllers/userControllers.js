const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const update = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).send({ message: 'Password required' });
    const { user_id } = req.params;
    if (Number(user_id) !== req.session.userId) {
      return res.status(403).send({ message: 'Forbidden' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = await userModel.update(user_id, password_hash);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const destroy = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (Number(user_id) !== req.session.userId) {
      return res.status(403).send({ message: 'Forbidden' });
    }
    const user = await userModel.destroy(user_id);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { update, destroy };