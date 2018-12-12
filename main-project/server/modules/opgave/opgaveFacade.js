var mediator = require('../mediator.js')
var opgave = require('./opgave.js')
var tilfojopgaveloser = require('./tilfojopgaveloser.js')

var name = 'opgave';
var profiler = [opgave, tilfojopgaveloser]

function setup() {
    console.log('setting up ' + name + ' facade')
    subDataFromDB()
    subGetView()
    subPostView()
    subPutView()
    subDeleteView()
}

function subGetView() {
    mediator.subscribe('getView', function (arg) {
        if (arg.req.path == '/' + name) {//name is "opgave"
            if (arg.req.query.opgaveId != undefined) {//if it contains a opgaveId, get specific opgave from db
                mediator.publish('readFromDB', Object.assign(arg, opgave.getOpgaveById(arg.req.query.opgaveId)))
            }
            else {//else just get required data (from db) for creating a new opgave (opgavetype, lokation etc.)
                mediator.publish('readFromDB', Object.assign(arg, opgave.getData()))
            }
        }
    })
    mediator.subscribe('getView', function (arg) {
        if (arg.req.path == '/tilfojopgaveloser') {
            //console.log(arg.req.query)
            //arg.req.query.opgaveId
            mediator.publish('readFromDB', Object.assign(arg, tilfojopgaveloser.getData(arg.req.query.opgaveId)))
            //arg.res.render('tilfojopgaveloser')//TODO
        }
    })
    mediator.subscribe('getView', function (arg) {
        if (arg.req.path == '/tilfojopgaveloserTid') {
            //arg.req.query.opgaveId
            console.log(arg.req.query)

            mediator.publish('readFromDB', Object.assign(arg, tilfojopgaveloser.getTidData(arg.req.query.startDate, arg.req.query.slutDate)))
            //arg.res.render('tilfojopgaveloser')//TODO
        }
    })
}

