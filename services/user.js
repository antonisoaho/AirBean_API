const db = require('../database');
const jwt = require('jsonwebtoken');

const postNewUser = async (username, password) => {
  // Logik för att se om befintligt användarnamn fortfarande finns, annars skapa upp användare och returnera ett lyckat avslut
  try {
    const userExists = await db.users.findOne({ username });

    if (userExists) {
      return {
        statusCode: 400,
        success: false,
        message: 'Användarnamnet finns redan',
      };
    } else {
      const newUser = { username, password };
      const userRegistered = await db.users.insert(newUser);

      if (!userRegistered) {
        return {
          statusCode: 500,
          success: false,
          message: 'Internal Server Error',
        };
      } else {
        return {
          statusCode: 201,
          success: true,
          message: 'Användare skapad',
        };
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      success: false,
      message: 'Ett fel uppstod med databasen när användaren skulle skapas',
    };
  }
};

const loginUser = async (username, password) => {
  let status = 400,
    success = false,
    token;
  try {
    const user = await db.users.findOne({ username: username }, (err, doc) => {
      if (err) return null;

      return doc;
    });
    console.log('user', user);

    if (user) {
      const passwordMatch = password === user.password;

      if (passwordMatch) {
        status = 200;
        success = true;
        token = jwt.sign(
          { userId: user._id, username: user.username },
          process.env.JWT_KEY,
          { expiresIn: '8h' }
        );
      }
    } else {
      status = 404;
    }
    return { status, success, token };
  } catch (err) {
    return { status: 500, success };
  }
};

const getUserHistory = async (userId) => {
  try {
    const userHistory = await db.beans.find({ userId });

    let response = { success: true };

    if (userHistory) {
      response = { success: true, orderHistory: [] };

      userHistory.map((order) =>
        response.orderHistory.push({
          total: order.total,
          orderNr: order._id,
          orderDate: order.orderDate,
        })
      );
      console.log('userHistory', userHistory);
    } else {
      response = {
        success: false,
        error: 'Ingen historik funnen på användaren',
      };
    }

    return response;
  } catch (error) {
    console.error('Error fetching user history:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { postNewUser, getUserHistory, loginUser };
