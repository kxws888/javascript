var hg = hg || {};
hg.Counter = (function () {
    'use strict';
    function Class(parent, child) {
        'use strict';
        function parentCtor() {};
        function childCtor() {
            this.init.apply(this, arguments);
        };
        if (typeof child === 'undefined') {
            childCtor.prototype = parent;
        }
        else {
            parentCtor.prototype = parent.prototype;
            childCtor.prototype = new parentCtor();
            for (var key in child) {
                childCtor.prototype[key] = child[key];
            }
            childCtor.prototype.$super = parent.prototype;
        }
        return childCtor;
    }

    var Counter = Class({

        init: function (args) {
            args = args || {};
            this.value = args.value;
            this.length = args.length;
            this.order = args.order;

            this.bits = [];

            var i, bit;
            for (i = 0 ; i < this.length ; i += 1) {
                bit = new function(){};
                bit.counter = this;
                bit.index = i;
                bit.value = 0;
                bit.order = this.order;
                bit.prototype.walk = this.walk;
                this.bits.push(bit);
            }
        },

        flush: function () {
            var i, value = this.value;
            for (i = this.length - 1 ; i >= 0 ; i -= 1) {
                this.bits[i].index = Math.floor(value / Math.pow(10, i));
                value -= this.bits[i].index * Math.pow(10, i);
            }
        },

        start: function () {
            var self = this;
            setTimeout(function () {
                self.value += 1;
                self.bits[self.length - 1].walk();
            }, 1000);
        },

        walk: function () {
            this.value += this.order === 'asc' ? 1 : -1;
            if (this.value > 9) {
                this.value = 0;
                this.counter.bits[this.index - 1].walk();
            }
            else if (this.index < 0) {
                this.value = 9;
                this.counter.bits[this.index - 1].walk();
            }
        }
    });


    return Counter;

})();


