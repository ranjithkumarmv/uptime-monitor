const { Sequelize, Model, DataTypes } = require('sequelize');


// ********** WARNING RUNNING THIS CODE WILL DROP DB ********** //
// DO NOT RUN BEFORE BACKUP

// prepare db and trigger monitor
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite'
});

class Metrics extends Model { }
Metrics.init({
    serviceuid: DataTypes.STRING,
    statuscode: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
}, {
    indexes: [
        {
            fields: ['serviceuid']
        }]
    , sequelize, modelName: 'metrics'
});



sequelize.sync({ force: true })
    .then(() => console.log("DB Synced"))
