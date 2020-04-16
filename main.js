var watcher = require('./watcher');
require('./server');


process.on('unhandledRejection', function (reason, p) {
    console.log('unhandledRejection');
    console.log(reason, p);

}).on('uncaughtException', function (err) {
    console.log("uncaughtException");
    console.log(err);
})


watcher.start()
