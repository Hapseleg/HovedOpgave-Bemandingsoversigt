var mediator = require('../mediator.js')
var mysql = require('./mysqlhandler.js')

var name = 'database';

function setup() {
    console.log('setting up ' + name + ' facade')
    subCreate()
    //subReplace()
    subRead()
    subUpdate()
    subDelete()
    mysql.initConnection()
}

function throwError(arg) {
    console.log('throwError')
    //console.log(Object.keys(arg))
    mediator.publish('error', { 'res': arg.res, 'error': arg.error, 'origin': name })
}

function returnResult(result) {
    console.log('returnResult')
    mediator.publish('dataFromDB', result)
}

function subCreate() {
    mediator.subscribe('createInDB', function (arg) {
        try {
            mysql.createInDB(arg, 0, undefined, undefined, returnResult, throwError)
        }
        catch (error) {
            //console.log(error)
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

function subRead() {
    mediator.subscribe('readFromDB', function (arg) {
        try {
            mysql.readFromDB(arg, returnResult, throwError)
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

function subUpdate() {
    mediator.subscribe('updateInDB', function (arg) {
        try {
            mysql.updateInDB(arg, returnResult, throwError)
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}

function subDelete() {
    mediator.subscribe('deleteInDB', function (arg) {
        try {
            mysql.deleteInDB(arg, returnResult, throwError)
        }
        catch (error) {
            mediator.publish('error', { 'res': arg.res, 'error': error, 'origin': name })
        }
    })
}


module.exports = {
    setup: setup
}