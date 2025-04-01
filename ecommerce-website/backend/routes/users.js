const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/authMiddleware');

// Get current user profile
router.get('/me', authenticate, (req, res) => {
  db.get(
    'SELECT id, email, role, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// Update user profile
router.put('/me', authenticate, (req, res) => {
  const { email } = req.body;
  
  db.run(
    'UPDATE users SET email = ? WHERE id = ?',
    [email, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Profile updated' });
    }
  );
});

module.exports = router;