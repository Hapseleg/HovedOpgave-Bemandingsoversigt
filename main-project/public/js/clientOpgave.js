$(document).ready(function () {
    $('#submitknap').click(function () {
        // console.log($('form').serializeArray())
        $('#opgaveform').submit()
    })

    $('input:checkbox').change(function () {
        let id = $(this).attr('id')
        if ($(this)[0].checked == true)
            $('input:hidden[name=' + id + ']').val(1)
        else
            $('input:hidden[name=' + id + ']').val(0)
    })

    $("tr").click(function () {
        let clicked = $(this)
        let hiddenInputs = clicked.children('input')

        if (clicked.hasClass('muligOpgaveloser')) {
            clicked.removeClass('muligOpgaveloser')
            clicked.addClass('valgtOpgaveloser')

            let rowId = $(hiddenInputs[0]).attr('id')
            for (let i = 0; i < hiddenInputs.length; i++) {
                let idName = $(hiddenInputs[i]).attr('idName')
                $(hiddenInputs[i]).attr('name', 'opgaveloser[' + rowId + '][' + idName + ']')
            }

            //clicked.attr('name', 'opgaveloser[{{@index}}][opgaveloserId]')

            $('#valgteOpgavelosere tr:last').after(clicked)
        }
        else if (clicked.hasClass('valgtOpgaveloser')) {
            clicked.removeClass('valgtOpgaveloser')
            clicked.addClass('muligOpgaveloser')

            for (let i = 0; i < hiddenInputs.length; i++) {
                $(hiddenInputs[i]).attr('')
            }

            $('#muligeOpgavelosere tr:last').after(clicked)
        }
    })

    var deadlineCount = 0;
    $('#addDeadline').click(function () {
        let deadlineDato = $('#deadlineDato').val()
        let deadlineKommentar = $('#deadlineKommentar').val()
        $('#deadlines tr:last').after(
            '<tr onclick="markForRemoval(this)" id="deadlineRow">' +
            '<input type="hidden" name="deadlines[' + deadlineCount + '][deadlineDato]" value="' + deadlineDato + '">' +
            '<input type="hidden" name="deadlines[' + deadlineCount + '][deadlineKommentar]" value="' + deadlineKommentar + '">' +
            '<td>' + deadlineDato + '</td>' +
            '<td>' + deadlineKommentar + '</td>' +
            '</tr>');
        deadlineCount++;
    })
})

function markForRemoval(e) {
    if ($(e).hasClass('selectedForRemoval'))
        $(e).removeClass('selectedForRemoval')
    else
        $(e).addClass('selectedForRemoval')
}

function removeDeadlines() {
    //$(e).remove()
    $('.selectedForRemoval').remove()
}