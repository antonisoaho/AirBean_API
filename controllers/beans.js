const express = require('express');
const { getMenuList, postNewOrder } = require('../services/beans');
const router = express.Router();

router
  .get('/', async (req, res) => {
    const response = await getMenuList();
    res.status(200).send(response);
  })
  .post('/order', async (req, res) => {
    const { Authorization } = req.headers;
    const orderRequest = req.body;

    try {
      const response = await postNewOrder(orderRequest, Authorization);

      //Returnera rätt svar till swagger-docs
    } catch (err) {}
  })
  .get('/order/status/:orderNr', async (req, res) => {
    // Hämta params.orderNr och kontrollera status på order i databasen.
  });

module.exports = router;
