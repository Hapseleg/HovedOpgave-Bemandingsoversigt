var express = require('express')
var exphbs  = require('express-handlebars')
var bodyParser = require('body-parser')
var mysql = require('promise-mysql')

var app = express();

//handlebars - view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

//body-parser - middleware
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

//mysql
var con = mysql.createPool({
    host: "localhost",
    user: "nlj",
    password: "password",
    database: "mydb2"
});

//routers
app.get('/', function (req, res) {
    res.render('home');
});

app.get('/mysql', function (req, res) {
    res.render('mysql')
});

app.post('/createDB', function(req, res){
    var dbName = req.body.dbName;

    con.query("CREATE DATABASE " + dbName, function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });
    res.redirect('mysql');
})

app.post('/createTable', function(req, res){
    var tableName = req.body.tableName
    var columns = req.body.tableColumns

    //var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
    var sql = "CREATE TABLE "+tableName+" (" + columns + ")";
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });

    res.redirect('mysql');
})

app.post('/insertIntoTable', function(req, res){
    var tableName = req.body.tableName
    var columns = req.body.tableColumns
    var values = req.body.rowValues

    //var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
    var sql = "INSERT INTO "+tableName+" ("+columns+") VALUES ("+values+")";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });

    res.redirect('mysql');
})

app.get('/selectTable?:tableName', function(req, res){
    var tableName = req.query.tableName

    console.log("aaaaaaaaa " + tableName)
    con.query("SELECT * FROM " + tableName, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render('mysql', result);
      });
    
    
})
//start it up
/*app.on('listening', function () {
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected to MySQL!");
      });
});*/

app.get('/provinces/:id', async (req, res) => {

    try {
  
      // get a connection from the pool
      //const con = await pool.createConnection();
        //console.log(con)

  
        // retrieve the list of provinces from the database
        console.log('before')
        await con.query('SELECT a FROM OpgaveloserArbejdsTider')
        .then(function(result){
            console.log('result')
            res.send(result)
        })
        .catch(function(err){
            console.log('error')
            throw err
        })
        console.log('after')
        // console.log('before if throw')
        // //console.log(provinces)
        // if (!provinces.length)
        //   throw provinces
        // console.log('after throwwwwwwwwwwwwwwwwww')
        // const province = provinces[0];
  
        // retrieve the associated country from the database
        // const sql_c = `SELECT c.code, c.name
        //                FROM countries c
        //                WHERE c.id = 1
        //                LIMIT 1`;
        // const countries = await con.query(sql_c, province.country_id);
        // if (!countries.length)
        //   throw countries
  
        // province.country = countries[0];
  
        // res.send({ province });
  

  
    } catch (err) {
        console.error('catch')
        //console.error(err._callSite)
        //console.error(err._callSite)
        //var a = err._callSite
        res.status(404).send({ message: err.message });
        //res.redirect('/')
    //   if (err instanceof Errors.NotFound)
    //     res.status(HttpStatus.NOT_FOUND).send({ message: err.message }); // 404
    //   console.log(err);
    //   res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
    }
});
console.log('-------------------------------------------------------')
app.listen(3000);