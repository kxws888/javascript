/**
 * dom.js
 * It's a light library only contains several methods which are used most in the development.
 * @author viclm
 * @version 20110527.5
 * @license New BSD License
*/
'use strict';
var dom = {};
/**
 * tool function
*/
dom.Tool = {
    extend: function (childCtor, parentCtor) {
        function tempCtor() {};
        tempCtor.prototype = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.super = parentCtor.prototype;
        childCtor.prototype.constructor = childCtor;
    },

    proxy: function (fn, obj) {
        return function () {
            return fn.apply(obj, arguments);
        }
    },

    trim: function (str) {
        if (str.trim) {
            return str.trim();
        }
        else {
            return str.replace(/^\s+|\s+$/, '');
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
    },

    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    tmpl: (function(){
      var cache = {};

      return function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            tmpl(document.getElementById(str).innerHTML) :

          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
      };
    })()
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

    one: function (query, parent) {
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

    all: function (query, parent) {
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
    },

    prev: function (node) {
        while (node = node.previousSibling) {
            if (node.nodeType === 1) {
                return node;
            }
        }
        return null;
    },

    next: function (node) {
        while (node = node.nextSibling) {
            if (node.nodeType === 1) {
                return node;
            }
        }
        return null;
    }
}

dom.Event = {
    add: function(node, event, fn) {
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
    },

    remove: function(node, event, fn) {
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
    },

    one: function (node, event, fn) {
        var self = this, fname = event + (+new Date());
        node[fname] = function () {
            self.remove(node, event, node[fname]);
            node[fname] = null;
            fn.apply(this, arguments);
        };
        this.add(node, event, node[fname]);
    },

    fix: function (e) {
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

//(function () {

    /**
    * Wordcapture
    * @version 20110525.3
    *
    */
    function Wordcapture (args) {
        this.scope = args && args.scope || document.body;
        this.hoverCapture  = args && args.hoverCapture || true;
        //this.direct add feature verticle direct word

        this.hoverEvent = document.createEvent('MouseEvents');
    }


    Wordcapture.prototype.enable = function () {
        dom.Event.add(this.scope, 'click', this.dblclickProxy = dom.Tool.proxy(this.dblclick, this));
        dom.Event.add(this.scope, 'mousedown', this.dragStartProxy = dom.Tool.proxy(this.dragStart, this));
        if (this.hoverCapture) {
            dom.Event.add(this.scope, 'mouseover', this.hoverProxy = dom.Tool.proxy(this.hover, this));
            this.time = +new Date();
        }
    };

    Wordcapture.prototype.disable = function () {
        dom.Event.remove(this.scope, 'click', this.dblclickProxy);
        dom.Event.remove(this.scope, 'mousedown', this.dragStartProxy);
    };

    Wordcapture.prototype.dblclick = function (e) {
        if (e.detail > 1) {
            this.capture(e);
        }
    };

    Wordcapture.prototype.dragStart = function (e) {
        var event = dom.Event.fix(e);
        dom.Event.one(document, 'mouseup', dom.Tool.proxy(this.dragEnd, this));
        this.startPos = event.pageX;
        this.endPos = null;
    };

    Wordcapture.prototype.dragEnd = function (e) {
        var event = dom.Event.fix(e);
        if (this.startPos !== event.pageX) {
            this.endPos = event.pageX;
            this.capture(e);
        }
    };

    Wordcapture.prototype.hover = function (e) {
        var x = e.pageX, y = e.pageY;
        this.x = x;
        this.y = y;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(dom.Tool.proxy(function () {
            if (x === this.x && y === this.y) {
                var parent = e.target, elems, wraper, i, len, elem, next;
                elems = parent.childNodes;
                if (elems.length === 1) {
                    elem = elems[0];
                    if (elem.nodeType === 3) {
                        var text = elem.nodeValue.split(/\s+/);//fixed
                    }
                }
                elems = dom.Tool.toArray(elems);
                for (i = 0, len = elems.length ; i < len ; i += 1) {
                    elem = elems[i];
                    if (elem.nodeType === 3) {
                        wraper = document.createElement('span');
                        parent.insertBefore(wraper, elem);
                        wraper.appendChild(elem);
                    }
                    else {
                        wraper = elem;
                    }

                    if (wraper.offsetLeft < e.clientX) {
                        next = wraper;
                    }
                }
                this.hoverEvent.initMouseEvent('mouseover', true, false,
                    e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY,
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
                next.dispatchEvent(this.hoverEvent);
            }
            this.timer = null;
        }, this), 1000);
    };

    Wordcapture.prototype.hoverPos = function (e) {
    
    }

    Wordcapture.prototype.capture = function (e) {
        var css = getComputedStyle(e.target, null), lineHeight;
        this.text = dom.Tool.trim(window.getSelection().toString());
        this.text = this.text.replace(/^\W$/, '');
        if (this.text.length > 0) {
            this.x = e.pageX - (this.endPos === null ? 0 : (this.endPos - this.startPos) / 2);
            this.y = e.pageY;
            lineHeight = parseInt(css.getPropertyValue('line-height'));
            if (isNaN(lineHeight)) {
                lineHeight = parseInt(css.getPropertyValue('font-size'), 10) * 1.2;
            }

            this.fontSize = lineHeight;
        }
    };




    function Dict(args) {
        this.super.constructor.call(this, args);
        this.port = chrome.extension.connect({name: "query"});
        this.uiSimple = this.createUISimple();

        this.port.onMessage.addListener(dom.Tool.proxy(this.show, this));

    }

    dom.Tool.extend(Dict, Wordcapture);

    Dict.prototype.dblclick = function (e) {
        if (e.detail <= 1 && this.endPos === null) {
            this.uiSimple.style.display = 'none';
        }
        else {
            this.super.dblclick.call(this, e);
        }
    };

    Dict.prototype.capture = function (e) {
        var data = {};
        this.super.capture.call(this, e);
        if (this.text.length > 0) {
            data['w'] = this.text;
            this.port.postMessage(data);

            this.uiSimple.querySelector('h1').innerHTML = this.text;
            this.uiSimple.querySelector('header span').innerHTML = '';
            this.uiSimple.querySelector('ul').innerHTML = '正在翻译中';
            this.uiSimple.style.display = '';

            this.position();
        }
    };

    Dict.prototype.show = function (data) {
        var i, len, item, ul, li;

        if (data.key !== this.text) {
            return;
        }

        if (!data.result) {
            this.uiSimple.querySelector('ul').innerHTML = '翻译出错';
        }

        if ('tt' in data) {
            this.uiSimple.querySelector('header span').innerHTML = data.ps === '' ? '' : '[' + data.ps + ']';
            ul = this.uiSimple.querySelector('ul');
            ul.innerHTML = '';

            for (i = 0, len = data.tt.length ; i < len ; i += 1) {
                item = data.tt[i];
                li = document.createElement('li');
                li.innerHTML = item.pos + ' ' + item.acceptation;
                ul.appendChild(li);
            }

            this.position();
        }
        else {
            this.uiSimple.querySelector('ul').innerHTML = '没有翻译结果';
        }
    };

    Dict.prototype.position = function () {
        var left, top, triangle;
        left = this.x - this.uiSimple.offsetWidth / 2;
        top = this.y - this.uiSimple.offsetHeight - 8 - this.fontSize / 2;
        triangle = this.uiSimple.querySelector('div:last-of-type');
        if (left - document.body.scrollLeft < 0) {
            left = this.x;
            triangle.style.left = '6px';
        }
        else {
            triangle.style.left = this.uiSimple.offsetWidth / 2 - 6 + 'px';
        }

        if (top - document.body.scrollTop < 0) {
            top = this.y + this.fontSize / 2;
            triangle.className = 'up';
        }
        else {
            triangle.className = 'down';
        }
        this.uiSimple.style.left = left + 'px';
        this.uiSimple.style.top = top + 'px';
    };

    Dict.prototype.createUISimple = function () {
        var aside = document.createElement('aside'), header, triangle;
        aside.id = 'dict-viclm-simple';

        header = document.createElement('header');
        header.appendChild(document.createElement('h1'));
        header.appendChild(document.createElement('span'));
        aside.appendChild(header);

        aside.appendChild(document.createElement('ul'));

        triangle = document.createElement('div');
        triangle.className = 'down';
        aside.appendChild(triangle);

        document.body.appendChild(aside);
        aside.style.display = 'none';
        return aside;
    };

    var dict = new Dict();
    dict.enable();
    //document.addEventListener('DOMContentLoaded', initDict, false);

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        request.cmd ? dict.enable() : dict.disable();
    });

//})();
