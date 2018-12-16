var mediator = require('../mediator.js')
var opgaveoversigt = require('./opgaveoversigt.js')

var name = 'opgaveoversigt';

function setup() {
    console.log('setting up ' + name + ' facade')
    subGetView()
    subDataFromDB()
}

function subGetView() {
    mediator.subscribe('getView', function (arg) {
        if (arg.req.path == '/' + name) {
            mediator.publish('readFromDB', Object.assign(arg, opgaveoversigt.getData()))
        }
        else if (arg.req.path == '/' + name + '/deadlines') {
            mediator.publish('readFromDB', Object.assign(arg, opgaveoversigt.getDeadlines(arg.req.query.opgaveId)))
        }
    })
}

function subDataFromDB() {
    mediator.subscribe('dataFromDB', function (arg) {
        try {
            if (arg.origin == name) {
                console.log('render subDataFromDB ' + arg.origin + ' here')
                if (arg.type == 'read') {
                    //calculate used time
                    opgaveoversigt.calculateUsedTimeForOpgave(arg.data, function (data) {
                        arg.res.render(name, { opgaver: data })
                    })

                    // arg.res.render(name, { opgaver: arg.data[0].result, 'usedTimeForOpgaver': opgaveoversigt.calculateUsedTimeForOpgave(arg.data[1].result) })
                }
            }
            else if (arg.origin == name + 'deadlines') {
                arg.res.json(arg.data[0].result)
            }
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

module.exports = {
    setup: setup
}