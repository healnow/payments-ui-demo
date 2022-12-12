const express = require('express');

module.exports = () => {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('index', {
      client_key: process.env.CLIENT_KEY,
      base_url: process.env.CHECKOUT_URL
    });
  });

  router.get('/card', (req, res) => {
    res.render('card', {
      client_key: process.env.CLIENT_KEY,
      base_url: process.env.CHECKOUT_URL
    });
  });

  return router
};