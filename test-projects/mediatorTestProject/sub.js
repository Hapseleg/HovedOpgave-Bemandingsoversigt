var mediator = require('./modules/mediator')

function setup(){
    mediator.subscribe('count',function(arg){
        console.log('sub count here ---------')
        console.log(arg);
        // får det til at køre uendligt
        // mediator.publish('nameChange', 'asd')
    })
}

function run(){

}

module.exports = {
    run: run,
    setup:setup
}