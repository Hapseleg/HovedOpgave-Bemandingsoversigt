var mediator = require('../mediator.js')
var bemandingsoversigt = require('./bemandingsoversigt.js')

// var facade = require('../facade.js')

// var f = {name: 'bemandingsoversigt'}
// facade.installTo(f)

var name = 'bemandingsoversigt';
var res;

function setup(){
    console.log('setting up '+name+' facade')
    subGetView()
    subDataFromDB()
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        console.log(arg.req.path)
        res = arg.res;
        if(arg.req.path == '/'+name){
            mediator.publish('readFromDB', bemandingsoversigt.getData())
        }   
        else if(arg.req.path == '/bemandingsOversigtTid')
            mediator.publish('readFromDB', bemandingsoversigt.getTidData())
    })
}

function subDataFromDB(){
    mediator.subscribe('dataFromDB',function(arg){
        if(arg.origin == name){
            try{
                console.log('render subDataFromDB opgave here')
                console.log(arg.type)
                console.log(arg.data[0].fields[0])
                let field = arg.data[0].fields[0]
                if(arg.type == 'read')
                    if(field.orgTable == 'opgaveloseropgave'){
                        res.render(name, {opgaveloser: arg.data[0].result})
                    }
                    else if(field.orgTable == 'opgaveloserarbejdstider'){
                        res.json(arg.data[0].result)
                    }

                    //res.render(name, {opgaveloser: arg.data[0].result})
                    // res.render(name, {
                    //     opgaveloser: arg.data[0].result,
                    //     opgavetype: arg.data[1].result,
                    //     opgavestatus: arg.data[2].result,
                    //     kontraktstatus: arg.data[3].result,
                    //     lokation: arg.data[4].result,
                    //     opgavestiller: arg.data[5].result,
                    //     kundeansvarlig: arg.data[6].result,
                    //     kunde: arg.data[7].result
                    // })
                else if(arg.type == 'create')
                    res.render(name)
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