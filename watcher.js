process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const { Sequelize, Model, DataTypes } = require('sequelize');
var Storage = require('node-storage');
const got = require('got');
var store = new Storage('./config');
var sleep = require("./utils/sleep")

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
}, { sequelize, modelName: 'metrics' });


// start hitting endpoints
function start() {
    var array = store.get("servers")
    for (let i = 0; i < array.length; i++) {
        monitor(array[i])
    }
}

async function monitor(service) {
    var currentTime = new Date().toISOString()
    console.log(service.uid, ":", currentTime)
    try {
        var response = await got.get(service.endpoint, { retry: { limit: 0 } })
        Metrics.create({ serviceuid: service.uid, statuscode: response.statusCode, status: true })
    } catch (error) {
        if (error.response) {
            Metrics.create({ serviceuid: service.uid, statuscode: error.response.statusCode, status: false })
        } else {
            Metrics.create({ serviceuid: service.uid, statuscode: 0, status: false })
        }
    }
    if (Number.isInteger(service.timeout) && service.timeout < 60) {
        await sleep.start(service.timeout * 60000)
    } else {
        await sleep.start(60000)
    }
    monitor(service)
}


module.exports.start = start