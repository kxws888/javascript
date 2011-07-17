/**
 * Simple class-style inherit
 * @author viclm
 * @version 20110714.4
 * @license New BSD License
*/
function Class(parentCtor, childCtor) {
    'use strict';
    function tempCtor() {};
    tempCtor.prototype = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    childCtor.prototype.$super = parentCtor.prototype;
    childCtor.prototype.constructor = childCtor;
}


function ClassC(parent, child) {
    'use strict';
    function childCtor() {};
    if (typeof child === 'undefined') {
        childCtor.prototype = parent;
    }
    else {
        function parentCtor() {};
        parentCtor.prototype = parent.prototype;
        childCtor.prototype = new parentCtor();
        for (var key in child) {
            childCtor.prototype[key] = child[key];
        }
        childCtor.prototype.$super = parent.prototype;
    }
    return childCtor;
}

hg.Class = function(){
	var klass = function(){
		this.$init.apply(this, arguments);
	};
	var args = [];
	for (var i = 0, l = arguments.length; i < l; i++) {
		args[i] = arguments[i];
	}
	var prototype = args.slice(-1)[0];
	var _prototype = {};
	var supers = args.slice(0, -1);
	for (var i in supers) {
		var _super = supers[i];
		if (typeof _super == "function") {
			$.extend(_prototype, _super.prototype);
			_prototype.$super = _super.prototype;
		} else if (typeof _super == "object"){
			$.extend(_prototype, _super);
		}
	}
	klass.prototype = $.extend(_prototype, prototype);
	return klass;
};


/**
* Class-style JavaScript statement and inheritance
* @Author Liuming
* @version 1.1
* @param {String} ns the name of class
* @param {Object} extend parent class
* @param {Object} obj the content of class
**/
this.ClassCA = (function () {
    'use strict';
    function Class(ns, extend, obj) {
        if (typeof obj === 'undefined') {
            obj = extend;
            extend = undefined;
        }
        if (!obj.init) {
            obj.init = function () {};
        }

        function Class() {
            return this.init.apply(this, arguments);
        }
        Class.prototype = obj;
        if (extend) {
            inherit(Class, extend);
        }
        Class.prototype.constructor = Class;
        verifyNameSpace(ns, Class);
    }

    function inherit(childCtor, parentCtor) {
        var key, child = childCtor.prototype, parent = parentCtor.prototype, init, superReg = /\.\$super\./;
        if (!superReg.test(child.init)) {
            init = child.init;
            child.init = function () {
                this.$super.init.apply(this, arguments);
                init.apply(this, arguments);
            };
        }
        for (key in parent) {
            if (child[key] && typeof child[key] === 'function') {
                if (superReg.test(child[key])) {
                    child[key] = (function (childFn, parentFn, name) {
                        return function () {
                            var self = this;
                            this.$super = this.$super || {};
                            this.$super[name] = function () {
                                return parentFn.apply(self, arguments);
                            }
                            return childFn.apply(this, arguments);
                        };
                    })(child[key], parent[key], key);
                }
            }
            else {
                child[key] = parent[key];
            }
        }
    }

    function verifyNameSpace(ns, obj) {
        var names = ns.split('.'), componentName = '', parent = window, i, length, n;
        componentName = names.pop();
        for (i = 0, length = names.length; i < length; i += 1) {
            n = names[i];
            if (typeof parent[n] === 'undefined') {
                parent[n] = {};
            }
            parent = parent[n];
        }
        parent[componentName] = obj;
    }

    return Class;
})();


