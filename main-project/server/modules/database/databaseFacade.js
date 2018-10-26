var mediator = require('../mediator.js')
var mysql = require('./mysql.js')

var name = 'database';

function setup(){
    console.log('setting up '+name+' facade')
    subCreate()
    subRead()
    subUpdate()
    subDelete()
    mysql.createConnection()
}

function subCreate(){
    mediator.subscribe('createInDB',function(arg){
        try{
            mysql.createInDB(arg)
        }
        catch(error){
            console.log(error)
            mediator.publish('error', error)
        }
        
    })
}

function returnResult(result){
    console.log(result)
    mediator.publish('dataFromDB', result)
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
    publish: mediator.publish,
    returnResult: returnResult
}