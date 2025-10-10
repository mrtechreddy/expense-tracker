// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const router = express.Router();

router.get('/signup', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('Username and password required.');

  try {
    const hashed = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashed], function (err) {
      if (err) {
        if (err.message && err.message.includes('UNIQUE')) {
          return res.send('Username already taken. <a href="/signup">Try again</a>');
        }
        return res.send('Error creating user.');
      }
      res.redirect('/login');
    });
  } catch (e) {
    res.send('Server error.');
  }
});

router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send('Username and password required.');

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) return res.send('DB error.');
    if (!user) return res.send('User not found. <a href="/login">Try again</a>');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send('Incorrect password. <a href="/login">Try again</a>');

    // set session
    req.session.userId = user.id;
    req.session.username = user.username;
    res.redirect('/dashboard');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;

