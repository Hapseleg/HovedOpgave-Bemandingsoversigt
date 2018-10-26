var mediator = require('../mediator.js')
var opgave = require('./opgave.js')

var name = 'opgave';
var profiler = [opgave]

function setup(){
    console.log('setting up '+name+' facade')
    subGetView()
    subPostView()
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        if(arg.req.path == '/'+name){
            let viewName = profiler[0].getView('opgave')
            arg.res.render(viewName)
        }
        
        // if(arg.req.path.includes('/'+name+'/')){
        //     let profiltype = arg.req.path.replace('/'+name+'/', '')

        //     for(let i = 0; i< profiler.length;i++){
        //         let viewName = profiler[i].getView(profiltype)
        //         if(viewName != '')
        //         {
        //             arg.res.render(viewName)
        //             break;
        //         }  
        //     }
        // }
    })
}

function subPostView(){
    mediator.subscribe('postView',function(arg){
        if(arg.req.path == '/'+name){
            try{
                let data = opgave.saveData(arg.req.body)
            
                if(!data.error)
                    mediator.publish('createInDB', data)          
            }
            catch(error){
                mediator.publish('error', error)
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

module.exports = {
    setup:setup
}