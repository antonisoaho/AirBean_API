const postNewUser = async (username, password) => {
      // Logik för att se om befintligt användarnamn fortfarande finns, annars skapa upp användare och returnera ett lyckat avslut
  try {
    const userExists = await db.users.findOne({ username });

    if (userExists){
      return { success: false, message: "Användarnamnet finns redan" };
    } else {
      const newUser = { username, password };
      await db.users.insert(newUser);
      return { success: true, message: "Användare skapad" };
    }
  } catch (error){
      if(error.code === 'ECONNREFUSED'){
        console.error("Database connection refused:", error);
            return { success: false, message: "Database connection refused" };
      } else {
        console.error("Database error:", error);
          return { success: false, message: "Ett fel uppstod med databasen när användaren skulle skapas" };
    }
  }
};
