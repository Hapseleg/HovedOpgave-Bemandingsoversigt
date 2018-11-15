$(document).ready(function () {
    $('.seDeadlines').click(function () {
        let opgaveId = $(this).parent().children('[idName=opgaveId]').val()

        $.ajax({
            url: '/opgaveoversigt/deadlines',
            data: { 'opgaveId': opgaveId },
            type: 'GET',
            success: function (result) {
                let deadlines = ''
                $(result).each(function (index) {
                    deadlines += result[index].deadlineKommentar + ' - ' + convertDate(result[index].deadlineDato) + '\n'
                })
                alert(deadlines)
            }
        });
    })

    $('.opgaveTd').click(function () {
        window.location.href = '/opgave?opgaveId=' + $(this).attr('value')
    })

    $('.date').each(function () {
        $(this).text(convertDate($(this).text()))
    })

    //sæt 
    $('.opgaveRow').each(function () {
        let estimeret = $(this).children('.estimeretTimetal')

        let manglendeTimer = parseFloat($(estimeret).attr('estimeret')) - parseFloat($(estimeret).attr('usedHours'))

         /*farv estimeret 08:35
        rød- flere timer i kalenderen end estimeret
        gul- mangler timer
        grøn- 0 timer tilbage af estimeret*/
        if (manglendeTimer > 0)
            $(estimeret).addClass('lowWorkload')
        else if (manglendeTimer == 0)
            $(estimeret).addClass('mediumWorkload')
        else
            $(estimeret).addClass('highWorkload')



        $(estimeret).text(manglendeTimer)
    })

})

function convertDate(dateString) {
    let date = new Date(dateString)
    let month = parseInt(date.getMonth(), 10) + 1
    return date.getDate() + '-' + month + '-' + date.getFullYear()
}