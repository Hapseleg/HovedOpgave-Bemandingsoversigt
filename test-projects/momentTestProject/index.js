var moment = require('moment')

function getWeekDaysInWeekInSameMonth(year, month, weekNumber, callback){
    let startOfWeek = moment(year, 'YYYY').month(month).isoWeek(weekNumber).startOf('isoWeek')
    let weekDays = []
    console.log(weekNumber)
    for(let i = 1; i<=5;i++){
        let weekDay = startOfWeek.isoWeekday()
        let monthOfStart = startOfWeek.month()+1

        console.log(startOfWeek)
 
        if(weekDay == 6 || weekDay == 7 || weekDays.length == 5){
            callback(weekDays)
            break;
        }
        else if(monthOfStart == month){
            weekDays.push(weekDay)
        }

        if(i == 5){
            callback(weekDays)
            break;
        }

        startOfWeek.add(1,'days')
    }
}

//https://stackoverflow.com/questions/43603604/how-to-get-week-numbers-of-current-month-in-moment-js
function getWeeksInMonth(year, month, callback){
    const firstDayOfMonth = moment(`${ year }-${ month }`, 'YYYY-MM-DD');
    const numOfDays = firstDayOfMonth.daysInMonth();
    let weeks = new Set();
   
    for(let i = 0; i < numOfDays; i++){
        const currentDay = moment(firstDayOfMonth, 'YYYY-MM-DD').add(i, 'days');

        if(currentDay.isoWeekday() != 6 && currentDay.isoWeekday() != 7)
            weeks.add(currentDay.isoWeek());
    }
    callback(Array.from(weeks))
}

function getWeekdaysInMonth(year,month,callback){
    getWeeksInMonth(year, month, function(weeks){
        var weekdays = []
        for(let i = 0; i< weeks.length;i++){
            getWeekDaysInWeekInSameMonth(year,month,weeks[i],function(res){
                weekdays.push({week: weeks[i], weekdays: res})
                if(weekdays.length == weeks.length){
                    callback(weekdays)
                }
            }) 
        }
    })
}

getWeekdaysInMonth(2018,11,function(res){
    console.log(res)
})


// var t = moment('2018-12-30')
// console.log(t)
// t.add(1,'d')
// console.log(t)
// function getWeekNumber(date){
//     return moment(date, "YYYYMMDD").isoWeek();
// }

// // function firstWeekdayOfMonthIsMonday(month,year){
// //     if(moment(year+month, "YYYYMM").startOf('month').isoWeekday() != 1)
// //         return false
// //     return true
// // }

// // function lastWeekdayOfMonthIsFriday(month,year){
// //    if(moment(year+month, "YYYYMM").endOf('month').isoWeekday() != 5)
// //         return false
// //     return true
// // }



// // function getWeekDaysInWeekInSameMonth(date, callback){
// //     let startOfWeek = moment(date, "YYYYMMDD").startOf('isoWeek')
// //     let dateCompare = startOfWeek.clone()
// //     let weekDays = [1]

// //     for(let i = 1; i<=5;i++){
// //         dateCompare.add(1,'days')

// //         if(weekDays.length == 5){
// //             callback(weekDays)
// //             break;
// //         }
// //         else if(dateCompare.month() == startOfWeek.month()){
// //             weekDays.push(i+1)
// //         }
// //         else {
// //             callback(weekDays)
// //             break;          
// //         }
// //     }
// // }

// function getWeekDaysInWeekInSameMonth(weekNumber, month, year, callback){
//     let startOfWeek = moment(year, 'YYYY').isoWeek(weekNumber).startOf('isoWeek')
//     let weekDays = []

//     for(let i = 1; i<=5;i++){
//         let weekDay = startOfWeek.isoWeekday()
//         let monthOfStart = startOfWeek.month()+1
 
//         if(weekDay == 6 || weekDay == 7 || weekDays.length == 5){
//             callback(weekDays)
//             break;
//         }
//         else if(monthOfStart == month && startOfWeek.year() == year){
//             weekDays.push(weekDay)
//         }

//         if(i == 5){
//             callback(weekDays)
//             break;
//         }

//         startOfWeek.add(1,'days')
//     }
// }

// getWeekDaysInWeekInSameMonth(44,10,2018, function(result){
//     console.log(result)
// })


// function getWeeksInMonth(year, month, callback){
//     const firstDayOfMonth = moment(`${ year }-${ month }`, 'YYYY-MM-DD');
//     const numOfDays = firstDayOfMonth.daysInMonth();
//     let weeks = new Set();
   
//     for(let i = 0; i < numOfDays; i++){
//         const currentDay = moment(firstDayOfMonth, 'YYYY-MM-DD').add(i, 'days');
   
//         weeks.add(currentDay.isoWeek());
//     }
   
//     // return Array.from(weeks)
//     callback(Array.from(weeks))
// }
// // console.log(getWeeksInMonth(2018,12))
// getWeeksInMonth(2018,12,function(result){
//     console.log(result)
// })

// function getWeekdaysForFirstWeekInMonth(month,year){
//     let date = moment(year+month, "YYYYMM").startOf('month')
//     if(date.isoWeekday() != 1)
//         return false
//     return [1,2,3,4,5]
// }

// function getWeekdaysForLastWeekInMonth(month,year){
//     let date = moment(year+month, "YYYYMM").endOf('month')
//    if(date.isoWeekday() != 5)
//         return false
//     return [1,2,3,4,5]
// }

// function firstWeekdayOfWeek(weekNumber){
//     return moment(weekNumber, 'W WW').startOf('isoweek').isoWeekday()
// }

// function lastWeekdayOfWeek(weekNumber){
//     // return moment(weekNumber, 'W WW').add(1, 'months').date(1).subtract(1, 'days').isoWeekday()
//     return moment(weekNumber, 'W WW').endOf('isoweek').isoWeekday()
// }

// function getWorkWeekdaysInWeek(weekNumber){
//     let workDays = [1,2,3,4,5]
//     let firstWeekdayOfWeek = firstWeekdayOfWeek(weekNumber)
//     let lastWeekdayOfWeek = lastWeekdayOfWeek(weekNumber)
// }

// // console.log(firstWeekdayOfMonthIsMonday('2018-10'))
// // console.log(lastWeekdayOfMonthIsFriday('2018-10'))
// // console.log(firstWeekdayOfWeek(44))
// // console.log(lastWeekdayOfWeek(44))

