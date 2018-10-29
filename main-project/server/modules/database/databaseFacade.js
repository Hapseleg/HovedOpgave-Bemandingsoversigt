var mediator = require('../mediator.js')
var mysql = require('./mysql.js')
var promise = require('promise')

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
            mysql.createInDB(arg, returnResult)//TODO returnresult skal ikke være her
        }
        catch(error){
            console.log(error)
            mediator.publish('error', error)
        }
    })
}

function returnResult(result){
    console.log('returnResult')
    // console.log(result)
    mediator.publish('dataFromDB', result)
}

function subRead(){
    mediator.subscribe('readFromDB',function(arg){
        try{
            mysql.readFromDB(arg, returnResult)
        }
        catch(error){
            mediator.publish('error', error)
        }
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
    publish:mediator.publish,
    returnResult:returnResult
}