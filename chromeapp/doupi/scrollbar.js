/**
 * Scrollbar
 * This is a highly extensible scrollbar versus regular scrollbar.
 * @author viclm
 * @version 2.1 20110420
 * @license New BSD License
*/

'use strict';

Class('Scrollbar', {

    init: function (args) {
        this.mode = args.mode || 'auto';
        this.prop = !args.direction || args.direction === 'vertical' ? 'top' : 'left';
        this.outline = dom.query(args.content);
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
        this.cursorPos = 0;
        this.handlePos = 0;
        this.contentPos = 0;

        this.outline.style.overflow = 'hidden';
        this.content = this.getScrolledContent();
        this.createScrollbar();
        this.adjustHandleSize();

        dom.addEvent(this.handle, 'mousedown', dom.proxy(this.dragInit, this));

        var self = this, offset;
        if (/firefox/i.test(navigator.userAgent)) {
            this.content.addEventListener('DOMMouseScroll', dom.proxy(function (e) {
                offset = Math.abs(Math.floor((this.pathSize + this.handleSize) * 120 / (this.contentSize + this.outlineSize)));
                offset *= e.detail > 0 ? 1 : -1;
                this.scroll(offset);
                e.preventDefault();
                return false;
            }, this), false);
        }
        else {
            dom.addEvent(this.content, 'mousewheel', dom.proxy(function (e) {
                var event = dom.event(e);
                offset = Math.abs(Math.floor((this.pathSize + this.handleSize) * 120 / (this.contentSize + this.outlineSize)));
                offset *= e.wheelDelta > 0 ? -1 : 1;
                this.scroll(offset);
                event.preventDefault();
                return false;
            }, this));
        }
    },

    getScrolledContent: function () {
        var children = this.outline.children, content, i, len, tmp;
        if (children.length === 1) {
            content = children[0];
        }
        else {
            content = document.createElement('div');
            children = Array.prototype.slice.call(this.outline.childNodes, 0);
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
        this.contentSize = this.prop === 'top' ? this.content.scrollHeight : this.content.scrollWidth;
        this.contentSize -= this.outlineSize;

        var rate = this.outlineSize / (this.contentSize + this.outlineSize);
        this.pathSize = this.prop === 'top' ? this.path.clientHeight : this.path.clientWidth;
        this.handleSize = Math.floor(this.pathSize * rate);
        if (this.handleSize < 2) {
            this.handleSize = 2;
        }
        this.pathSize -= this.handleSize;
        this.handle.style[this.prop === 'top' ? 'height' : 'width'] = this.handleSize + 'px';
    },

    scroll: function (offset) {
        var pos = this.handlePos + offset;
        if (pos < 0) {
            pos = 0;
        }
        else if (pos > this.pathSize) {
            pos = this.pathSize;
        }
        this.handle.style[this.prop] = pos + 'px';
        this.handlePos = pos;

        if (!this.timer) {
            this.timer = setInterval(dom.proxy(function () {
                var targetPos = this.handlePos / this.pathSize * this.contentSize, pos;
                pos = (targetPos - this.contentPos);
                if (Math.abs(pos) < 1) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                pos = this.contentPos + Math.ceil(Math.abs(pos * 0.1)) * (pos > 0 ? 1 : -1);
                if (pos < 0) {
                    pos = 0;
                }
                else if (pos > this.contentSize) {
                    pos = this.contentSize;
                }
                this.content.style[this.prop] = -pos + 'px';
                this.contentPos = pos;
            }, this), 24);
        }

        this.callback(this.pathSize === 0 ? 100 : Math.floor(this.handlePos / this.pathSize * 100));
    },

    dragInit: function (e) {
        dom.addEvent(document, 'mousemove', document['dragOn'] = dom.proxy(this.dragOn, this));
        dom.one(document, 'mouseup', dom.proxy(this.dragEnd, this));
        e = dom.event(e);
        this.cursorPos = this.prop === 'top' ? e.pageY : e.pageX;
        e.preventDefault();
    },

    dragOn: function (e) {
        e = dom.event(e);
        var self = this, pos = this.prop === 'top' ? e.pageY : e.pageX, offset;
        offset = pos - this.cursorPos;
        this.cursorPos = pos;
        this.scroll(offset);
        e.preventDefault();
    },

    dragEnd: function () {
        dom.removeEvent(document, 'mousemove', document['dragOn']);
        document['dragOn'] = undefined;
    },

    show: function () {
        this.path.style.display = '';
    },

    hide: function () {
        this.path.style.display = 'none';
    },
});

