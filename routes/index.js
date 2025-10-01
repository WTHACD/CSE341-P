const express = require('express');
const router = express.Router();
const passport = require('passport');

// --- Auth Routes ---
// Check authentication status
router.get('/auth/status', /* #swagger.tags = ['Authentication'] */ (req, res) => {
  console.log('Status Check - Session:', req.session);
  console.log('Status Check - User:', req.user);
  console.log('Status Check - Is Authenticated:', req.isAuthenticated());
  
  if (req.isAuthenticated()) {
    res.status(200).json({
      isAuthenticated: true,
      user: req.user,
      sessionID: req.sessionID
    });
  } else {
    res.status(401).json({
      isAuthenticated: false,
      message: 'Not authenticated',
      session: req.session ? 'Session exists' : 'No session',
      sessionID: req.sessionID || 'No session ID'
    });
  }
});

// Redirects to GitHub for authentication
router.get('/login', 
  /* #swagger.ignore = true */
  (req, res, next) => {
    passport.authenticate('github', {
      successReturnToOrRedirect: '/api-docs',
      failureRedirect: '/api-docs',
      failureMessage: true
    })(req, res, next);
  });

// GitHub callback route
router.get('/auth/github/callback', /* #swagger.ignore = true */
  passport.authenticate('github', { 
    failureRedirect: '/api-docs',
    failureMessage: true,
    session: true
  }),
  (req, res) => {
    // Log para depuración
    console.log('Auth callback - User:', req.user);
    console.log('Auth callback - Session:', req.session);
    
    // Forzar guardado de sesión
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Failed to save session' });
      }
      res.redirect('/api-docs');
    });
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
