'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('tests', 'explanation', {
                    type: Sequelize.DataTypes.STRING
                }, { transaction: t })
            ]);
        });
    },
    down: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.addColumn('tests', 'explanation', {
                    type: Sequelize.DataTypes.STRING
                }, { transaction: t })
            ]);
        });
    }
};
