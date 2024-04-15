const { readFile } = require('node:fs/promises');
const db = require('../database');
const { differenceInMinutes, addMinutes } = require('date-fns');

const getMenuList = async () => {
  try {
    const menu = await readFile('menu.json');

    return menu.toString('utf-8');
  } catch (err) {
    console.log(err);
  }
};

const postNewOrder = async (order, userId) => {
  try {
    const orderValidation = await validateOrderAndCalculateTotal(
      order.details.order
    );
    if (orderValidation.valid) {
      const minutesEta = Math.floor(Math.random() * (30 - 12 + 1)) + 12;
      const orderEta = addMinutes(new Date(), minutesEta);

      const orderEntity = {
        total: orderValidation.total,
        userId: userId,
        orderDate: new Date(),
        orderEta: orderEta,
      };

      const newOrder = await db.beans.insert(orderEntity);

      return { eta: minutesEta, orderNr: newOrder._id };
    } else return false;
  } catch (err) {}
};

const validateOrderAndCalculateTotal = async (order) => {
  const menuJSON = await getMenuList();
  let total = 0;
  const { menu } = JSON.parse(menuJSON);

  for (const item of order) {
    const menuItem = menu.find((menuItem) => menuItem.title === item.name);

    if (!menuItem || Math.abs(menuItem.price - item.price) > 0.0001) {
      return { valid: false, total: 0 };
    }
    total += menuItem.price;
  }
  return { valid: true, total };
};

const getOrderEta = async (orderNr, userId) => {
  try {
    const user = userId != undefined ? userId : null;
    const order = await db.beans.findOne({ _id: orderNr, userId: user });
    if (order) {
      const currentTime = new Date();
      const orderEtaTime = new Date(order.orderEta);

      const minutesLeft = differenceInMinutes(orderEtaTime, currentTime);

      if (minutesLeft > 0) {
        return { status: 200, eta: minutesLeft };
      } else {
        return { status: 400, error: 'Order ska ha anlänt.' };
      }
    } else {
      throw new Error('Hittar inte order i systemet');
    }
  } catch (err) {
    return { status: 404, error: err.message };
  }
};

module.exports = { getMenuList, postNewOrder, getOrderEta };
