const express = require('express');
const router = express.Router();
const passport = require('passport');

// --- Auth Routes ---
// Check authentication status
router.get('/auth/status', /* #swagger.tags = ['Authentication'] */ (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      isAuthenticated: true,
      user: req.user
    });
  } else {
    res.status(401).json({
      isAuthenticated: false,
      message: 'Not authenticated'
    });
  }
});

// Redirects to GitHub for authentication
router.get('/login', /* #swagger.tags = ['Authentication'] */ (req, res, next) => {
  passport.authenticate('github', {
    successReturnToOrRedirect: '/api-docs',
    failureRedirect: '/api-docs',
    failureMessage: true
  })(req, res, next);
});

// GitHub callback route
router.get('/auth/github/callback', /* #swagger.tags = ['Authentication'] */
  passport.authenticate('github', { 
    failureRedirect: '/api-docs',
    failureMessage: true,
    session: true
  }),
  (req, res) => {
    res.redirect('/api-docs');
  }
);

// Logout route
router.get('/logout', /* #swagger.tags = ['Authentication'] */ (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'You are not logged in' });
    }
    
    req.logout(function(err) {
        if (err) { 
            return res.status(500).json({ message: 'Error during logout' });
        }
        req.session.destroy(function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error destroying session' });
            }
            res.status(200).json({ message: 'Logged out successfully' });
        });
    });
});
// --- End Auth Routes ---

router.use('/menuItems', require('./menuItems'));
router.use('/orders', require('./orders'));

module.exports = router;
