/**
 * dom.js
 * It's a light library only contains several methods which are used most in the development.
 * @author viclm
 * @version 20110516.1
 * @license New BSD License
*/
//this change is just for test svn and git
'use strict';
var dom = {};
/**
 * tool function
*/
dom.Tool = {
    proxy: function (fn, obj) {
        return function () {
            return fn.apply(obj, arguments);
        }
    },

    toArray: function (obj) {
        try {
            return Array.prototype.slice.call(obj, 0);
        }
        catch (e) {
            this.toArray = function(obj) {
                var ret = [], i, len;
                if (typeof obj.length === "number") {
                    for (i = 0, len = obj.length; i < len; i += 1) {
                        ret[ret.length] = obj[i];
                    }
                } else {
                    for (i = 0; obj[i]; i += 1) {
                        ret[ret.length] = obj[i];
                    }
                }

                return ret;
            };
            return this.toArray(obj);
        }
    }
}

/**
* Class-style JavaScript statement and inheritance
* @Author Liuming
* @version 1.1
* @param {String} ns the name of class
* @param {Object} extend parent class
* @param {Object} obj the content of class
**/
dom.Class = (function () {
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

dom.Query = {

    $: function (query, parent) {
        parent = parent || document;
        if (parent.querySelector) {
            if (parent === document) {
                return document.querySelector(query);
            }
            var oldID = parent.id;
            parent.id = 'rooted' + (+new Date());
            try {
                return parent.querySelector('#' + parent.id + ' ' + query);
            }
            catch (e) {
                throw e;
            }
            finally {
                parent.id = oldID;
            }
        }
        else {
            return this.$$(query, parent)[0];
        }
    },

    $$: function (query, parent) {
        parent = parent || document;
        if (parent.querySelectorAll) {
            if (parent === document) {
                return document.querySelectorAll(query);
            }
            var oldID = parent.id;
            parent.id = 'rooted' + (++arguments.callee.counter);
            try {
                return parent.querySelectorAll('#' + parent.id + ' ' + query);
            } catch (e) {
                throw e;
            } finally {
                parent.id = oldID;
            }
        }
        else {
            if (!parent.push) {
                parent = [parent];
            }
            var regex = /\S+\s*/;
            var section = regex.exec(query);
            if (section) {
                var remain = query.slice(section[0].length);
                section = section[0].replace(/\s+$/, '');
                var result = [];
                var id;
                var tagName;
                var className;
                var level = section.split('.');

                if (level[0].charAt(0) === '#') {
                    id = level[0].slice(1);
                }
                else {
                    tagName = level[0];
                }

                if (level[1]) {
                    className = level[1];
                }

                for (var i = 0, len = parent.length ; i < len ; i++) {
                    var elem = parent[i];
                    var nodeList;
                    if (id) {
                        result.push(document.getElementById(id));
                        continue;
                    }
                    else if (tagName) {
                        nodeList = elem.getElementsByTagName(tagName);
                    }
                    if (className) {
                        if (!nodeList) {
                            nodeList = elem.getElementsByTagName('*');
                        }
                        var regexClassName = new RegExp('(^|\\s)' + className + '(\\s|$)');
                        for (i = 0, len = nodeList.length ; i < len ; i++) {
                            if (regexClassName.test(nodeList[i].className)) {
                                result.push(nodeList[i]);
                            }
                        }
                    }
                    else {
                        result = result.concat(dom.Tool.toArray(nodeList));
                    }
                }
                return this.$$(remain, result);
            }
            else {
                var obj = {};
                var a = [];
                for (var j = 0, jLen = parent.length ; j < jLen ; j++) {
                    var item = parent[j];
                    if (item.uniqueId === undefined) {
                        item.uniqueId = 1;
                        a.push(item);
                    }
                }
                for (j = 0, jLen = a.length ; j < jLen ; j++) {
                    a[j].uniqueId = undefined;
                }
                return a;
            }

        }
    }
}

dom.Event = {
    addEvent: function(node, event, fn) {
        if (node.addEventListener) {
            this.addEvent = function (node, event, fn) {
                node.addEventListener(event, fn, false);
            }
        }
        else if (node.attachEvent) {
            this.addEvent = function (node, event, fn) {
                node.attachEvent('on' + event, fn);
            }
        }

        this.addEvent(node, event, fn);
    },

    removeEvent: function(node, event, fn) {
        if (node.removeEventListener) {
            this.removeEvent = function (node, event, fn) {
                node.removeEventListener(event, fn, false);
            }
        }
        else if (node.detachEvent) {
            this.removeEvent = function (node, event, fn) {
                node.detachEvent('on' + event, fn);
            }
        }
        this.removeEvent(node, event, fn);
    },

    one: function (node, event, fn) {
        var self = this, fname = event + (+new Date());
        node[fname] = function () {
            self.removeEvent(node, event, node[fname]);
            node[fname] = null;
            fn.apply(this, arguments);
        };
        this.addEvent(node, event, node[fname]);
    },

    fix: function (evt) {
        if (!window.event) {
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

        return this.fix(evt);
    }
};

dom.Ajax = {
    createXMLHttpObject: function () {
        var XMLHttpFactories = [
            function () {return new XMLHttpRequest()},
            function () {return new ActiveXObject("Msxml2.XMLHTTP")},
            function () {return new ActiveXObject("Msxml3.XMLHTTP")},
            function () {return new ActiveXObject("Microsoft.XMLHTTP")}
        ];

        var xmlhttp = false, i, len;
        for (i = 0, len = XMLHttpFactories.length ; i < len ; i += 1) {
            try {
                xmlhttp = XMLHttpFactories[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }

        this.createXMLHttpObject = XMLHttpFactories[i];
        return xmlhttp;
    },

    stringify: function (parameters) {
        var params = [], p;
        for(p in parameters) {
            params.push(encodeURIComponent(p) + '=' + encodeURIComponent(parameters[p]));
        }
        return params.join('&');
    },

    httpSuccess: function (r) {
        try {
            // If no server status is provided, and we're actually
            // requesting a local file, then it was successful
            return !r.status && location.protocol == "file:" ||
                // Any status in the 200 range is good
                ( r.status >= 200 && r.status < 300 ) ||
                    // Successful if the document has not been modified
                    r.status == 304 ||
                        // Safari returns an empty status if the file has not been modified
                        navigator.userAgent.indexOf("Safari") >= 0 &&
                            typeof r.status == "undefined";
        } catch(e){}
        // If checking the status failed, then assume that the request failed too
        return false;
    }
}
