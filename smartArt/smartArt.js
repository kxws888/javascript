/**
 * SmartArt
 * @author st13652
 * @version 1.1
 */
(function ($) {

    var document = window.document;

    var isSupportCanvas = (function () {
        var canvas = document.createElement('canvas');
        return !!canvas.getContext;
    })();

    function extend (first, second) {
        second = second || {};
        var obj = {}, x;
        for(x in first) {
            obj[x] = first[x];
        }
        for(x in second) {
            obj[x] = second[x];
        }
        return obj;
    }

    var SmartArt = function (args) {
        return new SmartArtInit(args);
    };

    function SmartArtInit(args) {

        var opt, chart, sliders, indicator, polygon, range, base, data = [], i = 0, len = 5, grade;

        opt = extend(SmartArtInit.defaults, args);
        chart = $(opt.chart);
        sliders = $(opt.sliders);

        for (; i < len ; i ++) {
            sliders[i].index = i;
            data[i] = opt.radius / 2;
        }

        grade = 50;

        polygon = new Polygon({
            radius: opt.radius,
            fillColor: opt.fillColor,
            strokeColor: opt.strokeColor
        });

        polygon.draw.apply(polygon, data);
        chart.append(polygon.getCanvas());

        chart[0].style.position = 'relative';
        polygon.getCanvas().style.cssText = 'position: absolute; z-index: 100; left: ' + (opt.strokeWidth - 1) + 'px; top: ' + (opt.strokeWidth - 1) + 'px';

        range = new Polygon({
            radius: opt.radius,
            fillColor: '#fff',
            strokeColor: opt.strokeColor,
            strokeWidth: opt.strokeWidth
        });

        range.draw(opt.radius, opt.radius, opt.radius, opt.radius, opt.radius);
        range.drawPath();
        chart.append(range.getCanvas());

        sliders.slider({
            mode: 'advance',
            handleClass : opt.handleClass,
            trackClass : opt.trackClass,
            pathClass : opt.pathClass,
            direction : opt.direction,
            max : opt.max,
            min : opt.min,
            step : opt.step,
            callback : function () {
                data[this.index] = this.value * opt.radius / opt.max;
                polygon.draw.apply(polygon, data);
                for (var i = 0, len = data.length, grade = 0 ; i < len ; i += 1) {
                    grade += data[i];
                }
                grade = parseInt(grade / len * 100 / opt.radius, 10);
                indicator.setValue(grade);
            }
        });

        indicator = new Indicator();
        indicator.getCanvas().style.cssText = 'position: absolute; z-index: 200; left: -110px; top: -80px;'
        chart.append(indicator.getCanvas());

    }

    SmartArtInit.defaults = {
        radius: 100,
        fillColor: 'rgba(244, 135, 194, 0.5)',
        strokeColor: '#b73378',
        strokeWidth: 10,

        handleClass: '',
        trackClass: '',
        pathClass: '',
        direction: 1,
        max: 100,
        min: 0,
        step: 1,

        chart: '',
        sliders: ''
    };

    function Polygon(args) {

        var SIN18, COS18, SIN36, COS36, opt, size, canvas, ctx, pro, rate = 0.75, offset, radius;

        SIN18 = Math.sin(Math.PI / 180 * 18);
        COS18 = Math.cos(Math.PI / 180 * 18);
        SIN36 = Math.sin(Math.PI / 180 * 36);
        COS36 = Math.cos(Math.PI / 180 * 36);

        opt = extend(Polygon.defaults, args);

        width = 2 * COS18 * opt.radius;
        height = (1 + COS36) * opt.radius;

        if (isSupportCanvas) {
            canvas = document.createElement('canvas');
            canvas.width = width + opt.strokeWidth * 2;
            canvas.height = height + opt.strokeWidth * 2;
            ctx = canvas.getContext('2d');
            ctx.translate(opt.strokeWidth, opt.strokeWidth);
            ctx.lineJoin = 'round';
        }
        else {
            //document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
            canvas = ctx = document.createElement('v:polyline');
            ctx.strokecolor = opt.strokeColor;
            ctx.strokeweight = opt.strokeWidth + 'px';
            ctx.fillcolor = opt.fillColor;
        }



        function extend (first, second) {
            second = second || {};
            var obj = {}, x;
            for(x in first) {
                obj[x] = first[x];
            }
            for(x in second) {
                obj[x] = second[x];
            }
            return obj;
        }

        this.getCanvas = function () {
            return canvas;
        };

        this.draw = function () {
            if(!isSupportCanvas) {
                this.draw = function () {
                    var points = [];

                    points[points.length] = width / 2;
                    points[points.length] = opt.radius - arguments[0];
                    points[points.length] = width / 2 + arguments[1] * COS18 ;
                    points[points.length] = height / 2 - arguments[1] * SIN18 ;
                    points[points.length] = arguments[2] * SIN36 + width / 2 ;
                    points[points.length] = opt.radius + arguments[2] * COS36 ;
                    points[points.length] = width / 2 - arguments[3] * SIN36 ;
                    points[points.length] = opt.radius + arguments[3] * COS36 ;
                    points[points.length] = width / 2 - arguments[4] * COS18 ;
                    points[points.length] = height / 2 - arguments[4] * SIN18 ;
                    points[points.length] = width / 2 ;
                    points[points.length] = opt.radius - arguments[0];

                    for (var i = 0, len = points.length ; i < len ; i += 1) {
                        points[i] = points[i] * rate;
                    }
                    ctx.points ? ctx.points.value = points.join('pt,') + 'pt' : ctx.points = points.join('pt,') + 'pt';
                };
            }
            else {
                this.draw = function () {
                    ctx.clearRect(0, 0, width, height);
                    ctx.beginPath();
                    ctx.fillStyle = opt.fillColor;
                    ctx.lineWidth = opt.strokeWidth;
                    ctx.strokeStyle = opt.strokeColor;
                    ctx.moveTo(width / 2, opt.radius - arguments[0]);
                    ctx.lineTo(width / 2 + arguments[1] * COS18, opt.radius - arguments[1] * SIN18);
                    ctx.lineTo(arguments[2] * SIN36 + width / 2, opt.radius + arguments[2] * COS36);
                    ctx.lineTo(width / 2 - arguments[3] * SIN36, opt.radius + arguments[3] * COS36);
                    ctx.lineTo(width / 2 - arguments[4] * COS18, opt.radius - arguments[4] * SIN18);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill();
                }
            }
            return this.draw.apply(this, Array.prototype.slice.call(arguments));

        };

        this.drawPath = function () {
            var i, len = 5, tmp, unit = opt.radius / 5, end = 2 * Math.PI;
            ctx.beginPath();
            ctx.fillStyle = opt.strokeColor;
            for (i = 1 ; i < len ; i += 1) {
                ctx.moveTo(width / 2, unit * i);
                ctx.arc(width / 2, unit * i, 2, 0, end, true);
            }
            for (i = 1 ; i < len ; i += 1) {
                ctx.moveTo(width / 2 + unit * i * COS18, opt.radius - unit * i * SIN18);
                ctx.arc(width / 2 + unit * i * COS18, opt.radius - unit * i * SIN18, 2, 0, end, true);
            }
            for (i = 1 ; i < len ; i += 1) {
                ctx.moveTo(unit * i * SIN36 + width / 2, opt.radius + unit * i * COS36);
                ctx.arc(unit * i * SIN36 + width / 2, opt.radius + unit * i * COS36, 2, 0, end, true);
            }
            for (i = 1 ; i < len ; i += 1) {
                ctx.moveTo(width / 2 - unit * i * SIN36, opt.radius + unit * i * COS36);
                ctx.arc(width / 2 - unit * i * SIN36, opt.radius + unit * i * COS36, 2, 0, end, true);
            }
            for (i = 1 ; i < len ; i += 1) {
                ctx.moveTo(width / 2 - unit * i * COS18, opt.radius - unit * i * SIN18);
                ctx.arc(width / 2 - unit * i * COS18, opt.radius - unit * i * SIN18, 2, 0, end, true);
            }
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = opt.strokeColor;
            ctx.arc(width / 2, opt.radius, 5, 0, end, true);
            ctx.stroke();
        };

    }

    Polygon.defaults = {
        radius: 100,
        fillColor: '#f00',
        strokeColor: '#000',
        strokeWidth: 1
    };

    function Indicator(args) {
        var canvas, ctx;

        args = extend(Indicator.defaults, args);

        canvas = document.createElement('canvas');
        canvas.width = args.width;
        canvas.height = args.height;
        ctx = canvas.getContext('2d');
        createOutline();

        this.getCanvas = function () {
            return canvas;
        };

        this.setValue = function (num) {
            var x = 35, y = 40, from = y + 20;

            (function () {
                if (y > from) {
                    return;
                }
                ctx.clearRect(0, 0, args.width, args.height);
                createOutline();
                createCounter(num, 35, from--);
                setTimeout(arguments.callee, 0);
            })();
        };

        function createOutline() {
            if (isSupportCanvas) {
                ctx.beginPath();
                ctx.fillStyle = args.bgColor;
                ctx.moveTo(77, 36);
                ctx.bezierCurveTo(75, 8, 60, 1, 40, 1);
                ctx.bezierCurveTo(17, 0, 0, 17, 0, 40);
                ctx.bezierCurveTo(1, 71, 30, 114, 109, 125);
                ctx.bezierCurveTo(75, 111, 102, 93, 118, 76);
                ctx.bezierCurveTo(124, 69, 125, 57, 124, 51);
                ctx.bezierCurveTo(123, 32, 96, 20, 77, 36);
                ctx.fill();
            }
        }

        function createCounter(num, x, y) {
            if (isSupportCanvas) {
                ctx.fillStyle = args.color;
                ctx.font = "bold 48px Arial";
                ctx.textBaseline = "top";
                ctx.fillText(num + '', x, y);
            }
        }
    }

    Indicator.defaults = {
        width: 125,
        height: 125,
        color: '#fff',
        bgColor: '#f00',
        value: 50
    }

    window['SmartArt'] = SmartArt;




})(jQuery);
