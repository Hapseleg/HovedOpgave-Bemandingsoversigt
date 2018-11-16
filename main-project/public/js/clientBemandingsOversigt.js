$(document).ready(function () {
	var now = new Date()
	$('#month').val(now.getMonth() + 1)
	$('#year').val(now.getFullYear())
	populateWeeks()

	$('.opgaveTd').click(function () {
		window.location.href = '/opgave?opgaveId=' + $(this).attr('value')
	})

	$('[data-toggle="tooltip"]').tooltip();

	$('#month').change(populateWeeks)

	$('#year').change(populateWeeks)

	// $('#getTimeData').click(populateWeeks)

	$('#toggleWeeks').click(function () {
		let t = $(this)
		if ($(t).hasClass('toggledUsed')) {
			$(t).text('Se timer brugt')
			$(t).removeClass('toggledUsed')
			$(t).addClass('toggledAvail')

			//maxAvailableWorkTime
			$('.availableWorkTime').each(function (index) {
				let text = $(this).attr('availableWorkTime')
				$(this).text(text)
			})
		}
		else {
			$(t).text('Se timer til rådighed for uge')
			$(t).removeClass('toggledAvail')
			$(t).addClass('toggledUsed')

			//timeAntalForOpgave
			$('.availableWorkTime').each(function (index) {
				let text = $(this).attr('timeAntalForOpgave')
				$(this).text(text)
			})
		}
	})

	//https://stackoverflow.com/a/19947532/5098223
	$('#secondHead th').click(function () {
		var table = $(this).parents('table').children('tbody')
		var rows = table.find('tr').toArray().sort(comparer($(this).index()))
		this.asc = !this.asc
		if (!this.asc) { rows = rows.reverse() }
		for (var i = 0; i < rows.length; i++) { table.append(rows[i]) }
	})

	function comparer(index) {
		return function (a, b) {
			var valA = getCellValue(a, index), valB = getCellValue(b, index)
			return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
		}
	}
	function getCellValue(row, index) { return $(row).children('td').eq(index).text() }

	function getWeeksAjax(year, month, callback) {
		$.ajax({
			url: '/bemandingsOversigtTid',
			data: { year: year, month: month },
			type: 'GET',
			success: function (result) {
				console.log(result)
				insertWeeks(result, month, '#thMonth1')
				insertAvailableWorkTime(result, month, year)
				if (callback)
					callback()
			}
		});
	}

	function populateWeeks() {
		let month = $('#month').val()
		let year = $('#year').val()

		$('#toggleWeeks').removeClass('toggledAvail')
		$('#toggleWeeks').addClass('toggledUsed')

		clearWeeks()

		getWeeksAjax(year, month, function () {
			if (month == 12) {
				year++
				month = 1
			}
			else
				month++
			getWeeksAjax(year, month, function () {
				if (month == 12) {
					year++
					month = 1
				}
				else
					month++
				getWeeksAjax(year, month)
			})
		})
	}

	function clearWeeks() {
		$('#firstHead').children().remove()
		$('.weekNumber').remove()
		$('.availableWorkTime').remove()
		$('#firstHead').append('<th colspan="3"></th>')
	}

	function insertWeeks(result, month, th) {
		let months = $('#month').children()

		$('#firstHead').append('<th colspan="' + result.length + '" id="' + th + '">' + $(months[month - 1]).text() + '</th>')

		let thead = $('#secondHead')
		for (let i = 0; i < result.length; i++) {
			let th = $('<th>', { 'class': 'weekNumber', 'text': result[i].week })
			if (i == 0)
				$(th).addClass('firstInMonth')
			thead.append(th)

			//thead.append('<th class="weekNumber">' + result[i].week + '</th>')
		}
	}

	function insertAvailableWorkTime(weekDays, month, year) {
		var rows = $('tbody tr')
		for (let i = 0; i < rows.length; i++) {
			let currentRow = rows[i]
			let rowOpgaveloserId = $(currentRow).children('[idName=opgaveloserId]').val()
			let rowopgaveloserOpgaveId = $(currentRow).children('[idName=opgaveloserOpgaveId]').val()

			for (let i = 0; i < weekDays.length; i++) {
				let currentWeek = weekDays[i].week
				let opgaveloser = weekDays[i].opgaveloser.find(o => o.opgaveloserId == rowOpgaveloserId)
				//console.log(opgaveloser)
				let timeAntalForOpgave = 0
				let ugeTimeOpgaveId
				let availableWorkTime = opgaveloser.maxAvailableWorkTime

				for (let i = 0; i < opgaveloser.currentWorkTime.length; i++) {
					let currentWorkTime = opgaveloser.currentWorkTime[i]
					if (rowopgaveloserOpgaveId == currentWorkTime.opgaveloserOpgaveId) {
						timeAntalForOpgave += currentWorkTime.timeAntal
						ugeTimeOpgaveId = currentWorkTime.ugeTimeOpgaveId
						availableWorkTime -= timeAntalForOpgave
					}
				}

				// availableWorkTime -= opgaveloser.maxAvailableWorkTime - timeAntalForOpgave

				let td = $('<td>', {
					'onclick': 'changeAntalTimer(this)',
					'class': 'availableWorkTime pointer',
					'maxAvailableWorkTime': opgaveloser.maxAvailableWorkTime,
					'timeAntalForOpgave': timeAntalForOpgave,
					'availableWorkTime': availableWorkTime,
					'week': currentWeek,
					'ugeTimeOpgaveId': ugeTimeOpgaveId,
					'text': timeAntalForOpgave,
					'data-toggle': 'tooltip',
					'title': '',
					'workDaysInWeek': opgaveloser.workDaysInWeek.length,
					'workDaysInMonth': 0,
					'month': month,
					'year': year
				})

				if (i == 0)
					$(td).addClass('firstInMonth')

				//changeWorkLoad(td)
				$(currentRow).append(td)
			}
		}

		calcWeekAvailableworktime()
		setWorkHoursUsed()
	}
})

