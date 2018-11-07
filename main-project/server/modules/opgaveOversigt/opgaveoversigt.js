//Opgaveoversigt der viser deadline, tidsestimat, lokation, interne reservationer (trivsel hensyn, ferie mm.) og status.
var name = 'opgaveoversigt'

function validatePath(path){
    if(path == name)
        return true
}

function getView(path){
    if(validatePath(path))
        return name
    else
        return ''
}


function getData(){
    return {
        data:[
            {
                table:'Opgave',
                columns: ['opgaveId','opgaveNavn','lokationId','opgaveStatusId','kontraktStatusId','startDato','slutDato'],
                leftJoins:[
                    // {leftTable: 'Opgave', rightTable:'Deadline', leftColumn: 'opgaveId', rightColumn: 'opgaveId', selectColumns: ['deadlineDato', 'deadlineKommentar']},
                    {leftTable: 'Opgave', rightTable:'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn']},
                    {leftTable: 'Opgave', rightTable:'OpgaveStatus', leftColumn: 'opgaveStatusId', rightColumn: 'opgaveStatusId', selectColumns: ['opgaveStatusNavn']},
                    {leftTable: 'Opgave', rightTable:'KontraktStatus', leftColumn: 'kontraktStatusId', rightColumn: 'kontraktStatusId', selectColumns: ['kontraktStatusNavn']},

                ]
            },
        ],
        origin:name
    }
}

function getDeadlines(opgaveId){
    return {
        data:[
            {
                table:'Deadline',
                columns: ['deadlineDato', 'deadlineKommentar'],
                where: [{column: 'opgaveId', value: opgaveId}]
            },
        ],
        origin:name + 'deadlines'
    }
}

module.exports = {
    getView:getView,
    getData:getData,
    getDeadlines:getDeadlines,
}