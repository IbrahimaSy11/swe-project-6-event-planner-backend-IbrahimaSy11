const checkAuthentication = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).send({ message: 'Not authenticated' });
  }
  next();
};

module.exports = checkAuthentication;