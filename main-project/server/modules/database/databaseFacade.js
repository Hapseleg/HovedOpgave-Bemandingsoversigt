var mediator = require('../mediator.js')
var mysql = require('./mysqlhandler.js')

var name = 'database';

function setup(){
    console.log('setting up '+name+' facade')
    subCreate()
    subRead()
    subUpdate()
    subDelete()
    mysql.initConnection()
}

function subCreate(){
    mediator.subscribe('createInDB',function(arg){
        try{
            mysql.createInDB(arg, 0, undefined, undefined, returnResult, throwError)//TODO returnresult skal ikke være her
        }
        catch(error){
            //console.log(error)
            mediator.publish('error', {'res':arg.res, 'error':error, 'origin': name})
        }
    })
}

function throwError(arg){
    console.log('throwError')
    mediator.publish('error', {'res':arg.res, 'error':arg.error, 'origin': name})
}

function returnResult(result){
    console.log('returnResult')
    mediator.publish('dataFromDB', result)
}

function subRead(){
    mediator.subscribe('readFromDB',function(arg){
        try{
            mysql.readFromDB(arg, returnResult, throwError)
        }
        catch(error){
            mediator.publish('error', {'res':arg.res, 'error':error, 'origin': name})
        }
    })
}

function subUpdate(){
    mediator.subscribe('updateInDB',function(arg){
        try{
            mysql.updateInDB(arg, returnResult, throwError)
        }
        catch(error){
            mediator.publish('error', {'res':arg.res, 'error':error, 'origin': name})
        }
    })
}

function subDelete(){
    mediator.subscribe('deleteInDB',function(arg){
        
    })
}

module.exports = {
    setup:setup
}