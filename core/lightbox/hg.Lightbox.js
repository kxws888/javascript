(function ($) {
    'use strict';
    /**
     * @name hg.Lightbox
     * @author nhnst liuming
     * @description Lightbox is simple script to display content in a modal dialog, pass the content for pupup to the "box" arguments, and config other arguments to meet specific needs
     * @version 20110527.5
     * @param {Var} box A cssQuery string, dom object or jQuery object which is for operation
     * @param {Boolean} draggable Anable drag
     * @param {Boolean} exclusive Attach a big enough background to make all the content except the lightbox non-interactive
     * @param {String} maskClass When exclusive is set to true, specify a class for style in CSS
    */
    $.Class("Lightbox", {
        init : function (args) {
            this.box = '';
            this.draggable = true;
            this.exclusive = true;
            this.maskClass = 'mask';

            $.extend(this, args);

            if (!this.box) {
                throw 'must specify an object';
            }
            this.box = $(this.box);
            this.box.css('position', 'fixed');

            if (this.exclusive) {
                this.mask = $('<div>');
                this.mask.addClass(this.maskClass);
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
                this.left = ($(window).width() - this.box.width()) / 2;
                this.top = ($(window).height() - this.box.height()) / 2;
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
                this.left = ($(window).width() - this.box.width()) / 2;
                this.top = ($(window).height() - this.box.height()) / 2;
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
    $.Class.extend(hg.Lightbox, 'Lightbox', {
        init : function (args) {
            this.animateBackgroundOnly = false;
            this.animateSpeed = 500;
        },

        show : function (pos) {
            var self = this;
            this.$super.show(pos);
            if (this.animateBackgroundOnly) {
                var html = this.box.html();
                this.box.html('');
                this.zoomIn(this.animateSpeed, function () {
                    self.box.html(html);
                });
            }
            else {
                this.zoomIn(this.animateSpeed);
            }
        },

        hide : function (pos) {
            var self = this;
            if (this.animateBackgroundOnly) {
                var html = this.box.html();
                this.box.html('');
                this.zoomOut(this.animateSpeed, function () {
                    self.box.html(html);
                    self.$super.hide(pos);
                }, pos);
            }
            else {
                this.zoomOut(this.animateSpeed, function () {
                    self.$super.hide(pos);
                }, pos);
            }        
        },
		
		zoomIn : function (animateSpeed, callback, pos) {
			this.box.css({
				width: 0,
				height: 0,
                left: this.left + this.width / 2,
                top: this.top + this.height / 2,
				overflow: 'hidden'
			}).animate({
                width: this.width,
                height: this.height,
                left: this.left,
                top: this.top
            }, animateSpeed, callback);
		},

        zoomOut : function (animateSpeed, callback, pos) {
            var left = this.left + this.width / 2, top = this.top + this.height / 2;
            if (typeof pos !== 'undefined') {
                left = pos[0];
                top = pos[1];
            }
			this.box.css({
				overflow: 'hidden'
			}).animate({
				width: 0,
				height: 0,
                left: left,
                top: top
            }, animateSpeed, callback);
		}        
    });

})(jQuery);
