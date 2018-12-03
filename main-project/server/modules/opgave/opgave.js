var name = 'opgave'

//check if its the right path
function validatePath(path) {
    if (path == name)
        return true
}

//return view filename if its the right path
function getView(path) {
    if (validatePath(path))
        return name
    else
        return ''
}

//get data required for creating a new opgave (for the comboboxes)
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

//get data for getting a specific opgave
function getOpgaveById(opgaveId) {
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
            {
                table: 'Opgave',
                columns: ['opgaveId', 'opgaveNavn', 'kundeId', 'kundeansvarligId', 'opgavestillerId', 'opgaveStatusId', 'opgavetypeId', 'lokationId', 'kontraktStatusId', 'startDato', 'fixedStartDato', 'slutDato', 'fixedSlutDato', 'kommentar', 'estimeretTimetal', 'aktiv'],
                leftJoins: [
                    { leftTable: 'Opgave', rightTable: 'OpgaveStatus', leftColumn: 'opgaveStatusId', rightColumn: 'opgaveStatusId', selectColumns: ['opgaveStatusNavn'] },
                    { leftTable: 'Opgave', rightTable: 'Opgavetype', leftColumn: 'opgavetypeId', rightColumn: 'opgavetypeId', selectColumns: ['opgavetypeNavn'] },
                    { leftTable: 'Opgave', rightTable: 'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn'] },
                    { leftTable: 'Opgave', rightTable: 'KontraktStatus', leftColumn: 'kontraktStatusId', rightColumn: 'kontraktStatusId', selectColumns: ['kontraktStatusNavn'] },
                ],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
            {
                table: 'Deadline',
                columns: ['deadlineId','deadlineDato', 'deadlineKommentar'],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
            {
                table: 'OpgaveloserOpgave',
                columns: ['opgaveloserKonsulentProfilId'],
                leftJoins: [
                    { leftTable: 'OpgaveloserOpgave', rightTable: 'OpgaveloserKonsulentprofil', leftColumn: 'opgaveloserKonsulentProfilId', rightColumn: 'opgaveloserKonsulentProfilId', selectColumns: ['konsulentProfilId', 'opgaveloserId', 'konsulentProfilWeight'] },
                    { leftTable: 'OpgaveloserKonsulentprofil', rightTable: 'Konsulentprofil', leftColumn: 'konsulentProfilId', rightColumn: 'konsulentProfilId', selectColumns: ['konsulentProfilNavn'] },
                    { leftTable: 'OpgaveloserKonsulentprofil', rightTable: 'Opgaveloser', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['fornavn', 'efternavn', 'lokationId'] },
                    { leftTable: 'Opgaveloser', rightTable: 'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn'] },
                ],
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
        ],
        origin: name + 'specific'
    }
}

/**
 * insert data into db json object 
 * @param {string} table name of the table
 * @param {string[]} columns name of the columns
 * @param {Array} values the values that will be inserted into the db, the array holds objects
 * @param {Array} data the data array from the object that contains origin and idFromFirstInsert etc
 * @param {boolean} useIdFromFirstInsert Use the id from the first inserted thing? (fx deadlines uses opgaveId)
 * @param {function} callback callback function
 */
function insertData(table, columns, values, data, useIdFromFirstInsert, callback) {
    let toBeInserted = {//create object that will be inserted into data
        table: table,
        columns: columns,
        values: [],
        useIdFromFirstInsert: useIdFromFirstInsert
    }

    if (values != undefined) {//if values is undefined, don't do anything
        for (let i = 0; i < values.length; i++) {
            let da = values[i]//da is a object
            let arr = []
            for (let i = 0; i < Object.keys(da).length; i++) {//Object.keys(da).length = how many properties the object has, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
                arr.push(da[Object.keys(da)[i]])//gets the value of property i in da
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

function updateOpgave(arg, callback) {
    let data = {
        data: [{
            table: 'Opgave',
            columns: ['opgaveNavn', 'kundeId', 'kundeansvarligId', 'opgavestillerId', 'opgaveStatusId', 'opgavetypeId', 'lokationId', 'kontraktStatusId', 'startDato', 'fixedStartDato', 'slutDato', 'fixedSlutDato', 'kommentar', 'estimeretTimetal', 'aktiv'],
            values: [arg.opgaveNavn, arg.kundeId, arg.kundeansvarligId, arg.opgavestillerId, arg.opgaveStatusId, arg.opgavetypeId, arg.lokationId, arg.kontraktStatusId, arg.startDato, arg.fixedStartDato, arg.slutDato, arg.fixedSlutDato, arg.kommentar, arg.estimeretTimetal, arg.aktiv],
            where: [{ column: 'OpgaveId', value: arg.opgaveId }]
        }
            //tilføj/fjern deadlines og opgaveløsere
        ],
        origin: name
    }

    insertData('Deadline', ['deadlineDato', 'deadlineKommentar', 'opgaveId'], arg.deadlines, data.data, true, function () {
        //insertData('OpgaveloserOpgave', ['opgaveloserKonsulentProfilId', 'opgaveId'], arg.opgaveloser, data.data, true, function () {
            callback(data)
        //})
    })
}

function deleteOpgave(arg) {
    return {
        data: [{
            table: 'Opgave',
            where: [{ column: 'OpgaveId', value: arg.opgaveId }]
        }
        ],
        origin: name
    }
}

function deleteDeadlines(arg) {
    console.log(arg.deadlinesToRemove)
    let data = {
        data: [
        ],
        origin: name
    }
    for(let i = 0; i< arg.deadlinesToRemove.length; i++){
        data.data.push({
            'table': 'Deadline',
            'where': [{ column: 'deadlineId', value: arg.deadlinesToRemove[i] }]
        })
        console.log(data)
        if(data.data.length == arg.deadlinesToRemove.length)
            return data
    }
}

module.exports = {
    getView: getView,
    saveData: saveData,
    getData: getData,
    getOpgaveById: getOpgaveById,
    updateOpgave: updateOpgave,
    deleteOpgave: deleteOpgave,
    deleteDeadlines:deleteDeadlines
}