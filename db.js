const { Sequelize, Model, DataTypes } = require('sequelize');
var Storage = require('node-storage');
var store = new Storage('./config');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite'
});

class Metrics extends Model { }
Metrics.init({
    serviceuid: DataTypes.STRING,
    statuscode: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
}, { sequelize, modelName: 'metrics' });

async function getData() {
    var array = store.get("servers")
    var data = new Object;
    for (let i = 0; i < array.length; i++) {
        data[array[i].uid] = await getDataForService(array[i].uid)
        data[array[i].uid]["name"] = array[i].name
    }
    return data
}



async function getDataForService(serviceuid) {
    var time = []
    var status = []
    await Metrics.findAll({ where: { serviceuid: serviceuid } }).then(metrics => {
        for (let i = 0; i < metrics.length; i++) {
            var date = new Date(metrics[i].get("createdAt")).toISOString()
            time.push(date)
            if (metrics[i].status) {
                status.push(100)
            } else {
                status.push(-100)
            }
        }
    })
    return { time: time, status: status }
}

module.exports.getData = getData