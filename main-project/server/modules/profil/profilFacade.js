var mediator = require('../mediator.js')
var opgaveloser = require('./opgaveloser.js')

var name = 'profil';
var profiler = [opgaveloser]

function setup(){
    console.log('setting up '+name+' facade')
    subGetView()
    subPostView()
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        if(arg.req.path.includes('/'+name+'/')){
            let profiltype = arg.req.path.replace('/'+name+'/', '')

            for(let i = 0; i< profiler.length;i++){
                let viewName = profiler[i].getView(profiltype)
                if(viewName != '')
                {
                    arg.res.render(viewName)
                    break;
                }  
            }
        }
    })
}

function subPostView(){
    mediator.subscribe('postView',function(arg){
        if(arg.req.path.includes('/'+name+'/')){
            let profiltype = arg.req.path.replace('/'+name+'/', '')

            for(let i = 0; i< profiler.length;i++){
                let viewName = profiler[i].getView(profiltype)
                if(viewName != ''){
                    let data = profiler[i].saveData(arg.req.body)
                    
                    if(!data.error)
                        mediator.publish('createInDB', data)
                    else
                        mediator.publish('error', data)
                    break;
                }  
            }
        }
    })
}

module.exports = {
    setup:setup
}