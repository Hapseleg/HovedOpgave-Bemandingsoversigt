var express = require('express')
var exphbs  = require('express-handlebars')
var bodyParser = require('body-parser')


var app = express();

app.use(express.static('public'))

//handlebars - view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');


//body-parser - middleware
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json




//routers
app.get('/', function (req, res) {
    res.render('home');
});


app.listen(3000);