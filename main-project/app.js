var express = require('express')
var exphbs  = require('express-handlebars')
var bodyParser = require('body-parser')

var mediator = require('./server/modules/mediator.js')
require('./server/modules/bemandingsOversigt/bemandingsOversigtFacade.js').setup()
require('./server/modules/database/databaseFacade').setup()
require('./server/modules/profil/profilFacade').setup()
require('./server/modules/opgave/opgaveFacade').setup()

var app = express();

app.use(express.static('public'))

//handlebars - view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');


//body-parser - middleware
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json


//routers
app.use('/',function(req,res){
    // console.log(req);
    switch(req.method){
        case 'GET':{
            mediator.publish('getView', {req,res})
            break;
        }
        case 'POST':{
            console.log(req.body)
            mediator.publish('postView', {req,res})
            break;
        }
        case 'PUT':{
            mediator.publish('putView', {req,res})
            break;
        }
        case 'DELETE':{
            mediator.publish('deleteView', {req,res})
            break;
        }
        default:{
            res.send('ERROR IN APP ROUTER SWITCH')
        }
    }
})


app.listen(3000);