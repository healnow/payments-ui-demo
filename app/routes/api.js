const express = require('express');
const axios = require('axios');

module.exports = () => {
  const router = express.Router();

  router.post('/payments', (req, res) => {
    const { token } = req.body;

    // Make an API call to create an order
    axios.post(`${process.env.API_URL}/orders`, {
      description: 'Test payment by John Doe',
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
      meta: {
        foo: 'bar'
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

  router.get('/patients', (req, res) => {
    const { page, per_page } = req.query;

    axios.get(`${process.env.API_URL}/patients`, {
      params: {
        page: page ?? 1,
        per_page: per_page ?? 20
      },
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

  router.post('/cards', (req, res) => {
    const { token, patient_id } = req.body;

    // Make an API call to create an order
    axios.post(`${process.env.API_URL}/patients/${patient_id}/cards`, {
      token: token
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

  return router;
};