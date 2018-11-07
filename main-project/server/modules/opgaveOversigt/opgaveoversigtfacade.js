var mediator = require('../mediator.js')
var opgaveoversigt = require('./opgaveoversigt.js')

var name = 'opgaveoversigt';
var res;

function setup(){
    console.log('setting up '+name+' facade')
    subGetView()
    subDataFromDB()
    //subPutView()
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        res = arg.res;
        //req = arg.req;
        if(arg.req.path == '/'+name){
            mediator.publish('readFromDB', opgaveoversigt.getData())
        }   
        else if(arg.req.path == '/'+name+'/deadlines'){
            //console.log(arg.req.query)
            mediator.publish('readFromDB', opgaveoversigt.getDeadlines(arg.req.query.opgaveId))
        }
    })
}

// function subPutView(){
//     mediator.subscribe('putView',function(arg){
//         res = arg.res;
//         //req = arg.req;
//         try{
//             if(arg.req.path == '/bemandingsOversigtTid'){
//                 if(req.body.ugeTimeOpgaveId)
//                     mediator.publish('updateInDB', bemandingsoversigt.updateUgeTimeOpgave(req.body))
//                 else
//                     mediator.publish('createInDB', bemandingsoversigt.createUgeTimeOpgave(req.body))
//             }
//         }
//         catch(error){
//             mediator.publish('error', error)
//         }
//     })
// }

function subDataFromDB(){
    mediator.subscribe('dataFromDB',function(arg){
        try{
            if(arg.origin == name){
                console.log('render subDataFromDB '+arg.origin+' here')
                if(arg.type == 'read'){
                    //console.log(arg.data[0].result)
                    res.render(name, {opgaver: arg.data[0].result})
                }
            }
            else if(arg.origin == name + 'deadlines')
            {
                res.json(arg.data[0].result)
            }
        }
        catch(error){
            mediator.publish('error', error)
        }

        // if(arg.origin == name){
        //     try{
        //         console.log('render subDataFromDB bemandingsoversigt here')
        //         //console.log(arg.data[0])
        //         let field = arg.data[0].fields
        //         //console.log(field)
        //         //console.log(arg.type)
                
        //         if(arg.type == 'read'){
        //             if(field.orgTable == 'OpgaveloserOpgave'){
        //                 res.render(name, {opgaveloser: arg.data[0].result})
        //             }
        //             else if(field.orgTable == 'OpgaveloserArbejdsTider'){
        //                 // console.log(arg.data[0].result,'0')
        //                 // console.log(arg.data[1].result,'1')
        //                 tidsUdregner.getWeekdaysInMonth(req.query.year, req.query.month, function(weekdays){
        //                     tidsUdregner.calculateAvailableWorkTimeInWeeks(weekdays, arg.data, req.query.year, req.query.month, function(availableWorkTime){
        //                         res.json(availableWorkTime)
        //                     })
        //                 })
        //             }
        //         }
        //         else if(arg.type == 'create'){
        //             console.log('create',arg)
        //             res.json({'insertId': arg.data[0].result.insertId})
        //         }
        //         else if(arg.type == 'update'){
        //             console.log('update',arg)
        //             res.json({})
        //         }
        //         else{
        //             throw 'wrong type in bemandingsoversigt'
        //         }
                    
        //     }
        //     catch(error){
        //         mediator.publish('error', error)
        //     }
        // }
    })
}

module.exports = {
    setup:setup
}