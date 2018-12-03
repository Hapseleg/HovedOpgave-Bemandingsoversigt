$(document).ready(function () {
    $('#submitCreate').click(function () {
        $('#opgaveform').submit()
    })

    $('#redigerOpgavelosere').click(function () {
        var opgaveId = $('#opgaverealId').val()
        window.location = '/tilfojopgaveloser?opgaveId=' + opgaveId
    })

    $('input:checkbox').change(function () {
        let id = $(this).attr('id')
        if ($(this)[0].checked == true)
            $('input:hidden[name=' + id + ']').val(1)
        else
            $('input:hidden[name=' + id + ']').val(0)
    })

    var deadlineCount = 0;
    $('#addDeadline').click(function () {
        let deadlineDato = $('#deadlineDato').val()
        let deadlineKommentar = $('#deadlineKommentar').val()
        $('#deadlines tr:last').after(
            '<tr class="newDeadline" deadlineNumber="' + deadlineCount + '" onclick="markForRemoval(this)" id="deadlineRow">' +
            '<input type="hidden" name="deadlines[' + deadlineCount + '][deadlineDato]" value="' + deadlineDato + '">' +
            '<input type="hidden" name="deadlines[' + deadlineCount + '][deadlineKommentar]" value="' + deadlineKommentar + '">' +
            '<td class="deadlineDato">' + deadlineDato + '</td>' +
            '<td class="deadlineKommentar">' + deadlineKommentar + '</td>' +
            '</tr>');
        deadlineCount++;
    })

    $('#submitUpdate').click(function () {
        let d = $('form').serializeArray()

        let deadlinesToRemove = $('.deleteDeadline')
        if (deadlinesToRemove.length > 0) {
            let deadlinesIds = []
            $(deadlinesToRemove).each(function () {
                deadlinesIds.push($(this).attr('value'))
            })
            console.log(deadlinesIds)
            
            $.ajax({
                url: '/opgaveDeleteDeadlines',
                data: { 'deadlinesToRemove': deadlinesIds },
                type: 'DELETE',
                success: function (result) {

                }
            })
        }

        $.ajax({
            url: '/opgave',
            data: d,
            type: 'PUT',
            success: function (result) {
                window.location = '/opgaveoversigt'
            }
        })
    })

    $('#submitDelete').click(function () {
        let d = $('form').serializeArray()
        $.ajax({
            url: '/opgave',
            data: d,
            type: 'DELETE',
            success: function (result) {
                window.location = '/opgaveoversigt'
            }
        })
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
    $('.selectedForRemoval').addClass('deleteDeadline')
    $('.selectedForRemoval').hide()
}

var rendered = false
function renderTilfOpgaveloser(){
    $.ajax({
        url: '/tilfojopgaveloser/modal',
        data: {'opgaveId': '1'},
        type: 'GET',
        success: function (result) {
            //console.log(result)
            if(!rendered){
                rendered=true
                $('.modal-body').append(result)

            }
        }
    })
}