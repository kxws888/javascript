(function ($) {
/**
     * @name hg.Lightbox
     * @author nhnst liuming
     * @description Lightbox is simple script to display content in a modal dialog, pass the content for pupup to the "box" arguments, and config other arguments to meet specific needs
     * @version 1.1 20110415
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
            this.maskClass = 'mask';

            $.extend(this, args);

            if (!this.box) {
                throw 'must specify an object';
            }
            this.box = $(this.box);
            this.box.hide();
            this.width = this.box.width();
            this.height = this.box.height();
            this.box.css('z-index', '100');
            this.box.css('position', 'absolute');

            if (this.exclusive) {
                this.mask = $('<div>');
                this.mask.addClass(this.maskClass);
                this.mask.css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: $(document).height(),
                    display: 'none',
                    zIndex: '99'
                });
                this.mask.appendTo('body');
            }

            if (this.draggable) {
                this.box.bind('mousedown', $.proxy(this.dragInit, this));
                this.x = 0;
                this.y = 0;
            }
        },

        show : function (pos) {

            if (typeof pos === 'undefined') {
                this.left = this.left ? this.left : ($(window).width() - this.width) / 2;
                this.top = this.top ? this.top : ($(window).height() - this.height) / 2;
            }
            else {
                this.left = pos[0];
                this.top = pos[1];
            }
            this.scrollLeft = $(document).scrollLeft();
            this.scrollTop = $(document).scrollTop();

            this.box.css('left', this.left + this.scrollLeft);
            this.box.css('top', this.top + this.scrollTop);
            if (this.exclusive) {
                this.mask.show();
            }
            this.box.show();

            $(window).bind('scroll.lightbox', $.proxy(function () {
                this.scrollLeft = $(document).scrollLeft();
                this.scrollTop = $(document).scrollTop();
                this.box.css('left', this.left + this.scrollLeft);
                this.box.css('top', this.top + this.scrollTop);
            }, this));

            $(window).bind('resize.lightbox', $.proxy(function (e) {
                this.left = ($(window).width() - this.width) / 2;
                this.top = ($(window).height() - this.height) / 2;
                this.box.css('left', this.left + this.scrollLeft);
                this.box.css('top', this.top + this.scrollTop);
            }, this));
        },

        hide : function (pos) {
            if (this.exclusive) {
                this.mask.hide();
            }
            if (typeof pos !== 'undefined') {
                this.box.css({
                    left: pos[0],
                    top: pos[1]
                });
            }
            this.box.hide();
            $(window).unbind('.lightbox');
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
