/*var mediator = (function(){
    var subscribe = function(channel, fn){
        if (!mediator.channels[channel]) mediator.channels[channel] = [];
        mediator.channels[channel].push({ context: this, callback: fn });
        return this;
    },
 
    publish = function(channel){
        if (!mediator.channels[channel]) return false;
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
            var subscription = mediator.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }
        return this;
    };
 
    return {
        channels: {},
        publish: publish,
        subscribe: subscribe,
        installTo: function(obj){
            obj.subscribe = subscribe;
            obj.publish = publish;
        }
    };
 
}());
*/

var channels = {}

function subscribe(channel, fn){
    if (!channels[channel]) channels[channel] = [];
    channels[channel].push({ context: this, callback: fn });
    return this;
};

function publish(channel){
    if (!channels[channel]) return false;
    var args = Array.prototype.slice.call(arguments, 1);
    for (let i = 0, l = channels[channel].length; i < l; i++) {
        var subscription = channels[channel][i];
        // console.log(subscription)
        subscription.callback.apply(subscription.context, args);
    }
    return this;
};

function installTo(obj){
    obj.subscribe = this.subscribe
    obj.publish = this.publish
}

module.exports = {
    subscribe: subscribe,
    publish: publish,
    installTo: installTo,
    //channels: channels
}