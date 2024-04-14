const express = require('express');
const UserController = require('./controllers/user');
const BeanController = require('./controllers/beans');

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listens on port ${PORT}`);
});

app.use('/api/user', UserController);
app.use('/api/beans', BeanController);
