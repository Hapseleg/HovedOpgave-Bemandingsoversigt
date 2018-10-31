var mediator = require('../mediator.js')

var name = 'error';

function setup(){
    console.log('setting up '+name+' facade')
    subErrors()
}

function subErrors(){
    mediator.subscribe('error',function(arg){
        console.log('------------ error -----------')
        console.log(arg)
    })
}

module.exports = {
    setup:setup
}