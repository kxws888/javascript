(function () {
    'use strict';
    var document = window.document;
    function inherits(childCtor, parentCtor) {
        function tempCtor() {};
        tempCtor.prototype = parentCtor.prototype;
        childCtor.$super = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.constructor = childCtor;
    };

    function Random(range, speed, callback) {
        this.range = range;
        this.speed = speed || 25;
        this.callback = callback;
        this.result = null;
        this.timer = null;
    }

    Random.prototype.start = function () {
        if (!this.timer) {
            var self = this;
            this.timer = setInterval(function () {
                self.change.call(self)
            }, this.speed);
        }
    };

    Random.prototype.stop = function () {
        clearInterval(this.timer);
        this.timer = null;
    };

    Random.prototype.change = function () {
        var ran = Math.floor(Math.random() * this.range.length);
        this.result = this.range[ran];
        if (Object.prototype.toString.call(this.callback) === '[object Function]') {
            this.callback(this.result);
        }
    };

    window['Random'] = Random;
})();
