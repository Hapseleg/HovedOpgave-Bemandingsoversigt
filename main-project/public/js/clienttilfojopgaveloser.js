$(document).ready(function () {
    var weekdays

    $('#searchButton').click(search)

    function search() {
        getWeeksAjax()
    }

    function getWeeksAjax() {
        let start = new Date($('#startDatoSearch').val())
        let slut = new Date($('#slutDatoSearch').val())

        $.ajax({
            url: '/tilfojopgaveloserTid',
            data: { startDate: [start.getFullYear(), (start.getMonth() + 1), start.getDate()], slutDate: [slut.getFullYear(), (slut.getMonth() + 1), slut.getDate()] },
            type: 'GET',
            success: function (result) {
                weekdays = result
                console.log(result)
                addLedigeTimer(result)
                sortMuligeOpgavelosere()

            }
        });
    }

    function addLedigeTimer(result) {
        $('tbody').children().each(function () {
            //console.log($(this))

            let opgaveloserId = $(this).children('.opgaveloserId').attr('value')
            let ledigeTimer = result.find(o => o.opgaveloserId == opgaveloserId).availableWorkTime

            let td = $(this).children('.ledigeTimer')[0]
            $(td).html(ledigeTimer)
        })
    }

    function sortByType(type, value, red, green) {
        if (value != 'null') {
            $('.muligOpgaveloser').each(function () {
                let td = $(this).children(type)[0]
                if ($(td).attr('value') != value) {
                    $(td).addClass(red)
                }
                else {
                    $(td).addClass(green)
                }
            })
        }
    }

    function showOrHideRowsByColor() {
        if ($('#showRedFields')[0].checked) {//show all
            $('.muligOpgaveloser td').each(function () {
                $(this).show()
            })
        }
        else {
            //hvis den møder en rød, sæt til hide og gå til næsten
            $('.muligOpgaveloser').each(function () {
                let show = true
                $(this).children('td').each(function () {
                    if ($(this).hasClass('red')) {
                        show = false
                    }
                })
                if (show)
                    $(this).show()
                else
                    $(this).hide()
            })
        }
    }

    function resetTable() {
        $('.muligOpgaveloser td').each(function () {
            $(this).removeClass('red')
            $(this).removeClass('green')

            $(this).removeClass('redLedigeTimer')
            $(this).removeClass('greenLedigeTimer')
        })
    }

    function sortMuligeOpgavelosere() {
        resetTable()
        let lokationId = $('#lokationId option:selected').val()
        let konsulentProfilId = $('#konsulentProfil option:selected').val()

        sortByType('.lokationId', lokationId, 'red', 'green')
        sortByType('.konsulentProfilId', konsulentProfilId, 'red', 'green')

        showOrHideRowsByColor()

        $('.ledigeTimer').each(function () {
            let td = $(this)[0]
            if ($(td).html() == 0) {
                $(td).addClass('redLedigeTimer')
            }
            else {
                $(td).addClass('greenLedigeTimer')
            }
        })
    }

    $('#showRedFields').change(function () {
        if ($('#showRedFields')[0].checked)
            $('.muligOpgaveloser').each(function () {
                $(this).show()
            })
        else {
            showOrHideRowsByColor()
        }
    })


    //Tilføj opgaveløser til valgte opgaveløsere
    $('.muligOpgaveloser').click(function (e) {
        //console.log($(this))
        let val = prompt("Indtast time antal")
        if (val != null && !isNaN(val)) {
            $(this).removeClass('muligOpgaveloser')
            $(this).addClass('valgtOpgaveloser newOpgaveloser')

            //$(this).append($('<td>', {class: 'Timeantal', value: val, text:val}))
            $(this).children('.timeAntal').html(val)
            let ledigeTimer = $(this).children('.ledigeTimer').html() - val
            $(this).children('.ledigeTimer').html(ledigeTimer)

            $('#valgteOpgavelosere tbody').append($(this))
        }

    })

    $('#submitCreate').click(function () {
        //tilføj ændrede eller ny valgte opgaveløsere
        //let valgteOpgavelosere = $('.valgtOpgaveloser')



        $('.valgtOpgaveloser').each(function () {
            let opgaveloserId = $(this).children('.opgaveloserId').attr('value')
            let konsulentProfilId = $(this).children('.konsulentProfilId').attr('value')
            let lokationId = $(this).children('.lokationId').attr('value')
            let timeAntal = $(this).children('.timeAntal').html()

            let start = new Date($('#startDatoSearch').val())
            let slut = new Date($('#slutDatoSearch').val())

            let data = {
                opgaveloserId: opgaveloserId,
                konsulentProfilId: konsulentProfilId,
                lokationId: lokationId,
                timeAntal: timeAntal,
                startDato: start,
                slutDato: slut,
                weekdays: weekdays.find(o=>o.opgaveloserId == opgaveloserId)
            }

            if ($(this).hasClass('newOpgaveloser')) {
                console.log('newOpgaveloser ajax')
                $.ajax({
                    url: '/tilfojopgaveloser',
                    data: data,
                    type: 'POST',
                    success: function (result) {
                        console.log('create success for' + opgaveloserId)
                    }
                })
            }
            else if ($(this).hasClass('changedOpgaveloser')) {
                console.log('changedOpgaveloser ajax')
            }
        })

        // $.ajax({
        //     url: '/bemandingsOversigtTid',
        //     data: d,
        //     type: 'PUT',
        //     success: function (result) {
        //         $(e).attr('ugeTimeOpgaveId', result.insertId)
        //         $(e).text(val)
        //         $(e).attr('timeAntalForOpgave', val)
        //         let availableWorkTime = $(e).attr('maxAvailableWorkTime') - val
        //         $(e).attr('availableWorkTime', availableWorkTime)

        //         changeWorkLoad($(e))
        //         calcWeekAvailableworktime()
        //         setWorkHoursUsed()
        //     }
        // })
    })

})