const connection = require("../connection");
const Sequelize = require("sequelize");

const ErrorModel = connection.define("ErrorModel", {
    error_type: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    error_message: {
        type: Sequelize.STRING(255),
        allowNull: true
    }
});

module.exports = ErrorModel;