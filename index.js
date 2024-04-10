const Datastore = require('nedb-promise');
const express = require('express');
const UserController = require('./controllers/user');
const BeanController = require('./controllers/beans');

const db = {};

db.users = new Datastore({
  filename: './collections/users.db',
  autoload: true,
});
db.beans = new Datastore({
  filename: './collections/orders.db',
  autoload: true,
});

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listens on port ${PORT}`);
});

app.use('/api/user', UserController);
app.use('/api/beans', BeanController);
