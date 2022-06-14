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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Content-Type, Authorization, X-CSRF-TOKEN'
  );
  next();
});

// csrf
app.use(csrfProtection);

app.get('/api/v1/csrf-token', (req, res) => {
  const csrfToken = req.csrfToken();
  res.json({ csrfToken });
});

// routes
readdirSync('./routes').map((routeName) => {
  app.use('/api/v1', require(`./routes/${routeName}`));
});

app.get('/', (req, res) => {
  res.send({
    status: 'Active',
  });
});

module.exports = app;