function subPostView() {
    mediator.subscribe('postView', function (arg) {
        try {
            if (arg.req.path == '/' + name) {
                opgave.saveData(arg.req.body, function (data) {
                    mediator.publish('createInDB', Object.assign(arg, data))
                })
            }
            else if (arg.req.path == '/tilfojopgaveloser') {
                //09-11 4 05:40 og 07:45
                let opgaveloser = arg.req.body
                console.log(opgaveloser)
                console.log(parseFloat(opgaveloser.timeAntal))
                //console.log(opgaveloser.weekdays.months)
                if (opgaveloser.type == 'newOpgaveloser') {

                    tilfojopgaveloser.calculateHoursForMonths(parseFloat(opgaveloser.timeAntal), opgaveloser.weekdays.months, function (d) {

                        tilfojopgaveloser.saveNewOpgavelosere(opgaveloser, d, function (data) {
                            //console.log(data)
                            mediator.publish('createInDB', Object.assign(arg, data))
                        })
                    })
                }
                else if (opgaveloser.type == 'changedOpgaveloser') {
                    // let start = new Date(opgaveloser.startDato)
                    // let slut = new Date(opgaveloser.slutDato)
                    // let startDate = start.getFullYear() + '-' + (start.getMonth()+1) + '-' + start.getDate()
                    // let slutDate = slut.getFullYear() + '-' + (slut.getMonth()+1) + '-' + slut.getDate()

                    //mediator.publish('deleteInDB', Object.assign(arg, tilfojopgaveloser.deleteUgeTimeOpgave(opgaveloser, startDate, slutDate)))

                    tilfojopgaveloser.calculateHoursForMonths(parseFloat(opgaveloser.timeAntal), opgaveloser.weekdays.months, function (d) {
                        //console.log(d)
                        tilfojopgaveloser.saveChangedOpgavelosere(opgaveloser, d, function (data) {
                            //console.log(data)
                            mediator.publish('createInDB', Object.assign(arg, data))
                            // mediator.publish('replaceInDB', Object.assign(arg, data))
                        })
                    })
                }
            }
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

function subPutView() {
    mediator.subscribe('putView', function (arg) {
        try {
            if (arg.req.path == '/' + name) {
                console.log('put opgave')
                if (arg.req.body.opgaveId)
                    opgave.updateOpgave(arg.req.body, function (data) {
                        mediator.publish('updateInDB', Object.assign(arg, data))
                    })

            }
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

function subDeleteView() {
    mediator.subscribe('deleteView', function (arg) {
        try {
            if (arg.req.path == '/' + name) {
                console.log('delete opgave')
                if (arg.req.body.opgaveId)
                    mediator.publish('deleteInDB', Object.assign(arg, opgave.deleteOpgave(arg.req.body)))
            }
            else if (arg.req.path == '/' + name + 'DeleteDeadlines') {
                console.log('delete deadlines')
                if (arg.req.body.deadlinesToRemove)
                    mediator.publish('deleteInDB', Object.assign(arg, opgave.deleteDeadlines(arg.req.body)))
            }
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

function subDataFromDB() {
    mediator.subscribe('dataFromDB', function (arg) {
        try {
            if (arg.origin == 'opgave') {
                console.log('render subDataFromDB opgave here')
                if (arg.type == 'read')
                    arg.res.render('opgave', {
                        'muligeOpgaveloser': arg.data[0].result,
                        'opgavetype': arg.data[1].result,
                        'opgavestatus': arg.data[2].result,
                        'kontraktstatus': arg.data[3].result,
                        'lokation': arg.data[4].result,
                        'opgavestiller': arg.data[5].result,
                        'kundeansvarlig': arg.data[6].result,
                        'kunde': arg.data[7].result
                    })
                else if (arg.type == 'create')
                    arg.res.redirect('opgaveoversigt')
                else if (arg.type == 'update')
                    arg.res.json({})
                else if (arg.type == 'delete')
                    arg.res.json({})

            }
            else if (arg.origin == name + 'specific') {
                let bemandetTimerTotal = {}
                if (arg.data[11].result.length > 0) {
                    bemandetTimerTotal = arg.data[11].result.reduce((a, b) => ({ 'timeAntal': a.timeAntal + b.timeAntal }))
                }

                arg.res.render('opgave', {
                    'muligeOpgaveloser': arg.data[0].result,
                    'opgavetype': arg.data[1].result,
                    'opgavestatus': arg.data[2].result,
                    'kontraktstatus': arg.data[3].result,
                    'lokation': arg.data[4].result,
                    'opgavestiller': arg.data[5].result,
                    'kundeansvarlig': arg.data[6].result,
                    'kunde': arg.data[7].result,
                    'opgaveInfo': arg.data[8].result[0],
                    'deadlines': arg.data[9].result,
                    'opgavelosere': arg.data[10].result,
                    'bemandetTimerTotal': bemandetTimerTotal,
                })
            }
            else if (arg.origin == 'tilfojopgaveloser') {
                for (let i = 0; i < arg.data[6].result.length; i++) {
                    arg.data[6].result[i].timeAntal = 0
                    for (let j = 0; j < arg.data[5].result.length; j++) {
                        if (arg.data[6].result[i].opgaveloserId == arg.data[5].result[j].opgaveloserId)
                            arg.data[6].result[i].timeAntal += arg.data[5].result[j].timeAntal
                    }
                }
                let bemandetTimerTotal = {}
                if (arg.data[5].result.length > 0) {
                    bemandetTimerTotal = arg.data[5].result.reduce((a, b) => ({ 'timeAntal': a.timeAntal + b.timeAntal }))
                }

                // if (arg.modalTest)

                //     arg.res.render('tilfojopgaveloser', {
                //         layout: false,
                //         'opgavelosere': arg.data[0].result,
                //         'lokation': arg.data[1].result,
                //         'konsulentProfil': arg.data[2].result,
                //         'opgaveInfo': arg.data[3].result[0],
                //         'deadlines': arg.data[4].result,
                //         'bemandetTimerTotal': bemandetTimerTotal,
                //         'valgteOpgaveloser': arg.data[6].result,
                //     }, function (err, html) {
                //         arg.res.send(html);
                //     });
                // else
                arg.res.render('tilfojopgaveloser', {
                    'opgavelosere': arg.data[0].result,
                    'lokation': arg.data[1].result,
                    'konsulentProfil': arg.data[2].result,
                    'opgaveInfo': arg.data[3].result[0],
                    'deadlines': arg.data[4].result,
                    'bemandetTimerTotal': bemandetTimerTotal,
                    'valgteOpgaveloser': arg.data[6].result,
                })
            }
            else if (arg.origin == 'tilfojopgaveloserTid') {
                let loopDone = false;
                let weekdays = []
                for (let year = arg.req.query.startDate[0]; year <= arg.req.query.slutDate[0] && !loopDone; year++) {//
                    let month = 1
                    if (year == arg.req.query.startDate[0])
                        month = arg.req.query.startDate[1]

                    while (month <= 12 && !loopDone) {
                        if (year == arg.req.query.slutDate[0] && month == arg.req.query.slutDate[1]) {
                            tilfojopgaveloser.getWeekdaysInMonth(year, month, function (data) {
                                weekdays.push({ 'year': year, 'month': month, 'weeks': data })
                                arg.data.push({ weekdays })
                                loopDone = true
                                //arg.res.json(arg.data)
                            })
                            break;
                        }
                        else
                            tilfojopgaveloser.getWeekdaysInMonth(year, month, function (data) {
                                weekdays.push({ 'year': year, 'month': month, 'weeks': data })
                            })
                        month++;
                    }
                    //if (year == arg.req.query.slutDate[0] && month == arg.req.query.slutDate[1])
                }
                tilfojopgaveloser.calculateMaxAvailableWorkTimeInMonthsAndWeeks(arg.data[0].result, weekdays, function (opgavelosereMaxAvailableWorkTime) {
                    //console.log(opgavelosereMaxAvailableWorkTime)
                    tilfojopgaveloser.addUsedHours(opgavelosereMaxAvailableWorkTime, arg.data[1].result, function (usedHours) {
                        //console.log(usedHours)
                        //console.log(usedHours)
                        arg.res.json(usedHours)
                    })
                })

                //console.log(arg.data)
                //arg.res.json(arg.data)
            }
            else if (arg.origin == 'tilfojopgaveloserNewOpgavelosere') {
                arg.res.json({})
            }
            else if (arg.origin == 'tilfojopgaveloserChangedOpgavelosere') {
                arg.res.json({})
            }
            // else if (arg.origin == 'tilfojopgaveloserdelete') {
            //     arg.res.json({})
            // }
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

module.exports = {
    setup: setup
}