function calcWeekAvailableworktime() {//TODO dårlig performance.. refactor
	let rows = $('tbody tr')
	let realAvailableWorkTime = []

	//regn ud hvor mange timer hver opgaveløser har i hver uge i den valgte måned
	for (let i = 0; i < rows.length; i++) {//TODO dårlig performance.. refactor
		let currentRow = rows[i]
		let rowOpgaveloserId = $(currentRow).children('[idName=opgaveloserId]').val()

		let opgaveloser = realAvailableWorkTime.find(o => o.opgaveloserId == rowOpgaveloserId)
		if (opgaveloser == undefined) {
			opgaveloser = { 'opgaveloserId': rowOpgaveloserId, 'weeks': [] }
			realAvailableWorkTime.push(opgaveloser)
		}

		$(currentRow).children('.availableWorkTime').each(function () {
			let week = $(this).attr('week')
			let month = $(this).attr('month')
			let opgaveloserWeek = opgaveloser.weeks.find(o => o.week == week && o.month == month)
			if (opgaveloserWeek == undefined) {
				opgaveloserWeek = { 'week': week, 'month': month, 'availableWorkTime': 0, 'workDaysInMonth': 0 }
				opgaveloser.weeks.push(opgaveloserWeek)
			}
			opgaveloserWeek.availableWorkTime += parseFloat($(this).attr('timeAntalForOpgave'))
			opgaveloserWeek.workDaysInMonth = parseInt($(this).attr('workDaysInWeek'), 10)
		})

	}//dårlig performance..
	//ændre availableworktime for hver uge til hvor mange timer de har til rådighed i den uge
	for (let i = 0; i < rows.length; i++) {//TODO dårlig performance.. refactor
		let currentRow = rows[i]
		let rowOpgaveloserId = $(currentRow).children('[idName=opgaveloserId]').val()
		let opgaveloser = realAvailableWorkTime.find(o => o.opgaveloserId == rowOpgaveloserId)

		$(currentRow).children('.availableWorkTime').each(function () {
			let week = $(this).attr('week')
			let month = $(this).attr('month')
			let opgaveloserWeek = opgaveloser.weeks.find(o => o.week == week && o.month == month)

			let availableWorkTime = $(this).attr('maxAvailableWorkTime') - opgaveloserWeek.availableWorkTime
			$(this).attr('usedWorkHoursInWeek', opgaveloserWeek.availableWorkTime)
			$(this).attr('workDaysInMonth', opgaveloserWeek.workDaysInMonth)
			$(this).attr('availableworktime', availableWorkTime)
			$(this).attr('title', availableWorkTime)
			changeWorkLoad($(this))
		})

	}//dårlig performance..//TODO dårlig performance.. refactor
}


