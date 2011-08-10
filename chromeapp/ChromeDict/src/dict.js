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

/******************************************************************************************************************************************************************
*******************************************************************************************************************************************************************
***************************************************************************** Dict ********************************************************************************
*******************************************************************************************************************************************************************
******************************************************************************************************************************************************************/

(function () {

    /**
    * Dict
    * @version 20110602.4
    *
    */
    function Dict (args) {
        args = args || {};
        this.scope = args.scope || document.body;
        this.hoverCapture = args.hoverCapture;
        this.dragCapture = args.dragCapture;
        this.hotKey = args.hotKey || null;
        this.assistKey = args.assistKey || null;
        this.speed = args.speed || 50;
        this.skin = args.skin || 'orange';
        this.ui = this.createUI();
        this.port = chrome.extension.connect({name: 'dict'});

        this.rHasWord = /\b[a-z]+([-'][a-z]+)*\b/i;
        this.rAllWord = /\b[a-z]+([-'][a-z]+)*\b/gmi;
        this.rSingleWord = /^[a-z]+([-'][a-z]+)*$/i;

        this.port.onMessage.addListener(dom.Tool.proxy(function (msg) {
            this.show(msg);
        }, this));

        this.hotKey && this.scope.addEventListener('keyup', this.hoverHanlderProxy = dom.Tool.proxy(this.hotKeyHandler, this), false);
        this.dragCapture && this.setDragCapture();
        this.hoverCapture && this.setHoverCapture();
    };

    Dict.prototype.setDragCapture = function () {
        if (this.dblclickProxy) {
            this.scope.removeEventListener('click', this.dblclickProxy, false);
            this.scope.removeEventListener('mousedown', this.dragStartProxy, false);
            this.dblclickProxy = null;
            this.dragStartProxy = null;
            this.ui.style.display = 'none';
            this.dragCapture = false;
        }
        else {
            this.scope.addEventListener('click', this.dblclickProxy = dom.Tool.proxy(this.dblclick, this), false);
            this.scope.addEventListener('mousedown', this.dragStartProxy = dom.Tool.proxy(this.dragStart, this), false);
            this.dragCapture = true;
        }
    };

    Dict.prototype.setHoverCapture = function () {
        if (this.hoverProxy) {
            this.scope.removeEventListener('mouseover', this.hoverProxy, false);
            this.hoverProxy = null;
            this.getMousePosProxy = null;
            this.ui.style.display = 'none';
            this.hoverCapture = false;
        }
        else {
            this.scope.addEventListener('mouseover', this.hoverProxy = dom.Tool.proxy(this.hoverTrigger, this), false);
            this.hoverCapture = true;
        }
    };

    Dict.prototype.hotKeyHandler = function (e) {
        var self = this;
        if (e.keyCode === this.hotKey.hover.keyCode && e.ctrlKey === this.hotKey.hover.ctrlKey
           && e.altKey === this.hotKey.hover.altKey && e.shiftKey === this.hotKey.hover.shiftKey && e.metaKey === this.hotKey.hover.metaKey) {
            this.setHoverCapture();
            this.port.postMessage({cmd: 'setCaptureMode', dragCapture: this.dragCapture, hoverCapture: this.hoverCapture});
        }
        else if (e.keyCode === this.hotKey.drag.keyCode && e.ctrlKey === this.hotKey.drag.ctrlKey
           && e.altKey === this.hotKey.drag.altKey && e.shiftKey === this.hotKey.drag.shiftKey && e.metaKey === this.hotKey.drag.metaKey) {
            this.setDragCapture();
            this.port.postMessage({cmd: 'setCaptureMode', dragCapture: this.dragCapture, hoverCapture: this.hoverCapture});
        }
    };

    Dict.prototype.dblclick = function (e) {
        if (e.detail > 1) {
            if (!this.assistKey || e.altKey === this.assistKey.altKey && e.ctrlKey === this.assistKey.ctrlKey) {
                this.capture(e);
            }
        }
        else if (this.endPos === null) {
            this.ui.style.display = 'none';
        }
    };

    Dict.prototype.dragStart = function (e) {
        var event = dom.Event.fix(e);
        dom.Event.one(document, 'mouseup', dom.Tool.proxy(this.dragEnd, this));
        this.startPos = event.pageX;
        this.endPos = null;
        this.onDrag = true;
    };

    Dict.prototype.dragEnd = function (e) {
        var event = dom.Event.fix(e);
        if (this.startPos !== event.pageX) {
            if (!this.assistKey || e.altKey === this.assistKey.altKey && e.ctrlKey === this.assistKey.ctrlKey) {
                this.endPos = event.pageX;
                this.capture(e);
            }
        }
        this.onDrag = false;
    };

    Dict.prototype.hoverTrigger = function (e) {

        if (this.onDrag) {
            return;
        }

        if (this.assistKey && (e.altKey !== this.assistKey.altKey || e.ctrlKey !== this.assistKey.ctrlKey)) {
            return;
        }

        if (this.timer === null) {
            this.hoverHanlder(e);
            return;
        }

        this.hoverX = e.pageX;
        this.hoverY = e.pageY;
        clearTimeout(this.timer);
        this.timer = setTimeout(dom.Tool.proxy(function () {
            if (this.hoverX === e.pageX && this.hoverY === e.pageY) {
                //this.timer = null;
                this.hoverHanlder(e);
            }
        }, this), this.speed * 20);
    };

    Dict.prototype.hoverHanlder = function (e) {
        this.text = null;
        this.timer = undefined;
        var parent = e.target, elems, wraper, i, len, elem, next;
        elems = parent.childNodes;
        if (elems.length === 1) {
            elem = elems[0];
            if (elem.nodeType === 3) {
                var text = elem.nodeValue;
                if (this.rSingleWord.test(text) && parent.resolve) {
                    this.text = elem.nodeValue;
                    this.handle(e);
                    this.node = parent;
                }
                else if (this.rHasWord.test(text)) {
                    text = text.replace(this.rAllWord, function (str) {
                        return '<bdo>' + str + '</bdo>';
                    });
                    this.timer = null;
                    parent.innerHTML = text;
                    elems = parent.getElementsByTagName('bdo');
                    for (i = 0, len = elems.length ; i < len ; i += 1) {
                        elems[i].resolve = true;
                    }
                }
            }
        }
        else if (!parent.resolve) {
            elems = Array.prototype.slice.call(elems, 0);
            this.timer = null;
            for (i = 0, len = elems.length ; i < len ; i += 1) {
                elem = elems[i];
                if (elem.nodeType === 3 && this.rHasWord.test(elem.nodeValue)) {
                    wraper = document.createElement('bdo');
                    parent.insertBefore(wraper, elem);
                    wraper.appendChild(elem);
                }
            }
        }
        parent.resolve = true;
        this.ui.style.display = 'none';
    };

    Dict.prototype.capture = function (e) {
        this.node = null;
        this.text = window.getSelection().toString();
        this.text = this.text.trim().replace(/^\W+$/, '').replace(/^\d+$/, '');
        if (this.text.length > 0) {
            this.x = e.pageX - (!this.endPos ? 0 : (this.endPos - this.startPos) / 2);
            this.y = e.pageY;
            this.fontSize = parseInt(getComputedStyle(e.target, null).getPropertyValue('font-size'), 10) * 1.2;
            this.handle(e);
        }
    };

    Dict.prototype.handle = function (e) {
        var data = {};
        if (this.text.length > 0) {
            data['cmd'] = 'query';
            data['w'] = this.text;
            this.port.postMessage(data);
        }
    };

    Dict.prototype.createUI = function () {};





    function DictSimple(args) {
        this.super.constructor.call(this, args);

        this.uiKey = this.ui.querySelector('h1');
        this.uiPs = this.ui.querySelector('header span');
        this.uiPronBtn = this.ui.querySelector('header canvas');
        this.uiPron = this.ui.querySelector('header audio');
        this.uiTrans = this.ui.querySelector('ul');
        this.uiTriangle = this.ui.querySelector('div:last-of-type');
    }

    dom.Tool.extend(DictSimple, Dict);

    DictSimple.prototype.createUI = function () {
        var aside = document.createElement('aside'), header, uiPronBtn, uiPron, triangle;
        aside.id = 'dict-viclm-simple';
        aside.className = this.skin;

        header = document.createElement('header');
        header.appendChild(document.createElement('h1'));
        header.appendChild(document.createElement('span'));
        uiPronBtn = this.drawAlert(300, 300);
        uiPronBtn.style.cssText = 'width: 12px; height: 12px;';
        header.appendChild(uiPronBtn);
        uiPron = document.createElement('audio');
        header.appendChild(uiPron);
        uiPronBtn.addEventListener('click', function () {
            uiPron.play();
        }, false);
        aside.appendChild(header);

        aside.appendChild(document.createElement('ul'));

        triangle = document.createElement('div');
        triangle.className = 'down';
        aside.appendChild(triangle);

        document.body.appendChild(aside);
        aside.style.display = 'none';
        aside.addEventListener('mousedown', this.eventClear, false);
        aside.addEventListener('mouseover', this.eventClear, false);
        aside.addEventListener('mouseup', this.eventClear, false);
        aside.addEventListener('click', this.eventClear, false);
        return aside;
    };

    DictSimple.prototype.drawAlert = function (w, h) {
        var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        canvas.width = w;
        canvas.height = h;
        ctx.beginPath();
        ctx.fillStyle = '#000';

        ctx.moveTo(26, 71);
        ctx.lineTo(84, 71);
        ctx.lineTo(177, 0);
        ctx.lineTo(177, 300);
        ctx.lineTo(84, 229);
        ctx.lineTo(26, 229);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = '#000';

        ctx.moveTo(222, 76);
        ctx.lineTo(236, 63);
        ctx.bezierCurveTo(272, 93, 296, 186, 234, 247);
        ctx.lineTo(220, 234);
        ctx.bezierCurveTo(253, 202, 270, 131, 222, 76);
        ctx.closePath();
        ctx.fill();
        return canvas;
    };

    DictSimple.prototype.eventClear = function (e) {
        e.stopPropagation();
    };

    DictSimple.prototype.show = function (data) {
        var i, len, item, ul, li;
        if (data.key === this.text && 'tt' in data) {
            this.uiKey.innerHTML = this.text;
            this.uiPs.innerHTML = data.ps === '' ? '' : '[' + data.ps + ']';
            this.uiPron.src = data.pron;
            this.uiPronBtn.style.display = data.pron === '' ?  'none' : '';
            this.uiTrans.innerHTML = '';

            for (i = 0, len = data.tt.length ; i < len ; i += 1) {
                item = data.tt[i];
                li = document.createElement('li');
                li.innerHTML = item.pos + ' ' + item.acceptation;
                this.uiTrans.appendChild(li);
            }

            this.ui.style.display = '';
            this.position();
        }
    };

    DictSimple.prototype.position = function () {
        this.ui.style.left = 0 + 'px';
        this.ui.style.top = 0 + 'px';
        var left, top, triangleLeft, triangleClass, clientRectForUI, clientRectForNode;
        clientRectForUI = this.ui.getBoundingClientRect();

        if (this.node) {
            clientRectForNode = this.node.getBoundingClientRect();
            this.x = clientRectForNode.left + document.body.scrollLeft;
            this.y = clientRectForNode.top + document.body.scrollTop;
            left = this.x - (clientRectForUI.width  - clientRectForNode.width) / 2;
            top = this.y - clientRectForUI.height;
        }
        else {
            left = this.x - clientRectForUI.width / 2;
            top = this.y - clientRectForUI.height - 6 - this.fontSize / 2;
        }

        if (left - document.body.scrollLeft < 0) {
            left = document.body.scrollLeft;
            triangleLeft = this.node ? clientRectForNode.right - 18 : this.x - document.body.scrollLeft;
        }
        else if (left + clientRectForUI.width > document.body.clientWidth + document.body.scrollLeft) {
            left = document.body.clientWidth + document.body.scrollLeft - clientRectForUI.width;
            triangleLeft = this.x - left + 6;
        }
        else {
            triangleLeft = clientRectForUI.width / 2 - 6;
        }

        if (top - document.body.scrollTop < 0) {
            top = this.node ? this.y + clientRectForNode.height : this.y + this.fontSize / 2;
            triangleClass = 'up';
        }
        else {
            triangleClass = 'down';
        }
        this.ui.style.left = left + 'px';
        this.ui.style.top = top + 'px';
        this.uiTriangle.style.left = triangleLeft + 'px';
        this.uiTriangle.className = triangleClass;
    };

    var dict;
    //document.addEventListener('DOMContentLoaded', initDict, false);

    chrome.extension.sendRequest({cmd: 'config'}, function (response) {
        dict = new DictSimple({
            hotKey: response.hotKey,
            assistKey: response.assistKey,
            speed: response.speed,
            skin: response.skin,
            hoverCapture: response.hoverCapture,
            dragCapture: response.dragCapture
        });
    });

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (dict && request.cmd === 'setCaptureMode') {
            request.hoverCapture !== dict.hoverCapture && dict.setHoverCapture();
            request.dragCapture !== dict.dragCapture && dict.setDragCapture();
        }
    });

})();
