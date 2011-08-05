/**
* HUI for hangame user interface
* @author nhnst st13652
* @version 20110720
* @namespace hg
*/
(function ($) {
    'use strict';
    /**
    * Class
    * @Author NHN Japan RIA
    * @name jQuery.Class
    * @param {String} nameSpace {Object} method {Boolean} extend
    */
    jQuery.extend({
        Class: function(ns,obj,extend) {
            var typeClass = function(){
                var _this = this;
                var a = [];
                while (typeof _this.$super != "undefined") {
                    var $super = _this.$super;
                    _this.$super = new Object;
                    for (var x in $super) {
                        _this.$super[x] = $super[x];
                    }
                    _this.$super.$this = this;
                    if (typeof _this.$super.init == "function") a[a.length] = _this;
                    _this = _this.$super;
                }
                for (var i = a.length - 1; i > -1; i--) a[i].$super.init.apply(a[i].$super, arguments);
                if (this.init instanceof Function) this.init.apply(this, arguments);
            }
            typeClass.prototype = obj;
            typeClass.prototype.constructor = typeClass;
            typeClass._extend = jQuery.Class._extend;

            if(extend) return typeClass;

            var pkg = jQuery.Class._verifyNameSpace(ns);
            pkg.container[pkg.name] = typeClass;
            //pkg.container[pkg.name].name = pkg.name;
        }
    });

    jQuery.extend(jQuery.Class,{
        _verifyNameSpace: function(ns){
            if(ns=="")return null;
            var names=ns.split(".");
            var componentName="",parent=window;
            if(names.length==1){
                componentName=names.pop()
            }else{
                for(var i=0,length=names.length;i<length;i++){
                    var n=names[i];
                    if(i==names.length-1){
                        componentName=n;
                        break
                    }
                    if(parent[n]==undefined)parent[n]={};
                    parent=parent[n]
                }
            }
            return{container:parent,name:componentName}
        },
        _extend: function (superClass) {
            this.prototype.$super = new Object;
            var superFunc = function (m, superClass, func) {
                if (m != 'constructor' && func.toString().indexOf("$super") > -1) {
                    var funcArg = func.toString().replace(/function\s*\(([^\)]*)[\w\W]*/g, "$1").split(",");
                    var funcStr = func.toString().replace(/function\s*\(.*\)\s*\{/, "").replace(/this\.\$super/g, "this.$super.$super");
                    funcStr = funcStr.substr(0, funcStr.length - 1);
                    func = superClass[m] = new Function(funcArg, funcStr);
                }
                return function () {
                    var f = this.$this[m];
                    var t = this.$this;
                    var r = (t[m] = func).apply(t, arguments);
                    t[m] = f;
                    return r;
                };
            };
            for (var x in superClass.prototype) {
                if (typeof this.prototype[x] == "undefined" && x != "init") this.prototype[x] = superClass.prototype[x];
                if (typeof superClass.prototype[x] == "function") {
                    this.prototype.$super[x] = superFunc(x, superClass, superClass.prototype[x]);
                } else {
                    this.prototype.$super[x] = superClass.prototype[x];
                }
            }
            for (var x in superClass) {
                if (x == "prototype") continue;
                this[x] = superClass[x];
            }
            return this;
        },
        extend: function(superClass,ns,obj){
            var pkg = jQuery.Class._verifyNameSpace(ns)
            pkg.container[pkg.name] = jQuery.Class(ns,obj,true)._extend(superClass);
            //pkg.container[pkg.name].name = pkg.name;
        }
    });

/****************************************************************************************************************************************************************/

    /**
    * ImagePreloader is a tool for multi-images preloading
    *
    * @example
    * new ImagePreloader(['http://image1.jpg', 'http://image2.jpg'], 2, null, function (oImage, this.aImages, this.nProcessed, this.nLoaded) {
    *   //use jQuery
    *   $('<img>').attr('src', oImage.src);
    * });
    *
    * @author nhnst st13652
    * @version 20110720.3
    * @constructor
    * @param {String[]} images A collection of images url for preloading
    * @param {Number} timeout Set a local timeout(in seconds)
    * @param {Function} complete(this.aImages, this.nLoaded) A function called once all the images request finishes
    * @param {Function} one(oImage, this.aImages, this.nProcessed, this.nLoaded) A function called once the every image request finishes
    * @param {Boolean} cache If set to false, it will force requested images not to be cached by the browser.
    */
    function ImagePreloader(images, timeout, complete, one, cache) {
        this.timeout = timeout || 2;
        this.complete = complete;
        this.one = one;
        this.flush = !cache;

        this.nLoaded = 0;
        this.nProcessed = 0;
        this.aImages = [];

        this.nImages = images.length;

        for (var i = 0, len = images.length ; i < len ; i += 1) {
            this.preload(images[i], i);
        }
    }
    /**
    * Initialization
    * @private
    */
    ImagePreloader.prototype.preload = function (image, index) {
        var oImage = new Image;
        oImage.nIndex = index;
        oImage.bLoaded = false;
        oImage.oImagePreloader = this;

        this.aImages.push(oImage);

        // handle ie cache
        if (oImage.width > 0) {
            this.onload.call(oImage);
        }
        else {
            oImage.onload = this.onload;
            oImage.onerror = this.onerror;
            oImage.onabort = this.onabort;
        }

        oImage.src = image + (this.flush ? '?flush=' + (+new Date()) : '');

        setTimeout(function () {
            if (oImage.bLoaded || oImage.bError || oImage.bAbort) {return}
            oImage.onabort();
        }, this.timeout * 1000);
    };
    /**
    * A inner function to be called when every image request finishes
    * @private
    */
    ImagePreloader.prototype.onComplete = function (oImage) {
        this.nProcessed++;
        if (this.nProcessed === this.aImages.length && typeof this.complete === 'function') {
            this.complete(this.aImages, this.nLoaded);
        }
        if (typeof this.one === 'function') {
            this.one(oImage, this.aImages, this.nProcessed, this.nLoaded);
        }
    };
    /**
    * A inner function to be called when image loads successful
    * @private
    */
    ImagePreloader.prototype.onload = function () {
        this.bLoaded = true;
        this.oImagePreloader.nLoaded++;
        this.oImagePreloader.onComplete(this);
    };
    /**
    * A inner function to be called when an error occurs loading the image
    * @private
    */
    ImagePreloader.prototype.onerror = function () {
        this.bError = true;
        this.oImagePreloader.onComplete(this);
    };
    /**
    * A inner function to be called when image loading is aborted
    * @private
    */
    ImagePreloader.prototype.onabort = function () {
        if (!this.bAbort) {
            this.bAbort = true;
            this.oImagePreloader.onComplete(this);
        }
    };

/****************************************************************************************************************************************************************/

    /** @class */
    $.Class("hg.Tabs",
        /** @lends Tabs.prototype */
        {
        /**
        * hg.Tabs is base class for tabs, inherit it if you want add new feature
        *
        * @author nhnst st13652
        * @version 20110706.3
        * @constructs
        * @requires jQuery
        * @param {String|Object} widget The container of tabs widget
        * @param {String|Object} nav The navigation of tabs
        * @param {String|Object} panel The panels of tabs
        * @param {String} [event=click] The event for tabs navigation
        * @param {?String} highlightClass The css class for highlight active tab
        * @param {Object} ajaxOptions
        * @see ajaxOptions http://api.jquery.com/jQuery.ajax/
        */
        init: function (args) {
            args = args || {};

            var widget = $(args.widget).eq(0);
            this.nav = widget.find(args.nav);
            this.panel = widget.find(args.panel);
            this.event = args.event || 'click';
            this.highlightClass = args.highlightClass;
            this.ajaxOptions = args.ajaxOptions || null;

            this.ajaxDataPattern = this.ajaxOptions && this.ajaxOptions['data'];
            this.cache = {};

            this.index = 0;

            this.nav.each($.proxy(function (i, v) {
                $(v).bind(this.event, {index: i}, $.proxy(this.toggle, this));
            }, this));
        },
        reset: function (index) {
            this.index = null;
            this.nav.eq(index).trigger(this.event, {index: index});
        },
        /**
        * toggle tabs
        * @private
        */
        toggle: function (e) {
            var from = this.index, to = e.data.index, ajaxOpt = {}, res;
            if (from !== to) {
                this.index = to;
                if (this.highlightClass) {
                    this.nav.eq(from).removeClass(this.highlightClass);
                    this.nav.eq(to).addClass(this.highlightClass);
                }
                if (this.ajaxOptions) {
                    this.panel.hide();
                    if (this.cache[to]) {
                        this.update(this.cache[to], 'success', {index: to});
                    }
                    else {
                        if (this.ajaxDataPattern) {
                            this.ajaxOptions['data'] = this.ajaxDataPattern.replace(/#\{([a-z]+)\}/g, $.proxy(function (str, p1, offset, s) {
                                return this.nav.eq(to).attr(p1);
                            }, this));
                        }
                        this.ajaxOptions['success'] = $.proxy(this.update, this);
                        var ajaxReq = $.ajax(this.ajaxOptions);
                        ajaxReq.index = to;
                    }
                }
                else {
                    this.panel.eq(from).hide();
                    this.panel.eq(to).show();
                }
                res = to;
            }
            else {
                res = -1;
            }
            e.preventDefault();
            return res;
        },
        /**
        * update panel when using ajax, requred rewrite
        * @private
        */
        update: function (data, textStatus, jqXHR) {
            if (jqXHR.index === this.index) {
                this.cache[this.index] = data;
                this.panel.show();
            }
        }
    });

/****************************************************************************************************************************************************************/
    /** @class */
    $.Class('hg.Placeholder',
        /** @lends Placeholder.prototype */
        {
        /**
        * hg.Placeholder is a fack attribute called placeholder of html5 form element, in case to fix the lack of browser support
        *
        * @author nhnst liuming
        * @version 20110727.3
        * @constructs
        * @param {Object} elements The rate of slideshow plays
        * @param {String} highlight The css class for highlight
        * @namespace hg
        */
        init: function (args) {
            args = args || {};
            this.elements = $(args.elements);
            this.highlight = args.highlight;

            this.elements.bind('focus', $.proxy(this.onfocus, this));
            this.elements.bind('blur', $.proxy(this.onblur, this));
            if (!this.support) {
                this.elements.each(function (i, v) {
                    v.value = v.attributes.placeholder.nodeValue;
                });
            }
        },
        /**
        * detect if browser support the placeholder attribute
        * @private
        */
        support: (function() {
            return 'placeholder' in document.createElement('input');
        })(),
        /**
        * handle focus event
        * @private
        */
        onfocus: function (e) {
            var target = e.target;
            this.highlight && $(target).addClass(this.highlight);
            if (!this.support) {
                if (target.value === target.attributes.placeholder.nodeValue) {
                    target.value = '';
                }
            }
        },
        /**
        * handle blur event
        * @private
        */
        onblur: function (e) {
            var target = e.target;
            this.highlight && $(target).removeClass(this.highlight);
            if (!this.support) {
                if (target.value === '') {
                    target.value = target.attributes.placeholder.nodeValue;
                }
            }
        }

    });

/****************************************************************************************************************************************************************/

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

/****************************************************************************************************************************************************************/

    /** @class */
    $.Class("hg.Lightbox",
        /** @lends Lightbox.prototype */
        {
        /**
         * hg.Lightbox A basic lightbox for webpage, inherit it if you want some amazon effect
         * @author nhnst st13652
         * @version 20110623.4
         * @constructs
         * @param {String|Object} box A cssQuery string, dom object or jQuery object which is for operation
         * @param {Boolean} [draggable=true] Whether to allow dragging
         * @param {Boolean} [exclusive=true] Whether to attach a big enough background to make all the content except the lightbox itself non-interactive
         * @param {Object} maskStyle Css for mask
         * @param {String|Array} pos
        */
        init: function (args) {
            this.box = null;
            this.draggable = true;
            this.exclusive = true;
            this.maskStyle = null;
            this.pos = 'center';

            $.extend(this, args);

            this.box = this.box === null ? this.createBox() : $(this.box);

            if (this.exclusive) {
                this.mask = $('<div>');
                this.maskStyle = $.extend({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: $(document).height(),
                    display: 'none',
                    zIndex: '10000',
                    opacity: '0.5',
                    backgroundColor: 'black'
                }, this.maskStyle);
                this.mask.css(this.maskStyle);
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


            this.box.css({
                display: 'none',
                zIndex: '10001'
            });

            if (this.pos === 'center') {
                this.box.css('position', 'fixed');
                if (!window.XMLHttpRequest) {
                    this.box.css('position', 'absolute').addClass('lightbox');
                }
            }
            else {
                this.box.css('position', 'absolute');
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
        show: function () {

            this.status = true;

            if (this.exclusive) {
                this.mask.show();
            }

            this.box.show();

            if (this.pos === 'center') {
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
                    if (this.mask) {
                        this.mask.height($(document).height());
                    }
                }, this));
            }
            else {
                var offset = $(this.pos[0]).offset();
                this.left = offset.left + this.pos[1];
                this.top = offset.top + this.pos[2];

                this.box.css('left', this.left);
                this.box.css('top', this.top);

                $(window).bind('resize.lightbox', $.proxy(function (e) {
                    if (this.mask) {
                        this.mask.height($(document).height());
                    }
                }, this));
            }

        },
        /**
        * Hide the lightbox
        * @public
        */
        hide: function () {
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
        dragInit: function (e) {
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
        draging: function (e) {
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
        dragEnd: function () {
            this.box.css('cursor', '');
            var doc = $(document);
            doc.data('$drag', false);
            doc.unbind('.drag');
        }
    });

})(jQuery);
