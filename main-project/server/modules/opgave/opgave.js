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

function saveData(arg, publisher){
    console.log(arg,'OPGAVE SAVEDATA--')
    
    //opgave
    if(arg.opgavenNavn != ''){//tilføj de andre ting senere
        var data = {
            data:[{
                    table:'Opgave',
                    columns: ['opgaveNavn', 'kundeId', 'kundeansvarligId','opgavestillerId','opgaveStatusId','opgavetypeId','lokationId','kontraktStatusId','startDato','slutDato','kommentar'],
                    values: [[arg.opgaveNavn, arg.kundeId, arg.kundeansvarligId, arg.opgavestillerId, arg.opgaveStatusId, arg.opgavetypeId, arg.lokationId, arg.kontraktStatusId, arg.startDato, arg.slutDato, arg.kommentar]]
                }
            ],
                origin: name,
                idFromFirstInsert: 'Opgave'
        }

        var toBeInsertedDeadline = {
            table:'Deadline',
            columns:['deadlineDato', 'deadlineKommentar', 'opgaveId'],
            values:[],
            useIdFromFirstInsert: true
        }

        for(let i = 0; i<arg.deadlines.length;i++){
            // console.log(i,'for deadline')
            toBeInsertedDeadline.values.push([arg.deadlines[i].deadlineDato, arg.deadlines[i].deadlineKommentar])
            // console.log(data.data.length,'for deadline')
            if(i == arg.deadlines.length -1)//TODO grimt "callback" hack!
                data.data.push(toBeInsertedDeadline)
        }

        var toBeInsertedOpgaveloserOpgave = {
            table:'OpgaveloserOpgave',
            columns:['opgaveloserKonsulentProfilId', 'opgaveId'],
            values:[],
            useIdFromFirstInsert: true
        }
        for(let i = 0; i<arg.opgaveloser.length;i++){
            console.log(i,'i opgaveloseropgave')
            toBeInsertedOpgaveloserOpgave.values.push([arg.opgaveloser[i].opgaveloserKonsulentProfilId])
            console.log(data.data.length,'data length opgaveloser')
            if(i == arg.opgaveloser.length -1)//TODO grimt "callback" hack!
                data.data.push(toBeInsertedOpgaveloserOpgave)
            console.log(i)
            console.log(data.data.length)
        }
        //data.data.push(toBeInserted)

        //console.log(data)
        //publisher(data)

        while(true){ //TODO grimt "callback" hack!
            // console.log(data.data.length,'while')
            if(data.data.length == 3){
                publisher(data)
                break;
            }
                
                //return data
        }

        //return data   
    }
    else
        throw 'Et af felterne var tomme'
}

module.exports = {
    getView:getView,
    saveData:saveData,
    getData:getData
}