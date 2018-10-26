var mysql = require('mysql')
var databaseFacade = require('./databaseFacade.js')

//var facade = require('./databaseFacade')
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

function setupValuesString(array){
    let query = ''

    for(let i = 0; i< array.length;i++){
        if(isNaN(array[i]))
            query += '"' + array[i] + '"'  
        else
            query += array[i]
            
        query += ','
    }
    query = query.slice(0,-1)

    return query
}

function createInDB(arg){
    for (let i = 0, l = arg.data.length; i < l; i++) {
        let data = arg.data[i]

        var tableName = data.table
        var columns = setupColumnsString(data.columns)
        var values = setupValuesString(data.values)

        var sql = "INSERT INTO "+tableName+" ("+columns+") VALUES ("+values+")";
        console.log(sql)
        conn.query(sql, function (err, result) {
            if (err) 
                throw err;
            else 
                databaseFacade.returnResult({message:'saved', result: result, origin: arg.origin}) 
            
        });
    }
}

function readFromDB(arg){
    let results = {data:[]}

    for (let i = 0, l = arg.data.length; i < l; i++) {
        let data = arg.data[i]

        var tableName = data.table
        var columns = setupColumnsString(data.columns)

        var sql = "SELECT "+columns+" FROM " + tableName;
        console.log(sql)

        
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            results.data.push(result)
          });
    }

    return results
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