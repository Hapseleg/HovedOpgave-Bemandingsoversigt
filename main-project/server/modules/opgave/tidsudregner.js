var moment = require('moment');

//1 = mandag, 2 = tirsdag, 3 = onsdag, 4 = torsdag, 5 = fredag
//6 = lørdag, 7 = søndag

function getWeekDaysInWeekInSameMonth(year, month, weekNumber, callback) {
    let startOfWeek = moment(year, 'YYYY').month(month).isoWeek(weekNumber).startOf('isoWeek')
    let weekDays = []
    for (let i = 1; i <= 5; i++) {
        let weekDay = startOfWeek.isoWeekday()
        let monthOfStart = startOfWeek.month() + 1

        if (weekDay == 6 || weekDay == 7 || weekDays.length == 5) {
            callback(weekDays)
            break;
        }
        else if (monthOfStart == month) {
            weekDays.push(weekDay)
        }

        if (i == 5) {
            callback(weekDays)
            break;
        }

        startOfWeek.add(1, 'days')
    }
}

//https://stackoverflow.com/questions/43603604/how-to-get-week-numbers-of-current-month-in-moment-js
function getWeeksInMonth(year, month, callback) {
    const firstDayOfMonth = moment(`${year}-${month}`, 'YYYY-MM-DD');
    const numOfDays = firstDayOfMonth.daysInMonth();
    let weeks = new Set();

    for (let i = 0; i < numOfDays; i++) {
        const currentDay = moment(firstDayOfMonth, 'YYYY-MM-DD').add(i, 'days');

        if (currentDay.isoWeekday() != 6 && currentDay.isoWeekday() != 7)
            weeks.add(currentDay.isoWeek());
    }
    callback(Array.from(weeks))
}

function getWeekdaysInMonth(year, month, callback) {
    getWeeksInMonth(year, month, function (weeks) {
        var weekdays = []
        for (let i = 0; i < weeks.length; i++) {
            getWeekDaysInWeekInSameMonth(year, month, weeks[i], function (res) {
                weekdays.push({ week: weeks[i], weekdays: res })
                if (weekdays.length == weeks.length) {
                    callback(weekdays)
                }
            })
        }
    })
}

function getWorkDaysForOpgavelosere(data) {
    let opgavelosereArbejdsDage = []
    for (let i = 0; i < data.length; i++) {
        let op = data[i]
        let currentOpgaveloser = opgavelosereArbejdsDage.find(o => o.opgaveloserId === op.opgaveloserId)
        if (currentOpgaveloser == undefined) {
            currentOpgaveloser = { 'opgaveloserId': op.opgaveloserId, 'arbejdsDage': [], 'arbejdstidPrUge': op.arbejdstidPrUge }
            opgavelosereArbejdsDage.push(currentOpgaveloser)
        }
        currentOpgaveloser.arbejdsDage.push(op.dag)
    }
    return opgavelosereArbejdsDage
}

