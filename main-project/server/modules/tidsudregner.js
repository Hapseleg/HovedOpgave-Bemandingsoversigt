var moment = require('moment');

//1 = mandag, 2 = tirsdag, 3 = onsdag, 4 = torsdag, 5 = fredag
//6 = lørdag, 7 = søndag

/**
 * Returner via callback et number array der indeholder alle de ugedage for den bestemte uge, hvor 1 er mandag og 5 er fredag
 * @param {number} year Året
 * @param {number} month Måneden (1-12)
 * @param {number} weekNumber Ugen
 * @param {function} callback 
 */
function getWeekDaysInWeekInSameMonth(year, month, weekNumber, callback) {
    let startOfWeek = moment(year, 'YYYY').month(month).isoWeek(weekNumber).startOf('isoWeek')
    let weekDays = []
    for (let i = 1; i <= 5; i++) {
        let weekDay = startOfWeek.isoWeekday()
        let monthOfStart = startOfWeek.month() + 1

        if (weekDay == 6 || weekDay == 7 || weekDays.length == 5) {
            callback(weekDays)
            return weekDays
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
/**
 * Returner ugetallene for den angiven måned via callback
 * @param {*} year 
 * @param {*} month 
 * @param {*} callback 
 */
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

/**
 * Returnere via callback hvor mange arbejdsdage der er i den valgte måned
 * @param {*} year 
 * @param {*} month 
 * @param {*} callback 
 */
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

/**
 * Returnere et array der indeholder objekter med opgaveloserId, arbejdstidPrUge og et arbejdsDage array der indeholder de ugedage den opgaveløser arbejder (mandag = 1)
 * @param {*} opgaverlosere Array der indeholder objekter med opgaveloserId, arbejdstidPrUge og en dag
 */
function getWorkDaysForOpgavelosere(opgaverlosere) {
    let opgavelosereArbejdsDage = []
    for (let i = 0; i < opgaverlosere.length; i++) {
        let currentOpgaveloser = opgavelosereArbejdsDage.find(o => o.opgaveloserId === opgaverlosere[i].opgaveloserId)
        if (currentOpgaveloser == undefined) {
            currentOpgaveloser = { 'opgaveloserId': opgaverlosere[i].opgaveloserId, 'arbejdsDage': [], 'arbejdstidPrUge': opgaverlosere[i].arbejdstidPrUge }
            opgavelosereArbejdsDage.push(currentOpgaveloser)
        }
        currentOpgaveloser.arbejdsDage.push(opgaverlosere[i].dag)
    }
    return opgavelosereArbejdsDage
}

/**
 * Udregner hvor mange timer opgaveløserne max kan have til rådighed i de måneder der er sendt med som parameter
 * @param {*} data Array der indeholder objekter med opgaveloserId, arbejdstidPrUge og en dag (angivet som 1-5)
 * @param {*} months Array der består af måneder og ugerne i den måned
 * @param {*} callback 
 */
function calculateMaxAvailableWorkTimeInMonthsAndWeeks(data, months, callback) {

    // console.log(data)
    // console.log(months)
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
                //let foundWeek = newMo.weeks.find(o => o.week = we.week)

                if (availableWorkDaysInWeek > 0) {
                    // maxAvailableWorkTimeInWeek = (arbejdstidPrUge / hvor mange dage de arbejder i en normal uge) * arbejdsdage i ugen
                    let maxWorksHoursInWeek = (curOp.arbejdstidPrUge / curOp.arbejdsDage.length) * availableWorkDaysInWeek
                    let fixedMaxWorksHoursInWeek = parseInt(maxWorksHoursInWeek.toFixed(0), 10)
                    //console.log(curOp.opgaveloserId,curOp.arbejdstidPrUge, availableWorkDaysInWeek,fixedMaxWorksHoursInWeek)

                    //if (foundWeek == undefined) {
                    newMo.weeks.push({
                        'week': we.week,
                        'hours': fixedMaxWorksHoursInWeek,
                        'usedHours': 0,
                        'opgaver':[]
                    })
                    // }
                    // else {
                    //     foundWeek += fixedMaxWorksHoursInWeek
                    // }

                    newMo.maxAvailableWorkTimeInMonth += fixedMaxWorksHoursInWeek
                    newMo.availableWorkTimeInMonth += fixedMaxWorksHoursInWeek

                    opgaveloser.maxAvailableWorkTime += fixedMaxWorksHoursInWeek
                    opgaveloser.availableWorkTime += fixedMaxWorksHoursInWeek//TODO bliver nogle gange regnet forkert, 
                }
                else {
                    //if (foundWeek == undefined) {
                    newMo.weeks.push({
                        'week': we.week,
                        'hours': 0,
                        'usedHours': 0,
                        'opgaver':[]
                    })
                }
                //}

            }

        }
    }
    callback(opgaveloseremaxAvailableWorkTime)
}

/**
 * Tilføjer afsatte timer til opgaveløserne i maxAvailableWorkTime og returnere via callback 
 * @param {*} maxAvailableWorkTime Array fra funktionen calculateMaxAvailableWorkTimeInMonthsAndWeeks
 * @param {*} workTime Array fra databasen der indeholder afsatte timer
 * @param {*} callback 
 */
function addUsedHours(maxAvailableWorkTime, workTime, callback) {
    //console.log('workTime',workTime)
    for (let i = 0; i < workTime.length; i++) {
        let wt = workTime[i]
        if(wt.opgaveloserOpgaveId != null){

            let currentOpgaveloser = maxAvailableWorkTime.find(o => o.opgaveloserId == wt.opgaveloserId)
            if (currentOpgaveloser != undefined) {
                currentOpgaveloser.availableWorkTime -= wt.timeAntal
    
                let month = currentOpgaveloser.months.find(o => o.month == wt.month && o.year == wt.year)
                // if (month != undefined) {
                if (month != undefined && wt.aktiv == 1) {
                    month.availableWorkTimeInMonth -= wt.timeAntal
    
                    let week = month.weeks.find(o => o.week == wt.week)
                    week.usedHours += wt.timeAntal
                    //if(wt.opgaveId != null)
                    week.opgaver.push({'opgaveId':wt.opgaveId, 'opgaveNavn':wt.opgaveNavn})
                }
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