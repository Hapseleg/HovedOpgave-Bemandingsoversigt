var mediator = require('../mediator.js')
var opgaveloser = require('./opgaveloser.js')

var name = 'profil';
var modulesWithViews = [opgaveloser]
var res;

function setup(){
    console.log('setting up '+name+' facade')
    subGetView()
    subPostView()
    subDataFromDB()
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        if(arg.req.path.includes('/'+name+'/')){
            let profiltype = arg.req.path.replace('/'+name+'/', '')

            for(let i = 0; i< modulesWithViews.length;i++){
                let viewName = modulesWithViews[i].getView(profiltype)
                if(viewName != '')
                {
                    res = arg.res
                    mediator.publish('readFromDB', modulesWithViews[i].getData())
                    break;
                }  
            }
        }
    })
}

function subPostView(){
    mediator.subscribe('postView',function(arg){
        if(arg.req.path.includes('/'+name+'/')){// /profil/
            try{
                let profiltype = arg.req.path.replace('/'+name+'/', '')

                for(let i = 0; i< modulesWithViews.length;i++){
                    let viewName = modulesWithViews[i].getView(profiltype)
                    if(viewName != ''){
                        res = arg.res
                        //let data = profiler[i].saveData(arg.req.body)

                        modulesWithViews[i].saveData(arg.req.body, function(data){
                            //console.log(data.data[1])
                            mediator.publish('createInDB', data)
                        })
                        break;
                    }  
                }
            }
            catch(error){
                mediator.publish('error', error)
            }
        }
    })
}

function subDataFromDB(){
    mediator.subscribe('dataFromDB',function(arg){
        try{
            for(let i = 0; i< modulesWithViews.length;i++){
                let viewName = modulesWithViews[i].getView(arg.origin)

                if(arg.origin == viewName){
                    if(arg.type == 'read'){
                        res.render(viewName, 
                            {
                                days: [{name:'Mandag'},{name:'Tirsdag'},{name:'Onsdag'},{name:'Torsdag'},{name:'Fredag'}],
                                lokation: arg.data[0].result,
                                konsulentProfiler: arg.data[1].result
                            })
                        break;
                    }
                    else if(arg.type == 'create'){
                        res.redirect('/bemandingsoversigt')
                    }
                }
            }
        }
        catch(error){
            mediator.publish('error', error)
        }
    })
}

module.exports = {
    setup:setup
}