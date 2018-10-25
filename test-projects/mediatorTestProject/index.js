var mediator = require('./modules/mediator')

mediator.subscribe('count',function(arg){
    console.log('index count here ---------')
    console.log(arg);
})


mediator.name = "tim";
mediator.subscribe('nameChange', function(arg){
        console.log(this.name);
        this.name = arg;
        console.log(this.name);
        mediator.publish('count', 1000)
});

var sub = require('./sub')
sub.setup()


mediator.publish('nameChange', 'david'); //tim, david




// var obj = { name: 'sam' };
// mediator.installTo(obj);
// obj.subscribe('nameChange', function(arg){
//         console.log(this.name);
//         this.name = arg;
//         console.log(this.name);
// });
 
// obj.publish('nameChange', 'john'); //sam, john