var express = require('express')
var exphbs  = require('express-handlebars')
var bodyParser = require('body-parser')
var fs = require('fs');
const util = require('util');

var mediator = require('./mediator')
// require('./server/modules/errorHandler/errorFacade').setup()//set up error first

// require('./server/modules/database/databaseFacade').setup()
// //require('./server/modules/tidsUdregner/tidsUdregnerFacade').setup()

require('./bemandingsOversigtFacade').setup()
// require('./server/modules/profil/profilFacade').setup()
// require('./server/modules/opgave/opgaveFacade').setup()
// require('./server/modules/opgaveOversigt/opgaveoversigtfacade').setup()

var app = express();

// app.use(express.static('public'))

//handlebars - view engine
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    // helpers: {
    //     result: function () { return '' }
    // },
    //defaultLayout: 'main'
});

//app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.engine('handlebars', hbs.engine)

app.set('view engine', 'handlebars');

//body-parser - middleware
app.use(bodyParser.urlencoded({ extended: true })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json

var i = 0
var arr = []

//routers
// app.use('/',function(req,res){
//     console.log('-------------' + req.path + '-------------')

//     if(req.path == '/'){
//         fs.appendFile('mynewfile'+i+'.txt', util.inspect(res), function (err) {
//             if (err) throw err;
//             console.log('Saved!');
//             i++
//         });

//         arr.push(res)
//         if(arr.length == 2)
//             console.log('compare', arr[0] === arr[1])
//     }
    
    
    
    
//     switch(req.method){
//         case 'GET':{
//             mediator.publish('getView', {req,res})
//             break;
//         }
//         case 'POST':{
//             mediator.publish('postView', {req,res})
//             break;
//         }
//         case 'PUT':{
//             mediator.publish('putView', {req,res})
//             break;
//         }
//         case 'DELETE':{
//             mediator.publish('deleteView', {req,res})
//             break;
//         }
//         default:{
//             res.send('ERROR IN APP ROUTER SWITCH')
//         }
//     }
// })



var resTest = undefined
app.use('/',function(req,res){
    console.log('-------------' + req.path + '-------------')
    let sub = mediator.subscribe('renderView',function(arg){
        //console.log(arg)
        console.log('samme res: ', arg.res == res)
        if(arg.res == res){
            res.send('ok')
            //console.log('i sub ',sub)
            this.unsubscribe('renderView', sub)
        }
            
    })
    //console.log('i use ',sub)

    mediator.publish('getView', {req,res})

    
    
    // if(resTest == undefined)
    //     resTest = res

    // if(req.path == '/restest')
    //     resTest.send('test')

})



app.listen(3000);