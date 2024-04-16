const express = require("express");
const { postNewUser, getUserHistory, loginUser } = require("../services/user");
const { auth, validateToken } = require("../middlewares/auth");
require("dotenv").config();

const router = express.Router();

router
  .post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
      const userCreated = await postNewUser(username, password);
      if (userCreated.success) {
        res.status(userCreated.statusCode).send({
          success: true,
        });
      } else {
        res.status(userCreated.statusCode).send({ success: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ success: false, message: "Internal Server Error" });
    }
  })
  .post("/login", async (req, res) => {
    const { username, password } = req.body;

    const login = await loginUser(username, password);

    res.status(login.status);
    if ((login.status = 200)) {
      res.send({ success: login.success, token: login.token });
    } else {
      res.send({ success: login.success });
    }
  })
  .get("/history", auth, async (req, res) => {
    // Leta upp vilka orders det finns på användaren, hämta alla orders på ID från collection orders
    try {
      //authenticate with auth middleware
      const userId = req.user.userId;
      const orderhistory = await getUserHistory(userId);

      res.send(orderhistory);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  })
  .get("/status", (req, res) => {
    let response = {};
    try {
      response.success = validateToken(req);

      res.send(response);
    } catch (error) {
      response.success = false;
      response.error = error.message;

      res.status(401).send(response);
    }
  });

module.exports = router;
