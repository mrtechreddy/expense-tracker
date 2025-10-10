// routes/api.js
const express = require('express');
const db = require('../config/db');
const { forecastNextMonth } = require('../services/forecast');
const moment = require('moment');
const router = express.Router();

function requireAuthJson(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'unauthenticated' });
  next();
}

// summary for dashboard
router.get('/summary', requireAuthJson, (req, res) => {
  const userId = req.session.userId;
  db.all(`SELECT id, category, amount, date FROM expenses WHERE user_id = ? ORDER BY date DESC`, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db' });

    const totalSpent = rows.reduce((s, r) => s + Number(r.amount), 0);

    // category totals
    const totalsByCategory = {};
    rows.forEach(r => {
      totalsByCategory[r.category] = (totalsByCategory[r.category] || 0) + Number(r.amount);
    });

    // date ranges
    const today = moment().format('YYYY-MM-DD');
    const last7 = moment().subtract(6, 'days').format('YYYY-MM-DD'); // last 7 days
    const last30 = moment().subtract(29, 'days').format('YYYY-MM-DD');
    const last90 = moment().subtract(89, 'days').format('YYYY-MM-DD');

    const daily = rows.filter(r => r.date === today);
    const weekly = rows.filter(r => r.date >= last7);
    const monthly = rows.filter(r => r.date >= last30);
    const quarterly = rows.filter(r => r.date >= last90);

    const dailySpent = daily.reduce((s, r) => s + Number(r.amount), 0);
    const weeklySpent = weekly.reduce((s, r) => s + Number(r.amount), 0);
    const monthlySpent = monthly.reduce((s, r) => s + Number(r.amount), 0);
    const quarterlySpent = quarterly.reduce((s, r) => s + Number(r.amount), 0);

    const forecastNext = forecastNextMonth(rows);

    const recent = rows.slice(0, 10);

    res.json({
      totalSpent,
      totalsByCategory,
      dailySpent,
      weeklySpent,
      monthlySpent,
      quarterlySpent,
      forecastNext,
      recent
    });
  });
});

// return list of categories (static)
router.get('/categories', (req, res) => {
  res.json([
    'Gas','Rent','Electricity','Fuel','Mobile','Groceries','Food & Dining',
    'Transportation','Healthcare','Education','Entertainment','Shopping',
    'Insurance','Travel','Maintenance','Internet','Water','Subscription Services','Others'
  ]);
});

module.exports = router;

