var mediator = require('../mediator.js')
var opgave = require('./opgave.js')

var name = 'opgave';
var profiler = [opgave]
//var res;

function setup(){
    console.log('setting up '+name+' facade')
    subDataFromDB()
    subGetView()
    subPostView()
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        if(arg.req.path == '/'+name){
            //let viewName = profiler[0].getView('opgave')
            //arg.res.render(viewName)
            mediator.publish('readFromDB', Object.assign(arg, profiler[0].getData()))
            //res = arg.res
        }
    })
}

function subPostView(){
    mediator.subscribe('postView',function(arg){
        if(arg.req.path == '/'+name){
            try{
                // console.log(arg.req.body)
                //res = arg.res
                opgave.saveData(arg.req.body, function(data){
                    mediator.publish('createInDB', Object.assign(arg, data))
                })
                // if(!data.error)
                //     mediator.publish('createInDB', data)          
            }
            catch(error){
                mediator.publish('error', {'res':arg.res, 'error':error, 'origin': name})
            }
        }

        
        // if(arg.req.path.includes('/'+name+'/')){
        //     let profiltype = arg.req.path.replace('/'+name+'/', '')

        //     for(let i = 0; i< profiler.length;i++){
        //         let viewName = profiler[i].getView(profiltype)
        //         if(viewName != ''){
                    
        //         }  
        //     }
        // }
    })
}

function subDataFromDB(){
    mediator.subscribe('dataFromDB',function(arg){
        if(arg.origin == 'opgave'){
            try{
                console.log('render subDataFromDB opgave here')
                //console.log(arg.type)

                if(arg.type == 'read')
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
                else if(arg.type == 'create')
                    arg.res.redirect('bemandingsoversigt')
            }
            catch(error){
                mediator.publish('error', {'res':arg.res, 'error':error, 'origin': name})
            }
        }
    })
}

module.exports = {
    setup:setup
}