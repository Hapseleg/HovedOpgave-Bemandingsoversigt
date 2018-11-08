var mediator = require('./mediator.js')


var name = 'bemandingsoversigt';


function setup(){
    console.log('setting up '+name+' facade')
    subGetView()

}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        setTimeout(function(){
            mediator.publish('renderView', arg)
            //do what you need here
        }, 5000);
        //mediator.publish('renderView', arg)
        //arg.res.render('bemandingsoversigt')
        // res = arg.res;
        // req = arg.req;
        // if(arg.req.path == '/'+name || arg.req.path == '/'){
        //     mediator.publish('readFromDB', bemandingsoversigt.getData())
        // }   
        // else if(arg.req.path == '/bemandingsOversigtTid'){
        //     mediator.publish('readFromDB', bemandingsoversigt.getTidData())
        // }
    })
}

// function subPutView(){
//     mediator.subscribe('putView',function(arg){
//         res = arg.res;
//         req = arg.req;
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

// function subDataFromDB(){
//     mediator.subscribe('dataFromDB',function(arg){
//         if(arg.origin == name){
//             try{
//                 console.log('render subDataFromDB bemandingsoversigt here')
//                 //console.log(arg.data[0])
//                 let field = arg.data[0].fields
//                 //console.log(field)
//                 //console.log(arg.type)
                
//                 if(arg.type == 'read'){
//                     if(field.orgTable == 'OpgaveloserOpgave'){
//                         res.render(name, {opgaveloser: arg.data[0].result})
//                     }
//                     else if(field.orgTable == 'OpgaveloserArbejdsTider'){
//                         // console.log(arg.data[0].result,'0')
//                         // console.log(arg.data[1].result,'1')
//                         tidsUdregner.getWeekdaysInMonth(req.query.year, req.query.month, function(weekdays){
//                             tidsUdregner.calculateAvailableWorkTimeInWeeks(weekdays, arg.data, req.query.year, req.query.month, function(availableWorkTime){
//                                 res.json(availableWorkTime)
//                             })
//                         })
//                     }
//                 }
//                 else if(arg.type == 'create'){
//                     console.log('create',arg)
//                     res.json({'insertId': arg.data[0].result.insertId})
//                 }
//                 else if(arg.type == 'update'){
//                     console.log('update',arg)
//                     res.json({})
//                 }
//                 else{
//                     throw 'wrong type in bemandingsoversigt'
//                 }
                    
//             }
//             catch(error){
//                 mediator.publish('error', error)
//             }
//         }
//     })
// }

module.exports = {
    setup:setup
}