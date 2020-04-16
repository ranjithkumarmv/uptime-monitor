function start(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

module.exports.start = start
