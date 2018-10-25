var mediator = require('../mediator.js')

var name = 'profil';

function setup(){
    console.log('setting up '+name+' facade')
    subGetView();
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        //TODO
        if(arg.req.path.includes(name)){
            if(arg.req.path.includes('opgaveloser')){
                arg.res.render('opgaveloser')
            }
        }
            
    })
}

module.exports = {
    setup:setup,
    publish: mediator.publish
}