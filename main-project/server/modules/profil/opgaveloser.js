var name = 'opgaveloser'

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
                table:'Lokation',
                columns:['*']
            },
            {
                table:'KonsulentProfil',
                columns:['*']
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

function saveData(arg, callback){
//INSERT INTO opgaveloserarbejdstider (dag,dagStart,dagSlut,opgaveloserId) VALUES (1,'08:00', '15:00',1)

    /*
  { fornavn: 'Nicolaj',
    efternavn: 'Jørgensen',
    lokationId: '1',
    dage: [ { dag: '1', dagStart: '08:00', dagSlut: '15:00' } ],
    arbejdstidPrUge: '40',
    konsulentProfilId: '1',
    konsulentProfilWeight: '1',
    konsulentProfiler: [ { konsulentProfilId: '1', konsulentProfilWeight: '1' } ] }
*/
    if(arg.fornavn != '' || arg.efternavn != '' || arg.lokation != '' || arg.arbejdstidPrUge != ''){//tilføj de andre ting senere
        let data = {
            data:[
                {
                    table:'Opgaveloser',
                    columns: ['fornavn','efternavn','arbejdstidPrUge','lokationId'],
                    values: [[arg.fornavn,arg.efternavn, arg.arbejdstidPrUge, arg.lokationId]]
                },
            ],
                origin: name,
                idFromFirstInsert: 'Opgaveloser'
        }
        
        insertData('OpgaveloserArbejdsTider',['dag','dagStart','dagSlut','opgaveloserId'],arg.dage, data.data, true, function(){
            insertData('OpgaveloserKonsulentprofil',['konsulentProfilId','konsulentProfilWeight', 'opgaveloserId'],arg.konsulentProfiler, data.data, true, function(){
                callback(data)
            })
        })

        // let opgaveloserArbejdsTider = {
        //     table:'OpgaveloserArbejdsTider',
        //     columns: ['dag','dagStart','dagSlut','opgaveloserId'],
        //     values: []
        // }

        // for(let i = 0; i<arg.dage.length;i++){
        //     let da = arg.dage[i]
        //     opgaveloserArbejdsTider.values.push([da.dag, da.dagStart, da.dagSlut])
        //     // console.log(data.data.length,'for deadline')
        //     // if(i == arg.deadlines.length -1)//TODO grimt "callback" hack!
        //     //     data.data.push(toBeInsertedDeadline)
        // }
        // data.data.push(opgaveloserArbejdsTider)

        // let OpgaveloserKonsulentprofiler = {
        //     table:'OpgaveloserKonsulentprofil',
        //     columns: ['konsulentProfilId','konsulentProfilWeight', 'opgaveloserId'],
        //     values: []
        // }

        // for(let i = 0; i<arg.konsulentProfiler.length;i++){
        //     let da = arg.konsulentProfiler[i]
        //     OpgaveloserKonsulentprofiler.values.push([da.konsulentProfilId, da.konsulentProfilWeight])
        // }
        // data.data.push(OpgaveloserKonsulentprofiler)
        
        // callback(data)
    }
    else
        throw 'Et af felterne var tomme'
}

module.exports = {
    getView:getView,
    saveData:saveData,
    getData:getData
}