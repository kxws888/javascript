var hg = hg || {};
(function () {
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
    }

    hg.ImagePreloader = ImagePreloader;

/****************************************************************************************************************************************************************/

    var Counter = Class({

        init: function (args) {
            args = args || {};
            this.length = args.length;
            this.order = args.order || 'asc';

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
                bit.max = 9;
                bit.min = 0;
                this.bits.push(bit);
            }
        },

        set: function (value) {
            this.value = value;
            for (var i = 0 ; i < this.length ; i += 1) {
                this.bits[i].value = Math.floor(value / Math.pow(10, (this.length - i - 1)));
                value -= this.bits[i].value * Math.pow(10, (this.length - i - 1));
            }
        },

        start: function () {
            var self = this;

            this.timer = setInterval(function () {
                var res = self.bits[self.length - 1].walk();
                if (res === -1) {
                    console.log('end');
                    clearInterval(self.timer);
                    self.timer = null;
                }
            }, 1000);
        },

        walk: function () {
            this.value += this.order === 'asc' ? 1 : -1;
            if (this.value > this.max) {
                if (this.index === 0) {
                    this.value = this.max;
                    return -1;
                }
                else {
                    if (this.counter.bits[this.index - 1].walk() > -1) {
                        this.value = this.min;
                    }
                    else {
                        this.value = this.max;
                        return -1;
                    }
                }
            }
            else if (this.value < this.min) {
                if (this.index === 0) {
                    this.value = this.min;
                    return -1;
                }
                else {
                    if (this.counter.bits[this.index - 1].walk() > -1) {
                        this.value = this.max;
                    }
                    else {
                        this.value = this.min;
                        return -1;
                    }
                }
            }

            return this.value;
        }
    });

/******************************************************************************************************************************************************************/

    hg.Clock = Class(Counter, {

        init: function (args) {
            this.$super.init.call(this, args);

            this.mode = args.mode || '';
            this.gap = 27;
            this.stage = document.getElementById(args.stage);
            this.stage.width = 77 * this.length + this.gap * 2;
            this.stage.height = 132;
            this.numberImage = args.numberImage;

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

            var front = this.numberImage[0], back = this.numberImage[1], i, canvas, bit, tempCanvas, tempCtx, pixel;

            for (i = 0 ; i < this.length ; i += 1) {
                bit = this.bits[i];
                canvas = document.createElement('canvas');
                canvas.width = 77;
                canvas.height = 132;
                bit.canvas = canvas;
                bit.front = front;
                bit.back = back;
                bit.draw = this.drawNumber;

                switch (i) {
                case 2:
                case 4:
                    bit.max = 5;
                    break;
                }
            }

            tempCanvas = document.createElement('canvas');
            tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(front, 0, 0);
            pixel = tempCtx.getImageData(30, 5, 1, 1).data;
            this.ctx.fillStyle = 'rgba('+pixel[0]+', '+pixel[1]+', '+pixel[2]+', '+pixel[3]+')';

        },

        set: function (time) {
            var h, m, s;
            time = time ? new Date(time) : new Date();
            h = time.getHours();
            this.bits[0].value = Math.floor(h / 10);
            this.bits[1].value = h - this.bits[0].value * 10;

            m = time.getMinutes();
            this.bits[2].value = Math.floor(m / 10);
            this.bits[3].value = m - this.bits[2].value * 10;

            s = time.getSeconds();
            this.bits[4].value = Math.floor(s / 10);
            this.bits[5].value = s - this.bits[4].value * 10;

            for (var i = 0 ; i < this.length ; i += 1) {
                this.bits[i].draw();
            }
            this.drawStage();
        },

        walk: function () {
            var now = this.counter.$super.walk.call(this);
            if (now > -1) {
                if (this.index === 1 && this.value === 4 && this.counter.bits[0].value === 2) {
                    clearInterval(this.counter.timer);
                    this.counter.timer = null;
                    this.counter.set('December 21, 2012 00:00:00');
                    this.counter.start();
                }
                this.draw();
                this.counter.drawStage();
            }
            return now;
        },

        drawStage: function () {
            this.ctx.clearRect(0, 0, this.stage.width, 132);
            var self = this, x;
            for (var i = 0 ; i < this.length ; i += 1) {
                x = 77 * i + this.gap * (Math.floor(i / 2));
                this.ctx.drawImage(this.bits[i].canvas, x, 0);
                if (i % 2 === 1) {
                    this.ctx.rect(x + 86, 43, 9, 9);
                    this.ctx.rect(x + 86, 80, 9, 9);
                }
            }
            this.ctx.fill();
        },

        drawNumber: function () {
            var ctx, data = this.counter.numbersData[this.value], radians = Math.PI / 2, front, back;
            ctx = this.canvas.getContext('2d');
            front = this.front;
            back = this.back;

            ctx.restore();
            ctx.clearRect(0, 0, 77, 132);
            ctx.save();
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
        }
    });

