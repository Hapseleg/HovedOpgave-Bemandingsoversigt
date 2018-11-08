var mediator = require('../mediator.js')

var opgaveloser = require('./opgaveloser.js')
var opgavestiller = require('./opgavestiller.js')
var kundeansvarlig = require('./kundeansvarlig.js')
var kunde = require('./kunde.js')

var name = 'profil';
var modulesWithViews = [opgaveloser,opgavestiller,kundeansvarlig,kunde]
//var res;

function setup(){
    console.log('setting up '+name+' facade')
    subGetView()
    subPostView()
    subDataFromDB()
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        try{
            if(arg.req.path.includes('/'+name+'/')){
                let profiltype = arg.req.path.replace('/'+name+'/', '')
    
                for(let i = 0; i< modulesWithViews.length;i++){
                    let viewName = modulesWithViews[i].getView(profiltype)
                    if(viewName != '')
                    {
                        //res = arg.res
                        
                        mediator.publish('readFromDB', Object.assign(arg, modulesWithViews[i].getData()))
                        break;
                    }  
                }
            }
        }
        catch(error){
            mediator.publish('error', error)
        }

    })
}

function subPostView(){
    mediator.subscribe('postView',function(arg){
        if(arg.req.path.includes('/'+name+'/')){//  /profil/
            try{
                let profiltype = arg.req.path.replace('/'+name+'/', '')

                for(let i = 0; i< modulesWithViews.length;i++){
                    let viewName = modulesWithViews[i].getView(profiltype)
                    if(viewName != ''){
                        //res = arg.res
                        //let data = profiler[i].saveData(arg.req.body)

                        modulesWithViews[i].saveData(arg.req.body, function(data){
                            //console.log(data.data[1])
                            mediator.publish('createInDB', Object.assign(arg, data))
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
                        let d = {
                            'viewName': viewName,
                            'lokation': arg.data[0].result
                        }

                        if(viewName == 'opgaveloser'){
                            d.days = [{name:'Mandag', 'id': 1},{name:'Tirsdag', 'id': 2},{name:'Onsdag', 'id': 3},{name:'Torsdag', 'id': 4},{name:'Fredag', 'id': 5}]
                            d.konsulentProfiler = arg.data[1].result
                            arg.res.render(viewName, d)
                        }
                        else{
                            arg.res.render(viewName, d)
                        }
                        
                        break;
                    }
                    else if(arg.type == 'create'){
                        arg.res.redirect('/bemandingsoversigt')
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