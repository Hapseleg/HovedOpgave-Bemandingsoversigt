$(document).ready(function() {
	var now = new Date()
	$('#month').val(now.getMonth()+1)
	$('#year').val(now.getFullYear())
	populateWeeks()

	$('[data-toggle="tooltip"]').tooltip();
	
	$('#getTimeData').click(populateWeeks)

	$('#toggleWeeks').click(function(){
		let t = $(this)
		if($(t).hasClass('toggledUsed')){
			$(t).text('Se timer brugt')
			$(t).removeClass('toggledUsed')
			$(t).addClass('toggledAvail')

			//maxAvailableWorkTime
			$('.availableWorkTime').each(function(index){
				let text = $(this).attr('availableWorkTime')
				$(this).text(text)
			})
		}
		else{
			$(t).text('Se timer til rådighed')
			$(t).removeClass('toggledAvail')
			$(t).addClass('toggledUsed')

			//timeAntalForOpgave
			$('.availableWorkTime').each(function(index){
				let text = $(this).attr('timeAntalForOpgave')
				$(this).text(text)
			})
		}
	})

	//https://stackoverflow.com/a/19947532/5098223
	$('#secondHead th').click(function(){
		var table = $(this).parents('table').children('tbody')
		var rows = table.find('tr').toArray().sort(comparer($(this).index()))
		this.asc = !this.asc
		if (!this.asc){rows = rows.reverse()}
		for (var i = 0; i < rows.length; i++){table.append(rows[i])}
	})

	function comparer(index) {
		return function(a, b) {
			var valA = getCellValue(a, index), valB = getCellValue(b, index)
			return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
		}
	}
	function getCellValue(row, index){ return $(row).children('td').eq(index).text() }

	function populateWeeks(){
		let month = $('#month').val()
		let year = $('#year').val()

		$('#toggleWeeks').removeClass('toggledAvail')
		$('#toggleWeeks').addClass('toggledUsed')
	
		$.ajax({
			url: '/bemandingsOversigtTid',
			data: {year : year, month: month},
			type: 'GET',
			success: function(result) {
				//console.log(result)
				insertWeeks(result)
				insertAvailableWorkTime(result)
			}
		});
	}

	function insertWeeks(result){
		$('.weekNumber').remove()

		$('#thMonth').text($('#month :selected').text())
		let thead = $('#secondHead')

		for(let i = 0; i< result.length; i++){
			thead.append('<th class="weekNumber">'+result[i].week+'</th>')
		}
	}

	function insertAvailableWorkTime(result){
		$('.availableWorkTime').remove()
		var rows = $('tbody tr')
		for(let i = 0; i< rows.length; i++){
			let currentRow = rows[i]
			let rowOpgaveloserId = $(currentRow).children('[idName=opgaveloserId]').val()
			let rowopgaveloserOpgaveId = $(currentRow).children('[idName=opgaveloserOpgaveId]').val()
			

			for(let i = 0; i< result.length; i++){
				let currentWeek = result[i].week
				let opgaveloser = result[i].opgaveloser.find(o => o.opgaveloserId == rowOpgaveloserId)
				let timeAntalForOpgave = 0
				let ugeTimeOpgaveId
				let availableWorkTime = opgaveloser.maxAvailableWorkTime

				for(let i = 0; i<opgaveloser.currentWorkTime.length;i++){
					let currentWorkTime = opgaveloser.currentWorkTime[i]
					if(rowopgaveloserOpgaveId == currentWorkTime.opgaveloserOpgaveId){
						timeAntalForOpgave += currentWorkTime.timeAntal
						ugeTimeOpgaveId = currentWorkTime.ugeTimeOpgaveId
						availableWorkTime -= timeAntalForOpgave
					}
				}
				
				// availableWorkTime -= opgaveloser.maxAvailableWorkTime - timeAntalForOpgave

				let td = $('<td>', {
					'onclick': 'changeAntalTimer(this)', 
					'class': 'availableWorkTime',
					'maxAvailableWorkTime':opgaveloser.maxAvailableWorkTime, 
					'timeAntalForOpgave':timeAntalForOpgave,
					'availableWorkTime': availableWorkTime, 
					'week': currentWeek, 
					'ugeTimeOpgaveId': ugeTimeOpgaveId, 
					'text': timeAntalForOpgave,
					'data-toggle': 'tooltip', 
					'title':'', 
				})

				//changeWorkLoad(td)
				$(currentRow).append(td)
			}
		}

		calcWeekAvailableworktime()
	}
})

