var mysql = require('mysql')

//var facade = require('./databaseFacade')
var joinLetters = ['b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z']
var config = require('./mysqlConfig.js').config

var conn;

function createConnection(){
    try{
        conn = mysql.createConnection(config)
        console.log('mysql connection started')
    }
    catch(error){
        console.log(error)
    }
}

function closeConnection(){

}

// app.post('/createDB', function(req, res){
//     var dbName = req.body.dbName;

//     conn.query("CREATE DATABASE " + dbName, function (err, result) {
//         if (err) throw err;
//         console.log("Database created");
//       });
//     res.redirect('mysql');
// })

// app.post('/createTable', function(req, res){
//     var tableName = req.body.tableName
//     var columns = req.body.tableColumns

//     //var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
//     var sql = "CREATE TABLE "+tableName+" (" + columns + ")";
//     console.log(sql)
//     conn.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("Table created");
//     });

//     res.redirect('mysql');
// })

// app.post('/insertIntoTable', function(req, res){
//     var tableName = req.body.tableName
//     var columns = req.body.tableColumns
//     var values = req.body.rowValues

//     //var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
//     var sql = "INSERT INTO "+tableName+" ("+columns+") VALUES ("+values+")";
//     conn.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("1 record inserted");
//     });

//     res.redirect('mysql');
// })

function setupColumnsString(array){
    let query = ''

    for(let i = 0; i< array.length;i++){
            query += array[i] + ','
    }
    query = query.slice(0,-1)

    return query
}

function setupColumnsStringWithLetter(array, columnLetter, columnString){
    let query = columnString

    for(let i = 0; i< array.length;i++){
            query += columnLetter + '.' + array[i] + ','
    }
    query = query.slice(0,-1)

    return query
}

function setupValuesString(array){
    let query = ''

    for(let i = 0; i< array.length;i++){
        if(isNaN(array[i]))
            query += '"' + array[i] + '"'  
        else
            query += array[i]
            
        query += ','
        console.log(query)
    }
    query = query.slice(0,-1)

    return query
}

function setupValuesArray(array){

    for(let i = 0; i< array.length;i++){
        if(!isNaN(array[i]))
            array[i] = parseInt(array[i],10)                
    }
}

function createInDB(arg, obj, createdDone, firstId, earlierResults){
    // console.log(arg,'createInDb arg')
    let results = {data:[], origin: arg.origin, type: 'create'}
    if(earlierResults != undefined)
        results = earlierResults

    let insertId = firstId;

    // for (let i = 0, l = arg.data.length; i < l; i++) {
        // let data = arg.data[i]
        let data = arg.data[createdDone]
        // console.log(data.values,'createdindb')

        var tableName = data.table
        var columns = setupColumnsString(data.columns)

        for(let i = 0; i< data.values.length;i++)
            setupValuesArray(data.values[i])

        if(data.useIdFromFirstInsert){
            for(let i = 0; i<data.values.length;i++){
                data.values[i].push(insertId)
            }
        }

        var sql = "INSERT INTO "+tableName+" ("+columns+") VALUES ?";
        // var sql = "INSERT INTO "+tableName+" ("+columns+") VALUES ("+values+")";
        // console.log(sql)
        // console.log(data.values)
        // console.log(insertId)
        conn.query(sql, [data.values], function (err, result) {
        // conn.query(sql, function (err, result) {
            if (err) 
                throw err;
            if (tableName == arg.idFromFirstInsert)
                insertId = result.insertId
            
            //result.OkPacket.insertId = opgaveId
            results.data.push({result: result})

            if(results.data.length == arg.data.length)
                obj(results)
            else
                createInDB(arg, obj, createdDone+1, insertId, results)
        });
    // }
}

function readFromDB(arg, obj){
    console.log('readfromdb')
    let results = {data:[], origin: arg.origin, type: 'read'}

    for (let i = 0, l = arg.data.length; i < l; i++) {
        let data = arg.data[i]

        var tableName = data.table
        var columns = setupColumnsStringWithLetter(data.columns, 'a', '')
        var leftjoin = ''

        if(data.leftJoins){
            // console.log('left join enter')
            //select a.fornavn, b.lokationNavn from opgaveloser a left join lokation b on a.lokationId = b.lokationId
            for (let i = 0, l = data.leftJoins.length; i < l; i++) {
                let leftJoinData = data.leftJoins[i];

                columns += ','
                columns = setupColumnsStringWithLetter(leftJoinData.selectColumns,joinLetters[i],columns)

                let leftTableLetter = 'a'
                //find ud af hvilket bogstav lefttable har ved at køre dem igennem
                for (let i = 0, l = data.leftJoins.length; i < l; i++){
                    if(leftJoinData.leftTable == data.leftJoins[i].rightTable){
                        leftTableLetter = joinLetters[i]
                        break;
                    }
                }
                
                leftjoin += ' LEFT JOIN ' + leftJoinData.rightTable + ' ' + joinLetters[i] + ' ON '+leftTableLetter+'.' + leftJoinData.leftColumn + ' = ' + joinLetters[i] + '.' + leftJoinData.rightColumn
            }
        }
        var sql = "SELECT "+columns+" FROM " + tableName + " a" + leftjoin;
        // console.log(sql)
        
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;

            results.data.push({result: result, fields:fields})
            if(results.data.length == arg.data.length)
                obj(results)
          })
        
    }
}

function updateInDB(){

}

function deleteInDB(){

}

module.exports = {
    createInDB: createInDB,
    readFromDB: readFromDB,
    updateInDB: updateInDB,
    deleteInDB: deleteInDB,
    createConnection: createConnection
}