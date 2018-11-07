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
    }
    else
        throw 'Et af felterne var tomme'
}

module.exports = {
    getView:getView,
    saveData:saveData,
    getData:getData
}