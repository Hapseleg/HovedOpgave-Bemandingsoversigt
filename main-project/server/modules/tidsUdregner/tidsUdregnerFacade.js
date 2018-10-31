var mediator = require('../mediator.js')
var tidsUdregner = require('./tidsUdregner.js')

var name = 'tidsUdregner';

function setup(){
    console.log('setting up '+name+' facade')
    subcalcAvailWorkTime()
}

function subcalcAvailWorkTime(){
    mediator.subscribe('calcAvailWorkTime',function(arg){
        console.log('calcAvailWorkTime')
        // console.log(arg.data[0].result)
        // console.log(arg.data[1].result)
        // console.log(arg.date, 'subcalcAvailWorkTime')
        tidsUdregner.getWeekdaysInMonth(arg.date.year, arg.date.month, function(weekdays){
            // console.log(arg.data[0].result)
            tidsUdregner.calculateAvailableWorkTimeInWeeks(weekdays, arg.data, arg.date, function(availableWorkTime){
                arg.res.json(availableWorkTime)
            })

            
        })

    })
}

module.exports = {
    setup:setup
}