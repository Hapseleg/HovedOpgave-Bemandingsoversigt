$(document).ready(function() {
	var now = new Date()
	$('#month').val(now.getMonth()+1)
	$('#year').val(now.getFullYear())
	populateWeeks()

	$('[data-toggle="tooltip"]').tooltip();
	
	$('#getTimeData').click(populateWeeks)

	$('th').click(function(){
		var table = $(this).parents('table').eq(0)
		var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
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

		let thead = $('#opgaveloserTable thead tr')

		for(let i = 0; i< result.length; i++){
			thead.append('<th class="weekNumber">'+result[i].week+'</th>')
		}
	}

	function insertAvailableWorkTime(result){
		$('.availableWorkTime').remove()
		var rows = $('tbody tr')
		//console.log(rows)

		for(let i = 0; i< rows.length; i++){
			let currentRow = rows[i]
			let rowOpgaveloserId = $(currentRow).children('[idName=opgaveloserId]').val()
			let rowopgaveId = $(currentRow).children('[idName=opgaveId]').val()
			// let rowopgaveloserKonsulentProfilId = $(currentRow).children('[idName=opgaveloserKonsulentProfilId]').val()

			let rowopgaveloserOpgaveId = $(currentRow).children('[idName=opgaveloserOpgaveId]').val()
			
			for(let i = 0; i< result.length; i++){
				let opgaveloser = result[i].opgaveloser.find(o => o.opgaveloserId == rowOpgaveloserId)
				let antalTimerOpgaveloserArbejderPaaOpgaven = 0
				let ugeTimeOpgaveId

				for(let i = 0; i<opgaveloser.currentWorkTime.length;i++){
					let currentWorkTime = opgaveloser.currentWorkTime[i]
					if(rowopgaveloserOpgaveId == currentWorkTime.opgaveloserOpgaveId){
						antalTimerOpgaveloserArbejderPaaOpgaven += currentWorkTime.timeAntal
						ugeTimeOpgaveId = currentWorkTime.ugeTimeOpgaveId
					}
						
				}

				let td = $('<td>', {'onclick': 'changeAntalTimer(this)', 'class': 'availableWorkTime', 'data-toggle': 'tooltip', 'title':opgaveloser.maxAvailableWorkTime, week: result[i].week, 'ugeTimeOpgaveId': ugeTimeOpgaveId, text: antalTimerOpgaveloserArbejderPaaOpgaven})

				if(opgaveloser.maxAvailableWorkTime-antalTimerOpgaveloserArbejderPaaOpgaven > 0){
					$(td).addClass('lowWorkload')
				}
				else if(opgaveloser.maxAvailableWorkTime-antalTimerOpgaveloserArbejderPaaOpgaven == 0){
					$(td).addClass('mediumWorkload')
				}
				else{
					$(td).addClass('highWorkload')
				}
				$(currentRow).append(td)
			}
		}
	}
	
})

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
			success: function(result) {
				$(e).text(val)

				//insertAvailableWorkTime(result)
			}
		});
	}
}