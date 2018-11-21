var name = 'bemandingsoversigt'

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
            {//OpgaveloserOpgave, opgave, Opgaveloser, ugetimeopgave, OpgaveloserKonsulentprofil, Konsulentprofil
                table:'Opgaveloser',
                columns: ['*'],
                // leftJoins:[
                   
                // ],
            },
            // {//OpgaveloserOpgave, opgave, Opgaveloser, ugetimeopgave, OpgaveloserKonsulentprofil, Konsulentprofil
            //     table:'OpgaveloserOpgave',
            //     columns: ['opgaveloserOpgaveId','opgaveId','opgaveloserKonsulentProfilId'],
            //     leftJoins:[
            //         {leftTable: 'OpgaveloserOpgave', rightTable:'Opgave', leftColumn: 'opgaveId', rightColumn: 'opgaveId', selectColumns: ['opgaveNavn', 'startDato', 'slutDato']},
            //         {leftTable: 'OpgaveloserOpgave', rightTable:'OpgaveloserKonsulentprofil', leftColumn: 'opgaveloserKonsulentProfilId', rightColumn: 'opgaveloserKonsulentProfilId', selectColumns: ['opgaveloserId', 'konsulentProfilId']},
            //         {leftTable: 'OpgaveloserKonsulentprofil', rightTable:'Konsulentprofil', leftColumn: 'konsulentProfilId', rightColumn: 'konsulentProfilId', selectColumns: ['konsulentProfilNavn']},
            //         {leftTable: 'OpgaveloserKonsulentprofil', rightTable:'Opgaveloser', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['fornavn', 'efternavn', 'arbejdstidPrUge']},
            //     ],
            //     where: [{ column: 'aktiv', value: 1 }]
            // },
        ],
        origin:name
    }
}

function getTidData(){
    return {
        data:[
            {
                table: 'OpgaveloserArbejdsTider',
                //columns: ['opgaveloserId', 'dag', 'dagStart', 'dagSlut'],
                columns: ['opgaveloserId', 'dag'],
                leftJoins: [
                    { leftTable: 'OpgaveloserArbejdsTider', rightTable: 'Opgaveloser', leftColumn: 'opgaveloserId', rightColumn: 'opgaveloserId', selectColumns: ['arbejdstidPrUge'] }
                ],
            },
            {
                table: 'opgaveloserKonsulentProfil',
                columns: ['opgaveloserKonsulentProfilId','opgaveloserId'],
                leftJoins:[
                    {
                        leftTable: 'opgaveloserKonsulentProfil', 
                        rightTable:'opgaveloserOpgave', 
                        leftColumn: 'opgaveloserKonsulentProfilId', 
                        rightColumn: 'opgaveloserKonsulentProfilId', 
                        selectColumns: [
                            'opgaveloserOpgaveId',
                            'opgaveId'
                        ]
                    },
                    {
                        leftTable: 'opgaveloserOpgave', 
                        rightTable:'ugetimeopgave', 
                        leftColumn: 'opgaveloserOpgaveId', 
                        rightColumn: 'opgaveloserOpgaveId', 
                        selectColumns: [
                            'ugeTimeOpgaveId', 'year','month','week', 'timeAntal'
                        ]
                    },
                ]
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


function createUgeTimeOpgave(arg){
    return {
        data:[{
                table:'UgeTimeOpgave',
                columns: ['opgaveloserOpgaveId', 'year', 'month', 'week','timeAntal'],
                values: [[arg.opgaveloserOpgaveId, arg.year, arg.month, arg.week, arg.timeAntal]]
            }
        ],
            origin: name
    }
}

function updateUgeTimeOpgave(arg){
    return {
        data:[{
                table:'UgeTimeOpgave',
                columns: ['timeAntal'],
                values: [arg.timeAntal],
                where: [{column: 'ugeTimeOpgaveId', value: arg.ugeTimeOpgaveId}]
            }
        ],
            origin: name
    }
}

module.exports = {
    getView:getView,
    saveData:saveData,
    getData:getData,
    getTidData:getTidData,
    createUgeTimeOpgave:createUgeTimeOpgave,
    updateUgeTimeOpgave:updateUgeTimeOpgave
}