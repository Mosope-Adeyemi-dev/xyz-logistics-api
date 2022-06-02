require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { readdirSync } = require('fs');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const csrfProtection = csrf({ cookie: true });

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.json());
// parse cookies: we need this because "cookie" is true in csrfProtection
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//cors
app.use((req, res, next) => {
  const allowedOrigins = ['*'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH'
  );
  res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization');
  next();
});

// routes
readdirSync('./routes').map((routeName) => {
  app.use('/api/v1', require(`./routes/${routeName}`));
});

// csrf
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get('/', (req, res) => {
  res.send({
    status: 'Active',
  });
});

module.exports = app;
