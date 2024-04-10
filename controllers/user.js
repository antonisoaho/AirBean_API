const express = require('express');

const router = express.Router();

router
  .post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
      const userCreated = await postNewUser(username, password);
    } catch (err) {
      console.log(err);
    }
  })
  .post('/login', (req, res) => {
    // Kontrollera lösenord mot ett hashat? lösenord i databasen
  })
  .get('/history', (req, res) => {
    // Leta upp vilka orders det finns på användaren, hämta alla orders på ID från collection orders
  })
  .get('/status', (req, res) => {
    // Kontrollera om en token är giltig eller inte
  });

module.exports = router;
