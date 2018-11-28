var mediator = require('../mediator.js')
var bemandingsoversigt = require('./bemandingsoversigt.js')
//var tidsUdregner = require('../tidsudregner.js')

var name = 'bemandingsoversigt';

function setup() {
    console.log('setting up ' + name + ' facade')
    subGetView()
    subDataFromDB()
    subPutView()
}

function subGetView() {
    mediator.subscribe('getView', function (arg) {
        if (arg.req.path == '/' + name || arg.req.path == '/') {
            mediator.publish('readFromDB', Object.assign(arg, bemandingsoversigt.getData()))
        }
        else if (arg.req.path == '/bemandingsOversigtTid') {
            mediator.publish('readFromDB', Object.assign(arg, bemandingsoversigt.getTidData()))
        }
    })
}

function subPutView() {
    mediator.subscribe('putView', function (arg) {
        //res = arg.res;
        //req = arg.req;
        try {
            if (arg.req.path == '/bemandingsOversigtTid') {
                if (arg.req.body.ugeTimeOpgaveId)
                    mediator.publish('updateInDB', Object.assign(arg, bemandingsoversigt.updateUgeTimeOpgave(arg.req.body)))//bemandingsoversigt.updateUgeTimeOpgave(req.body))
                else
                    mediator.publish('createInDB', Object.assign(arg, bemandingsoversigt.createUgeTimeOpgave(arg.req.body)))
                //mediator.publish('createInDB', bemandingsoversigt.createUgeTimeOpgave(req.body))
            }
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

function subDataFromDB() {
    mediator.subscribe('dataFromDB', function (arg) {
        if (arg.origin == name) {
            try {
                console.log('render subDataFromDB bemandingsoversigt here')
                //console.log(arg.type)
                let field = arg.data[0].fields

                if (arg.type == 'read') {
                    if (field.orgTable == 'Opgaveloser') {
                        arg.res.render(name, 
                            { 
                                'opgaveloser': arg.data[0].result,
                                //'opgaver':arg.data[1].result 
                            })
                    }
                    else if (field.orgTable == 'OpgaveloserArbejdsTider') {
                        let year = arg.req.query.year
                        let month = arg.req.query.month
                        let weekdays = []
                        bemandingsoversigt.getWeekdaysInMonth(year, month, function (data) {
                            weekdays.push({ 'year': year, 'month': month, 'weeks': data })
                            arg.data.push({ weekdays })

                            bemandingsoversigt.calculateMaxAvailableWorkTimeInMonthsAndWeeks(arg.data[0].result, weekdays, function (opgavelosereMaxAvailableWorkTime) {
                                //console.log(arg.data[1].result)
                                bemandingsoversigt.addUsedHours(opgavelosereMaxAvailableWorkTime, arg.data[1].result, function (usedHours) {
                                    arg.res.json(usedHours)
                                })
                            })
                        })
                    }
                }
                else if (arg.type == 'create') {
                    //console.log('create',arg)
                    arg.res.json({ 'insertId': arg.data[0].result.insertId })
                }
                else if (arg.type == 'update') {
                    //console.log('update',arg)
                    arg.res.json({})
                }
                else {
                    throw 'wrong type in bemandingsoversigt'
                }

            }
            catch (error) {
                mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
            }
        }
    })
}

module.exports = {
    setup: setup
}