//sætter workDaysInMonth på alle uger i tabellen
function setWorkDaysInMonth() {//dårlig performance..//TODO dårlig performance.. refactor
	let workDaysInMonthOpgavelosere = []

	$('tbody tr').each(function () {//gå igennem alle rows
		let rowOpgaveloserId = $(this).children('[idName=opgaveloserId]').val()
		let opgaveloser = workDaysInMonthOpgavelosere.find(o => o.opgaveloserId == rowOpgaveloserId)

		if (opgaveloser == undefined) {//opgaveløseren findes ikke endnu i mit array
			opgaveloser = { 'opgaveloserId': rowOpgaveloserId, 'workDaysInMonth': [] }
			$(this).children('.availableWorkTime').each(function () {
				var month = $(this).attr('month')
				let currentMonth = opgaveloser.workDaysInMonth.find(o => o.month == month)//tjek om månedet findes
				if(currentMonth == undefined){//hvis ikke opret det
					currentMonth = {'month':month, 'days': 0}
					opgaveloser.workDaysInMonth.push(currentMonth)
				}
				currentMonth.days += parseInt($(this).attr('workDaysInWeek'), 10)//tilføj dage
			})
			workDaysInMonthOpgavelosere.push(opgaveloser)
		}
	})

	$('tbody tr').each(function () {
		let rowOpgaveloserId = $(this).children('[idName=opgaveloserId]').val()
		let opgaveloser = workDaysInMonthOpgavelosere.find(o => o.opgaveloserId == rowOpgaveloserId)

		$(this).children('.availableWorkTime').each(function () {
			var month = $(this).attr('month')
			let currentMonth = opgaveloser.workDaysInMonth.find(o => o.month == month)

			$(this).attr('workDaysInMonth', currentMonth.days)
		})
	})
}

function setWorkHoursUsed() {
	setWorkDaysInMonth()
	/* 
	ARBEJDEPROCENT = (32 - 0,5*arbejdsdage i ugen)/34,5 = procent arbejder ift 37 timer
	ARBEJDEPROCENT = (32 - 0,5*5)/34,5 = 0,86 * 100 = 86%

	ARBEJDSTIMER_FOR_MÅNED = max arbejdsdage i måned * 6,9 (rundet op)
	ARBEJDSTIMER_FOR_MÅNED = 23 * 6,9 = 159 (rundet op)

	BRUGETIMER_FOR_MÅNED = sum af alle opgaver for opgaveløser


	BRUGETIMER_FOR_MÅNED / (ARBEJDSTIMER_FOR_MÅNED * ARBEJDEPROCENT)
	(1+2+3+4+5+6+7) / ( (23 * 6,9) * ((37 - 0,5*5)/34,5) )
	*/


	//get total workhours and 
	let workHoursInMonth = []

	$('tbody tr').each(function () {
		let rowOpgaveloserId = $(this).children('[idName=opgaveloserId]').val()
		let opgaveloser = workHoursInMonth.find(o => o.opgaveloserId == rowOpgaveloserId)
		if (opgaveloser == undefined) {
			opgaveloser = { 'opgaveloserId': rowOpgaveloserId, 'hoursUsedInMonth': 0, 'maxavailableworktimeThisMonth': 0 }
			$(this).children('.availableWorkTime').each(function () {
				opgaveloser.maxavailableworktimeThisMonth += parseFloat($(this).attr('maxAvailableWorkTime'))
				opgaveloser.hoursUsedInMonth += parseFloat($(this).attr('usedworkhoursinweek'))
				opgaveloser.workDaysInWeek = $(this).attr('workDaysInWeek')//workDaysInWeek

			})
			workHoursInMonth.push(opgaveloser)
		}

		let firstTD = $(this).children('.availableWorkTime')[0]

		let pauseTimeInMonth = parseInt($(firstTD).attr('workDaysInMonth'), 10) * 0.5
		let maxWorkHoursForMonthWithBreak = opgaveloser.maxavailableworktimeThisMonth - pauseTimeInMonth
		let maxWorkHoursForMonth = opgaveloser.maxavailableworktimeThisMonth

		// console.log('maxWorkHoursForMonth uden pause: ' + opgaveloser.maxavailableworktimeThisMonth)
		// console.log('maxWorkHoursForMonth med pause: ' + maxWorkHoursForMonth)

		let worksHoursUsedInMonthInPercent = opgaveloser.hoursUsedInMonth / maxWorkHoursForMonth * 100
		let worksHoursUsedInMonthInPercentWithBreak = opgaveloser.hoursUsedInMonth / maxWorkHoursForMonthWithBreak * 100

		$(this).children('.usedHoursPercentNoBreak').text(worksHoursUsedInMonthInPercent.toFixed(0) + '%')
		$(this).children('.usedHoursPercentWithBreak').text(worksHoursUsedInMonthInPercentWithBreak.toFixed(0) + '%')


		//maxavailableworktime


		//ARBEJDEPROCENT = (32 - 0,5*arbejdsdage i ugen)/34,5 = procent arbejder ift 37 - (5*0,5) pga pauser = 34,5
		// let workPercent = (32 - 0.5 * parseInt(opgaveloser.workDaysInWeek, 10)) / 34.5
		// console.log('workPercent ',workPercent)

		// //ARBEJDSTIMER_FOR_MÅNED = max arbejdsdage i måned * 6,9 (rundet op)
		// let firstTD = $(this).children('.availableWorkTime')[0]
		// let workDaysInMonth = parseInt($(firstTD).attr('workDaysInMonth'), 10) 
		// let maxWorkHoursForMonth = workDaysInMonth * 6.9
		// console.log('workDaysInMonth', workDaysInMonth)
		// console.log('maxWorkHoursForMonth ',maxWorkHoursForMonth)

		// //BRUGETIMER_FOR_MÅNED = sum af alle opgaver for opgaveløser
		// console.log('hoursUsedInMonth ', opgaveloser.hoursUsedInMonth)

		// //BRUGETIMER_FOR_MÅNED / (ARBEJDSTIMER_FOR_MÅNED * ARBEJDEPROCENT)
		// let worksHoursUsedInMonthInPercent = opgaveloser.hoursUsedInMonth / (maxWorkHoursForMonth * workPercent) * 100
		// console.log('worksHoursUsedInMonthInPercent ', worksHoursUsedInMonthInPercent)

		// //console.log(workPercent)
		// //console.log(opgaveloser)

		// $(this).children('.usedHoursPercent').text(worksHoursUsedInMonthInPercent.toFixed(0) + '%')
	})

	//usedHoursPercent
}

