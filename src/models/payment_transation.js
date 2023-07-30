'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Payment_Transation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Payment_Transation.init({
        order_id: DataTypes.INTEGER,
        amount: DataTypes.INTEGER,
        payment_status: DataTypes.STRING,
        transation_date: DataTypes.DATE,
        payment_gateway_info: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Payment_Transation',
        tableName: 'payment_transations'
    });
    return Payment_Transation;
};