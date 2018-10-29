var name = 'opgave'

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
                table:'Opgaveloser',
                columns: ['opgaveloserId','fornavn','lokationId','arbejdstidPrUge'],
                leftJoins:[
                    {leftTable: 'Opgaveloser', rightTable:'Lokation', leftColumn: 'lokationId', rightColumn: 'lokationId', selectColumns: ['lokationNavn']},
                    {leftTable: 'Opgaveloser', rightTable:'OpgaveloserKonsulentprofil', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['konsulentProfilId']},
                    {leftTable: 'OpgaveloserKonsulentprofil', rightTable:'Konsulentprofil', leftColumn: 'konsulentProfilId', rightColumn: 'konsulentProfilId', selectColumns: ['konsulentProfilNavn']}
                ]
            },
            {
                table:'Opgavetype',
                columns:['*']
            },
            {
                table:'OpgaveStatus',
                columns:['*']
            },
            {
                table:'KontraktStatus',
                columns:['*']
            },
            {
                table:'Lokation',
                columns:['*']
            },
            {
                table:'Opgavestiller',
                columns:['opgavestillerId','fornavn, efternavn']
            },
            {
                table:'Kundeansvarlig',
                columns:['kundeansvarligId','fornavn, efternavn']
            },
            {
                table:'Kunde',
                columns:['kundeId','fornavn, efternavn']
            },
        ],
        origin:name
    }
}

function saveData(arg){
    console.log(arg)
    //opgave
    if(arg.opgavenNavn != ''){//tilføj de andre ting senere
        return {
            data:[{
                    table:'Opgave',
                    columns: ['opgaveNavn', 'kundeId', 'kundeAnsvarligId','opgavestillerId','opgaveStatusId','opgavetypeId','lokationId','kontraktStatusId','startDato','slutDato','kommentar'],
                    values: [arg.opgaveNavn,arg.kundeId, arg.kundeAnsvarligId, arg.opgavestillerId, arg.opgaveStatusId, arg.opgavetypeId, arg.lokationId, arg.kontraktStatusId, arg.startDato, arg.slutDato, arg.kommentar]
                }
                // ,{
                //     table:'OpgaveloserOpgave',
                //     columns:[],
                //     values:[],

                // },{
                //     table:'Deadline',
                //     columns:[],
                //     values:[]
                // }
            ],
                origin: name,
                useIdFromFirstInsert: 'opgaveId'
        }   
    }
    else
        throw 'Et af felterne var tomme'

    //deadline

    //opgaveloserOpgave



}

module.exports = {
    getView:getView,
    saveData:saveData,
    getData:getData
}