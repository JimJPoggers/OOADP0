const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a quiz table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Quiz = db.define('quiz', {
    question: {
        type: Sequelize.STRING
    },
    choiceA: {
        type: Sequelize.STRING
    },
    choiceB: {
        type: Sequelize.STRING
    },
    choiceC: {
        type: Sequelize.STRING
    },
    correct: {
        type: Sequelize.STRING
    }
});

module.exports = Quiz;