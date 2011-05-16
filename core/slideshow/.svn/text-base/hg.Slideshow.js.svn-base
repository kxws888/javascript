(function ($) {
    'use strict';
    /**
    * @name hg.Slideshow
    * @author nhnst liuming
    * @version 1.2 20110421
    */
    $.Class("hg.Slideshow", {
        init : function (args) {
            this.gap = 5000;
            this.length = 5;
            this.loop = true;
            this.step = 1;
            this.count = 1;
            this.timer = null;

            $.extend(this, args);
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
        },

        prev : function () {
            var target = this.count - this.step;
            if (target < 1) {
                if (this.loop) {
                    target = this.length + target;
                }
                else {
                    target = 1;
                    return false;
                }
            }
            this.goto(target);
        },

        next : function () {
            var target = this.count + this.step;
            if (target > this.length) {
                if (this.loop) {
                    target = target - this.length;
                }
                else {
                    target = this.length;
                    return false;
                }
            }
            this.goto(target);
        }
    });

    $.Class.extend(hg.Slideshow, 'hg.SlideshowGW', {
        init : function (args) {

            this.stage = null;
            this.slides = null;
            this.btnPrev = null;
            this.btnNext = null;
            this.unit = null;
            this.direction = 'horizontal';

            $.extend(this, args);
            var self = this, stage, btnPrev, btnNext;

            stage = $(this.stage).eq(0);
            this.slides = $(this.slides, stage);
            btnPrev = stage.find(this.btnPrev);
            btnNext = stage.find(this.btnNext);
            this.prop = this.direction === 'horizontal' ? 'left' : 'top';
            this.lock = false;

            this.slides.css(this.prop, 0);

            btnPrev.click(function (e) {
                self.prev();
                e.preventDefault();
                return false;
            });

            btnNext.click(function (e) {
                self.next();
                e.preventDefault();
                return false;
            });

            this.slides.find('div.conts p.img script').remove();
        },

        goto : function (num) {
            this._goto(num);
            this.slides.css(this.prop, (1 - num) * this.unit);
        },

        _goto : function (num) {
            if (this.count === num) {
                return false;
            }
            this.count = num;
        },

        prev : function () {
            this.slides.stop(true, true);
            var target = this.count - this.step, self = this,  i, props = {};
            if (target < 1) {
                if (this.loop) {
                    target = this.length + target;
                    i = this.length;
                    while (i > this.count) {
                        this.slides.find('>li:last').prependTo(this.slides);
                        i -= 1;
                    }
                    this.slides.css(this.prop, parseInt(this.slides.css(this.prop), 10) - this.unit * (this.length - this.count));
                }
                else {
                    target = 1;
                    return false;
                }
            }

            this._goto(target);
            props[this.prop] = '+=' + this.unit * this.step;
            this.slides.animate(props, 500, function () {
                if (typeof i !== 'undefined') {
                    self.slides.css(self.prop, parseInt(self.slides.css(self.prop), 10) - self.unit * i);
                    while (i) {
                        self.slides.find('>li:last').prependTo(self.slides);
                        i -= 1;
                    }
                }
            });
        },

        next : function () {
            this.slides.stop(true, true);
            var target = this.count + this.step, self = this,  i, props = {};
            if (target > this.length) {
                if (this.loop) {
                    target = target - this.length;
                    i = 1;
                    while (i < this.count) {
                        this.slides.find('>li:first').appendTo(this.slides);
                        i += 1;
                    }
                    this.slides.css(this.prop, parseInt(this.slides.css(this.prop), 10) + this.unit * (i - 1));
                }
                else {
                    target = this.length;
                    return false;
                }
            }

            this._goto(target);
            props[this.prop] = '-=' + this.unit * this.step;
            this.slides.animate(props, 500, function () {
                if (typeof i !== 'undefined') {
                    self.slides.css(self.prop, parseInt(self.slides.css(self.prop), 10) + self.unit * (self.length - i + 1));
                    while (i <= self.length) {
                        self.slides.find('>li:first').appendTo(self.slides);
                        i += 1;
                    }
                }
            });
        }
    });

})(jQuery);