function changeAntalTimer(e) {
	let val = prompt("Indtast time antal")
	console.log(val)
	if (val != null && !isNaN(val)) {
		let row = $(e).parent()
		let rowopgaveloserOpgaveId = $(row).children('[idName=opgaveloserOpgaveId]').val()

		// let month = $('#month').val()
		// let year = $('#year').val()
		let month = $(e).attr('month')
		let year = $(e).attr('year')

		let weekNumber = $(e).attr('week')
		let ugeTimeOpgaveId = $(e).attr('ugeTimeOpgaveId')

		let d = {
			ugeTimeOpgaveId: ugeTimeOpgaveId,//kan være undefined
			opgaveloserOpgaveId: rowopgaveloserOpgaveId,
			year: year,
			month: month,
			week: weekNumber,
			timeAntal: val
		}
		// console.log(d)

		$.ajax({
			url: '/bemandingsOversigtTid',
			data: d,
			type: 'PUT',
			success: function (result) {
				$(e).attr('ugeTimeOpgaveId', result.insertId)
				$(e).text(val)
				$(e).attr('timeAntalForOpgave', val)
				let availableWorkTime = $(e).attr('maxAvailableWorkTime') - val
				$(e).attr('availableWorkTime', availableWorkTime)

				changeWorkLoad($(e))
				calcWeekAvailableworktime()
				setWorkHoursUsed()
			}
		})
	}
}

function changeWorkLoad(td) {
	let availableWorkTime = $(td).attr('availableWorkTime')

	// let maxAvailableWorkTime = $(td).attr('maxAvailableWorkTime')
	// let timeAntalForOpgave = $(td).attr('timeAntalForOpgave')
	// let time = maxAvailableWorkTime - timeAntalForOpgave
	//$(td).attr('class', 'availableWorkTime')
	$(td).removeClass('lowWorkload')
	$(td).removeClass('mediumWorkload')
	$(td).removeClass('highWorkload')

	if (availableWorkTime > 0) {
		$(td).addClass('lowWorkload')
	}
	else if (availableWorkTime == 0) {
		$(td).addClass('mediumWorkload')
	}
	else {
		$(td).addClass('highWorkload')
	}
}

$('.availableWorkTime').change(function () {
	console.log('change')
	let maxAvailableWorkTime = $(this).attr('maxAvailableWorkTime')
	let timeAntalForOpgave = $(this).attr('timeAntalForOpgave')
	let time = maxAvailableWorkTime - timeAntalForOpgave
	$(this).attr('class', 'availableWorkTime')

	if (time > 0) {
		$(this).addClass('lowWorkload')
	}
	else if (time == 0) {
		$(this).addClass('mediumWorkload')
	}
	else {
		$(this).addClass('highWorkload')
	}
}).change()