function calcWeekAvailableworktime(){
	let rows = $('tbody tr')
	let realAvailableWorkTime = []//TODO dårlig performance.. refactor
		for(let i = 0; i< rows.length; i++){//TODO dårlig performance.. refactor
			let currentRow = rows[i]
			let rowOpgaveloserId = $(currentRow).children('[idName=opgaveloserId]').val()

			let opgaveloser = realAvailableWorkTime.find(o => o.opgaveloserId == rowOpgaveloserId)
			if(opgaveloser == undefined){
				opgaveloser = {'opgaveloserId': rowOpgaveloserId, 'weeks': []}
				realAvailableWorkTime.push(opgaveloser)
			}
				
			$(currentRow).children('.availableWorkTime').each(function(){
				let week = $(this).attr('week')
				let opgaveloserWeek = opgaveloser.weeks.find(o => o.week == week)
				if(opgaveloserWeek == undefined){
					opgaveloserWeek = {'week': week, 'availableWorkTime': 0}
					opgaveloser.weeks.push(opgaveloserWeek)
				}
				opgaveloserWeek.availableWorkTime += parseInt($(this).attr('timeAntalForOpgave'),10)
			})

		}//dårlig performance..
		for(let i = 0; i< rows.length; i++){//TODO dårlig performance.. refactor
			let currentRow = rows[i]
			let rowOpgaveloserId = $(currentRow).children('[idName=opgaveloserId]').val()
			let opgaveloser = realAvailableWorkTime.find(o => o.opgaveloserId == rowOpgaveloserId)

			$(currentRow).children('.availableWorkTime').each(function(){
				let week = $(this).attr('week')
				let opgaveloserWeek = opgaveloser.weeks.find(o => o.week == week)
				
				let availableWorkTime = $(this).attr('maxAvailableWorkTime') - opgaveloserWeek.availableWorkTime
				$(this).attr('availableworktime', availableWorkTime)
				$(this).attr('title', availableWorkTime)
				changeWorkLoad($(this))
			})
			
		}//dårlig performance..//TODO dårlig performance.. refactor

	
}

function changeAntalTimer(e){
	let val = prompt("Indtast time antal")
	
	if(val != null && !isNaN(val)){
		let row = $(e).parent()
		let rowopgaveloserOpgaveId = $(row).children('[idName=opgaveloserOpgaveId]').val()

		let month = $('#month').val()
		let year = $('#year').val()

		let weekNumber = $(e).attr('week')
		let ugeTimeOpgaveId = $(e).attr('ugeTimeOpgaveId')

		let d = {
			ugeTimeOpgaveId:ugeTimeOpgaveId,//kan være undefined
			opgaveloserOpgaveId:rowopgaveloserOpgaveId,
			year: year,
			month: month,
			week:weekNumber,
			timeAntal:val
		}
		//console.log(d)

		$.ajax({
			url: '/bemandingsOversigtTid',
			data: d,
			type: 'PUT',
			success: function(result) {//TODO hvis jeg vælger en med 0 først og så den samme uden at refresh crasher den fordi den <td> ikke har nogen "ugeTimeOpgaveId"
				$(e).text(val)
				$(e).attr('timeAntalForOpgave', val)
				let availableWorkTime = $(e).attr('maxAvailableWorkTime') - val
				$(e).attr('availableWorkTime', availableWorkTime)
				
				changeWorkLoad($(e))
				calcWeekAvailableworktime()

				//insertAvailableWorkTime(result)
			}
		});
	}
}

function changeWorkLoad(td){
	let availableWorkTime = $(td).attr('availableWorkTime')

	// let maxAvailableWorkTime = $(td).attr('maxAvailableWorkTime')
	// let timeAntalForOpgave = $(td).attr('timeAntalForOpgave')
	// let time = maxAvailableWorkTime - timeAntalForOpgave
	$(td).attr('class', 'availableWorkTime')

	if(availableWorkTime > 0){
		$(td).addClass('lowWorkload')
	}
	else if(availableWorkTime == 0){
		$(td).addClass('mediumWorkload')
	}
	else{
		$(td).addClass('highWorkload')
	}
}

$('.availableWorkTime').change(function(){
	console.log('change')
	let maxAvailableWorkTime = $(this).attr('maxAvailableWorkTime')
	let timeAntalForOpgave = $(this).attr('timeAntalForOpgave')
	let time = maxAvailableWorkTime - timeAntalForOpgave
	$(this).attr('class', 'availableWorkTime')

	if(time > 0){
		$(this).addClass('lowWorkload')
	}
	else if(time == 0){
		$(this).addClass('mediumWorkload')
	}
	else{
		$(this).addClass('highWorkload')
	}
}).change()