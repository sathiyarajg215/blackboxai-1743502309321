const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/authMiddleware');

// Create new order
router.post('/', authenticate, (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  
  // Validate input
  if (!items || !items.length || !shippingAddress || !paymentMethod) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Start transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Create order
    db.run(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [req.user.id, total, 'pending'],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to create order' });
        }

        const orderId = this.lastID;

        // Add order items
        const stmt = db.prepare(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)'
        );

        items.forEach(item => {
          stmt.run(orderId, item.product_id, item.quantity, item.price);
        });

        stmt.finalize(err => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Failed to add order items' });
          }

          db.run('COMMIT');
          res.status(201).json({ orderId });
        });
      }
    );
  });
});

// Get user's orders
router.get('/', authenticate, (req, res) => {
  db.all(
    `SELECT o.id, o.total, o.status, o.created_at 
     FROM orders o 
     WHERE o.user_id = ? 
     ORDER BY o.created_at DESC`,
    [req.user.id],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(orders);
    }
  );
});

module.exports = router;