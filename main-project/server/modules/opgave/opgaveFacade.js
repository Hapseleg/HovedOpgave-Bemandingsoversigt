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
        if (arg.req.path == '/' + name) {
            if (arg.req.query.opgaveId != undefined) {
                mediator.publish('readFromDB', Object.assign(arg, profiler[0].getOpgaveById(arg.req.query.opgaveId)))
            }
            else {
                mediator.publish('readFromDB', Object.assign(arg, profiler[0].getData()))
            }
        }
        else if (arg.req.path == '/tilfojopgaveloser') {
            //arg.req.query.opgaveId
            mediator.publish('readFromDB', Object.assign(arg, profiler[1].getData(arg.req.query.opgaveId)))
            //arg.res.render('tilfojopgaveloser')//TODO
        }
        else if (arg.req.path == '/tilfojopgaveloserTid') {
            //arg.req.query.opgaveId
            console.log(arg.req.query)

            mediator.publish('readFromDB', Object.assign(arg, profiler[1].getTidData(arg.req.query.startDate, arg.req.query.slutDate)))
            //arg.res.render('tilfojopgaveloser')//TODO
        }
    })
}

function subPostView() {
    mediator.subscribe('postView', function (arg) {
        if (arg.req.path == '/' + name) {
            try {
                opgave.saveData(arg.req.body, function (data) {
                    mediator.publish('createInDB', Object.assign(arg, data))
                })
            }
            catch (error) {
                mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
            }
        }
    })
}

function subPutView() {
    mediator.subscribe('putView', function (arg) {
        try {
            if (arg.req.path == '/' + name) {
                console.log('put opgave')
                if (arg.req.body.opgaveId)
                    mediator.publish('updateInDB', Object.assign(arg, opgave.updateOpgave(arg.req.body)))
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
            }
            else if (arg.origin == name + 'specific') {
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
                    'opgavelosere': arg.data[10].result
                })
            }
            else if (arg.origin == 'tilfojopgaveloser') {
                //console.log(arg.data)
                console.log(arg.data[5].result)
                console.log(arg.data[5].result.reduce((a, b) => ({ 'timeAntal': a.timeAntal + b.timeAntal })))
                arg.res.render('tilfojopgaveloser', {
                    'opgavelosere': arg.data[0].result,
                    'lokation': arg.data[1].result,
                    'konsulentProfil': arg.data[2].result,
                    'opgaveInfo': arg.data[3].result[0],
                    'deadlines': arg.data[4].result,
                    'bemandetTimer': arg.data[5].result.reduce((a, b) => ({ 'timeAntal': a.timeAntal + b.timeAntal }))
                    //'bemandetTimer': arg.data[5].result.reduce(function (a, b) { return { 'timeAntal': a.timeAntal + b.timeAntal } }, 0)
                })
            }
            else if (arg.origin == 'tilfojopgaveloserTid') {

                let weekdays = []
                for (let year = arg.req.query.startDate[0]; year <= arg.req.query.slutDate[0]; year++) {//
                    let month = 1
                    if (year == arg.req.query.startDate[0])
                        month = arg.req.query.startDate[1]

                    while (month <= 12) {
                        if (year == arg.req.query.slutDate[0] && month == arg.req.query.slutDate[1]) {
                            tilfojopgaveloser.getWeekdaysInMonth(year, month, function (data) {
                                weekdays.push({ 'year': year, 'month': month, 'weeks': data })
                                arg.data.push({ weekdays })
                                arg.res.json(arg.data)
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

                //console.log(arg.data)
                //arg.res.json(arg.data)
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