var name = 'opgave'

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

function getData() {
    return {
        data: [
            {
                table: 'Opgaveloser',
                columns: ['opgaveloserId', 'fornavn', 'lokationId', 'arbejdstidPrUge'],
                leftJoins: [
                    { leftTable: 'Opgaveloser', rightTable: 'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn'] },
                    { leftTable: 'Opgaveloser', rightTable: 'OpgaveloserKonsulentprofil', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['opgaveloserKonsulentProfilId', 'konsulentProfilId', 'konsulentProfilWeight'] },
                    { leftTable: 'OpgaveloserKonsulentprofil', rightTable: 'Konsulentprofil', leftColumn: 'konsulentProfilId', rightColumn: 'konsulentProfilId', selectColumns: ['konsulentProfilNavn'] }
                ]
            },
            {
                table: 'Opgavetype',
                columns: ['*']
            },
            {
                table: 'OpgaveStatus',
                columns: ['*']
            },
            {
                table: 'KontraktStatus',
                columns: ['*']
            },
            {
                table: 'Lokation',
                columns: ['*']
            },
            {
                table: 'Opgavestiller',
                columns: ['opgavestillerId', 'fornavn, efternavn']
            },
            {
                table: 'Kundeansvarlig',
                columns: ['kundeansvarligId', 'fornavn, efternavn']
            },
            {
                table: 'Kunde',
                columns: ['kundeId', 'fornavn, efternavn']
            },
        ],
        origin: name
    }
}

function getOpgaveById(opgaveId) {
    return {
        data: [
            {
                table: 'Opgave',
                columns: ['opgaveNavn', 'opgaveStatusId', 'opgavetypeId', 'lokationId', 'kontraktStatusId', 'startDato', 'fixedStartDato', 'slutDato', 'fixedSlutDato', 'kommentar', 'estimeretTimetal', 'aktiv'],
                leftJoins: [
                    { leftTable: 'Opgave', rightTable: 'OpgaveStatus', leftColumn: 'opgaveStatusId', rightColumn: 'opgaveStatusId', selectColumns: ['opgaveStatusNavn'] },
                    { leftTable: 'Opgave', rightTable: 'Opgavetype', leftColumn: 'opgavetypeId', rightColumn: 'opgavetypeId', selectColumns: ['opgavetypeNavn'] },
                    { leftTable: 'Opgave', rightTable: 'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn'] },
                    { leftTable: 'Opgave', rightTable: 'KontraktStatus', leftColumn: 'kontraktStatusId', rightColumn: 'kontraktStatusId', selectColumns: ['kontraktStatusNavn'] },
                ],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
            {
                table: 'Opgave',
                columns: ['kundeId'],
                leftJoins: [
                    { leftTable: 'Opgave', rightTable: 'Kunde', leftColumn: 'kundeId', rightColumn: 'kundeId', selectColumns: ['fornavn', 'efternavn'] },
                ],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
            {
                table: 'Opgave',
                columns: ['kundeansvarligId'],
                leftJoins: [
                    { leftTable: 'Opgave', rightTable: 'Kundeansvarlig', leftColumn: 'kundeansvarligId', rightColumn: 'kundeansvarligId', selectColumns: ['fornavn', 'efternavn'] },
                ],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
            {
                table: 'Opgave',
                columns: ['opgavestillerId'],
                leftJoins: [
                    { leftTable: 'Opgave', rightTable: 'Opgavestiller', leftColumn: 'opgavestillerId', rightColumn: 'opgavestillerId', selectColumns: ['fornavn', 'efternavn'] },
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
                columns: ['opgaveloserKonsulentProfilId'],
                leftJoins: [
                    { leftTable: 'OpgaveloserOpgave', rightTable: 'OpgaveloserKonsulentprofil', leftColumn: 'opgaveloserKonsulentProfilId', rightColumn: 'opgaveloserKonsulentProfilId', selectColumns: ['konsulentProfilId','opgaveloserId','konsulentProfilWeight'] },
                    { leftTable: 'OpgaveloserKonsulentprofil', rightTable: 'Konsulentprofil', leftColumn: 'konsulentProfilId', rightColumn: 'konsulentProfilId', selectColumns: ['konsulentProfilNavn'] },
                    { leftTable: 'OpgaveloserKonsulentprofil', rightTable: 'Opgaveloser', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['fornavn','efternavn','lokationId'] },
                    { leftTable: 'Opgaveloser', rightTable: 'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn'] },
                ],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
        ],
        origin: name + 'specific'
    }
}

function insertData(table, columns, values, data, useIdFromFirstInsert, callback) {
    if(values != undefined){
        let toBeInserted = {
            table: table,
            columns: columns,
            values: [],
            useIdFromFirstInsert: useIdFromFirstInsert
        }
    
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

function saveData(arg, callback) {
    if (arg.opgavenNavn == '')
        throw 'opgave navn er tomt'
    else {
        let data = {
            data: [{
                table: 'Opgave',
                columns: ['opgaveNavn', 'kundeId', 'kundeansvarligId', 'opgavestillerId', 'opgaveStatusId', 'opgavetypeId', 'lokationId', 'kontraktStatusId', 'startDato', 'fixedStartDato', 'slutDato', 'fixedSlutDato', 'kommentar', 'estimeretTimetal', 'aktiv'],
                values: [[arg.opgaveNavn, arg.kundeId, arg.kundeansvarligId, arg.opgavestillerId, arg.opgaveStatusId, arg.opgavetypeId, arg.lokationId, arg.kontraktStatusId, arg.startDato, arg.fixedStartDato, arg.slutDato, arg.fixedSlutDato, arg.kommentar, arg.estimeretTimetal, arg.aktiv]]
            }
            ],
            origin: name,
            idFromFirstInsert: 'Opgave'
        }

        insertData('Deadline', ['deadlineDato', 'deadlineKommentar', 'opgaveId'], arg.deadlines, data.data, true, function () {
            insertData('OpgaveloserOpgave', ['opgaveloserKonsulentProfilId', 'opgaveId'], arg.opgaveloser, data.data, true, function () {
                callback(data)
            })
        })
    }
}

module.exports = {
    getView: getView,
    saveData: saveData,
    getData: getData,
    getOpgaveById: getOpgaveById
}