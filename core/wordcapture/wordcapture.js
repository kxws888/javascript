/**
 * @version 20110523.1
 *
*/
dom.Class('Wordcapture', {

    init: function (args) {
        this.scope = args && args.scope || document.body;

        this.captureEvent = document.createEvent('Event');
        this.captureEvent.initEvent('capture', true, true);
        dom.Event.addEvent(this.scope, 'capture', dom.Tool.proxy(this.captureText, this));
    },

    enable: function () {
        dom.Event.addEvent(this.scope, 'click', dom.Tool.proxy(this.dblclickHandler, this));
        dom.Event.addEvent(this.scope, 'mousedown', dom.Tool.proxy(this.dragStart, this));
    },

    disable: function () {
        dom.Event.removeEvent(this.scope, 'click', dom.Tool.proxy(this.dblclickHandler, this));
        dom.Event.removeEvent(this.scope, 'mousedown', dom.Tool.proxy(this.dragStart, this));
    },

    dblclickHandler: function (e) {
        if (e.detail > 1) {
            e.target.dispatchEvent(this.captureEvent);
        }
    },

    dragStart: function (e) {
        var event = dom.Event.fix(e);
        dom.Event.one(document, 'mouseup', dom.Tool.proxy(this.dragEnd, this));
        this.cursorPos = event.pageX;
    },

    dragEnd: function (e) {
        var event = dom.Event.fix(e);
        if (this.cursorPos !== event.pageX) {
            e.target.dispatchEvent(this.captureEvent);
        }
    },

    captureText: function (e) {
        var text = window.getSelection().toString();
        console.log(text);
    }
});
