var mediator = require('../mediator.js')

// var facade = require('../facade.js')

// var f = {name: 'bemandingsoversigt'}
// facade.installTo(f)

var name = 'bemandingsoversigt';

function setup(){
    console.log('setting up '+name+' facade')
    subGetView();
}

function subGetView(){
    mediator.subscribe('getView',function(arg){
        console.log(arg.req.path)
        if(arg.req.path == '/'+name)
            arg.res.render(name)
    })
}

module.exports = {
    setup:setup,
    publish: mediator.publish
}