const postNewUser = async (username, password) => {
  try {
    await db.users.findOne({ username });

    // Logik för att se om befintligt användarnamn fortfarande finns, annars skapa upp användare och returnera ett lyckat avslut
  } catch {
    return false;
  }
};
