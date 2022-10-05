const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');

require('dotenv').config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    client_key: process.env.CLIENT_KEY,
    base_url: process.env.CHECKOUT_URL
  });
});

app.post('/payment', (req, res) => {
  const { token } = req.body;

  // Make an API call to create an order
  axios.post(`${process.env.API_URL}/orders`, {
    patient: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@helnow.io'
    },
    card: {
      // Use token received by payment form
      token: token,
      save: true
    },
    items: [
      {
        name: 'Line item 1',
        price_in_cents: 200,
        tax_in_cents: 30
      },
      {
        name: 'Line item 2',
        price_in_cents: 400,
        tax_in_cents: 50
      }
    ]
  }, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`
    }
  }).then(response => {
    res.json(response.data);
  }).catch(error => {
    res.status(400);
    res.json(error.response.data);
  });
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