function calculateMaxAvailableWorkTimeInMonthsAndWeeks(data, months, callback) {
    //console.log(data)
    //console.log(months)
    /**
     * Lav objekter for hver opgaveløser med deres arbejdsdage
     * gå ind i måned
     * Tjek om opgaveløseren findes, hvis ikke tilføj ham
     * gå ind i ugen
     * sammenlign dage i ugen og arbejdsdage for opgaveløseren
     * maxAvailableWorkTimeInWeek = arbejdstidPrUge / arbejdsdage i ugen
     * maxAvailableWorkTimeInMonth += maxAvailableWorkTimeInWeek
     */

    //Lav objekter for hver opgaveløser med deres arbejdsdage
    //{ 'opgaveloserId': op.opgaveloserId, 'arbejdsDage': [], 'arbejdstidPrUge': op.arbejdstidPrUge }
    let opgavelosereArbejdsDage = getWorkDaysForOpgavelosere(data)

    //gå igennem hver opgaveløser og tilføj 
    //id, år, måned, maxAvailableWorkTimeInMonth, maxAvailableWorkTimeInWeeks: [{week:1, time:37},{week:1, time:37}]
    let opgaveloseremaxAvailableWorkTime = []
    for (let i = 0; i < opgavelosereArbejdsDage.length; i++) {
        let curOp = opgavelosereArbejdsDage[i]
        let opgaveloser = {
            'opgaveloserId': curOp.opgaveloserId,
            'months': [],
            'maxAvailableWorkTime': 0,
            'availableWorkTime': 0,
            // 'maxAvailableWorkTimeInWeeks': []
        }
        opgaveloseremaxAvailableWorkTime.push(opgaveloser)

        //gå ind i måned
        for (let currentMonth = 0; currentMonth < months.length; currentMonth++) {
            let mo = months[currentMonth]
            //tilføj måned
            let newMo = {
                'year': mo.year,
                'month': mo.month,
                'weeks': [],//[{week:1, time:37},{week:1, time:37}]
                'maxAvailableWorkTimeInMonth': 0,
                'availableWorkTimeInMonth': 0,
            }
            opgaveloser.months.push(newMo)

            //gå ind i ugen
            for (let currentWeek = 0; currentWeek < mo.weeks.length; currentWeek++) {
                let we = mo.weeks[currentWeek]//{ week: 40, weekdays: [ 1, 2, 3, 4, 5 ] }

                //sammenlign dage i ugen og arbejdsdage for opgaveløseren
                let availableWorkDaysInWeek = 0
                for (let i = 0; i < we.weekdays.length; i++) {
                    if (curOp.arbejdsDage.includes(we.weekdays[i]))
                        availableWorkDaysInWeek++
                }

                // maxAvailableWorkTimeInWeek = arbejdstidPrUge / arbejdsdage i ugen
                if (availableWorkDaysInWeek > 0) {
                    let maxWorksHoursInWeek = curOp.arbejdstidPrUge / availableWorkDaysInWeek
                    let fixedMaxWorksHoursInWeek = parseInt(maxWorksHoursInWeek.toFixed(0),10) 

                    
                    newMo.weeks.push({ 
                        'week': we.week, 
                        'hours': fixedMaxWorksHoursInWeek,
                        'usedHours': 0,
                     })

                    newMo.maxAvailableWorkTimeInMonth += fixedMaxWorksHoursInWeek
                    newMo.availableWorkTimeInMonth += fixedMaxWorksHoursInWeek

                    opgaveloser.maxAvailableWorkTime += fixedMaxWorksHoursInWeek
                    opgaveloser.availableWorkTime += fixedMaxWorksHoursInWeek
                }

            }
        }
    }

    callback(opgaveloseremaxAvailableWorkTime)
}

function addUsedHours(maxAvailableWorkTime, workTime, callback) {
    for (let i = 0; i < workTime.length; i++) {
        let wt = workTime[i]
        let currentOpgaveloser = maxAvailableWorkTime.find(o => o.opgaveloserId == wt.opgaveloserId)
        if (currentOpgaveloser != undefined) {
            currentOpgaveloser.availableWorkTime -= wt.timeAntal

            let month = currentOpgaveloser.months.find(o => o.month == wt.month)
            if (month != undefined) {
                month.availableWorkTimeInMonth -= wt.timeAntal

                let week = month.weeks.find(o=>o.week == wt.week)
                week.usedHours += wt.timeAntal
            }
        }
    }
    callback(maxAvailableWorkTime)
}

function getIsoWeek(year, month, date) {
    return moment(year, 'YYYY').month(month).date(date).isoWeek()
}

module.exports = {
    getWeekdaysInMonth: getWeekdaysInMonth,
    calculateMaxAvailableWorkTimeInMonthsAndWeeks: calculateMaxAvailableWorkTimeInMonthsAndWeeks,
    getIsoWeek: getIsoWeek,
    addUsedHours: addUsedHours,
}