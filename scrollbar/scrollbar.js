/**
* Scrollbar
* This is a highly extensible scrollbar versus regular scrollbar.
* @author viclm
* @version 20110824.3
* @license New BSD License
*/

'use strict';

var dom = {};

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
        if (e && e['preventDefault']) {
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
            };
        }
        else {
            this.fix = function () {
                return {
                    pageX : window.event.clientX + document.body.scrollLeft,
                    pageY : window.event.clientY + document.body.scrollTop,
                    target : window.event.srcElement,
                    preventDefault : function () {
                        window.event.returnValue = false;
                    },
                    stopPropagation : function () {
                        window.event.cancelBubble = true;
                    }
                }
            };
        }

        return this.fix(e);
    }
};


dom.Tool = {
    extend: function (childCtor, parentCtor) {
        function tempCtor() {};
        tempCtor.prototype = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.$super = parentCtor.prototype;
        childCtor.prototype.constructor = childCtor;
    },

    proxy: function (fn, obj) {
        return function () {
            return fn.apply(obj, arguments);
        }
    }
};

function Scrollbar(args) {
	this.mode = args.mode || 'auto';
	this.prop = !args.direction || args.direction === 'vertical' ? 'top' : 'left';
	this.outline = document.getElementById(args.content);
	this.callback = args.callback || function () {};

	if (this.prop === 'top') {
		this.outlineSize = this.outline.clientHeight;
	}
	else {
		this.outlineSize = this.outline.clientWidth;
	}

	switch (this.mode) {
	case 'always':
		this.enable();
		break;
	case 'auto':
		if ( (this.prop === 'top' && this.outline.clientHeight < this.outline.children[0].scrollHeight) ||
			(this.prop === 'left' && this.outline.clientWidth < this.outline.children[0].scrollWidth) ) {
			this.enable();
		}
		break;
	}
}

Scrollbar.prototype.enable = function () {
	this.actualPos = 0;
	this.cursorPos = 0;
	this.handlePos = 0;
	this.contentPos = 0;

	this.content = this.getScrolledContent();
	this.createScrollbar();
	this.adjustHandleSize();

	this.MOUSEWHEEL_OFFSET = 120;

	dom.Event.add(this.handle, 'mousedown', dom.Tool.proxy(this.dragInit, this));

	if (/firefox/i.test(navigator.userAgent)) {
		this.outline.addEventListener('DOMMouseScroll', dom.Tool.proxy(function (e) {
			var offset;
			offset = (e.detail > 0 ? 1 : -1) * this.MOUSEWHEEL_OFFSET;
			this.actualPos = this.adjustPos(this.actualPos + offset, [0, this.contentSize]);
			this.isScrollHandle = true;
			this.scroll();
			e.preventDefault();
			return false;
		}, this), false);
	}
	else {
		dom.Event.add(this.outline, 'mousewheel', dom.Tool.proxy(function (e) {
			var event = dom.Event.fix(e), offset;
			offset = (e.wheelDelta > 0 ? -1 : 1) * this.MOUSEWHEEL_OFFSET;
			this.actualPos = this.adjustPos(this.actualPos + offset, [0, this.contentSize]);
			this.isScrollHandle = true;
			this.scroll();
			event.preventDefault();
			return false;
		}, this));
	}
}

Scrollbar.prototype.getScrolledContent = function () {
	var children = this.outline.children, content, i, len, tmp;
	if (children.length === 1) {
		content = children[0];
	}
	else {
		content = document.createElement('div');
		children = dom.Tool.toArray(this.outline.childNodes);
		for (i = 0, len = children.length ; i < len ; i += 1) {
			tmp = children[i];
			content.appendChild(tmp);
		}
		this.outline.appendChild(content);
	}

	if (content.style.position !== 'absolute') {
		content.style.cssText = 'position: relative; ' + this.prop + ': 0;';//bug init position
	}

	return content;
}

Scrollbar.prototype.createScrollbar = function () {
	this.path = document.createElement('div');
	this.path.className = 'scrollbar';
	this.path.style.cssText = 'position: absolute';

	this.handle = document.createElement('div');
	this.handle.className = 'handle';
	this.handle.style.cssText = 'position: absolute;';

	this.path.appendChild(this.handle);
	this.outline.appendChild(this.path);
}

