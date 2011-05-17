/**
 * Scrollbar
 * This is a highly extensible scrollbar versus regular scrollbar.
 * @author viclm
 * @version 20110517.2
 * @license New BSD License
*/

'use strict';

dom.Class('Scrollbar', {

    init: function (args) {
        this.mode = args.mode || 'auto';
        this.prop = !args.direction || args.direction === 'vertical' ? 'top' : 'left';
        this.outline = dom.Query.$(args.content);
        this.callback = args.callback || function () {};

        if (this.prop === 'top') {
            this.outlineSize = this.outline.clientHeight;
        }
        else {
            this.outlineSize = this.outlineSize.clientWidth;
        }

        switch (this.mode) {
        case 'always':
            this.enable();
            break;
        case 'auto':
            if ( (this.prop === 'top' && this.outline.clientHeight < this.outline.scrollHeight) ||
                (this.prop === 'left' && this.outline.clientWidth < this.outline.scrollWidth) ) {
                this.enable();
            }
            break;
        }
    },

    enable: function () {
        this.actualPos = 0;
        this.cursorPos = 0;
        this.handlePos = 0;
        this.contentPos = 0;

        this.content = this.getScrolledContent();
        this.createScrollbar();
        this.adjustHandleSize();

        this.MOUSEWHEEL_OFFSET = 120;

        dom.Event.addEvent(this.handle, 'mousedown', dom.Tool.proxy(this.dragInit, this));

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
            dom.Event.addEvent(this.outline, 'mousewheel', dom.Tool.proxy(function (e) {
                var event = dom.Event.fix(e), offset;
                offset = (e.wheelDelta > 0 ? -1 : 1) * this.MOUSEWHEEL_OFFSET;
                this.actualPos = this.adjustPos(this.actualPos + offset, [0, this.contentSize]);
                this.isScrollHandle = true;
                this.scroll();
                event.preventDefault();
                return false;
            }, this));
        }
        //ie7 can't get the correct scrollHeight value when overflow property of parent element is set
        this.outline.style.overflow = 'hidden';
    },

    getScrolledContent: function () {
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
    },

    createScrollbar: function () {
        this.path = document.createElement('div');
        this.path.className = 'scrollbar';
        this.path.style.cssText = 'position: absolute';

        this.handle = document.createElement('div');
        this.handle.className = 'handle';
        this.handle.style.cssText = 'position: absolute;';

        this.path.appendChild(this.handle);
        this.outline.appendChild(this.path);
    },

    adjustHandleSize: function () {
        this.dragEnd();
        this.contentSize = this.prop === 'top' ? this.content.scrollHeight : this.content.scrollWidth;
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
    },

    adjustPos: function (pos, range) {
        var min = range[0] || 0, max = range[1];
        if (pos < min) {
            pos = min;
        }
        else if (pos > max) {
            pos = max;
        }
        return pos;
    },

    scroll: function () {
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
    },

    dragInit: function (e) {
        this.isScrollHandle = false;
        dom.Event.addEvent(document, 'mousemove', this.dragOnProxy = dom.Tool.proxy(this.dragOn, this));
        dom.Event.one(document, 'mouseup', dom.Tool.proxy(this.dragEnd, this));
        e = dom.Event.fix(e);
        this.cursorPos = this.prop === 'top' ? e.pageY : e.pageX;
        e.preventDefault();
    },

    dragOn: function (e) {
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
    },

    dragEnd: function () {
        dom.Event.removeEvent(document, 'mousemove', this.dragOnProxy);
        this.dragOnProxy = null;
    }
});

