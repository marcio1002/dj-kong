const EventEmitter = require('events');

class EventsMusic {
    evtMusic = new EventEmitter.EventEmitter();

    on(evt,callback) {
        if(typeof callback != "function") throw new Error("Require function");

        this.evtMusic.on(evt,callback);
    }
    once(evt,callback) {
        if(typeof callback != "function") throw new Error("Require function");

        this.evtMusic.once(evt,callback);
    }

    emit(evt, ...data) {
        this.evtMusic.emit(evt,data);
    }
}

module.exports = EventsMusic;