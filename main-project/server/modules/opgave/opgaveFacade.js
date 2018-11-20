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
        try {
            if (arg.req.path == '/' + name) {
                opgave.saveData(arg.req.body, function (data) {
                    mediator.publish('createInDB', Object.assign(arg, data))
                })
            }
            else if (arg.req.path == '/tilfojopgaveloser') {
                //09-11 4 05:40 og 07:45
                //console.log(arg.req.body)

                //nye opgaveløsere på opgaven
                let newOpgavelosere = arg.req.body.newOpgavelosere
                if (newOpgavelosere != undefined){
                    // let dataFromAll = undefined//grimt hack

                    for (let i = 0; i < newOpgavelosere.length; i++) {
                        console.log('newOpgavelosere')
                        tilfojopgaveloser.calculateHoursForMonths(parseFloat(newOpgavelosere[i].timeAntal), newOpgavelosere[i].weekdays.months, function (d) {
                            tilfojopgaveloser.saveNewOpgavelosere(newOpgavelosere[i],d,function(data){
                                console.log(data)
                                mediator.publish('createInDB', Object.assign(arg, data))
                                // if(dataFromAll == undefined)//grimt hack
                                //     dataFromAll = data
                                // else{
                                //     for(let j = 0; j<data.data.length;j++){
                                //         for(let k = 0; k<data.data[j].values.length;k++){
                                //             dataFromAll.data[j].values.push(data.data[j].values[k])
                                //         }
                                //     }
                                // }//grimt hack

                            })
                        })
                        // if(dataFromAll.data[0].values.length == newOpgavelosere.length){//grimt hack
                        //     console.log(dataFromAll)
                        //     //mediator.publish('createInDB', Object.assign(arg, dataFromAll))
                        // }   
                    }
                }
                    

                //opgaveløsere der allerede var på opgaven men hvor timetallet er blevet ændret
                let changedOpgavelosere = arg.req.body.changedOpgavelosere
                if (changedOpgavelosere != undefined)
                    for (let i = 0; i < changedOpgavelosere.length; i++) {
                        console.log('changedOpgavelosere')
                        let start = new Date(changedOpgavelosere[i].startDato)
                        let slut = new Date(changedOpgavelosere[i].slutDato)
                        let startDate = start.getFullYear() + '-' + (start.getMonth()+1) + '-' + start.getDate()
                        let slutDate = slut.getFullYear() + '-' + (slut.getMonth()+1) + '-' + slut.getDate()

                        //slet alle timeantal der allerede er oprettet i ugetimeopgave
                        //console.log(arg.req.body)
                        //console.log(tilfojopgaveloser.deleteUgeTimeOpgave(changedOpgavelosere[i], startDate, slutDate))
                        mediator.publish('deleteInDB', Object.assign(arg, tilfojopgaveloser.deleteUgeTimeOpgave(changedOpgavelosere[i], startDate, slutDate)))

                        tilfojopgaveloser.calculateHoursForMonths(parseFloat(changedOpgavelosere[i].timeAntal), changedOpgavelosere[i].weekdays.months, function (d) {
                            //console.log(d)
                            //mediator.publish('createInDB', Object.assign(arg, data))
                            //console.log(d)
                            tilfojopgaveloser.saveChangedOpgavelosere(changedOpgavelosere[i],d,function(data){
                                console.log(data)
                                mediator.publish('createInDB', Object.assign(arg, data))
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
                for (let i = 0; i < arg.data[6].result.length; i++) {
                    arg.data[6].result[i].timeAntal = 0
                    for (let j = 0; j < arg.data[5].result.length; j++) {
                        if (arg.data[6].result[i].opgaveloserId == arg.data[5].result[j].opgaveloserId)
                            arg.data[6].result[i].timeAntal += arg.data[5].result[j].timeAntal
                    }
                }
                let bemandetTimerTotal = {}
                if(arg.data[5].result.length>0){
                    bemandetTimerTotal = arg.data[5].result.reduce((a, b) => ({ 'timeAntal': a.timeAntal + b.timeAntal }))
                }

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
                        arg.res.json(usedHours)
                    })
                    //calc ledig tid

                })

                //console.log(arg.data)
                //arg.res.json(arg.data)
            }
            else if (arg.origin == 'tilfojopgaveloserNewOpgavelosere') {
                //arg.res.json({})
            }
            else if (arg.origin == 'tilfojopgaveloserChangedOpgavelosere') {
                //arg.res.json({})
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