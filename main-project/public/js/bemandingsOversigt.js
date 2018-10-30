$(document).ready(function() {    
    
})

function test(data){
    console.log('test')
    console.log(data);
}

function getData(){
    $.ajax({
		url: '/bemandingsOversigtTid',
		data: {year : 2018, month: 10},
		type: 'GET',
		success: function(result) {
			console.log(result)
		}
	});
}