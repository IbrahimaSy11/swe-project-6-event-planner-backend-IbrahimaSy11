const eventModel = require('../models/eventModel');

const VALID_TYPES = ['conference', 'workshop', 'social', 'networking', 'concert', 'sports', 'fundraiser', 'other'];

const list = async (req, res) => {
  try {
    const events = await eventModel.list();
    res.send(events);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const listByUser = async (req, res) => {
  try {
    const events = await eventModel.listByUser(req.params.user_id);
    res.send(events);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, date, location, event_type, max_capacity } = req.body;
    if (!title || !date || !location || !event_type || !max_capacity) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    if (!VALID_TYPES.includes(event_type)) {
      return res.status(400).send({ message: 'Invalid event_type' });
    }
    const event = await eventModel.create({
      title, description, date, location, event_type, max_capacity,
      user_id: req.session.userId
    });
    res.status(201).send(event);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const event = await eventModel.find(req.params.event_id);
    if (!event) return res.status(404).send({ message: 'Event not found' });
    if (event.user_id !== req.session.userId) {
      return res.status(403).send({ message: 'Forbidden' });
    }
    const updated = await eventModel.update(req.params.event_id, req.body);
    res.send(updated);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const destroy = async (req, res) => {
  try {
    const event = await eventModel.find(req.params.event_id);
    if (!event) return res.status(404).send({ message: 'Event not found' });
    if (event.user_id !== req.session.userId) {
      return res.status(403).send({ message: 'Forbidden' });
    }
    const deleted = await eventModel.destroy(req.params.event_id);
    res.send(deleted);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { list, listByUser, create, update, destroy };