/******************************************************************************************************************************************************************/

    hg.CounterT = Class(Counter, {

        init: function (args) {
            this.$super.init.call(this, args);

            this.stage = document.getElementById(args.stage);

            this.width = args.width || 28;
            this.height = args.height || 38;
            this.gap = args.gap || 5;
            this.font = args.font || 'bold 30px arial';
            this.borderColor = args.borderColor || '#808080';
            this.borderWidth = args.borderWidth || 2;
            this.fontColor = args.fontColor || '#ff5600';

            var padding = args.padding || [5, 3];
            switch (padding.length) {
            case 1:
                this.padding = [padding[0], padding[0], padding[0], padding[0]];
                break;
            case 2:
                this.padding = [padding[0], padding[1], padding[0], padding[1]];
                break;
            case 3:
                this.padding = [padding[0], padding[1], padding[2], padding[1]];
                break;
            case 4:
                this.padding = padding;
                break;
            }
            this.stage.width = this.width * this.length + this.gap * (this.length - 1);
            this.stage.height = this.height;

            this.ctx = this.stage.getContext('2d');
            this.ctx.font = this.font;
            this.ctx.strokeStyle = this.borderColor;
            this.ctx.lineWidth = this.borderWidth;
            this.ctx.fillStyle = this.fontColor;

        },

        set: function (value) {
            this.$super.set.call(this, value);
            this.drawStage();
        },

        flush: function (value, time, rate) {
            var self = this, timer, start = +new Date(), i = this.length - 1, delay = 0;
            time = time || 5000;
            rate = rate || 200;
            timer = setInterval(function () {
                (function () {
                    var num, last = Math.pow(10, this.length - i);
                    if (delay || (+new Date() - start) > time) {
                        if (i < 0) {
                            clearInterval(timer);console.log('flush ends', value)
                            return;
                        }
                        delay += 1;
                        num = Math.floor(Math.random() * Math.pow(10, i)) * last + (value - Math.floor(value / last) * last);
                        if (delay === Math.floor(1000 / rate) + 1) {
                            i -= 1;
                            delay = 1;
                        }
                    }
                    else {
                        num = Math.floor(Math.random() * Math.pow(10, this.length));
                    }
                    this.set(num);
                }).call(self);
            }, rate);
        },

        drawStage: function () {
            this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
            for (var i = 0 ; i < this.length ; i += 1) {
                this.ctx.strokeRect(this.width * i + this.gap * i + this.borderWidth / 2, this.borderWidth / 2, this.width - this.borderWidth, this.height - this.borderWidth);
                this.ctx.fillText(this.bits[i].value, this.width * i + this.gap * i + this.padding[3] + this.borderWidth, this.height - this.borderWidth - this.padding[2]);
            }
        }
    });

