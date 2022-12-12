const express = require('express');
const pages = require('./routes/pages');
const api = require('./routes/api');

module.exports = () => {
  const router = express.Router();

  router.use('/', pages());
  router.use('/api', api());

  return router;
};