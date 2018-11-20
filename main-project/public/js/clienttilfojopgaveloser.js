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
        $('.opgaveloserTbody').children().each(function () {

            let opgaveloserId = $(this).children('.opgaveloserId').attr('value')
            let ledigeTimer = result.find(o => o.opgaveloserId == opgaveloserId).availableWorkTime

            let td = $(this).children('.ledigeTimer')[0]
            $(td).html(ledigeTimer)
            $(td).attr('orgledigeTimer', ledigeTimer)
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

    function colorLedigeTider() {
        $('.ledigeTimer').each(function () {
            let td = $(this)[0]
            $(td).removeClass('redLedigeTimer')
            $(td).removeClass('greenLedigeTimer')
            if (parseFloat($(td).html()) <= 0) {
                $(td).addClass('redLedigeTimer')
            }
            else {
                $(td).addClass('greenLedigeTimer')
            }
        })
    }

    function sortMuligeOpgavelosere() {
        resetTable()
        let lokationId = $('#lokationId option:selected').val()
        let konsulentProfilId = $('#konsulentProfil option:selected').val()

        sortByType('.lokationId', lokationId, 'red', 'green')
        sortByType('.konsulentProfilId', konsulentProfilId, 'red', 'green')

        showOrHideRowsByColor()
        colorLedigeTider()

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


    function setEstimeret() {
        let estimeretTimetal = parseFloat($('#estimeretTimetal').val())
        let bemandedeTimer = 0

        $('.valgtOpgaveloser').children('.timeAntal').each(function () {
            bemandedeTimer += parseFloat($(this).html())
        })

        $('#manglendeTimer').val(estimeretTimetal - bemandedeTimer)
        $('#bemandedeTimer').val(bemandedeTimer)
    }

    //Tilføj opgaveløser til valgte opgaveløsere
    // $('.muligOpgaveloser').click(function () {

    // })

    //ændre timetallet for en allerede valgt opgaveløser
    $('tr').click(function () {
        if ($(this).hasClass('valgtOpgaveloser')) {
            console.log($(this))
            let val = prompt("Indtast time antal")
            if (val != null && !isNaN(val)) {
                if (!$(this).hasClass('newOpgaveloser'))
                    $(this).addClass('changedOpgaveloser')

                $(this).children('.timeAntal').html(val)
                let orgTimeTal = $(this).children('.timeAntal').attr('orgTimeTal')
                let ledigeTimer = parseInt($(this).children('.ledigeTimer').attr('orgledigeTimer'), 10) - val + parseInt(orgTimeTal, 10)
                console.log(orgTimeTal)
                console.log(ledigeTimer)
                $(this).children('.ledigeTimer').html(ledigeTimer)
            }
            setEstimeret()
            colorLedigeTider()
        }
        else if ($(this).hasClass('muligOpgaveloser')) {
            //console.log($(this))
            let val = prompt("Indtast time antal")
            if (val != null && !isNaN(val)) {
                $(this).removeClass('muligOpgaveloser')
                $(this).addClass('valgtOpgaveloser newOpgaveloser')

                $(this).children('.timeAntal').html(val)
                let ledigeTimer = $(this).children('.ledigeTimer').html() - val
                $(this).children('.ledigeTimer').html(ledigeTimer)
                //$(this).attr('onclick', "changeValgtOpgaveloser")

                $('#valgteOpgavelosere tbody').append($(this))
            }
            setEstimeret()
            colorLedigeTider()
        }
    })

    // $('.valgtOpgaveloser').click(changeValgtOpgaveloser)

    // function changeValgtOpgaveloser() {
    //     console.log($(this))
    //     let val = prompt("Indtast time antal")
    //     if (val != null && !isNaN(val)) {
    //         if (!$(this).hasClass('newOpgaveloser'))
    //             $(this).addClass('changedOpgaveloser')

    //         $(this).children('.timeAntal').html(val)
    //         let orgTimeTal = $(this).children('.timeAntal').attr('orgTimeTal')
    //         let ledigeTimer = parseInt($(this).children('.ledigeTimer').attr('orgledigeTimer'), 10) - val + parseInt(orgTimeTal, 10)
    //         console.log(orgTimeTal)
    //         console.log(ledigeTimer)
    //         $(this).children('.ledigeTimer').html(ledigeTimer)
    //     }
    //     setEstimeret()
    //     colorLedigeTider()
    // }

    $('#submitCreate').click(function () {
        //tilføj ændrede eller ny valgte opgaveløsere
        //let valgteOpgavelosere = $('.valgtOpgaveloser')
        let opgaveId = $('#opgaveId').attr('value')
        let newOpgavelosere = []
        let changedOpgavelosere = []

        $('.valgtOpgaveloser').each(function () {

            let opgaveloserId = $(this).children('.opgaveloserId').attr('value')
            let konsulentProfilId = $(this).children('.konsulentProfilId').attr('value')
            let lokationId = $(this).children('.lokationId').attr('value')
            let timeAntal = $(this).children('.timeAntal').html()

            let start = new Date($('#startDatoSearch').val())
            let slut = new Date($('#slutDatoSearch').val())

            let d = {
                opgaveId: opgaveId,
                opgaveloserId: opgaveloserId,
                konsulentProfilId: konsulentProfilId,
                lokationId: lokationId,
                timeAntal: timeAntal,
                startDato: start,
                slutDato: slut,
                weekdays: weekdays.find(o => o.opgaveloserId == opgaveloserId)
            }

            if ($(this).hasClass('newOpgaveloser')) {
                d.opgaveloserKonsulentProfilId = $(this).attr('opgaveloserKonsulentProfilId')
                newOpgavelosere.push(d)
            }
            else if ($(this).hasClass('changedOpgaveloser')) {
                d.opgaveloserOpgaveId = $(this).children('.opgaveloserOpgaveId').attr('value')
                console.log($(this).children('.opgaveloserOpgaveId').attr('value'))
                changedOpgavelosere.push(d)
            }
        })

        console.log('newOpgaveloser ajax')
        $.ajax({
            url: '/tilfojopgaveloser',
            data: { newOpgavelosere: newOpgavelosere, changedOpgavelosere: changedOpgavelosere },
            type: 'POST',
            success: function (result) {
                console.log('create success for' + opgaveloserId)
            }
        })

    })

})

