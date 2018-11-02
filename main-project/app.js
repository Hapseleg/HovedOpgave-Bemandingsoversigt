var express = require('express')
var exphbs  = require('express-handlebars')
var bodyParser = require('body-parser')

var mediator = require('./server/modules/mediator')
require('./server/modules/database/databaseFacade').setup()
//require('./server/modules/tidsUdregner/tidsUdregnerFacade').setup()
require('./server/modules/errorHandler/errorFacade').setup()

require('./server/modules/bemandingsOversigt/bemandingsOversigtFacade').setup()
require('./server/modules/profil/profilFacade').setup()
require('./server/modules/opgave/opgaveFacade').setup()

var app = express();

app.use(express.static('public'))

//handlebars - view engine
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    // helpers: {
    //     result: function () { return '' }
    // },
    defaultLayout: 'main'
});

//app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.engine('handlebars', hbs.engine)

app.set('view engine', 'handlebars');

//body-parser - middleware
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

//routers
app.use('/',function(req,res){
    console.log('-------------' + req.path + '-------------')

    // console.log(req);
    console.log(req.body)
    //console.log(req.query)
    
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
            res.send('ERROR IN APP ROUTER SWITCH')
        }
    }
})


app.listen(3000);