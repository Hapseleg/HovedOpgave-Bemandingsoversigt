var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')

var mediator = require('./server/modules/mediator')
require('./server/modules/errorHandler/errorFacade').setup()//setup error handler
require('./server/modules/database/databaseFacade').setup()//setup database handler

require('./server/modules/bemandingsOversigt/bemandingsOversigtFacade').setup()//setup bemandingsoversigt
require('./server/modules/opgaveOversigt/opgaveoversigtfacade').setup()//setup opgaveoversigt
require('./server/modules/profil/profilFacade').setup()//setup profiler (opgaveløser, kunde etc)
require('./server/modules/opgave/opgaveFacade').setup()//setup opgave (opgave and tilfojopgaveloser)

//app uses express for handling browser requests
var app = express();
//set folder public as a static folder, the public folder holds client-side js and css files
app.use(express.static('public'))

//handlebars - view engine
var hbs = exphbs.create({
    defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars');

//body-parser - middleware
app.use(bodyParser.urlencoded({ extended: true })) //true makes it possible to send nested objects
app.use(bodyParser.json())//only parse json

//routers
app.use('/', function (req, res) {
    console.log('-------------' + req.path + ' - ' + req.method + '------------')
    switch (req.method) {
        case 'GET': {//get db data or HTML
            mediator.publish('getView', { req, res })
            break;
        }
        case 'POST': {//save a new entry in db
            mediator.publish('postView', { req, res })
            break;
        }
        case 'PUT': {//update a entry in db
            mediator.publish('putView', { req, res })
            break;
        }
        case 'DELETE': {//delete a entry in db
            mediator.publish('deleteView', { req, res })
            break;
        }
        default: {//something went wrong, send error
            res.send('ERROR IN APP ROUTER SWITCH')
        }
    }
})


//start app
var config = require('./config.js').config
var PRODUCTION_MODE = 'production';
var host = config.host
var port = config.port

app.set('port', port);
process.env.NODE_ENV = config.NODE_ENV

app.listen(app.get('port'), host, () => {
    if (!process.env.NODE_ENV) {
        console.log('process.env.NODE_ENV is not set!');
    }

    console.log(`WebService has started on ${host}:${port} running in ${process.env.NODE_ENV} mode`);
    if (process.env.NODE_ENV !== PRODUCTION_MODE) {
        console.log('PLEASE NOTE: your webservice is running not in a production mode!');
    }
});

// console.log('Listening on port: ' + port + ' go to http://localhost:' + port)
// app.listen(port);