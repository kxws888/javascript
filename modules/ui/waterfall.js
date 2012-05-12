define('waterfall', ['core/jquery', 'core/tmpl', 'core/es5'], function (require, exports) {

    var $ = jQuery,
        tmpl = require('tmpl');

    exports.Waterfall = Class('Waterfall', tmpl, {

        init: function (opt) {
            var self = this, i;
            this.opt = $.extend({
                colWidth: 'auto',
                colCount: 'auto',
                colGap: 10,
                verticalGap: 10,
                autoExpand: true,
                container: 'body',
                template: ''
            }, opt);

            this.container = $(this.opt.container);

            this.columnStyle = this.caculateColumnStyle({
                count: self.opt.colCount,
                width: self.opt.colWidth,
                gap: self.opt.gap,
                availableWidth: self.container.width()
            });

            this.columnsHeight = [];
            for (i = 0; i < this.columnStyle.count ; i += 1) {
                this.columnsHeight.push(0);
            }
            this.bricks = [];

            this.timer = null;

            $(window).bind('resize', $.proxy(this.resize, this));

        },

        caculateColumnStyle: function (columnStyle) {

            var colWidth = columnStyle.width || 'auto',
            colCount = columnStyle.count || 'auto',
            colGap = columnStyle.gap || 12,
            availableWidth = columnStyle.availableWidth || 0;

            if (typeof colCount === 'number' && colWidth === 'auto') {
                colCount = colCount;
                colWidth = Math.max(0, (availableWidth - ((colCount - 1) * colGap)) / colCount);
            }
            else if (colCount === 'auto' && typeof colWidth === 'number'){
                colCount = Math.max(1, Math.floor((availableWidth + colGap) / (colWidth + colGap)));
                colWidth = (availableWidth + colGap) / colCount - colGap;
            }
            else if (typeof colCount === 'number' && typeof colWidth === 'number') {
                colCount = Math.min(colCount, Math.floor((availableWidth + colGap) / (colWidth + colGap)))
                colWidth = (availableWidth + colGap) / colCount - colGap;
            }
            else {
                throw 'wrong params of column';
            }

            return {
                count: colCount,
                width: colWidth,
                gap: colGap,
                availableWidth: availableWidth
            };
        },

        push: function (bricks) {
            var i, len, minIndex, brick;
            if (typeof bricks === 'string' || typeof bricks.length !== 'number') {
                bricks = [bricks];
            }
            for (i = 0, len = bricks.length ; i < len ; i += 1) {
                minIndex = this.columnsHeight.indexOf(Math.min.apply(Math, this.columnsHeight));
                if (bricks[i].jquery) {
                    brick = bricks[i];
                    if (this.opt.autoExpand) {
                        brick.css('width', this.columnStyle.width + 'px');
                    }
                    else {
                        this.columnStyle.width = this.opt.colWidth;
                    }
                    brick.css('left',(this.columnStyle.width + this.columnStyle.gap) * minIndex + 'px');
                    brick.css('top', this.columnsHeight[minIndex] + 'px');
                }
                else {
                    bricks[i].height = this.columnStyle.width * Number(bricks[i].height) / Number(bricks[i].width)
                    brick = $(this.tmpl(this.opt.template, {data: bricks[i]}));
                    if (this.opt.autoExpand) {
                        brick.css('width', this.columnStyle.width + 'px');
                    }
                    else {
                        this.columnStyle.width = this.opt.colWidth;
                    }
                    brick.css('left',(this.columnStyle.width + this.columnStyle.gap) * minIndex + 'px');
                    brick.css('top', this.columnsHeight[minIndex] + 'px');
                    this.container.append(brick);
                }
                this.columnsHeight[minIndex] += brick.height() + this.opt.verticalGap;
                this.bricks.push(brick);
            }
            this.container.height(Math.max.apply(Math, this.columnsHeight));
        },

        resize: function () {
            clearTimeout(this.timer);
            this.timer = setTimeout($.proxy(function () {
                if (this.columnStyle.availableWidth !== this.container.width()) {
                    this.columnStyle.availableWidth = this.container.width();
                    var colCountOld = this.columnStyle.count,
                        bricksOld = this.bricks,
                        self = this,
                        i;
                    this.columnStyle = this.caculateColumnStyle({
                        count: self.opt.colCount,
                        width: self.opt.colWidth,
                        gap: self.opt.gap,
                        availableWidth: self.columnStyle.availableWidth
                    });
                    if (this.opt.autoExpand || colCountOld !== this.columnStyle.count) {
                        this.columnsHeight = [];
                        for (i = 0 ; i < this.columnStyle.count ; i += 1) {
                            this.columnsHeight.push(0);
                        }
                        this.bricks = [];
                        this.push(bricksOld);
                    }
                }
            }, this), 100);
        }

    });

});
