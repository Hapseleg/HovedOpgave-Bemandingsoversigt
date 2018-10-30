var moment = require('moment');

//1 = mandag, 2 = tirsdag, 3 = onsdag, 4 = torsdag, 5 = fredag
//6 = lørdag, 7 = søndag

function getWeekDaysInWeekInSameMonth(year, month, weekNumber, callback){
    let startOfWeek = moment(year, 'YYYY').month(month).isoWeek(weekNumber).startOf('isoWeek')
    let weekDays = []
    console.log(weekNumber)
    for(let i = 1; i<=5;i++){
        let weekDay = startOfWeek.isoWeekday()
        let monthOfStart = startOfWeek.month()+1

        console.log(startOfWeek)
 
        if(weekDay == 6 || weekDay == 7 || weekDays.length == 5){
            callback(weekDays)
            break;
        }
        else if(monthOfStart == month){
            weekDays.push(weekDay)
        }

        if(i == 5){
            callback(weekDays)
            break;
        }

        startOfWeek.add(1,'days')
    }
}

//https://stackoverflow.com/questions/43603604/how-to-get-week-numbers-of-current-month-in-moment-js
function getWeeksInMonth(year, month, callback){
    const firstDayOfMonth = moment(`${ year }-${ month }`, 'YYYY-MM-DD');
    const numOfDays = firstDayOfMonth.daysInMonth();
    let weeks = new Set();
   
    for(let i = 0; i < numOfDays; i++){
        const currentDay = moment(firstDayOfMonth, 'YYYY-MM-DD').add(i, 'days');

        if(currentDay.isoWeekday() != 6 && currentDay.isoWeekday() != 7)
            weeks.add(currentDay.isoWeek());
    }
    callback(Array.from(weeks))
}

function getWeekdaysInMonth(year,month,callback){
    getWeeksInMonth(year, month, function(weeks){
        var weekdays = []
        for(let i = 0; i< weeks.length;i++){
            getWeekDaysInWeekInSameMonth(year,month,weeks[i],function(res){
                weekdays.push({week: weeks[i], weekdays: res})
                if(weekdays.length == weeks.length){
                    callback(weekdays)
                }
            }) 
        }
    })
}

function getWeekNumber(date){
    return moment(date, "YYYYMMDD").isoWeek();
}

function firstWeekdayOfWeek(weekNumber){
    return moment().startOf(weekNumber).weekday()
}

function lastWeekdayOfWeek(weekNumber){
    return moment().endOf(weekNumber).weekday()
}

function getWorkWeekdaysInWeek(weekNumber){
    let workDays = [0,1,2,3,4]
    let firstWeekdayOfWeek = firstWeekdayOfWeek(weekNumber)
    let lastWeekdayOfWeek = lastWeekdayOfWeek(weekNumber)


}

function calculateAvailableWorkTime(weekNumbers){

}

/*
ugedage = hvilke dage er der i ugen = momentjs?
arbejdsDage = hvilke dage han arbejder = databasen (OpgaveloserArbejdsTider)
dageTilRådighed = match UGEDAGE og ARBEJDSDAGE

maxTimeAntalTilRådighed = hvis han ikke arbejder på andre opgaver i den uge = dagSlut - dagStart ift dageTilRådighed

timeAntalTilRådighed = hvor mange timer han reelt har til rådighed = maxTimeAntalTilRådighed - (timeAntal for de dato'er i den uge)
 */



module.exports = {

}