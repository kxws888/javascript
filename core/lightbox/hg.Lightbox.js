(function ($) {
    'use strict';
    /**
     * @name hg.Lightbox
     * @author nhnst liuming
     * @description Lightbox is simple script to display content in a modal dialog, pass the content for pupup to the "box" arguments, and config other arguments to meet specific needs
     * @version 20110610.5
     * @param {Var} box A cssQuery string, dom object or jQuery object which is for operation
     * @param {Boolean} draggable Anable drag
     * @param {Boolean} exclusive Attach a big enough background to make all the content except the lightbox non-interactive
     * @param {String} maskClass When exclusive is set to true, specify a class for style in CSS
    */
    $.Class("hg.Lightbox", {
        init : function (args) {
            this.box = '';
            this.draggable = true;
            this.exclusive = true;

            $.extend(this, args);

            if (!this.box) {
                throw 'must specify an object';
            }
            this.box = $(this.box);
            this.box.css('position', 'fixed');

            if (this.exclusive) {
                this.mask = $('<div>');
                this.mask.css({
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: $(document).height(),
                    display: 'none',
                    zIndex: '99999'
                });
                try {
                    this.mask.css('backgroundColor', 'rgba(0,0,0,0.7)');
                }
                catch (e) {
                    this.mask.css({
                        background: 'transparent',
                        filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr=#70000000,endColorstr=#70000000)',
                        zoom: 1
                    })
                }
                this.mask.append(this.box);
                this.mask.appendTo('body');
                this.box.show();
            }
            else {
                this.box.css('z-index', '99999');
                this.box.hide();
            }

            this.mask ? this.mask.show() : this.box.show();
            this.width = this.box.width();
            this.height = this.box.height();
            this.mask ? this.mask.hide() : this.box.hide();

            if (this.draggable) {
                this.box.bind('mousedown', $.proxy(this.dragInit, this));
                this.box.find('a').each(function (index, elem) {
                    $(elem).bind('mousedown', function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    })
                });
                this.x = 0;
                this.y = 0;
            }
        },

        show : function (pos) {

            if (this.exclusive) {
                this.mask.show();
            }
            else {
                this.box.show();
            }

            if (typeof pos === 'undefined') {
                this.left = ($(window).width() - this.width) / 2;
                this.top = ($(window).height() - this.height) / 2;
            }
            else {
                this.left = pos[0];
                this.top = pos[1];
            }

            //this.scrollLeft = $(document).scrollLeft();
            //this.scrollTop = $(document).scrollTop();

            this.box.css('left', this.left);
            this.box.css('top', this.top);

/*
            $(window).bind('scroll.lightbox', $.proxy(function () {
                this.scrollLeft = $(document).scrollLeft();
                this.scrollTop = $(document).scrollTop();
                this.box.css('left', this.left + this.scrollLeft);
                this.box.css('top', this.top + this.scrollTop);
            }, this));
*/
            $(window).bind('resize.lightbox', $.proxy(function (e) {
                this.left = ($(window).width() - this.width) / 2;
                this.top = ($(window).height() - this.height) / 2;
                this.box.css('left', this.left);
                this.box.css('top', this.top);
            }, this));
        },

        hide : function () {
            if (this.exclusive) {
                this.mask.hide();
            }
            else {
                this.box.hide();
            }
            //$(window).unbind('.lightbox');
        },

        dragInit : function (e) {
            this.box.css('cursor', 'move');
            var doc = $(document);
            doc.data('$drag', true);
            doc.bind('mousemove.drag', $.proxy(this.draging, this));
            doc.bind('mouseup.drag', $.proxy(this.dragEnd, this));
            this.x = e.pageX;
            this.y = e.pageY;
            e.preventDefault();
        },

        draging : function (e) {
            var left, top, x, y;
            x = e.pageX;
            y = e.pageY;
            left = x - this.x + this.left;
            top = y - this.y + this.top;
            this.box.css({
                left: left,
                top: top
            });
            this.x = x;
            this.y = y;
            this.left = left;
            this.top = top;
        },

        dragEnd : function () {
            this.box.css('cursor', '');
            var doc = $(document);
            doc.data('$drag', false);
            doc.unbind('.drag');
        }
    });
/**
 * @param {Bollean} animateBackgroundOnly Only animate background, this is mainly for performance optimization especially when the animate object contains a lot of dom element
 * @param {Number} animateSpeed The speed of animation
 */
    $.Class.extend(hg.Lightbox, 'hg.LightboxZ', {
        init : function (args) {
            this.animateBackgroundOnly = false;
            this.animateSpeed = 500;

            if (this.animateBackgroundOnly) {
                this.innerBox = document.createDocumentFragment();
            }
        },

        show : function (pos) {
            var self = this;
            this.$super.show(pos);
            if (this.animateBackgroundOnly) {
                var childNodes = Array.prototype.slice.call(this.box[0].childNodes, 0), i = 0, len = childNodes.length;
                for (; i < len ; i += 1) {
                    this.innerBox.appendChild(childNodes[i]);
                }
                this.zoomIn(this.animateSpeed, $.proxy(function () {
                    var childNodes = Array.prototype.slice.call(this.innerBox.childNodes, 0), i = 0, len = childNodes.length;
                    for (; i < len ; i += 1) {
                        this.box.appendChild(childNodes[i]);
                    }
                }, this));
            }
            else {
                this.zoomIn(this.animateSpeed);
            }
        },

        hide : function (pos) {
            var self = this;
            if (this.animateBackgroundOnly) {
                var childNodes = Array.prototype.slice.call(this.box[0].childNodes, 0), i = 0, len = childNodes.length;
                for (; i < len ; i += 1) {
                    this.innerBox.appendChild(childNodes[i]);
                }
                this.zoomOut(this.animateSpeed, $.proxy(function () {
                    var childNodes = Array.prototype.slice.call(this.innerBox.childNodes, 0), i = 0, len = childNodes.length;
                    for (; i < len ; i += 1) {
                        this.box.appendChild(childNodes[i]);
                    }
                }, this));
            }
            else {
                this.zoomOut(this.animateSpeed, function () {
                    self.$super.hide(pos);
                }, pos);
            }
        },

        zoomIn : function (animateSpeed, callback, pos) {
            var fProp = {}, tProp = {};
            fProp.width = 0;
            fProp.height = 0;
            fProp.left = this.left + this.width / 2;
            fProp.top = this.top + this.height / 2;
            fProp.overflow = 'hidden';

            tProp.width = this.width;
            tProp.height = this.height;
            tProp.left = this.left;
            tProp.top = this.top;

            this.box.css(fProp).animate(tProp, animateSpeed, callback);
        },

        zoomOut : function (animateSpeed, callback, pos) {
            var fProp = {}, tProp = {};
            fProp.overflow = 'hidden';

            tProp.width = 0;
            tProp.height = 0;
            tProp.left = this.left + this.width / 2;
            tProp.top = this.top + this.height / 2;

            if (typeof pos !== 'undefined') {
                left = pos[0];
                top = pos[1];
            }
            this.box.css(fProp).animate(tProp, animateSpeed, callback);
        }
    });

})(jQuery);
