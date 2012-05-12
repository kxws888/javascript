(function ($) {
    'use strict';
    /** @class */
    $.Class("hg.Slideshow",
        /** @lends Slideshow.prototype */
        {
        /**
        * hg.Slideshow is abstract class for slideshow, inherit it if you want a slideshow on webpage
        *
        * @author nhnst liuming
        * @version 20110623.4
        * @constructs
        * @requires jQuery
        * @param {Number} [gap=5000] The rate of slideshow plays
        * @param {length} length The number of slides
        * @param {Boolean} [loop=true] Indicate whether the slideshow plays loop
        * @param {Integer} [step=1] The step of slideshow moves
        */
        init: function (args) {
            var args = arguments[0] || {};

            this.gap = args.gap || 5000;
            this.length = args.length;
            this.loop = !!args.loop;
            this.step = args.step || 1;
            this.callback = args.callback;

            this.count = 1;
            this.timer = null;
        },
        /**
        * reset the slideshow
        * @public
        */
        reset: function () {
            this.count = 1;
            return this;
        },
        /**
        * start playing the slideshow
        * @public
        */
        start: function () {
            var self = this;
            if (!this.timer) {
                this.timer = setInterval(function () {
                    self.next();//modify in 7.6
                }, this.gap);
            }
        },
        /**
        * stop playing the slideshow
        * @public
        */
        stop: function () {
            clearInterval(this.timer);
            this.timer = null;
        },
        /**
        * move to a special slide
        * @public
        * @param {Integer} index The No. of slide
        * @returns {Integer} The No. of slide moved to, return -1 if moving failed(e.g., move to current slide)
        */
        moveTo: function (index) {
            var res = index;
            if (this.count !== index) {
                this.count = index;
            }
            else {
                res = -1;
            }
            typeof this.callback === 'function' && this.callback(res);
            return res;
        },
        /**
        * move to next slide
        * @public
        * @returns {Integer} The No. of slide moved to, return -1 if moving failed(e.g., move to current slide)
        */
        prev: function () {
            var target = this.count - this.step;
            if (target < 1) {
                if (this.loop) {
                    target = this.length + target;
                }
                else {
                    target = 1;
                }
            }
            return this.moveTo(target);
        },
        /**
        * move to previous slide
        * @public
        * @returns {Integer} The No. of slide moved to, return -1 if moving failed(e.g., move to current slide)
        */
        next: function () {
            var target = this.count + this.step;
            if (target > this.length) {
                if (this.loop) {
                    target = target - this.length;
                }
                else {
                    target = this.length;
                }
            }
            return this.moveTo(target);
        }

    });

})(jQuery);

/******************************************************************************************************************************************************************
*******************************************************************************************************************************************************************
************************************************************************ DIVISION *********************************************************************************
*******************************************************************************************************************************************************************
******************************************************************************************************************************************************************/
(function ($) {
    'use strict';
    /**
    * hg.SlideshowF for fade effect
    * @author nhnst liuming
    * @version 20110609.4
    */
    $.Class.extend(hg.Slideshow, 'hg.SlideshowF', {
        init: function () {

            this.stage = null;
            this.slides = null;
            this.btnIndex = null;
            this.btnPrev = null;
            this.btnNext = null;

            $.extend(this, arguments[0]);

            var self = this, stage;

            stage = $(this.stage).eq(0);
            this.slides = $(this.slides, stage);

            if (this.length === 'auto') {
                this.length = this.slides.length;
            }

            if (this.btnIndex) {
                this.btnIndex = stage.find(this.btnIndex);
                this.btnIndex.each(function (index, elem) {
                    var i = index + 1;
                    $(elem).bind('click', function () {
                        self.moveTo(i);
                    });
                });
            }

            if (this.btnPrev) {
                stage.find(this.btnPrev).bind('click', function (e) {
                    self.prev();
                    e.preventDefault();
                    return false;
                });
            }

            if (this.btnNext) {
                stage.find(this.btnNext).bind('click', function (e) {
                    self.next();
                    e.preventDefault();
                    return false;
                });
            }
        },

        moveTo: function (index) {
            var bak = this.count, res = this.$super.moveTo(index);
            if (res !== -1) {
                this.slides.eq(res - 1).stop(true, true).fadeIn(500);
                this.slides.eq(bak - 1).stop(true, true).fadeOut(500);
                if (this.btnIndex) {
                    this.btnIndex.eq(res - 1).addClass('active');
                    this.btnIndex.eq(bak - 1).removeClass('active');
                }
            }
        }
    });
})(jQuery);

