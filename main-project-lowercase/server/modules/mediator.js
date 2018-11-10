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
        subscription.callback.apply(subscription.context, args);
    }
    return this;
};

function installTo(obj){
    obj.subscribe = this.subscribe
    obj.publish = this.publish
}

function printChannels(){
    console.log(channels)
    // channels.channel.array.forEach(element => {
    //     console.log(element)
    // });
}

module.exports = {
    subscribe: subscribe,
    publish: publish,
    installTo: installTo,
    printChannels:printChannels
}