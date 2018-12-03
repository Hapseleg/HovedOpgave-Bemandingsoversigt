//Opgaveoversigt der viser deadline, tidsestimat, lokation, interne reservationer (trivsel hensyn, ferie mm.) og status.
var name = 'opgaveoversigt'

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
                table: 'Opgave',
                columns: ['opgaveId', 'opgaveNavn', 'lokationId', 'opgaveStatusId', 'kontraktStatusId', 'startDato', 'slutDato', 'estimeretTimetal', 'aktiv'],
                leftJoins: [
                    // {leftTable: 'Opgave', rightTable:'Deadline', leftColumn: 'opgaveId', rightColumn: 'opgaveId', selectColumns: ['deadlineDato', 'deadlineKommentar']},
                    { leftTable: 'Opgave', rightTable: 'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn'] },
                    { leftTable: 'Opgave', rightTable: 'OpgaveStatus', leftColumn: 'opgaveStatusId', rightColumn: 'opgaveStatusId', selectColumns: ['opgaveStatusNavn'] },
                    { leftTable: 'Opgave', rightTable: 'KontraktStatus', leftColumn: 'kontraktStatusId', rightColumn: 'kontraktStatusId', selectColumns: ['kontraktStatusNavn'] },
                ]
            },
            {
                table: 'UgeTimeOpgave',
                columns: ['opgaveloserOpgaveId', 'timeAntal'],
                leftJoins: [
                    { leftTable: 'UgeTimeOpgave', rightTable: 'OpgaveloserOpgave', leftColumn: 'opgaveloserOpgaveId', rightColumn: 'opgaveloserOpgaveId', selectColumns: ['opgaveId'] },
                ]
            },
        ],
        origin: name
    }
}

function getDeadlines(opgaveId) {
    return {
        data: [
            {
                table: 'Deadline',
                columns: ['deadlineDato', 'deadlineKommentar'],
                where: [{ column: 'opgaveId', value: opgaveId }]
            },
        ],
        origin: name + 'deadlines'
    }
}

function calculateUsedTimeForOpgave(arg, callback) {

    for (let i = 0; i < arg[0].result.length; i++) {//alle opgaverne
        let da = arg[0].result[i]
        da.timerBrugt = 0;

        for (let j = 0; j < arg[1].result.length; j++)
            if (arg[1].result[j].opgaveId == da.opgaveId)
                da.timerBrugt += arg[1].result[j].timeAntal
    }
    callback(arg[0].result)
}
// function calculateUsedTimeForOpgave(arg, callback){
//     let hoursForOpgave = []

//     for(let i = 0;i<arg.length;i++){
//         let opgave = hoursForOpgave.find(e => e.opgaveId == arg[i].opgaveId)
//         if(opgave == undefined){
//             opgave = {'opgaveId': arg[i].opgaveId, 'timerBrugt': 0}
//             hoursForOpgave.push(opgave)
//         }
//         opgave.timerBrugt += arg[i].timeAntal

//     }
//     return {hoursForOpgave}
// }

module.exports = {
    getView: getView,
    getData: getData,
    getDeadlines: getDeadlines,
    calculateUsedTimeForOpgave: calculateUsedTimeForOpgave
}