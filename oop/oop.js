/**
 * Class
 */
(function (exports, undefined) {

    exports.extend = function (childCtor, parentCtor) {
        var fnTest = /\bsuperclass\b/,
            parent = parentCtor.prototype,
            fackParent = {},
            tempCtor = function(){},
            name;
        if (parent.superclass) {
            for (name in parent) {
                if (parent.hasOwnProperty(name) && fnTest.test(parent[name])) {
                    fackParent[name] = (function (name, fn) {
                        return function () {
                            var bak = this.superclass[name], res;
                            this.superclass[name] = parent.superclass[name];
                            res = fn.apply(this, arguments);
                            this.superclass[name] = bak;
                            return res;
                        };
                    })(name, parent[name]);
                }
                else {
                    fackParent[name] = parent[name];
                }
            }
            parent = fackParent;
        }
        tempCtor.prototype = parent;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.superclass = parentCtor.prototype;
        childCtor.prototype.constructor = childCtor;
    };

    exports.mixin = function (childCtor, interface) {
        interface = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, len = interface.length, name ; i < len ; i += 1) {
            for (name in interface[i]) {
                childCtor.prototype[name] = interface[i][name];
            }
        }
    };

    exports.Class = function (parent, interface, props) {
        var Class = function () {
            this.init.apply(this, arguments);
        };
        if (arguments.length === 1) {
            Class.prototype = parent;
        }
        else {
            if (typeof parent === 'function') {
                exports.extend(Class, parent);
                interface = Array.prototype.slice.call(arguments, 1);
            }
            else {
                interface = Array.prototype.slice.call(arguments, 0);
            }
            interface.unshift(Class);
            exports.mixin.apply(null, interface);
        }
        Class.prototype.constructor = Class;
        return Class;
    };

})(window);

/**
 * Module
 */
(function (exports, undefined) {

    var modules = {};

    var loadScript = function (url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        }
        else {
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    var require = function (name) {
        return modules[name];
    };

    exports.define = function (name, dependence, callback) {
        if (name === 'main'){
            loadScript('getModules?modules=' + dependence.toString(), function () {
                callback(require);
            };)
        }
        else {
            callback(require, modules[name] = {});
        }
    };

})(window);

// maths.js
define("maths", function(require, exports){
    exports.per = function(value, total) {
        return( (value / total) * 100 );
    };
});
// application.js
define("application", function(require, exports){
    var per = require("./maths").per;
    assertEqual( per(50, 100), 50 );
}, ["./maths"]); // List dependencies (maths.js)



    exports.PubSub = {

        callbacks: {},

        subscribe: function(ev, callback) {
            (this.callbacks[ev] || (this.callbacks[ev] = [])).push(callback);
            this.publish('subscribe');
            return this;
        },

        publish: function() {
            var args = Array.prototype.slice.call(arguments, 0),
                ev = args.shift(),
                list = this.callbacks[ev],
                i,
                len;
            if (list) {
                for (i = 0, len = list.length; i < len; i++) {
                    list[i].apply(this, args);
                }
            }
            return this;
        }

    };

