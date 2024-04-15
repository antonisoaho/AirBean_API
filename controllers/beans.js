const express = require('express');
const { getMenuList, postNewOrder, getOrderEta } = require('../services/beans');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router
  .get('/', async (req, res) => {
    const response = await getMenuList();
    res.status(200).send(response);
  })
  .post(
    '/order',
    (req, res, next) => {
      if (req.headers['authorization']) {
        auth(req, res, next);
      } else {
        next();
      }
    },
    async (req, res) => {
      const orderRequest = req.body;
      const userId = req.user ? req.user.userId : null;

      try {
        const response = await postNewOrder(orderRequest, userId);

        if (response == undefined || response === false)
          throw new Error('Verkar vara något tokigt med din beställning');

        res.status(201).send(response);
      } catch (err) {
        res.status(400).send({ success: false, error: err.message });
      }
    }
  )
  .get(
    '/order/status/:orderNr',
    (req, res, next) => {
      if (req.headers['authorization']) {
        auth(req, res, next);
      } else {
        next();
      }
    },
    async (req, res) => {
      try {
        const orderNr = req.params.orderNr;
        const userId = req.user ? req.user.userId : null;

        const response = await getOrderEta(orderNr, userId);
        const { status, eta } = response;
        res.status(status).send({ eta });
      } catch (err) {
        console.log('err', err);
        res.status(401).send({ success: false, error: err.message });
      }
    }
  );

module.exports = router;
