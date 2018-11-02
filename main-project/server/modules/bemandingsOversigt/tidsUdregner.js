var moment = require('moment');

//1 = mandag, 2 = tirsdag, 3 = onsdag, 4 = torsdag, 5 = fredag
//6 = lørdag, 7 = søndag

function getWeekDaysInWeekInSameMonth(year, month, weekNumber, callback){
    let startOfWeek = moment(year, 'YYYY').month(month).isoWeek(weekNumber).startOf('isoWeek')
    let weekDays = []
    for(let i = 1; i<=5;i++){
        let weekDay = startOfWeek.isoWeekday()
        let monthOfStart = startOfWeek.month()+1
 
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

function calculateAvailableWorkTimeInWeeks(weekNumbers, data, year, month, callback){
    let dagStartMoment
    let dagSlutMoment

    //console.log(data[1].result)

    for(let i = 0; i<weekNumbers.length;i++){
        var currentWeekNumber = weekNumbers[i]
        currentWeekNumber.opgaveloser = []

        for(let i = 0; i<data[0].result.length;i++){
            let da = data[0].result[i]

            let opgaveloser = currentWeekNumber.opgaveloser.find(o => o.opgaveloserId === da.opgaveloserId)

            if(opgaveloser == undefined){//if the opgaveloser is not in the array, add it
                opgaveloser = {opgaveloserId: da.opgaveloserId, week: currentWeekNumber.week, workDaysInWeek: [], maxAvailableWorkTime: 0, currentWorkTime: []}
                currentWeekNumber.opgaveloser.push(opgaveloser)
            }

            if(currentWeekNumber.weekdays.includes(da.dag)){
                opgaveloser.workDaysInWeek.push(da.dag)

                dagStartMoment = moment(da.dagStart, 'HHmmss')
                dagSlutMoment = moment(da.dagSlut, 'HHmmss')

                opgaveloser.maxAvailableWorkTime += dagSlutMoment.diff(dagStartMoment, 'h', true)
            }
        }
    }

    // console.log(data[1].result, 'calculateAvailableWorkTimeInWeeks currentWorkTime')
    for(let i = 0; i<data[1].result.length;i++){
        let da = data[1].result[i]
        //console.log(da)
        if(da.opgaveloserKonsulentProfilId != null){
            let workDate = moment(da.year, 'YYYY').month(da.month).isoWeek(da.week).startOf('isoWeek')



        if(workDate.year() == year && workDate.month()+1 == month){

            let weekNumber = workDate.isoWeek()
            let week = weekNumbers.find(o => o.week == weekNumber)
            let opgaveloser = week.opgaveloser.find(o => o.opgaveloserId === da.opgaveloserId)

            opgaveloser.currentWorkTime.push({ugeTimeOpgaveId: da.ugeTimeOpgaveId, opgaveId: da.opgaveId, timeAntal: da.timeAntal, opgaveloserKonsulentProfilId: da.opgaveloserKonsulentProfilId})
        }
        }

        
    }

    callback(weekNumbers)
}

/*
ugedage = hvilke dage er der i ugen = momentjs?
arbejdsDage = hvilke dage han arbejder = databasen (OpgaveloserArbejdsTider)
dageTilRådighed = match UGEDAGE og ARBEJDSDAGE

maxTimeAntalTilRådighed = hvis han ikke arbejder på andre opgaver i den uge = dagSlut - dagStart ift dageTilRådighed

timeAntalTilRådighed = hvor mange timer han reelt har til rådighed = maxTimeAntalTilRådighed - (timeAntal for de dato'er i den uge)
 */



module.exports = {
    getWeekdaysInMonth:getWeekdaysInMonth,
    calculateAvailableWorkTimeInWeeks:calculateAvailableWorkTimeInWeeks
}