/**
 * Cross-browser event handles
 */
define('event', function (require, exports) {
    exports.add = function(node, event, fn) {
        if (node.addEventListener) {
            this.add = function (node, event, fn) {
                node.addEventListener(event, fn, false);
            }
        }
        else if (node.attachEvent) {
            this.add = function (node, event, fn) {
                node.attachEvent('on' + event, fn);
            }
        }

        this.add(node, event, fn);
    };

    exports.remove = function(node, event, fn) {
        if (node.removeEventListener) {
            this.remove = function (node, event, fn) {
                node.removeEventListener(event, fn, false);
            }
        }
        else if (node.detachEvent) {
            this.remove = function (node, event, fn) {
                node.detachEvent('on' + event, fn);
            }
        }
        this.remove(node, event, fn);
    };

    exports.one = function (node, event, fn) {
        var self = this, fname = event + (+new Date());
        node[fname] = function () {
            self.remove(node, event, node[fname]);
            node[fname] = null;
            fn.apply(this, arguments);
        };
        this.add(node, event, node[fname]);
    };

    exports.fix = function (e) {
        if (e) {
            this.fix = function (e) {
                return {
                    pageX : e.pageX,
                    pageY : e.pageY,
                    target : e.target,
                    preventDefault : function () {
                        e.preventDefault();
                    },
                    stopPropagation : function () {
                        e.stopPropagation();
                    }
                }
            }
        }
        else {
            this.fix = function () {
                return {
                    pageX : window.eventclientX + document.body.scrollLeft,
                    pageY : window.event.clientY + document.body.scrollTop,
                    target : window.event.srcElement,
                    preventDefault : function () {
                        window.event.returnValue = false;
                    },
                    stopPropagation : function () {
                        window.event.cancelBubble = true;
                    }
                }
            }
        }

        return this.fix(e);
    };
});
