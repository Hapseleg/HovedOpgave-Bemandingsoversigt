var tidsUdregner = require('./tidsudregner.js')

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
                columns: ['opgaveNavn','estimeretTimetal'],
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
                columns: ['opgaveloserId', 'dag', 'dagStart', 'dagSlut'],
            },
            {
                table: 'OpgaveloserOpgave',
                columns: ['opgaveloserOpgaveId', 'opgaveId', 'opgaveloserKonsulentProfilId'],
                leftJoins: [
                    { leftTable: 'OpgaveloserOpgave', rightTable: 'UgeTimeOpgave', leftColumn: 'opgaveloserOpgaveId', rightColumn: 'opgaveloserOpgaveId', selectColumns: ['year', 'month', 'week', 'timeAntal'] },
                    { leftTable: 'OpgaveloserOpgave', rightTable: 'OpgaveloserKonsulentProfil', leftColumn: 'opgaveloserKonsulentProfilId', rightColumn: 'opgaveloserKonsulentProfilId', selectColumns: ['opgaveloserId'] },
                ],
                //where: [{ column: 'opgaveId', value: opgaveId }],
                between: [
                    { 'column': 'year', 'start': startDate[0], 'slut': slutDate[0] },
                    { 'column': 'month', 'start': startDate[1], 'slut': slutDate[1] },
                    //{ 'column': 'week', 'start': tidsUdregner.getIsoWeek(startDate[0],startDate[1],startDate[2]), 'slut': tidsUdregner.getIsoWeek(slutDate[0],slutDate[1],slutDate[2]) }
                ]
            },
        ],
        origin: name + 'Tid'
    }
}

module.exports = {
    getView: getView,
    //saveData: saveData,
    getData: getData,
    getTidData: getTidData,
    getWeekdaysInMonth: tidsUdregner.getWeekdaysInMonth,
    calculateAvailableWorkTimeInWeeks: tidsUdregner.calculateAvailableWorkTimeInWeeks
}