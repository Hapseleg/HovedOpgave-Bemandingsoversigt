$(document).ready(function() {
    $('#submitknap').click(saveOpgaveloser)

    function saveOpgaveloser(){
        let cbs = $('#arbejdsdage input:checkbox')
        for(let i = 0; i< cbs.length; i++){
            let dagHidden = $(cbs[i]).parent().children('#dagHidden')
            let dagStartHidden = $(cbs[i]).parent().children('#dagStartHidden')
            let dagSlutHidden = $(cbs[i]).parent().children('#dagSlutHidden')

            if(cbs[i].checked){
                let dagVal = $(cbs[i]).val()
                let dagStart = $(cbs[i]).parent().children('#dagStart').val()
                let dagSlut = $(cbs[i]).parent().children('#dagSlut').val()

                $(dagHidden).attr({name:'dage['+i+'][dag]', value:dagVal})
                $(dagStartHidden).attr({name:'dage['+i+'][dagStart]', value:dagStart})
                $(dagSlutHidden).attr({name:'dage['+i+'][dagSlut]', value:dagSlut})
            }
            else{
                $(dagHidden).removeAttr('name')
                $(dagHidden).removeAttr('value')

                $(dagStartHidden).removeAttr('name')
                $(dagStartHidden).removeAttr('value')

                $(dagSlutHidden).removeAttr('name')
                $(dagSlutHidden).removeAttr('value')
            }
        }

        $('#opgaveloserform').submit()
    }

    var konsulentProfilCount = 0;
    $('#addKonsulentProfil').click(function(){
        let konsulentProfilNavn = $('#konsulentProfil option:selected').text()
        let konsulentProfilId = $('#konsulentProfil').val()
        let konsulentProfilWeight = $('#konsulentProfilWeight').val()
        $('#konsulentProfiler tr:last').after(
            '<tr onclick="markForRemoval(this)" id="deadlineRow">'+
                '<input type="hidden" name="konsulentProfiler['+konsulentProfilCount+'][konsulentProfilId]" value="'+konsulentProfilId+'">'+
                '<input type="hidden" name="konsulentProfiler['+konsulentProfilCount+'][konsulentProfilWeight]" value="'+konsulentProfilWeight+'">'+
                '<td>'+konsulentProfilNavn+'</td>' +
                '<td>'+konsulentProfilWeight+'</td>' +
            '</tr>');
        konsulentProfilCount++;
    })

})

function markForRemoval(e){
    if($(e).hasClass('selectedForRemoval'))
        $(e).removeClass('selectedForRemoval')
    else
        $(e).addClass('selectedForRemoval')
}

function removeKonsulentProfiler(){
    //$(e).remove()
    $('.selectedForRemoval').remove()
}