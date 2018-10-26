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

function saveData(arg){
    //opgave
    if(arg.opgavenNavn != ''){//tilføj de andre ting senere
        return {
            data:[{
                    table:'Opgave',
                    columns: ['opgaveNavn', 'kundeId', 'kundeAnsvarligId','opgavestillerId','opgaveStatusId','opgavetypeId','lokationId','kontraktStatusId','startDato','slutDato','kommentar'],
                    values: [arg.opgaveNavn,arg.kundeId, arg.kundeAnsvarligId, arg.opgavestillerId, arg.opgaveStatusId, arg.opgavetypeId, arg.lokationId, arg.kontraktStatusId, arg.startDato, arg.slutDato, arg.kommentar]
                }],
                origin: name
        }   
    }
    else
        throw 'Et af felterne var tomme'

    //deadline

    //opgaveloserOpgave



}

module.exports = {
    getView:getView,
    saveData:saveData
}