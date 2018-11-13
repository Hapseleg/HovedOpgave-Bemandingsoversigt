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
                    {leftTable: 'Opgaveloser', rightTable:'OpgaveloserKonsulentprofil', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['opgaveloserKonsulentProfilId', 'konsulentProfilId', 'konsulentProfilWeight']},
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

function insertData(table,columns,values, data, useIdFromFirstInsert, callback){
    let toBeInserted = {
        table:table,
        columns: columns,
        values: [],
        useIdFromFirstInsert: useIdFromFirstInsert
    }

    for(let i = 0; i<values.length;i++){
        let da = values[i]
        let arr = []
        for(let i = 0;i<Object.keys(da).length;i++){
            arr.push(da[Object.keys(da)[i]])
        }
        toBeInserted.values.push(arr)
    }
    data.push(toBeInserted)
    callback(data)
}

function saveData(arg,callback){
    if(arg.opgavenNavn == '')
        throw 'opgave navn er tomt'
    else{
        let data = {
            data:[{
                    table:'Opgave',
                    columns: ['opgaveNavn', 'kundeId', 'kundeansvarligId','opgavestillerId','opgaveStatusId','opgavetypeId','lokationId','kontraktStatusId','startDato','slutDato','kommentar','estimeretTimetal','aktiv'],
                    values: [[arg.opgaveNavn, arg.kundeId, arg.kundeansvarligId, arg.opgavestillerId, arg.opgaveStatusId, arg.opgavetypeId, arg.lokationId, arg.kontraktStatusId, arg.startDato, arg.slutDato, arg.kommentar, arg.estimeretTimetal, arg.aktiv]]
                }
            ],
                origin: name,
                idFromFirstInsert: 'Opgave'
        }

        insertData('Deadline',['deadlineDato', 'deadlineKommentar', 'opgaveId'],arg.deadlines, data.data, true, function(){
            insertData('OpgaveloserOpgave',['opgaveloserKonsulentProfilId', 'opgaveId'],arg.opgaveloser, data.data, true, function(){
                callback(data)
            })
        })
    }
}

module.exports = {
    getView:getView,
    saveData:saveData,
    getData:getData
}