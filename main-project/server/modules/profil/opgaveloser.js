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

function saveData(arg){
//INSERT INTO opgaveloserarbejdstider (dag,dagStart,dagSlut,opgaveloserId) VALUES (1,'08:00', '15:00',1)

    /*
      { fornavn: 'Nicolaj',
  efternavn: 'Jørgensen',
  lokation: '1',
  dagStart: '',
  dagSlut: '',
  arbejdstidPrUge: '' }
     */
    // console.log(arg)
    if(arg.fornavn != '' || arg.efternavn != '' || arg.lokation != '' || arg.arbejdstidPrUge != ''){//tilføj de andre ting senere
        return {
            data:[{
                    table:'Opgaveloser',
                    columns: ['fornavn','efternavn','arbejdstidPrUge','lokationId'],
                    values: [arg.fornavn,arg.efternavn, arg.arbejdstidPrUge, arg.lokation]
                }],
                origin: name
        }   
    }
    else
        throw 'Et af felterne var tomme'
}

module.exports = {
    getView:getView,
    saveData:saveData
}