/******************************************************************************************************************************************************************/

    hg.CounterTH = Class(Counter, {

        init: function (args) {
            this.$super.init.call(this, args);

            this.stage = document.getElementById(args.stage);

            this.width = args.width || 28;
            this.height = args.height || 38;
            this.gap = args.gap || 5;
            this.font = args.font || 'bold 30px arial';
            this.borderColor = args.borderColor || '#808080';
            this.borderWidth = args.borderWidth || 2;
            this.fontColor = args.fontColor || '#ff5600';

            var padding = args.padding || [5, 3];
            switch (padding.length) {
            case 1:
                this.padding = [padding[0], padding[0], padding[0], padding[0]];
                break;
            case 2:
                this.padding = [padding[0], padding[1], padding[0], padding[1]];
                break;
            case 3:
                this.padding = [padding[0], padding[1], padding[2], padding[1]];
                break;
            case 4:
                this.padding = padding;
                break;
            }
            this.stage.width = this.width * this.length + this.gap * (this.length - 1);
            this.stage.height = this.height;

            this.ctx = this.stage.getContext('2d');
            this.ctx.font = this.font;
            this.ctx.strokeStyle = this.borderColor;
            this.ctx.lineWidth = this.borderWidth;
            this.ctx.fillStyle = this.fontColor;

        },

        set: function (value) {
            this.$super.set.call(this, value);
            this.drawStage();
        },

        flush: function (value, time, rate) {
            var self = this, timer, start = +new Date(), i = this.length - 1, delay = 0;
            time = time || 5000;
            rate = rate || 200;
            timer = setInterval(function () {
                (function () {
                    var num, last = Math.pow(10, this.length - i);
                    if (delay || (+new Date() - start) > time) {
                        if (i < 0) {
                            clearInterval(timer);console.log('flush ends', value)
                            return;
                        }
                        delay += 1;
                        num = Math.floor(Math.random() * Math.pow(10, i)) * last + (value - Math.floor(value / last) * last);
                        if (delay === Math.floor(1000 / rate) + 1) {
                            i -= 1;
                            delay = 1;
                        }
                    }
                    else {
                        num = Math.floor(Math.random() * Math.pow(10, this.length));
                    }
                    this.set(num);
                }).call(self);
            }, rate);
        },

        drawStage: function () {
            this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);
            for (var i = 0 ; i < this.length ; i += 1) {
                this.ctx.strokeRect(this.width * i + this.gap * i + this.borderWidth / 2, this.borderWidth / 2, this.width - this.borderWidth, this.height - this.borderWidth);
                this.ctx.fillText(this.bits[i].value, this.width * i + this.gap * i + this.padding[3] + this.borderWidth, this.height - this.borderWidth - this.padding[2]);
            }
        }
    });

/******************************************************************************************************************************************************************/

    hg.CounterIH = Class(Counter, {

        init: function (args) {
            this.$super.init.call(this, args);

            this.gap = args.gap || 0;
            this.stage = document.getElementById(args.stage);
            this.stage.width = 77 * this.length + this.gap * (this.length - 1);
            this.stage.height = 132;
            this.numberImage = args.numberImage;

            this.ctx = this.stage.getContext('2d');
            this.ctx.fillStyle = '#fff';

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

            var front = this.numberImage[0], back = this.numberImage[1], i, canvas, bit;

            for (i = 0 ; i < this.length ; i += 1) {
                bit = this.bits[i];
                canvas = document.createElement('canvas');
                canvas.width = 77;
                canvas.height = 132;
                bit.canvas = canvas;
                bit.front = front;
                bit.back = back;
                bit.draw = this.drawNumber;
            }

        },

        isAndroid: (function () {
            return navigator.userAgent.toLowerCase().indexOf("android") > -1
        })(),

        set: function (value) {
            this.$super.set.call(this, value);
            for (var i = 0 ; i < this.length ; i += 1) {
                this.bits[i].draw();
            }
            this.drawStage();
        },

        flush: function (value, time, rate) {
            var self = this, timer, start = +new Date(), i = this.length - 1, delay = 0;
            time = time || 5000;
            rate = rate || 200;
            timer = setInterval(function () {
                (function () {
                    var num, last = Math.pow(10, this.length - i);
                    if (delay || (+new Date() - start) > time) {
                        if (i < 0) {
                            clearInterval(timer);console.log('flush ends', value)
                            return;
                        }
                        delay += 1;
                        num = Math.floor(Math.random() * Math.pow(10, i)) * last + (value - Math.floor(value / last) * last);
                        if (delay === Math.floor(1000 / rate) + 1) {
                            i -= 1;
                            delay = 1;
                        }
                    }
                    else {
                        num = Math.floor(Math.random() * Math.pow(10, this.length));
                    }
                    this.set(num);
                }).call(self);
            }, rate);
        },

        walk: function () {
            var now = this.counter.$super.walk.call(this);
            if (now > -1) {
                this.draw();
                this.counter.drawStage();
            }
            return now;
        },

        drawStage: function () {
            this.ctx.clearRect(0, 0, this.stage.width, 132);
            var self = this;
            for (var i = 0 ; i < this.length ; i += 1) {
                this.ctx.drawImage(this.bits[i].canvas, 77 * i + this.gap * i, 0);
                this.ctx.rect(77 * (i + 1) + this.gap * i, 0, this.gap, 132);
            }
            this.ctx.fill();
        },

        drawNumber: function () {
            var ctx, data = this.counter.numbersData[this.value], radians = Math.PI / 2, front, back;
            ctx = this.canvas.getContext('2d');
            front = this.front;
            back = this.back;

            ctx.restore();
            ctx.clearRect(0, 0, 77, 132);
            ctx.save();
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
        }
    });

})();
