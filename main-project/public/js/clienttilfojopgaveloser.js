$(document).ready(function () {
    var weekdays

    function setup() {
        var now = new Date()

        let year = now.getFullYear()
        let month = now.getMonth() + 1
        let date = now.getDate()

        let monthString = month
        let dateString = date
        if(month < 10)
            monthString = '0' + month
        if(date < 10)
            dateString = '0' + date
        

        $('#startDatoSearch').val(year + '-' + monthString + '-' + dateString)
        month++
        if (month > 12) {
            month = 1
            year++
        }

        monthString = month
        dateString = date
        if(month < 10)
            monthString = '0' + month
        if(date < 10)
            dateString = '0' + date
        $('#slutDatoSearch').val(year + '-' + monthString + '-' + dateString)

        getWeeksAjax()
    }
    setup()

    $('select').change(function () {
        sortMuligeOpgavelosere()
    })
    $('input[type="date"]').change(function () {
        let start = new Date($('#startDatoSearch').val())
        let slut = new Date($('#slutDatoSearch').val())

        if (slut >= start)
            getWeeksAjax()
        else
            alert('start skal være før slut')

    })

    $('#searchButton').click(getWeeksAjax)

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
        let mangelende = estimeretTimetal - bemandedeTimer
        $('#manglendeTimer').val(mangelende)
        $('#bemandedeTimer').val(bemandedeTimer)

        setManglendeColor()
    }

    function setManglendeColor() {
        let manglende = parseFloat($('#manglendeTimer').val())

        if (manglende == 0)
            $('#manglendeTimer').css("background-color", "#2ecc71")
        else if (manglende < 0)
            $('#manglendeTimer').css("background-color", "#e74c3c")
        else
            $('#manglendeTimer').css("background-color", "#f1c40f")
    }

    //Tilføj opgaveløser til valgte opgaveløsere
    // $('.muligOpgaveloser').click(function () {

    // })

    //ændre timetallet for en allerede valgt opgaveløser
    $('tr').click(function () {
        if ($(this).hasClass('valgtOpgaveloser')) {
            //console.log($(this))
            let val = prompt("Indtast time antal der skal tilføjes")
            if (val != null && !isNaN(val)) {
                let value = parseFloat(val)
                if (value <= 0) {
                    alert('skal være større end 0')
                    return
                }
                let orgTimeTal = parseInt($(this).children('.timeAntal').attr('orgTimeTal'), 10)
                let orgLedigeTimer = parseInt($(this).children('.ledigeTimer').attr('orgledigetimer'), 10)
                
                if (value > orgLedigeTimer) {
                    if (!confirm('Det indtastede time antal er større end antal ledige timer, vil du fortsætte?'))
                        return
                }

                if (!$(this).hasClass('newOpgaveloser'))
                    $(this).addClass('changedOpgaveloser changed')


                $(this).children('.timeAntal').html((value + orgTimeTal))
                $(this).children('.ledigeTimer').html((orgLedigeTimer - value))



                $(this).children('.timeAntal').attr('addedTimeTal', value)
            }
            setEstimeret()
            colorLedigeTider()
        }
        else if ($(this).hasClass('muligOpgaveloser')) {
            //console.log($(this))
            let val = prompt("Indtast time antal")
            if (val != null && !isNaN(val)) {
                let value = parseFloat(val)
                if (value <= 0) {
                    alert('skal være større end 0')
                    return
                }
                let orgLedigeTimer = parseInt($(this).children('.ledigeTimer').attr('orgledigetimer'), 10)
                if (value > orgLedigeTimer) {
                    if (!confirm('Det indtastede time antal er større end antal ledige timer, vil du fortsætte?'))
                    return
                }
                let ledigeTimer = $(this).children('.ledigeTimer').html() - value
                $(this).removeClass('muligOpgaveloser')
                $(this).addClass('valgtOpgaveloser newOpgaveloser changed')

                $(this).children('.timeAntal').html(value)
                $(this).children('.timeAntal').attr('addedTimeTal', value)

                $(this).children('.ledigeTimer').html(ledigeTimer)
                //$(this).attr('onclick', "changeValgtOpgaveloser")

                $('#valgteOpgavelosere tbody').append($(this))
            }
            setEstimeret()
            colorLedigeTider()
        }
    })

    $('#submitCreate').click(function () {
        //tilføj ændrede eller ny valgte opgaveløsere
        let valgteOpgavelosere = $('.changed')
        createOpgavelosere(0, valgteOpgavelosere)
    })

    function createOpgavelosere(i, valgteOpgavelosere) {
        if (i < valgteOpgavelosere.length) {
            // console.log(valgteOpgavelosere[i])
            let opgaveId = $('#opgaveId').attr('value')
            let opgaveloserId = $(valgteOpgavelosere[i]).children('.opgaveloserId').attr('value')
            let konsulentProfilId = $(valgteOpgavelosere[i]).children('.konsulentProfilId').attr('value')
            let lokationId = $(valgteOpgavelosere[i]).children('.lokationId').attr('value')
            let timeAntal = $(valgteOpgavelosere[i]).children('.timeAntal').attr('addedTimeTal')

            let start = new Date($('#startDatoSearch').val())
            let slut = new Date($('#slutDatoSearch').val())

            let d = {
                type: '',
                opgaveId: opgaveId,
                opgaveloserId: opgaveloserId,
                konsulentProfilId: konsulentProfilId,
                lokationId: lokationId,
                timeAntal: timeAntal,
                startDato: start,
                slutDato: slut,
                weekdays: weekdays.find(o => o.opgaveloserId == opgaveloserId)
            }

            if ($(valgteOpgavelosere[i]).hasClass('newOpgaveloser')) {
                d.type = 'newOpgaveloser'
                d.opgaveloserKonsulentProfilId = $(valgteOpgavelosere[i]).attr('opgaveloserKonsulentProfilId')
            }
            else if ($(valgteOpgavelosere[i]).hasClass('changedOpgaveloser')) {
                d.type = 'changedOpgaveloser'
                d.opgaveloserOpgaveId = $(valgteOpgavelosere[i]).children('.opgaveloserOpgaveId').attr('value')
            }
            // console.log(d)
            addOpgaveloserAjax(d, function () {
                createOpgavelosere(i + 1, valgteOpgavelosere)
            })
        }
        else {
            alert('done')
            window.location.href = '/opgave?opgaveId=' + $('#opgaveId').attr('value')
        }
    }

    function addOpgaveloserAjax(data, callback) {
        console.log(data)
        $.ajax({
            url: '/tilfojopgaveloser',
            data: data,
            type: 'POST',
            success: function (result) {
                console.log(result)
                console.log('create success for' + data.opgaveloserId)
                if (callback)
                    callback()
            }
        })
    }

})