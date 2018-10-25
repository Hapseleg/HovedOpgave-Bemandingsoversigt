var facade = require('./databaseFacade')

var conn;
var config = {
    host: "localhost",
    user: "nlj",
    password: "password",
    database: "mydb2"
}

function createConnection(){
    conn = mysql.createConnection(config)
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

function createInDB(arg){
    for (let i = 0, l = arg.length; i < l; i++) {
        
    }

    var tableName = arg.tableName
    var columns = arg.tableColumns
    var values = arg.rowValues

    //var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    var sql = "INSERT INTO "+tableName+" ("+columns+") VALUES ("+values+")";
    conn.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
}


app.get('/selectTable?:tableName', function(req, res){
    var tableName = req.query.tableName

    console.log("aaaaaaaaa " + tableName)
    conn.query("SELECT * FROM " + tableName, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render('mysql', result);
      });
    
    
})

module.exports = {
    createInDB: createInDB,
    readFromDB: readFromDB,
    updateInDB: updateInDB,
    deleteInDB: deleteInDB
}