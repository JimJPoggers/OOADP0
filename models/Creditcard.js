const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
const Creditcard = db.define('creditcard', {
    CreditCardNum: {
        type: Sequelize.STRING
    },
    ExpiryDate: {
        type: Sequelize.STRING
    },
    SecurityNum: {
        type: Sequelize.STRING
    },
    HolderName: {
        type: Sequelize.STRING
    },
});
module.exports = Creditcard;
verified: {
    type: Sequelize.BOOLEAN
   }