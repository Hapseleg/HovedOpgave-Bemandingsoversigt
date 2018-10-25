var mediator = require('../mediator.js')
var mysql = require('./mysql.js')

var name = 'database';

function setup(){
    console.log('setting up '+name+' facade')
    subCreate()
    subRead()
    subUpdate()
    subDelete()
}

function subCreate(){
    mediator.subscribe('createInDB',function(arg){
        
    })
}

function subRead(){
    mediator.subscribe('readFromDB',function(arg){
        
    })
}

function subUpdate(){
    mediator.subscribe('updateInDB',function(arg){
        
    })
}

function subDelete(){
    mediator.subscribe('deleteInDB',function(arg){
        
    })
}

module.exports = {
    setup:setup,
    publish: mediator.publish
}