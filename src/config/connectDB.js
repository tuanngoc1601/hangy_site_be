const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('hangy_db', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

let connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: true });
        console.log("All models were synchronized successfully.");
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;