var mediator = require('../mediator.js')

function installTo(obj){
    obj.subscribe = mediator.subscribe
    obj.publish = mediator.publish
}

function setup(){
    console.log('setting up ' + this.name + '-facade')
}

function subToGetView(){
    mediator.subscribe('getView',function(arg){
        arg.res.render('bemandingsoversigt')
    })
}

module.exports = {
    installTo: installTo
}