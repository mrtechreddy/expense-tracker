// routes/expenses.js
const express = require('express');
const db = require('../config/db');
const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

router.get('/add', requireAuth, (req, res) => {
  res.render('addExpense');
});

router.post('/add', requireAuth, (req, res) => {
  const { category, amount, date } = req.body;
  const d = date && date.trim() ? date : new Date().toISOString().slice(0, 10);
  const amt = Number(amount) || 0;

  db.run(`INSERT INTO expenses (user_id, category, amount, date) VALUES (?, ?, ?, ?)`,
    [req.session.userId, category, amt, d], function (err) {
      if (err) {
        console.error(err);
        return res.send('Error saving expense.');
      }
      res.redirect('/dashboard');
    });
});

router.get('/expenses', requireAuth, (req, res) => {
  db.all(`SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC`, [req.session.userId], (err, rows) => {
    if (err) return res.send('DB error.');
    res.render('expenses', { expenses: rows });
  });
});

module.exports = router;

