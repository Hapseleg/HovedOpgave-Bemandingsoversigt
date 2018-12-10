var tidsUdregner = require('../tidsudregner.js')

var name = 'tilfojopgaveloser'

function validatePath(path) {
    if (path == name)
        return true
}

function getView(path) {
    if (validatePath(path))
        return name
    else
        return ''
}

function getData(opgaveId) {
    return {
        data: [
            {
                table: 'Opgaveloser',
                columns: ['opgaveloserId', 'fornavn', 'efternavn', 'lokationId', 'arbejdstidPrUge'],
                leftJoins: [
                    { leftTable: 'Opgaveloser', rightTable: 'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn'] },
                    { leftTable: 'Opgaveloser', rightTable: 'OpgaveloserKonsulentprofil', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['opgaveloserKonsulentProfilId', 'konsulentProfilId', 'konsulentProfilWeight'] },
                    { leftTable: 'OpgaveloserKonsulentprofil', rightTable: 'Konsulentprofil', leftColumn: 'konsulentProfilId', rightColumn: 'konsulentProfilId', selectColumns: ['konsulentProfilNavn'] }
                ]
            },
            {
                table: 'Lokation',
                columns: ['*']
            },
            {
                table: 'KonsulentProfil',
                columns: ['*']
            },
            {
                table: 'Opgave',
                columns: ['opgaveId', 'opgaveNavn', 'estimeretTimetal', 'aktiv'],
                leftJoins: [
                    { leftTable: 'Opgave', rightTable: 'Opgavetype', leftColumn: 'opgavetypeId', rightColumn: 'opgavetypeId', selectColumns: ['opgavetypeNavn'] },
                    { leftTable: 'Opgave', rightTable: 'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn'] },
                ],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
            {
                table: 'Deadline',
                columns: ['deadlineDato', 'deadlineKommentar'],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
            {
                table: 'OpgaveloserOpgave',
                columns: ['opgaveId'],
                leftJoins: [
                    { leftTable: 'OpgaveloserOpgave', rightTable: 'UgeTimeOpgave', leftColumn: 'opgaveloserOpgaveId', rightColumn: 'opgaveloserOpgaveId', selectColumns: ['timeAntal'] },
                    { leftTable: 'OpgaveloserOpgave', rightTable: 'OpgaveloserKonsulentprofil', leftColumn: 'opgaveloserKonsulentProfilId', rightColumn: 'opgaveloserKonsulentProfilId', selectColumns: ['opgaveloserId'] },
                ],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
            {
                table: 'Opgaveloser',
                columns: ['opgaveloserId', 'fornavn', 'efternavn', 'lokationId', 'arbejdstidPrUge'],
                leftJoins: [
                    { leftTable: 'Opgaveloser', rightTable: 'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn'] },
                    { leftTable: 'Opgaveloser', rightTable: 'OpgaveloserKonsulentprofil', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['opgaveloserKonsulentProfilId', 'konsulentProfilId', 'konsulentProfilWeight'] },
                    { leftTable: 'OpgaveloserKonsulentprofil', rightTable: 'Konsulentprofil', leftColumn: 'konsulentProfilId', rightColumn: 'konsulentProfilId', selectColumns: ['konsulentProfilNavn'] },
                    { leftTable: 'OpgaveloserKonsulentprofil', rightTable: 'OpgaveloserOpgave', leftColumn: 'opgaveloserKonsulentProfilId', rightColumn: 'opgaveloserKonsulentProfilId', selectColumns: ['opgaveId', 'opgaveloserOpgaveId'] }
                ],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
        ],
        origin: name
    }
}

function getTidData(startDate, slutDate) {
    return {
        data: [
            {
                table: 'OpgaveloserArbejdsTider',
                //columns: ['opgaveloserId', 'dag', 'dagStart', 'dagSlut'],
                columns: ['opgaveloserId', 'dag'],
                leftJoins: [
                    { leftTable: 'OpgaveloserArbejdsTider', rightTable: 'Opgaveloser', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['arbejdstidPrUge'] }
                ],
            },
            {
                table: 'OpgaveloserOpgave',
                columns: ['opgaveloserOpgaveId', 'opgaveId', 'opgaveloserKonsulentProfilId'],
                leftJoins: [
                    { leftTable: 'OpgaveloserOpgave', rightTable: 'UgeTimeOpgave', leftColumn: 'opgaveloserOpgaveId', rightColumn: 'opgaveloserOpgaveId', selectColumns: ['year', 'month', 'week', 'timeAntal'] },
                    { leftTable: 'OpgaveloserOpgave', rightTable: 'OpgaveloserKonsulentProfil', leftColumn: 'opgaveloserKonsulentProfilId', rightColumn: 'opgaveloserKonsulentProfilId', selectColumns: ['opgaveloserId'] },
                    { leftTable: 'OpgaveloserOpgave', rightTable: 'Opgave', leftColumn: 'opgaveId', rightColumn: 'opgaveId', selectColumns: ['aktiv'] },
                ],
                between: [
                    { 'column': 'dato', 'start': ('"' + startDate[0] + '-' + startDate[1] + '-01"'), 'slut': ('"' + slutDate[0] + '-' + slutDate[1] + '-01"') },
                    // { 'column': 'dato', 'start': ('"' + startDate[0] + '-' + startDate[1] + '-' + startDate[2] + '"'), 'slut': ('"' + slutDate[0] + '-' + slutDate[1] + '-' + slutDate[2] + '"') },
                    //{ 'column': 'year', 'start': startDate[0], 'slut': slutDate[0] },
                    //{ 'column': 'month', 'start': startDate[1], 'slut': slutDate[1] },
                    //{ 'column': 'week', 'start': tidsUdregner.getIsoWeek(startDate[0],startDate[1],startDate[2]), 'slut': tidsUdregner.getIsoWeek(slutDate[0],slutDate[1],slutDate[2]) }
                ]
            },
        ],
        origin: name + 'Tid'
    }
}

//TODO avanceret version til at fordele timerne, starter med en nemmere udgave
function calculateAverageHoursForMonths(timeAntal, months) {
    if (months.length == 0)
        throw "There are no months"
    if (timeAntal <= 0)
        throw "timeAntal needs to be greater than 0"

    //tjek om det er muligt at fordele timerne i samme timetal ud over månederne
    let averageHours = timeAntal / months.length
    let averageHoursIsPossible = true
    let i = 0
    while (averageHoursIsPossible && i < months.length) {
        if (months[i].availableWorkTimeInMonth < averageHours)
            averageHoursIsPossible = false
        i++
    }
    if (averageHoursIsPossible) {//det er muligt at fordele dem gennemsnitligt
        //er det muligt at fordele timerne udover alle ugerne gennemsnitligt - det er det nok for det meste ikke..


    }
    else {

    }
}

function calculateHoursForMonths(timeAntal, months, callback) {
    if (months.length == 0)
        throw "There are no months"
    if (timeAntal <= 0)
        throw "timeAntal needs to be greater than 0"

    let datesAndHours = []
    //console.log(months)
    let i = 0
    while (timeAntal > 0 && i < months.length) {//bliv ved så længe timeantal er større end 0
        if (parseFloat(months[i].availableWorkTimeInMonth) > 0) {//hvis der er nogen timer til rådighed i den måned
            for (let currentWeek = 0; timeAntal > 0 && currentWeek < months[i].weeks.length; currentWeek++) {
                let d = {
                    'year': months[i].year,
                    'month': months[i].month,
                    'week': 0,
                    'timeAntal': 0
                    //'weeks': []
                }
                let we = months[i].weeks[currentWeek]
                //console.log(we)
                let remainingHours = (parseFloat(we.hours) - parseFloat(we.usedHours))

                if (remainingHours > 0) {//hvis der er timer til rådighed i den uge
                    timeAntal -= remainingHours
                    if (timeAntal < 0) {//TODO fejl hvis timeantal er større end timer til rådighed total
                        d.timeAntal = parseFloat(we.hours) + timeAntal
                    }
                    else {
                        d.timeAntal = remainingHours
                    }

                    d.week = we.week
                    datesAndHours.push(d)
                }
                //console.log(d)
            }
            //datesAndHours.push(d)
        }
        i++
    }

    // console.log('timeAntal', timeAntal)
    // console.log('months', months)
    // console.log('datesAndHours', datesAndHours)
    callback(datesAndHours)
}

function insertData(table, columns, values, onDupliateKeyUpdate, data, useIdFromFirstInsert, callback) {
    let toBeInserted = {
        table: table,
        columns: columns,
        values: [],
        useIdFromFirstInsert: useIdFromFirstInsert,
        onDupliateKeyUpdate: onDupliateKeyUpdate
    }

    if (values != undefined) {
        for (let i = 0; i < values.length; i++) {
            let da = values[i]
            let arr = []
            for (let i = 0; i < Object.keys(da).length; i++) {
                arr.push(da[Object.keys(da)[i]])
            }
            toBeInserted.values.push(arr)
        }
        data.push(toBeInserted)
    }
    callback(data)
}

function saveNewOpgavelosere(arg, months, callback) {
    let data = {
        data: [{
            table: 'OpgaveloserOpgave',
            columns: ['opgaveloserKonsulentProfilId', 'opgaveId'],
            values: [[arg.opgaveloserKonsulentProfilId, arg.opgaveId]]
        }
        ],
        origin: name + 'NewOpgavelosere',
        idFromFirstInsert: 'OpgaveloserOpgave'
    }

    let onDupliateKeyUpdate = { 'column': 'timeAntal' }
    insertData('UgeTimeOpgave', ['year', 'month', 'week', 'timeAntal', 'opgaveloserOpgaveId'], months, onDupliateKeyUpdate, data.data, true, function () {
        callback(data)
    })
}

function saveChangedOpgavelosere(arg, months, callback) {
    let data = {
        data: [],
        origin: name + 'NewOpgavelosere',
        idFromFirstInsert: 'OpgaveloserOpgave'
    }

    for (let i = 0; i < months.length; i++)
        months[i].opgaveloserOpgaveId = arg.opgaveloserOpgaveId

    let onDupliateKeyUpdate = { 'column': 'timeAntal' }
    insertData('UgeTimeOpgave', ['year', 'month', 'week', 'timeAntal', 'opgaveloserOpgaveId'], months, onDupliateKeyUpdate, data.data, false, function () {
        callback(data)
    })
}

function deleteUgeTimeOpgave(arg, startDate, slutDate) {
    return {
        data: [{
            table: 'UgeTimeOpgave',
            where: [
                { column: 'opgaveloserOpgaveId', value: arg.opgaveloserOpgaveId }
            ],
            between: [
                { 'column': 'dato', 'start': ('"' + startDate + '"'), 'slut': ('"' + slutDate + '"') },
            ]
        }
        ],
        origin: name + 'delete'
    }
}

module.exports = {
    getView: getView,
    getData: getData,
    getTidData: getTidData,
    getWeekdaysInMonth: tidsUdregner.getWeekdaysInMonth,
    calculateMaxAvailableWorkTimeInMonthsAndWeeks: tidsUdregner.calculateMaxAvailableWorkTimeInMonthsAndWeeks,
    addUsedHours: tidsUdregner.addUsedHours,
    calculateHoursForMonths: calculateHoursForMonths,
    deleteUgeTimeOpgave: deleteUgeTimeOpgave,
    saveNewOpgavelosere: saveNewOpgavelosere,
    saveChangedOpgavelosere: saveChangedOpgavelosere
}