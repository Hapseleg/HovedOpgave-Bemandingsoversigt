var mediator = require('../mediator.js')
var bemandingsoversigt = require('./bemandingsoversigt.js')

// var facade = require('../facade.js')

// var f = {name: 'bemandingsoversigt'}
// facade.installTo(f)

var name = 'bemandingsoversigt';
var res;
var req;

function setup(){
    console.log('setting up '+name+' facade')
    subGetView()
    subDataFromDB()
    subPutView()
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        res = arg.res;
        req = arg.req;
        if(arg.req.path == '/'+name){
            mediator.publish('readFromDB', bemandingsoversigt.getData())
        }   
        else if(arg.req.path == '/bemandingsOversigtTid'){
            mediator.publish('readFromDB', bemandingsoversigt.getTidData())
        }
    })
}

function subPutView(){
    mediator.subscribe('putView',function(arg){
        res = arg.res;
        req = arg.req;
        if(arg.req.path == '/bemandingsOversigtTid'){
            if(req.body.ugeTimeOpgaveId)
                mediator.publish('updateInDB', bemandingsoversigt.updateUgeTimeOpgave(req.body))
            else
                mediator.publish('createInDB', bemandingsoversigt.createUgeTimeOpgave(req.body))
        }
    })
}

function subDataFromDB(){
    mediator.subscribe('dataFromDB',function(arg){
        if(arg.origin == name){
            try{
                console.log('render subDataFromDB opgave here')
                //console.log(arg.type)
                //console.log(arg.data[0])
                let field = arg.data[0].fields[0]
                if(arg.type == 'read'){
                    if(field.orgTable == 'opgaveloseropgave'){
                        res.render(name, {opgaveloser: arg.data[0].result})
                    }
                    else if(field.orgTable == 'opgaveloserarbejdstider'){
                        // mediator.printChannels()
                        // console.log('calcAvailWorkTime i bemandingsoversigt')
                        // mediator.publish('calcAvailWorkTime', {data: arg.data[0].result, date: arg.req.query, res:res})
                        arg.date = req.query
                        arg.res = res
                        mediator.publish('calcAvailWorkTime', arg)
                        //res.json(arg.data[0].result)
                    }
                }
                else if(arg.type == 'create'){
                    res.render(name)
                }
                else if(arg.type == 'update'){
                    res.json({})
                }
                    
            }
            catch(error){
                mediator.publish('error', error)
            }
        }
    })
}

module.exports = {
    setup:setup,
    publish: mediator.publish
}