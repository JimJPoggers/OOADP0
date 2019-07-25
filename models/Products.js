const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Product = db.define('product', {
    productimage: {
        type: Sequelize.STRING
    },
    productname: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
});
module.exports = Product;