Scrollbar.prototype.adjustHandleSize = function () {
	this.dragEnd();
	this.outline.style.overflow = '';
	if (this.prop === 'top') {
		this.contentSize = this.content.scrollHeight;
		this.content.style.height = this.contentSize + 'px';
    }
	else {
		this.contentSize = this.content.scrollWidth;
		this.content.style.width = this.contentSize + 'px';
	}
	this.contentSize -= this.outlineSize;

	var rate = this.outlineSize / (this.contentSize + this.outlineSize);
	this.pathSize = this.prop === 'top' ? this.path.clientHeight : this.path.clientWidth;
	this.handleSize = Math.floor(this.pathSize * rate);
	if (this.handleSize < 2) {
		this.handleSize = 2;
	}
	this.pathSize -= this.handleSize;
	this.rate = this.contentSize / this.pathSize;
	this.handle.style[this.prop === 'top' ? 'height' : 'width'] = this.handleSize + 'px';
	this.handlePos = Math.round(this.actualPos / this.rate);
	this.handle.style[this.prop] = this.handlePos + 'px';
	//console.log('this.actualPos='+this.actualPos, 'this.contentPos='+this.contentPos, 'this.contentSize='+this.contentSize, 'this.handlePos='+this.handlePos, 'this.handleSize='+this.handleSize)
	//this.actualPos = this.adjustPos(this.actualPos + offset, [0, this.contentSize]);
	//this.isScrollHandle = true;
	//this.scroll();
	//ie7 can't get the correct scrollHeight value when overflow property of parent element is set
	this.outline.style.overflow = 'hidden';
}

Scrollbar.prototype.adjustPos = function (pos, range) {
	var min = range[0] || 0, max = range[1];
	if (pos < min) {
		pos = min;
	}
	else if (pos > max) {
		pos = max;
	}
	return pos;
}

Scrollbar.prototype.scroll = function () {
	if (Math.abs(this.actualPos - this.contentPos) < 1) {
		return;
	}
	//remove inertance
	if ((this.actualPos - this.contentPos) * (Math.round(this.actualPos / this.rate)  - this.handlePos) < 0) {
		this.content.style[this.prop] = -this.actualPos + 'px';
		this.contentPos = this.actualPos;
		return;
	}
	if (!this.timer) {
		this.timer = setInterval(dom.Tool.proxy(function () {
			var pos = this.actualPos - this.contentPos, handlePos;
			if (Math.abs(pos) < 1) {
				this.callback(parseInt(this.actualPos / this.contentSize * 100, 10));
				clearInterval(this.timer);
				this.timer = null;
				return;
			}
			pos = this.contentPos + Math.ceil(Math.abs(pos * 0.1)) * (pos > 0 ? 1 : -1);
			pos = this.adjustPos(pos, [0, this.contentSize]);
			this.content.style[this.prop] = -pos + 'px';
			this.contentPos = pos;

			if (this.isScrollHandle) {
				handlePos = this.adjustPos(pos / this.rate, [0, this.pathSize]);
				this.handle.style[this.prop] = handlePos + 'px';
				this.handlePos = handlePos;
			}
		}, this), 4);
	}
}

Scrollbar.prototype.dragInit = function (e) {
	this.isScrollHandle = false;
	dom.Event.add(document, 'mousemove', this.dragOnProxy = dom.Tool.proxy(this.dragOn, this));
	dom.Event.one(document, 'mouseup', dom.Tool.proxy(this.dragEnd, this));
	e = dom.Event.fix(e);
	this.cursorPos = this.prop === 'top' ? e.pageY : e.pageX;
	e.preventDefault();
}

Scrollbar.prototype.dragOn = function (e) {
	e = dom.Event.fix(e);
	var self = this, pos = this.prop === 'top' ? e.pageY : e.pageX, offset;
	offset = pos - this.cursorPos;
	this.cursorPos = pos;

	offset += this.handlePos;
	offset = this.adjustPos(offset, [0, this.pathSize]);
	this.handle.style[this.prop] = offset + 'px';
	this.handlePos = offset;

	this.actualPos = this.adjustPos(Math.round(offset * this.rate), [0, this.contentSize]);

	this.scroll();
	e.preventDefault();
}

Scrollbar.prototype.dragEnd = function () {
	if (this.dragOnProxy) {
		dom.Event.remove(document, 'mousemove', this.dragOnProxy);
		this.dragOnProxy = null;
	}
}
