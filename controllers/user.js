const express = require('express');
const {postNewUser, getUserHistory} = require('../services/user');
const { auth } = require('../middlewares/auth')
require('dotenv').config();

const router = express.Router();

router
  .post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
      const userCreated = await postNewUser(username, password);
      if (userCreated.success) {
        res.status(userCreated.statusCode).json({
          success: true,
          message: userCreated.message,
          token: userCreated.token 
        });
      } else {
        res.status(userCreated.statusCode).json({ success: false, message: userCreated.message });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  })
  .post('/login', (req, res) => {
    // Kontrollera lösenord mot ett hashat? lösenord i databasen
  })
  .get('/history', auth, async (req, res) => {
    // Leta upp vilka orders det finns på användaren, hämta alla orders på ID från collection orders
    try{
    //authenticate with auth middleware
    const userId = req.user.userId;
    const orderhistory = await getUserHistory(userId)

    res.json(orderhistory)
    } catch (error){
      console.error(error)
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .get('/status', (req, res) => {
    // Kontrollera om en token är giltig eller inte
  });

module.exports = router;
