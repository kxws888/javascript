Class('Slider', function () {

    init: function (args) {
        this.prop = !args.direction || args.direction === 'vertical' ? 'top' : 'left';
        this.track = dom.query(args.track);
        this.handle = dom.query(args.handle);

        dom.addEvent(this.handle, 'mousedown', Class.proxy(this.dragInit, this));
    },

    dragInit: function () {
        dom.addEvent
    },

    drag

});