/******************************************************************************************************************************************************************
*******************************************************************************************************************************************************************
************************************************************************ DIVISION *********************************************************************************
*******************************************************************************************************************************************************************
******************************************************************************************************************************************************************/
(function ($) {
    'use strict';
    /** @class */
    $.Class.extend(hg.Slideshow, 'hg.SlideshowS',
        /** @lends SlideshowS.prototype */
        {
        /**
        * hg.Slideshow is a slideshow animating by sliding
        *
        * @author nhnst liuming
        * @version 20110727.3
        * @constructs
        * @augments hg.Slideshow
        * @requires jQuery
        * @param {Object|String} stage The container of slideshow
        * @param {Object|String} slides The slide content of slideshow
        * @param {Object|String} btnIndex The index controller of slideshow
        * @param {Object|String} btnPrev The prev button
        * @param {Object|String} btnNext The next button
        * @param {Number|String} unit The length of every slide, specify 'auto' to caculate it automatly
        * @param {String} easing The animation easing
        * @param {String} direction The direction of slideshow
        */
        init : function (args) {

            this.stage = null;
            this.slides = null;
            this.btnIndex = null;
            this.btnPrev = null;
            this.btnNext = null;
            this.unit = null;
            this.easing = null;
            this.direction = 'horizontal';

            $.extend(this, args);

            var self = this, stage;

            stage = $(this.stage).eq(0);
            this.slides = $(this.slides, stage);
            this.prop = this.direction === 'horizontal' ? 'left' : 'top';

            if (this.length === 'auto') {
                this.length = this.slides.children().length;
            }

            this.slides.css(this.prop, 0);
            this.direction === 'horizontal' ? this.slides.width(this.unit * this.length) : this.slides.height(this.unit * this.length);

            if (this.btnIndex) {
                this.btnIndex = stage.find(this.btnIndex);
                this.btnIndex.each(function (index, elem) {
                    var i = index + 1;
                    $(elem).click(function () {
                        var bak = this.count;
                        if (self.moveTo(i) > -1) {
                            self.slideTo(bak, i);
                        }
                    });
                });
            }

            if (this.btnPrev) {
                stage.find(this.btnPrev).click(function (e) {
                    if (self.length > 1) {
                        self.prev();
                    }
                    e.preventDefault();
                    return false;
                });
            }

            if (this.btnNext) {
                stage.find(this.btnNext).click(function (e) {
                    if (self.length > 1) {
                        self.next();
                    }
                    e.preventDefault();
                    return false;
                });
            }
        },

        reset : function () {
            this.$super.reset();
            this.slides.css(this.prop, 0);
        },

        slideTo : function (from, to, callback) {
            var props = {}, animOptions = {};
            this.slides.stop(true, true);
            props[this.prop] = '-=' + this.unit * (to - from);
            animOptions['duration'] = 500;
            this.easing && (animOptions['easing'] = this.easing);
            animOptions['complete'] = callback;
            this.slides.animate(props, animOptions);
        },

        prev : function () {
            var bak = this.count, res = this.$super.prev(), self = this,  i;
            if (res > -1) {
                if (res > bak) {
                    i = this.length;
                    while (i > bak) {
                        this.slides.children(':last').prependTo(this.slides);
                        i -= 1;
                    }
                    this.slides.css(this.prop, parseInt(this.slides.css(this.prop), 10) - this.unit * (this.length - bak));
                }

                this.slideTo(bak, bak - this.step, function () {
                    if (typeof i !== 'undefined') {
                        self.slides.css(self.prop, parseInt(self.slides.css(self.prop), 10) - self.unit * i);
                        while (i) {
                            self.slides.children(':last').prependTo(self.slides);
                            i -= 1;
                        }
                    }
                });
            }
        },

        next : function () {
            var bak = this.count, res = this.$super.next(), self = this,  i;
            if (res > -1) {
                if (res < bak) {
                    i = 1;
                    while (i < bak) {
                        this.slides.children(':first').appendTo(this.slides);
                        i += 1;
                    }
                    this.slides.css(this.prop, parseInt(this.slides.css(this.prop), 10) + this.unit * (i - 1));
                }
                this.slideTo(bak, bak + this.step, function () {
                    if (typeof i !== 'undefined') {
                        self.slides.css(self.prop, parseInt(self.slides.css(self.prop), 10) + self.unit * (self.length - i + 1));
                        while (i <= self.length) {
                            self.slides.children(':first').appendTo(self.slides);
                            i += 1;
                        }
                    }
                });
            }
        }
    });
})(jQuery);

/******************************************************************************************************************************************************************
*******************************************************************************************************************************************************************
************************************************************************ DIVISION *********************************************************************************
*******************************************************************************************************************************************************************
******************************************************************************************************************************************************************/
(function ($) {
    'use strict';
    /**
    * hg.SlideshowSF for slide and fade effect
    * @author nhnst liuming
    * @version 20110609.4
    */
    $.Class.extend(hg.Slideshow, 'hg.SlideshowSF', {
        init : function (args) {

            this.stage = null;
            this.slides = null;
            this.btnIndex = null;
            this.btnPrev = null;
            this.btnNext = null;
            this.unit = null;
            this.direction = 'horizontal';

            $.extend(this, args);
            var self = this, stage;

            stage = $(this.stage).eq(0);
            this.slides = $(this.slides, stage);
            this.prop = this.direction === 'horizontal' ? 'left' : 'top';

            if (this.length === 'auto') {
                this.length = this.slides.length;
            }

            this.slides.css(this.prop, 0);

            if (this.btnIndex) {
                this.btnIndex = stage.find(this.btnIndex);
                this.btnIndex.each(function (index, elem) {
                    var i = index + 1;
                    $(elem).click(function (e) {
                        self.moveTo(i);
                        e.preventDefault();
                    });
                });
            }

            if (this.btnPrev) {
                stage.find(this.btnPrev).click(function (e) {
                    self.prev();
                    e.preventDefault();
                    return false;
                });
            }

            if (this.btnNext) {
                stage.find(this.btnNext).click(function (e) {
                    self.next();
                    e.preventDefault();
                    return false;
                });
            }
        },

        moveTo : function (index) {
            var self = this, offset = index > this.count ? -20 : 20, props = {};
            if (this.btnIndex) {
                this.btnIndex.eq(this.count - 1).removeClass('active');
                this.btnIndex.eq(index - 1).addClass('active');
            }

            props[self.prop] = offset;
            props['opacity'] = 0.5;
            this.slides.eq(this.count - 1).animate(props, 300, function () {
                $(this).css(self.prop, 0).hide();
                props[self.prop] = 0;
                props['opacity'] = 1;
                self.slides.eq(index - 1).css(self.prop, -offset).css('opacity', 0.5).show().animate(props, 300, function () {
                    $(this).css(self.prop, 0);
                })
            });
            this.$super.moveTo(index);
        }
    });

})(jQuery);
