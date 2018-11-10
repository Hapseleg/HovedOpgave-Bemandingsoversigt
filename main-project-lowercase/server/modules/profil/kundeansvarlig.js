var name = 'kundeansvarlig'

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
            }
        ],
        origin:name
    }
}

// function insertData(table, columns, values, data, useIdFromFirstInsert, callback){
//     let toBeInserted = {
//         table:table,
//         columns: columns,
//         values: [],
//         useIdFromFirstInsert: useIdFromFirstInsert
//     }

//     for(let i = 0; i<values.length;i++){
//         let da = values[i]
//         let arr = []
//         for(let i = 0;i<Object.keys(da).length;i++){
//             arr.push(da[Object.keys(da)[i]])
//         }
//         toBeInserted.values.push(arr)
//     }
//     data.push(toBeInserted)
//     callback(data)
// }

function saveData(arg, callback){
    if(arg.fornavn == '' || arg.efternavn == '' || arg.lokation == '')
        throw 'Et af felterne var tomme'
    else{
        let data = {
            data:[
                {
                    table:'Kundeansvarlig',
                    columns: ['fornavn','efternavn','lokationId'],
                    values: [[arg.fornavn, arg.efternavn, arg.lokationId]]
                },
            ],
                origin: name
        }
        callback(data)
    }
}

module.exports = {
    getView:getView,
    saveData:saveData,
    getData:getData
}