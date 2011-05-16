'use strict';
var dom = {

    query: function (query, parent) {
        parent = parent || document;
        if (!parent.querySelector) {
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
            return this.queryAll(query, parent)[0];
        }
    },

    queryAll: function (query, parent) {
        parent = parent || document;
        if (typeof parent.querySelectorAll == 'function') {
            if (parent === document) {
                return document.querySelectorAll(query);
            }
            var oldID = parent.id;
            parent.id = 'rooted' + (+new Date());
            try {
                return parent.querySelectorAll('#' + parent.id + ' ' + query);
            }
            catch (e) {
                throw e;
            }
            finally {
                parent.id = oldID;
            }
        }
        else {
            if (!parent.push) {
                parent = [parent];
            }
            var regex = /^\S+\s*/;
            var section = regex.exec(query);
            if (section) {
                var remain = query.slice(section[0].length);
                section = section[0].replace(/\s+$/, '');
                var result = [];
                var id;
                var tagName;
                var className;
                var level = section.split('.');

                if (level[0][0] === '#') {
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
                        result = result.concat(Array.prototype.slice.call(nodeList, 0));
                    }
                }
                return arguments.callee(remain, result);
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

    proxy: function (fn, obj) {
        return function () {
            return fn.apply(obj, arguments);
        }
    },

    addEvent: (function() {
        if (document.body.addEventListener) {
            return function (node, event, fn) {
                node.addEventListener(event, fn, false);
            }
        }
        else if (document.body.attachEvent) {
            return function (node, event, fn) {
                node.attachEvent('on' + event, fn);
            }
        }
    })(),

    removeEvent: (function() {
        if (document.body.removeEventListener) {
            return function (node, event, fn) {
                node.removeEventListener(event, fn, false);
            }
        }
        else if (document.body.detachEvent) {
            return function (node, event, fn) {
                node.detachEvent('on' + event, fn);
            }
        }
    })(),

    one: function (node, event, fn) {
        var self = this, fname = event + (+new Date());
        node[fname] = function () {
            self.removeEvent(node, event, node[fname]);
            node[fname] = null;
            fn.apply(this, arguments);
        };
        this.addEvent(node, event, node[fname]);
    },

    event: function (evt) {
        if (evt) {
            this.event = function (e) {
                return {
                    value : e,
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
            this.event = function () {
                return {
                    value : window.event,
                    pageX : this.value.clientX + document.body.scrollLeft,
                    pageY : this.value.clientY + document.body.scrollTop,
                    target : this.value.srcElement,
                    preventDefault : function () {
                        this.value.returnValue = false;
                    },
                    stopPropagation : function () {
                        this.value.cancelBubble = true;
                    }
                }
            }
        }

        return this.event(evt);
    }
}


/**
  * @constructor Animate
  * @param {HTMLElement} el the element we want to animate
  * @param {String} prop the CSS property we will be animating
  * @param {Object} opts a configuration object
  * object properties include
  * from {Int}
  * to {Int}
  * time {Int} time in milliseconds
  * callback {Function}
  */

function Animate(el, prop, opts) {
  this.el = el;
  this.prop = prop;
  this.from = opts.from;
  this.to = opts.to;
  this.time = opts.time;
  this.callback = opts.callback;
  this.animDiff = this.to - this.from;
}

/**
  * @private
  * @param {String} val the CSS value we will set on the property
  */

Animate.prototype._setStyle = function(val) {
  switch (this.prop) {
    case 'opacity':
      this.el.style[this.prop] = val;
      this.el.style.filter = 'alpha(opacity=' + val * 100 + ')';
      break;
    default:
      this.el.style[this.prop] = val + 'px';
      break;
  };
};

/**
  * @private
  * this is the tweening function
  */
Animate.prototype._animate = function() {
  var that = this;
  this.now = new Date();
  this.diff = this.now - this.startTime;

  if (this.diff > this.time) {
    this.stop(true);
    return;

  }
  this.percentage = (Math.floor((this.diff / this.time) * 100) / 100);
  this.val = (this.animDiff * this.percentage) + this.from;
  this._setStyle(this.val);
};

/**
  * @public
  * begins the animation
  */
Animate.prototype.start = function() {
    if (this.timer) {
        return;
    }
  var that = this;
  this.startTime = new Date();
  this.animating = true;
  this.timer = setInterval(function() {
    that._animate.call(that);
  }, 4);
}

Animate.prototype.stop = function (jumpToEnd) {
    if (jumpToEnd) {
        this._setStyle(this.to);
    }

    if (this.callback) {
        this.callback.call(this);
    }

    clearInterval(this.timer);
    this.timer = null;
    this.animating = false;
}

/**

  * @static
  * @boolean
  * allows us to check if native CSS transitions are possible
  */

Animate.canTransition = function() {
  var el = document.createElement('foo');
  el.style.cssText = '-webkit-transition: all .5s linear;';
  return !!el.style.webkitTransitionProperty;
}();

