const Datastore = require('nedb-promise');

const db = {};
db.users = new Datastore({ filename: './collections/users.db', autoload: true });
db.beans = new Datastore({ filename: './collections/orders.db', autoload: true });

module.exports = db;