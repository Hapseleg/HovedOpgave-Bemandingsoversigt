$(document).ready(function() {
    $("tr").click(function(){
        let clicked = $(this)
        if(clicked.hasClass('muligOpgaveloser')){
            clicked.removeClass('muligOpgaveloser')
            clicked.addClass('valgtOpgaveloser')
            
            $('#valgteOpgavelosere tr:last').after(clicked)
        }
        else if(clicked.hasClass('valgtOpgaveloser')){
            clicked.removeClass('valgtOpgaveloser')
            clicked.addClass('muligOpgaveloser')
            $('#muligeOpgavelosere tr:last').after(clicked)
        }
    })

    $('#addDeadline').click(function(){
        let deadlineDato = $('#deadlineDato').val()
        let deadlineKommentar = $('#deadlineKommentar').val()
        $('#deadlines tr:last').after('<tr onclick="removeDeadline(this)" id="deadlineRow"><td>'+deadlineDato+'</td> <td>'+deadlineKommentar+'</td></tr>');
    })

    
})

function removeDeadline(e){
    $(e).remove()
}