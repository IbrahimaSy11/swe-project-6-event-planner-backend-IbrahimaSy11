const rsvpModel = require('../models/rsvpModel');

const create = async (req, res) => {
  try {
    const rsvp = await rsvpModel.create(req.session.userId, req.params.event_id);
    res.status(201).send(rsvp);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const destroy = async (req, res) => {
  try {
    const rsvp = await rsvpModel.destroy(req.session.userId, req.params.event_id);
    res.send(rsvp);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const listByUser = async (req, res) => {
  try {
    const events = await rsvpModel.listByUser(req.params.user_id);
    res.send(events);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { create, destroy, listByUser };