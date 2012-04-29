/**
 * Class
 */
(function (exports, undefined) {

    exports.extend = function extend(childCtor, parentCtor) {
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

    exports.mixin = function mixin(childCtor, interface) {
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
                extend(Class, parent);
                interface = Array.prototype.slice.call(arguments, 1);
            }
            else {
                interface = Array.prototype.slice.call(arguments, 0);
            }
            interface.unshift(Class);
            mixin.apply(null, interface);
        }
        Class.prototype.constructor = Class;
        return Class;
    };

})(window);

/**
 * Module
 */
(function (exports, undefined) {

    exports.define = function (name, dependence, callback) {};

    exports.require = function (name, callback) {};

    exports.loader = function loader() {};

})(window);
