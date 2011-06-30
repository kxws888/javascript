(function ($) {
    'use strict';
    /** @class */
    $.Class("hg.Lightbox",
        /** @lends Lightbox.prototype */
        {
        /**
         * hg.Lightbox A basic lightbox for webpage, inherit it if you want some amazon effect
         * @author nhnst liuming
         * @version 20110623.4
         * @constructs
         * @param {String|Object} box A cssQuery string, dom object or jQuery object which is for operation
         * @param {Boolean} [draggable=true] Whether to allow dragging
         * @param {Boolean} [exclusive=true] Whether to attach a big enough background to make all the content except the lightbox itself non-interactive
        */
        init : function (args) {
            this.box = null;
            this.draggable = true;
            this.exclusive = true;

            $.extend(this, args);

            this.box = this.box === null ? this.createBox() : $(this.box);
            this.box.css({
                position: 'fixed',
                display: 'none',
                zIndex: '19860208'
            });

            if (this.exclusive) {
                this.mask = $('<div>');
                this.mask.css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: $(document).height(),
                    display: 'none',
                    zIndex: '19860207',
                    opacity: '0.5',
                    filter: 'alpha(opacity=50)',
                    backgroundColor: 'black'
                });
                this.mask.appendTo(document.body);
            }

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

            if (!window.XMLHttpRequest) {
                this.box.css('position', 'absolute').addClass('lightbox');
            }
        },
        /**
        * Indicate the visibility of lightbox
        * @public
        */
        status: false,
        /**
        * Show the lightbox
        * @public
        */
        show : function () {

            this.status = true;

            if (this.exclusive) {
                this.mask.show();
            }

            this.box.show();

            this.left = ($(window).width() - this.box.width()) / 2;
            this.top = ($(window).height() - this.box.height()) / 2;


            if (!window.XMLHttpRequest) {
                this.box.css('left', this.left + $(document).scrollLeft());
                this.box.css('top', this.top + $(document).scrollTop());
            }
            else {
                this.box.css('left', this.left);
                this.box.css('top', this.top);
            }

            $(window).bind('resize.lightbox', $.proxy(function (e) {
                this.left = ($(window).width() - this.box.width()) / 2;
                this.top = ($(window).height() - this.box.height()) / 2;
                this.box.css('left', this.left);
                this.box.css('top', this.top);
            }, this));
        },
        /**
        * Hide the lightbox
        * @public
        */
        hide : function () {
            this.status = false;
            if (this.exclusive) {
                this.mask.hide();
            }
            this.box.hide();
            $(window).unbind('.lightbox');
        },
        /**
        * Drag init
        * @private
        */
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
        /**
        * Drag on
        * @private
        */
        draging : function (e) {
            var left, top, x, y;
            x = e.pageX;
            y = e.pageY;
            this.left = x - this.x + this.left;
            this.top = y - this.y + this.top;

            if (!window.XMLHttpRequest) {
                this.box.css('left', this.left + $(document).scrollLeft());
                this.box.css('top', this.top + $(document).scrollTop());
            }
            else {
                this.box.css('left', this.left);
                this.box.css('top', this.top);
            }
            this.x = x;
            this.y = y;
        },
        /**
        * Drag end
        * @private
        */
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
            this.width = this.box.width();
            this.height = this.box.height();
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

        zoomIn : function (animateSpeed, callback) {
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

        zoomOut : function (animateSpeed, callback) {
            var fProp = {}, tProp = {};
            fProp.overflow = 'hidden';

            tProp.width = 0;
            tProp.height = 0;
            tProp.left = this.left + this.width / 2;
            tProp.top = this.top + this.height / 2;

            this.box.css(fProp).animate(tProp, animateSpeed, callback);
        }
    });

})(jQuery);
