$(document).ready(function() {
    $("tr").click(function(){
        let clicked = $(this)
        let hiddenInputs = clicked.children('input')

        if(clicked.hasClass('muligOpgaveloser')){
            clicked.removeClass('muligOpgaveloser')
            clicked.addClass('valgtOpgaveloser')

            let rowId = $(hiddenInputs[0]).attr('id')
            for(let i = 0; i<hiddenInputs.length;i++){
                let idName = $(hiddenInputs[i]).attr('idName')
                $(hiddenInputs[i]).attr('name', 'opgaveloser['+rowId+']['+idName+']')
            }

            //clicked.attr('name', 'opgaveloser[{{@index}}][opgaveloserId]')
            
            $('#valgteOpgavelosere tr:last').after(clicked)
        }
        else if(clicked.hasClass('valgtOpgaveloser')){
            clicked.removeClass('valgtOpgaveloser')
            clicked.addClass('muligOpgaveloser')

            for(let i = 0; i<hiddenInputs.length;i++){
                $(hiddenInputs[i]).attr('')
            }

            $('#muligeOpgavelosere tr:last').after(clicked)
        }
    })

    var deadlineCount = 0;
    $('#addDeadline').click(function(){
        let deadlineDato = $('#deadlineDato').val()
        let deadlineKommentar = $('#deadlineKommentar').val()
        $('#deadlines tr:last').after(
            '<tr onclick="removeDeadline(this)" id="deadlineRow">'+
                '<input type="hidden" name="deadlines['+deadlineCount+'][deadlineDato]" value="'+deadlineDato+'">'+
                '<input type="hidden" name="deadlines['+deadlineCount+'][deadlineKommentar]" value="'+deadlineKommentar+'">'+
                '<td>'+deadlineDato+'</td>' +
                '<td>'+deadlineKommentar+'</td>' +
            '</tr>');
        deadlineCount++;
    })

    
})

function removeDeadline(e){
    $(e).remove()
}