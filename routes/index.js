const express = require('express');
const router = express.Router();
const passport = require('passport');

// --- Auth Routes ---
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
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/api-docs');
      });
});
// --- End Auth Routes ---

router.use('/menuItems', require('./menuItems'));
router.use('/orders', require('./orders'));

module.exports = router;
