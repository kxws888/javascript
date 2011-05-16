/**
 * Scrollbar
 * 
 * @author viclm
 * @version 2.0
*/

'use strict';

Class('Scrollbar', {

    init: function (args) {
        this.mode = args.mode || 'auto';
        this.prop = !args.direction || args.direction === 'vertical' ? 'top' : 'left';
        this.outline = dom.query(args.content);
        this.content = this.getScrolledContent();

        switch (this.mode) {
        case 'always':
        case 'auto':
            if ( (this.prop === 'top' && this.content.clientHeight < this.content.scrollHeight) ||
                (this.prop === 'left' && this.content.clientWidth < this.content.scrollWidth) ) {
                this.show();
            }
            this.enable();
            break;
        }
    },

    createScrollbar: function () {
        this.path = document.createElement('div');
        this.path.className = 'scrollbar';
        this.path.style.cssText = 'position: absolute';

        this.handle = document.createElement('div');
        this.handle.className = 'handle';
        this.handle.style.cssText = 'position: absolute; ' + this.prop + ': 0;';

        this.path.appendChild(this.handle);
        this.outline.appendChild(this.path);
    },

    getScrolledContent: function () {
        var children = this.outline.children, content;
        if (children.length === 1) {
            content = children[0];
        }
        else {
            content = document.createElement('div');
            content.innerHTML = this.outline.innerHTML;
            this.outline.innerHTML = '';
            this.outline.appendChild(content);
        }

        if (content.style.position !== 'absolute') {
            content.style.cssText = 'position: relative; ' + this.prop + ': 0;';//bug init position
        }

        return content;
    },

    adjustHandleSize: function () {
        var rate = this.outlineSize / (this.contentSize + this.outlineSize);
        this.handleSize = this.pathSize * rate;
        if (this.handleSize < 10) {
            this.handleSize = 10;
        }
        this.pathSize -= this.handleSize;
        this.handle.style[this.prop === 'top' ? 'height' : 'width'] = this.handleSize + 'px';
    },

    enable: function () {
        this.outline.style.overflow = 'hidden';
        this.createScrollbar();
        if (this.prop === 'top') {
            this.outlineSize = this.outline.clientHeight;
            this.contentSize = this.content.scrollHeight;
            this.pathSize = this.path.clientHeight;
        }
        else {
            this.outlineSize = this.outlineSize.clientWidth;
            this.contentSize = this.content.scrollWidth;
            this.pathSize = this.path.clientWidth;
        }
        this.contentSize -= this.outlineSize;
        this.adjustHandleSize();

        this.timer = null;
        this.cursorPos = 0;
        this.handlePos = 0;
        this.contentPos = 0;
        dom.addEvent(this.handle, 'mousedown', dom.proxy(this.dragInit, this));

        var self = this, offset = (this.pathSize + this.handleSize) * 120 / Math.ceil( (this.contentSize + this.outlineSize) );
        if (/firefox/i.test(navigator.userAgent)) {
            this.content.addEventListener('DOMMouseScroll', function (e) {
                offset = Math.abs(offset);
                offset *= e.detail > 0 ? 1 : -1;
                self.scroll(offset);
                e.preventDefault();
                return false;
            }, false);
        }
        else {
            dom.addEvent(this.content, 'mousewheel', function (e) {
                event = dom.event(e);
                offset = Math.abs(offset);
                offset *= e.wheelDelta > 0 ? -1 : 1;
                self.scroll(offset);
                event.preventDefault();
                return false;
            });
        }
    },

    scroll: function (offset) {
        //console.log(new Date(), offset)
        var pos = this.handlePos + offset, self = this;
        if (pos < 0) {
            pos = 0;
        }
        else if (pos > this.pathSize) {
            pos = this.pathSize;
        }
        this.handle.style[this.prop] = pos + 'px';
        this.handlePos = pos;
        this.scrollContent(offset);
    },

    scrollContent: function (offset) {
        var offset = this.handlePos / (this.handleSize + this.pathSize) * (this.outlineSize + this.contentSize);console.log('offset', this.contentSize)
        var pos = this.contentPos + offset, self = this;
        if (pos < 0) {
            pos = 0;
        }
        else if (pos > this.contentSize){
            pos = this.contentSize;
        }
        if (!this.timer) {
            var time = 250;
            this.timer = setTimeout(function () {
                self.animate(self.content, self.prop, self.contentPos, pos, time, function () {
                    self.timer = null;
                    self.contentPos = pos;
                });
            }, time);
        }
/*
        this.animate(this.content, this.prop, this.contentPos, pos, 50, function () {
            self.timer = null;
            self.contentPos = pos;
        });*/
    },

    disable: function () {
    
    },

    dragInit: function (e) {
        dom.addEvent(document, 'mousemove', document['dragOn'] = dom.proxy(this.dragOn, this));
        dom.one(document, 'mouseup', dom.proxy(this.dragEnd, this));
        e = dom.event(e);
        this.cursorPos = this.prop === 'top' ? e.pageY : e.pageX;
        this.cursorStop = this.handlePos;
        this.dragTimer = null;
        e.preventDefault();
    },

    dragOn: function (e) {
        e = dom.event(e);
        var self = this, pos = this.prop === 'top' ? e.pageY : e.pageX, offset;
        offset = pos - this.cursorPos;
        this.cursorPos = pos;
        this.scroll(offset);
        /*
        this.moveDiff += offset;
        clearTimeout(this.dragTimer);
        this.dragTimer = setTimeout(function () {console.log('moveDiff', self.handlePos - self.cursorStop)
            self.scrollContent(self.handlePos - self.cursorStop);
            self.cursorStop = self.handlePos;
        }, 50);*/
    },

    dragEnd: function () {
        dom.removeEvent(document, 'mousemove', document['dragOn']);
        document['dragOn'] = undefined;
    },

    _animate: function (node, prop, from, to, time, callback) {
        if (Math.abs(from - to) < 5) {
            node.style[prop] = -to + 'px';
            callback();
            return;
        }
        var start = new Date();
        var speed = Math.ceil((to - from) / 100);
        if (speed === 0) {
            speed = to - from > 0 ? 1 : -1;
        }
        (function tween() {
            if (Math.abs(from - to) <= Math.abs(speed)) {
                node.style[prop] = -to + 'px';
                callback();
                return;
            }
            from += speed;
            node.style[prop] = -from + 'px';
            setTimeout(tween, 0);
        })();
    },

    animate: function (node, prop, from, to, time, callback) {
        console.log(new Date(), 'animate begins', from, to, time)
        if (Math.abs(from - to) < 5) {
            node.style[prop] = -to + 'px';
            callback();
            return;
        }
        var start = new Date(), diff;
        (function tween() {
            diff = new Date() - start;
            if (diff > time) {
                node.style[prop] = -to + 'px';
                callback();
                console.log(new Date(), 'animate ends')
                return;
            }
            node.style[prop] = -(diff / time * (to - from) + from) + 'px';
            setTimeout(tween, 4);
        })();
    }
});
