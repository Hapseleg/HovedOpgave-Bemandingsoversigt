var mediator = require('../mediator.js')
//var res
var name = 'error';

function setup(){
    console.log('setting up '+name+' facade')
    subErrors()
}

function subErrors(){
    mediator.subscribe('error',function(arg){
        console.log('------------ error -----------')
        console.error(arg.error)
        if(arg.res != undefined)
            arg.res.send(arg.origin + ' -------- '+ arg.error.toString())
    })

    //sub to views to get res so it always can send the error to the connected client
    // mediator.subscribe('getView',function(arg){
    //     res = arg.res
    // })
    // mediator.subscribe('postView',function(arg){
    //     res = arg.res
    // })
    // mediator.subscribe('putView',function(arg){
    //     res = arg.res
    // })
    // mediator.subscribe('deleteView',function(arg){
    //     res = arg.res
    // })
}

module.exports = {
    setup:setup
}