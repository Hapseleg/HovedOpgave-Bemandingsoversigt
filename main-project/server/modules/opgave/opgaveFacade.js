var mediator = require('../mediator.js')
var opgave = require('./opgave.js')

var name = 'opgave';
var profiler = [opgave]

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

function subPutView(){
    mediator.subscribe('putView',function(arg){
        try{
            if (arg.req.path == '/' + name) {
                console.log('put opgave')
                if(arg.req.body.opgaveId)
                    mediator.publish('updateInDB', Object.assign(arg, opgave.updateOpgave(arg.req.body)))
            }
        }
        catch(error){
            mediator.publish('error', {'res':arg.res, 'error':error, 'origin': name})
        }
    })
}

function subDeleteView(){
    mediator.subscribe('deleteView',function(arg){
        try{
            if (arg.req.path == '/' + name) {
                console.log('delete opgave')
                if(arg.req.body.opgaveId)
                    mediator.publish('deleteInDB', Object.assign(arg, opgave.deleteOpgave(arg.req.body)))
            }
        }
        catch(error){
            mediator.publish('error', {'res':arg.res, 'error':error, 'origin': name})
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
                        muligeOpgaveloser: arg.data[0].result,
                        opgavetype: arg.data[1].result,
                        opgavestatus: arg.data[2].result,
                        kontraktstatus: arg.data[3].result,
                        lokation: arg.data[4].result,
                        opgavestiller: arg.data[5].result,
                        kundeansvarlig: arg.data[6].result,
                        kunde: arg.data[7].result
                    })
                else if (arg.type == 'create')
                    arg.res.redirect('opgaveoversigt')
                else if(arg.type == 'update')
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
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

module.exports = {
    setup: setup
}