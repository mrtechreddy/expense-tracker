// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const apiRoutes = require('./routes/api');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// session - for demo use env var for secret in production
app.use(session({
  secret: process.env.SESSION_SECRET || 'devSecret123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// expose session to views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// routes
app.use('/', authRoutes);
app.use('/', expenseRoutes);
app.use('/api', apiRoutes);

// dashboard (simple render - client will fetch /api/summary)
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('dashboard'); // dashboard.ejs will call /api/summary via JS
});

// default
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 ExpenseTrackr running at http://localhost:${PORT}`));

