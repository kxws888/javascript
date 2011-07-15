var hg = hg || {};
hg.Counter = (function () {
    'use strict';
    function Class(parent, child) {
        'use strict';
        function parentCtor() {};
        function childCtor() {
            this.init.apply(this, arguments);
        };
        if (typeof child === 'undefined') {
            childCtor.prototype = parent;
        }
        else {
            parentCtor.prototype = parent.prototype;
            childCtor.prototype = new parentCtor();
            for (var key in child) {
                childCtor.prototype[key] = child[key];
            }
            childCtor.prototype.$super = parent.prototype;
        }
        return childCtor;
    }

    /**
    * ImagePreloader is a tool for multi-images preloading
    *
    * @example
    * new ImagePreloader(['http://image1.jpg', 'http://image2.jpg'], function (oImage, this.aImages, this.nProcessed, this.nLoaded) {
    *   //use jQuery
    *   $('<img>').attr('src', oImage.src);
    * });
    *
    * @author nhnst Liuming
    * @version 20110623.4
    * @constructor
    * @param {String[]} images A collection of images url for preloading
    * @param {Function} callback(oImage, this.aImages, this.nProcessed, this.nLoaded) A function to call once the every image request finishes
    */
    function ImagePreloader(images, callback) {
        this.callback = callback;

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
        oImage.src = image + '?flush=' + (+new Date());

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
    };
    /**
    * A inner function to be called when every image request finishes
    * @private
    */
    ImagePreloader.prototype.onComplete = function (oImage) {
        this.nProcessed++;
        this.callback(oImage, this.aImages, this.nProcessed, this.nLoaded);
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
        this.bAbort = true;
        this.oImagePreloader.onComplete(this);
    };


/****************************************************************************************************************************************************************/

    var Counter = Class({

        init: function (args) {
            args = args || {};
            this.value = args.value;
            this.length = args.length;
            this.order = args.order;

            this.bits = [];

            var i, bit;
            for (i = 0 ; i < this.length ; i += 1) {
                bit = function(){};
                bit.prototype.walk = this.walk;
                bit = new bit();
                bit.counter = this;
                bit.index = i;
                bit.value = 0;
                bit.order = this.order;
                this.bits.push(bit);
            }
        },

        flush: function () {
            var i, value = this.value;
            for (i = 0 ; i < this.length ; i += 1) {
                this.bits[i].value = Math.floor(value / Math.pow(10, (this.length - i - 1)));
                value -= this.bits[i].value * Math.pow(10, (this.length - i - 1));
            }
        },

        start: function () {
            this.flush();
            var self = this;
            self.value += 1;
            if (self.bits[self.length - 1].walk() === -1) {
                alert('end')
                return;
            }
            setTimeout(function () {
                self.start();
            }, 1000);
        },

        walk: function () {
            this.value += this.order === 'asc' ? 1 : -1;
            if (this.value > 9) {
                if (this.index === 0) {
                    this.value = 9;
                    return -1;
                }
                else {
                    if (this.counter.bits[this.index - 1].walk() > -1) {
                        this.value = 0;
                    }
                    else {
                        this.value = 9;
                        return -1;
                    }
                }
            }
            else if (this.index < 0) {
                if (this.index === 0) {
                    this.value = 0;
                    return -1;
                }
                else {
                    if (this.counter.bits[this.index - 1].walk() > -1) {
                        this.value = 9;
                    }
                    else {
                        this.value = 0;
                        return -1;
                    }
                }
            }

            return this.value;
        }
    });

    var CounterC = Class(Counter, {

        init: function (args) {
            this.$super.init.call(this, args);

            this.stage = document.getElementById(args.stage);
            this.size = args.size;
            this.numberImage = args.numberImage;

            this.stage.width = args.size[0] * this.length;
            this.stage.height = args.size[1];
            this.stage.style.backgroundColor = 'black';
            this.ctx = this.stage.getContext('2d');

            this.numbersData = {
                0: [1,1,1,1,1,1,0],
                1: [0,1,1,0,0,0,0],
                2: [1,1,0,1,1,0,1],
                3: [1,1,1,1,0,0,1],
                4: [0,1,1,0,0,1,1],
                5: [1,0,1,1,0,1,1],
                6: [1,0,1,1,1,1,1],
                7: [1,1,1,0,0,0,0],
                8: [1,1,1,1,1,1,1],
                9: [1,1,1,1,0,1,1]
            };
            this.numberCanvas = {};

            var i, canvas, self = this;
            for (i = 0 ; i < this.length ; i += 1) {
                canvas = document.createElement('canvas');
                canvas.width = this.stage.width / this.length;
                canvas.height = this.stage.height;
                this.bits[i].canvas = canvas;
            }

            new ImagePreloader(this.numberImage, function(oImage, aImages, nProcessed, nLoaded) {
                if (nLoaded === aImages.length) {
                    self.front = aImages[0];
                    self.back = aImages[1];

                    self.start();
                    for (i = 0 ; i < 10 ; i += 1) {
                        //self.numberCanvas[i] = self.drawNumber(i, self.size[0], self.size[1], front, back);
                    }
                }
            });
        },

        flush: function () {
            this.$super.flush.call(this);
            for (var i = this.length - 1 ; i >= 0 ; i -= 1) {
                this.bits[i].canvas = this.drawNumber(this.bits[i].value, this.size[0], this.size[1], this.front, this.back);
            }
            this.drawStage();
        },

        walk: function () {
            var now = this.counter.$super.walk.call(this);
            if (now > -1) {
                this.counter.drawNumber(this.value, this.counter.size[0], this.counter.size[1], this.counter.front, this.counter.back);
                this.counter.drawStage();
            }
            return now;
        },

        drawStage: function () {
            this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
            for (var i = this.length - 1 ; i >= 0 ; i -= 1) {
                this.ctx.drawImage(this.bits[i].canvas, this.size[0] * i, 0);
            }
        },

        drawNumber: function (n, w, h, front, back) {
            var canvas = document.createElement('canvas'), ctx, data = this.numbersData[n], radians = Math.PI / 2;
            canvas.width = w;
            canvas.height = h;
            ctx = canvas.getContext('2d');
            ctx.translate(12, 15);
            ctx.drawImage(data[0] ? front : back, 0, 0);

            ctx.translate(55, 5);
            ctx.rotate(radians);
            ctx.drawImage(data[1] ? front : back, 0, 0);

            ctx.translate(51, 0);
            ctx.drawImage(data[2] ? front : back, 0, 0);

            ctx.translate(55, 5);
            ctx.rotate(radians);
            ctx.drawImage(data[3] ? front : back, 0, 0);

            ctx.translate(55, 5);
            ctx.rotate(radians);
            ctx.drawImage(data[4] ? front : back, 0, 0);

            ctx.translate(51, 0);
            ctx.drawImage(data[5] ? front : back, 0, 0);

            ctx.translate(4, 6);
            ctx.rotate(radians);
            ctx.drawImage(data[6] ? front : back, 0, 0);

            return canvas;
        }
    });


    return CounterC;

})();


