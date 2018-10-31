$(document).ready(function() {
	var now = new Date()
	$('#month').val(now.getMonth()+1)
	$('#year').val(now.getFullYear())
	populateWeeks()

	$('[data-toggle="tooltip"]').tooltip();
	
	$('#getTimeData').click(populateWeeks)

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
			let rowopgaveloserKonsulentProfilId = $(currentRow).children('[idName=opgaveloserKonsulentProfilId]').val()
			
			for(let i = 0; i< result.length; i++){
				let opgaveloser = result[i].opgaveloser.find(o => o.opgaveloserId == rowOpgaveloserId)
				let antalTimerOpgaveloserArbejderPaaOpgaven = 0
				let ugeTimeOpgaveId

				for(let i = 0; i<opgaveloser.currentWorkTime.length;i++){
					let currentWorkTime = opgaveloser.currentWorkTime[i]
					if(rowopgaveId == currentWorkTime.opgaveId && rowopgaveloserKonsulentProfilId == currentWorkTime.opgaveloserKonsulentProfilId){
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
	let row = $(e).parent()
	let rowopgaveId = $(row).children('[idName=opgaveId]').val()
	let rowopgaveloserKonsulentProfilId = $(row).children('[idName=opgaveloserKonsulentProfilId]').val()

	let month = $('#month').val()
	let year = $('#year').val()

	let weekNumber = $(e).attr('week')
	let ugeTimeOpgaveId = $(e).attr('ugeTimeOpgaveId')

	let val = prompt("Indtast time antal")

	let d = {
		ugeTimeOpgaveId:ugeTimeOpgaveId,//kan være undefined
		opgaveId:rowopgaveId,
		opgaveloserKonsulentProfilId:rowopgaveloserKonsulentProfilId,
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