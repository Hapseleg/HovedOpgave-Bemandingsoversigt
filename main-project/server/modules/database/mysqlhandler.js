var mysql = require('promise-mysql')

//var facade = require('./databaseFacade')
var joinLetters = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z']
var config = require('./mysqlConfig.js').config

var conn;

function initConnection() {
    try {
        conn = mysql.createPool(config)
        console.log('mysql connection started')
    }
    catch (error) {
        throw error
    }
}

function closeConnection() {

}

function setupColumnsString(array) {
    let query = ''

    for (let i = 0; i < array.length; i++) {
        query += array[i] + ','
    }
    query = query.slice(0, -1)

    return query
}

function setupColumnsStringWithLetter(array, columnLetter, columnString) {
    let query = columnString

    for (let i = 0; i < array.length; i++) {
        query += columnLetter + '.' + array[i] + ','
    }
    query = query.slice(0, -1)

    return query
}

function setupValuesArray(array) {
    for (let i = 0; i < array.length; i++)
        if (!isNaN(array[i]) && array[i] != "" && array[i] != undefined)
            array[i] = parseInt(array[i], 10)
        else if (array[i] == "null" || array[i] == "")
            array[i] = null
}

async function createInDB(arg, createdDone, firstId, earlierResults, callback, errorCallback) {
    let results = { data: [], origin: arg.origin, type: 'create' }
    if (earlierResults != undefined)
        results = earlierResults

    let insertId = firstId;

    let data = arg.data[createdDone]

    var tableName = data.table
    var columns = setupColumnsString(data.columns)

    for (let i = 0; i < data.values.length; i++)
        setupValuesArray(data.values[i])

    if (data.useIdFromFirstInsert) {
        for (let i = 0; i < data.values.length; i++) {
            data.values[i].push(insertId)
        }
    }

    var sql = "INSERT INTO " + tableName + " (" + columns + ") VALUES ?";
    console.log(sql)

    await conn.query(sql, [data.values])
        .then(function (result) {
            if (tableName == arg.idFromFirstInsert)
                insertId = result.insertId

            results.data.push({ result: result, fields: { orgTable: tableName } })

            if (results.data.length == arg.data.length)
                callback(Object.assign(arg, results))
            else
                createInDB(arg, createdDone + 1, insertId, results, callback, errorCallback)
        })
        .catch(function (error) {
            errorCallback(Object.assign(arg, { error }))
            return
        })
}

async function readFromDB(arg, callback, errorCallback) {

    console.log('readfromdb')
    let results = { data: [], origin: arg.origin, type: 'read' }

    for (let i = 0, l = arg.data.length; i < l; i++) {
        let data = arg.data[i]

        var tableName = data.table
        var columns = setupColumnsStringWithLetter(data.columns, 'a', '')
        var leftjoin = ''

        if (data.leftJoins) {
            // console.log('left join enter')
            //select a.fornavn, b.lokationNavn from opgaveloser a left join lokation b on a.lokationId = b.lokationId
            for (let i = 0, l = data.leftJoins.length; i < l; i++) {
                let leftJoinData = data.leftJoins[i];

                columns += ','
                columns = setupColumnsStringWithLetter(leftJoinData.selectColumns, joinLetters[i], columns)

                let leftTableLetter = 'a'
                //find ud af hvilket bogstav lefttable har ved at køre dem igennem
                for (let i = 0, l = data.leftJoins.length; i < l; i++) {
                    if (leftJoinData.leftTable == data.leftJoins[i].rightTable) {
                        leftTableLetter = joinLetters[i]
                        break;
                    }
                }

                leftjoin += ' LEFT JOIN ' + leftJoinData.rightTable + ' ' + joinLetters[i] + ' ON ' + leftTableLetter + '.' + leftJoinData.leftColumn + ' = ' + joinLetters[i] + '.' + leftJoinData.rightColumn
            }
        }
        let whereValues = ''
        if (data.where) {
            whereValues = setupWhereString(data.where)
        }

        var sql = "SELECT " + columns + " FROM " + tableName + " a" + leftjoin + whereValues;
        console.log(sql)

        await conn.query(sql)
            .then(function (result) {
                results.data.push({ result: result, fields: { orgTable: tableName } })
                if (results.data.length == arg.data.length)
                    callback(Object.assign(arg, results))
                //callback(results)
            })
            .catch(function (error) {
                errorCallback(Object.assign(arg, { error }))
            })
    }

}

function setupSetString(colArray, valArray) {
    let query = ''
    //col = val, col = val
    for (let i = 0; i < colArray.length; i++) {
        query += colArray[i] + '='

        if (isNaN(valArray[i]))
            query += '"' + valArray[i] + '"'
        else
            query += valArray[i]

        query += ','

    }
    query = query.slice(0, -1)

    return query
}

function setupWhereString(array) {
    let query = ''
    if (array.length > 0)
        query += ' WHERE '
    //WHERE column = value AND id = 2
    for (let i = 0; i < array.length; i++) {
        query += array[i].column + '='

        if (isNaN(array[i].value))
            query += '"' + array[i].value + '"'
        else
            query += array[i].value

        query += ' AND '
    }
    query = query.slice(0, -5)

    return query
}

async function updateInDB(arg, callback, errorCallback) {
    console.log('updateInDB')
    let results = { data: [], origin: arg.origin, type: 'update' }

    for (let i = 0, l = arg.data.length; i < l; i++) {
        let data = arg.data[i]
        //console.log(data)

        let tableName = data.table
        let setValues = setupSetString(data.columns, data.values)
        //console.log(setValues)
        let whereValues = setupWhereString(data.where)

        let sql = "UPDATE " + tableName + " SET " + setValues + whereValues
        console.log(sql)
        await conn.query(sql)
            .then(function (result) {
                results.data.push({ result: result, fields: { orgTable: tableName } })
                callback(Object.assign(arg, results))
                //callback(results)
            })
            .catch(function (error) {
                errorCallback(Object.assign(arg, { error }))
            })
    }
}

async function deleteInDB(arg, callback, errorCallback) {
    console.log('updateInDB')

    for (let i = 0, l = arg.data.length; i < l; i++) {
        let data = arg.data[i]
        let tableName = data.table
        let whereValues = setupWhereString(data.where)

        let sql = "DELETE FROM " + tableName + whereValues
        console.log(sql)
        await conn.query(sql)
            .then(function (result) {
                results.data.push({ result: result, fields: { orgTable: tableName } })
                callback(Object.assign(arg, results))
                //callback(results)
            })
            .catch(function (error) {
                errorCallback(Object.assign(arg, { error }))
            })
    }
}

module.exports = {
    createInDB: createInDB,
    readFromDB: readFromDB,
    updateInDB: updateInDB,
    deleteInDB: deleteInDB,
    initConnection: initConnection
}