var express = require('express')
var exphbs  = require('express-handlebars')
var bodyParser = require('body-parser')

var mediator = require('./server/modules/mediator.js')
var bemandingsoversigt = require('./server/modules/bemandingsOversigt/bemandingsOversigtFacade.js')
bemandingsoversigt.setup()

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
    switch(req.method){
        case 'GET':{
            mediator.publish('getView', {req,res})
            break;
        }
        case 'POST':{
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
            res.send('ERROR IN APP ROUTER')
        }
    }

    
})
//post,put,delete


app.listen(3000);