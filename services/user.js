const postNewUser = async (username, password) => {
      // Logik för att se om befintligt användarnamn fortfarande finns, annars skapa upp användare och returnera ett lyckat avslut
  try {
    const userExists = await db.users.findOne({ username });

    if (userExists){
      return false;
    } else {
      const newUser = { username, password };
      await db.users.insert({newUser});
      return true;
    }
  } catch {
    return false;
  }
};
