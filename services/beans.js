const { readFile } = require('node:fs/promises');

const getMenuList = async () => {
  try {
    const menu = await readFile('menu.json');

    return menu;
  } catch (err) {
    console.log(err);
  }
};

const postNewOrder = async () => {
  // Lägga in logik för att lägga en ny order och generera ett tal för hur lång tid det kommer ta beroende på hur många aktiva orders som ligger?
};

module.exports = { getMenuList, postNewOrder };
