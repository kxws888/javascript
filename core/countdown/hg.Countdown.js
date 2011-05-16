/**
 * hg.Countdown is base on jQuery
 * @author st13652 Liu Ming
 * @version 2.0
 * @param {String} container  a css selecter string of countdown body
 * @param {String} mode indicate the mode
 * @param {String} day  a css selecter string of day frame
 * @param {String} hour  a css selecter string of hour frame
 * @param {String} minute  a css selecter string of minute frame
 * @param {String} second  a css selecter string of second frame
 * @param {Number} unit  specify the height of time frame
 * @param {Number} rest time of rest
 * @param {String} redictUrl
 * @param {String} requestUrl
*/
(function ($) {
    'use strict';
    $.Class('hg.Countdown', {
        //declaration one variable for every time frame, for example, dl is a shortcut of dayLeft, the '$' prefix tells it's a jQuery object
        init : function (args) {
            this.args = $.extend({
                container : '.countdown',
                mode: 'dhms',
                day : '.d',
                hour : '.h',
                minute : '.m',
                second : '.s',
                unit : 40,
                rest : 54421,
                redictUrl: '',
                requestUrl: ''
            }, args);

            if (!/^d?h?m?s?\b$/.test(this.args.mode)) {
                return;
            }

            this.timer = null;
            this.anims = [];
            this.timeUnit = [];

            var self = this, i = 0, j = 0, iLen, jLen, tmp, container = $(this.args.container), $d, $h, $m, $s, d, h, m, s, offset = this.args.rest, unit = this.args.unit;
            for (iLen = this.args.mode.length ; i < iLen ; i += 1) {
                switch (this.args.mode.charAt(i)) {
                    case 'd':
                        $d = $(this.args.day, container);
                        d = Math.floor(offset / 86400);
                        offset -= d * 86400;
                        this.timeUnit.push({
                            jquery: $d,
                            value: d
                        });
                        break;
                    case 'h':
                        $h = $(this.args.hour, container);
                        h = Math.floor(offset / 3600);
                        offset -= h * 3600;
                        this.timeUnit.push({
                            jquery: $h,
                            value: h,
                            max: 24
                        });
                        break;
                    case 'm':
                        $m = $(this.args.minute, container);
                        m = Math.floor(offset / 60);
                        offset -= m * 60;
                        this.timeUnit.push({
                            jquery: $m,
                            value: m,
                            max: 60
                        });
                        break;
                    case 's':
                        $s = $(this.args.second, container);
                        s = offset;
                        this.timeUnit.push({
                            jquery: $s,
                            value: s,
                            max: 60
                        });
                        break;
                }
            }

            for (i = 0, iLen = this.timeUnit.length ; i < iLen ; i += 1) {
                tmp = this.timeUnit[i];
                for (j = 0, jLen = tmp.jquery.length ; j < jLen ; j += 1) {
                    tmp.jquery.eq(j).css('top', -unit * Math.floor(tmp.value % Math.pow(10, (jLen - j)) / Math.pow(10, (jLen - j - 1))));
                }
            }

            this.timeUnit.reverse();

            this.timer = setInterval(function () {
                if (!self.update(0)) {
                    clearInterval(self.timer);
                    self.complete();
                }
            }, 1000);

        },
        complete: function () {
            var self = this;
            $.ajax({
                url: self.args.requestUrl,
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    if (data && data.rest) {
                        self.initTime(data.rest);
                    }
                    else {
                        window.location.href = self.args.redictUrl;
                    }
                },
                error: function () {
                    window.location.href = window.location.href;
                }
            })
        },

        update : function (deep) {
            var $s = this.timeUnit[deep].jquery, s = this.timeUnit[deep].value;
            s -= 1;
            if (s === -1) {
                if (this.timeUnit[deep + 1] && this.update(deep + 1)) {
                    s = this.timeUnit[deep + 1].max - 1;
                }
                else {
                    s = 0;
                    return false;
                }
            }
            this.compare(this.timeUnit[deep].value, s, $s.length, function (index, from, to) {
                if (deep === 0 && index === $s.length - 1) {
                    this.jitter($s.eq(index), from, to);
                }
                else {
                    this.uniform($s.eq(index), from, to);
                }
            });
            this.timeUnit[deep].value = s;
            return true;
        },

        compare : function (obj1, obj2, len, callback) {
            obj1 = String.prototype.split.call(obj1, '').reverse();
            obj2 = String.prototype.split.call(obj2, '').reverse();

            var i = 0;

            for (; i < len ; i += 1) {
                if (obj1[i] !== obj2[i]) {
                    callback.call(this, len - 1 - i,  typeof obj1[i] === 'undefined' ? 0 : obj1[i], typeof obj2[i] === 'undefined' ? 0 : obj2[i]);
                }
            }
        },
        //uniform effect
        uniform : function (elem, from, to) {
            if (from === 0) {
                from = to + 1;
                elem.css('top', -this.args.unit * from + 'px');
            }
            to = to * this.args.unit;
            this.anims.push({
                node: elem,
                to: to
            });
        },
        //jitter effect
        jitter : function (elem, from, to) {
            var othis = this;
            if (from === 0) {
                from = to + 1;
                elem.css('top', -this.args.unit * from + 'px');
            }
            to = to * this.args.unit;
            elem.animate({
                top: -to
            }, 100).animate({
                top: '-=10'
            }, 50).animate({
                top: '+=10'
            }, 50, function () {
                (function call() {
                    var anim = othis.anims[othis.anims.length - 1];
                    if (!anim) {
                        return;
                    }
                    anim.node.animate({
                        top: -anim.to + 'px'
                    }, 200, function () {
                        othis.anims = othis.anims.slice(0, othis.anims.length - 1);
                        call();
                    });
                })();
            });
        }
    });
})(jQuery);

