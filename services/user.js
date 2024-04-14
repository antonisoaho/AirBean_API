const db = require('../database');
const jwt = require('jsonwebtoken');

const postNewUser = async (username, password) => {
      // Logik för att se om befintligt användarnamn fortfarande finns, annars skapa upp användare och returnera ett lyckat avslut
  try {
    const userExists = await db.users.findOne({ username });

    if (userExists) {
      return { statusCode: 400, success: false, message: "Användarnamnet finns redan" };
    } else {
      return new Promise((resolve, reject) => {
        const newUser = { username, password };
        db.users.insert(newUser, (err, newDoc) => {
          if (err) {
            reject({ statusCode: 500, success: false, message: "Internal Server Error" });
          } else {
            const token = jwt.sign(
              { userId: newDoc._id, username: username },
              process.env.JWT_KEY,
              { expiresIn: '24h' }
            );
            resolve({ statusCode: 201, success: true, message: "Användare skapad", token: token });
          }
        });
      });
    }
  } catch (error){
      if(error.code === 'ECONNREFUSED'){
        console.error("Database connection refused:", error);
            return { statusCode: 500, success: false, message: "Database connection refused" };
      } else {
        console.error("Database error:", error);
          return { statusCode: 500, success: false, message: "Ett fel uppstod med databasen när användaren skulle skapas" };
    }
  }
};
const getUserHistory = async (userId) =>{
  // hitta orders kopplat till id of said user  
  try {

    //temportärt findOne och id som returneras innan vi har våran orders.db set up (skall vara db.beans se för historiken av ordrar)
    const userHistory = await db.users.findOne({ _id: userId }, { _id: 1 });
    return userHistory._id;

  } catch (error) {
    console.error("Error fetching user history:", error);
    throw error; 
  }
}


module.exports = {postNewUser, getUserHistory}