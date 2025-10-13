// server.js
require('dotenv').config(); // loads .env variables

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const SQLiteStore = require('connect-sqlite3')(session);

// route imports
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const apiRoutes = require('./routes/api');

const app = express();

// ----------------------------------------------------
// ✅ TRUST PROXY (IMPORTANT for EC2 or public IP usage)
// ----------------------------------------------------
app.set('trust proxy', 1); // respect proxy headers

// ----------------------------------------------------
// VIEW ENGINE
// ----------------------------------------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layout'); // default layout file

// ----------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------------------------------
// ✅ SESSION SETUP
// ----------------------------------------------------
app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: './db' }),
  secret: process.env.SESSION_SECRET || 'devSecret123',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: false,       // set true when HTTPS is enabled
    sameSite: 'lax',       // allows cookies on IP or domain
    secure: false,         // false for HTTP, true for HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// ----------------------------------------------------
// MAKE SESSION ACCESSIBLE TO VIEWS
// ----------------------------------------------------
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ----------------------------------------------------
// ✅ DEBUG LOGGER (helps you trace the reload issue)
// ----------------------------------------------------
app.use((req, res, next) => {
  console.log('👉', req.method, req.url);
  console.log('   SessionID:', req.sessionID);
  console.log('   Session:', req.session);
  next();
});

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------
app.use('/', authRoutes);
app.use('/', expenseRoutes);
app.use('/api', apiRoutes);

// ----------------------------------------------------
// DASHBOARD
// ----------------------------------------------------
app.get('/dashboard', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.render('dashboard', { title: 'Dashboard' });
});

// ----------------------------------------------------
// ROOT REDIRECT
// ----------------------------------------------------
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.redirect('/login');
});

// ----------------------------------------------------
// DEBUG ROUTES
// ----------------------------------------------------
app.get('/session-debug', (req, res) => {
  res.json(req.session);
});

// Quick cookie persistence test
app.get('/test-cookie', (req, res) => {
  req.session.cookieTest = (req.session.cookieTest || 0) + 1;
  res.send(`🍪 Cookie counter: ${req.session.cookieTest}`);
});

// ----------------------------------------------------
// SERVER START
// ----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 ExpenseTrackr running at http://localhost:${PORT}`)
);

