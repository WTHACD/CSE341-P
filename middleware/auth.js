// middleware/auth.js
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // If not authenticated, redirect to login page or send an error
  res.status(401).json({ message: 'Unauthorized. Please log in to access this resource.' });
};

module.exports = {
  isAuthenticated,
};
