"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn(
                    "users",
                    "is_admin",
                    {
                        type: Sequelize.DataTypes.BOOLEAN,
                    },
                    { transaction: t }
                ),
            ]);
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn("users", "is_admin", {
                    transaction: t,
                })
            ]);
        });
    },
};
