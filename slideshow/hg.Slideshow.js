/**
 * hg.
 * @version 1.1
 **/
(function ($) {
    'use strict';
	$.Class("hg.Slideshow", {
        init : function (args) {
            this.gap = 5000;
            this.length = 5;
            this.loop = true;
            this.step = 1;
            this.count = 1;
            this.timer = null;

            $.extend(this, args);

            if (this.loop) {
                this.start();
            }
        },

        start : function () {
            var self = this;
            if (!this.timer) {
                this.timer = setInterval(function () {
                    self.next.call(self);
                }, self.gap);
            }
        },

        stop : function () {
            clearInterval(this.timer);
            this.timer = null;
        },

        goto : function (num) {
            if (this.count === num) {
                return false;
            }
            this.count = num;
            return num;
        },

        prev : function () {
            var target = this.count - this.step;
            if (target < 1) {
                if (this.loop) {
                    target = this.length + target;
                }
                else {
                    target = 1;
                }
            }
            return this.goto(target);
        },

        next : function () {
            var target = this.count + this.step;
            if (target > this.length) {
                if (this.loop) {
                    target = target - this.length;
                }
                else {
                    target = this.length;
                }
            }
            return this.goto(target);
        }
    });

    $.Class.extend(hg.Slideshow, 'Slideshow', {
        init: function (args) {
            this.slideshow = '';
            this.control = '';
            this.slide = '';
            this.controls = '';
            this.slides = '';
            this.limit = 5;
            this.controlUnit = 0;
            this.controlClass = '';


            $.extend(this, args);
            
            this.slideshow = $(this.slideshow);
            this.slides = $(this.slides, this.slideshow);
            this.control = $(this.control, this.slideshow);
            this.controls = $(this.controls, this.slideshow);

            this.controlUnit = this.controlUnit || this.controls.eq(0).width();
            
            if (this.limit < this.length) {
                this.flipStop = {};
                var interations = Math.floor(this.length / this.limit), remainder = this.length % this.limit;
                
                if (remainder) {
                    this.flipStop[interations * this.limit] = -(this.length - this.limit) * this.controlUnit;
                    this.flipStop[this.length - this.limit + remainder] = -((interations - 1) * this.limit) * this.controlUnit;
                }
                
                while (--interations) {
                    this.flipStop[snippet * this.limit] = -(interations * this.limit) * this.controlUnit;
                    this.flipStop[snippet * this.limit + 1] = -((interations - 1) * this.limit) * this.controlUnit;
                }
            }

            this.controls.each(function (index) {
                $(this).data('index', index);
            });
            
            this.slides.hide();
            this.slides.eq(0).show();

            var self = this;

            this.controls.click(function (e) {
                var index = $(this).data('index') + 1;
                self.goto(index);
                e.preventDefault();
            });
        },

        goto : function (num) {
            if (this.count === num) {
                return false;
            }
            this.controlChange(num);
            this.slideChange(num);
            this.count = num;
            return num;
        },

        slideChange : function (num, callback) {
            var self = this, old = this.count;
            this.slides.eq(num - 1).css({
                position: 'absolute',
                top: 0,
                left: 0
            }).fadeIn(500, function () {
                self.slides.eq(old - 1).hide();
                $(this).css('position', '');
            });
        },

        controlChange : function (num) {
            this.controls.eq(this.count - 1).removeClass(this.controlClass);
            this.controls.eq(num - 1).addClass(this.controlClass);
            if (this.flipStop && typeof this.flipStop[num] !== 'undefined') {
                this.control.animate({
                    left: this.flipStop[num]
                })
            }
        },

        

        animate : function (node, effect, speed, callback, callbefore) {
			callback = callback || function () {};
			callbefore = callbefore || function () {};
			callbefore();
			
            switch (effect) {
            case 'fadeIn':
                node.fadeIn(speed, callback);
                break;
            case 'fadeOut':
                node.fadeOut(speed, callback);
                break;
            case 'slideRight':
                node.animate()
            }
		}
    })

})(jQuery);
