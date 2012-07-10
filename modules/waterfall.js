define(function (require, exports, module) {

    var oop = require('oop'),
        $ = require('jquery'),
        tmpl = require('tmpl');

    exports.Waterfall = oop.Class(tmpl, {

        init: function (opt) {
            var self = this, i;
            this.opt = $.extend({
                colWidth: 'auto',
                colCount: 'auto',
                colGap: 10,
                verticalGap: 10,
                autoExpand: true,
                container: 'body',
                template: {},
                rule: function (t) {}
            }, opt, true);

            this.container = $(this.opt.container);
            this.container.css({margin: '0 auto', position: 'relative'});

            this.columnStyle = this.caculateColumnStyle({
                count: self.opt.colCount,
                width: self.opt.colWidth,
                gap: self.opt.colGap,
                availableWidth: self.container.parent().width()
            });

            this.reset();
            this.timer = null;

            $(window).bind('resize', $.proxy(this.resize, this));
            this.container.delegate('.brick', 'resize', $.proxy(this.innerResize, this));

        },

        reset: function () {
            this.columns = [];
            this.columnsHeight = [];
            for (i = 0; i < this.columnStyle.count ; i += 1) {
                this.columns.push([]);
                this.columnsHeight.push(0);
            }
            this.bricks = [];
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
                colCount = Math.max(4, Math.floor((availableWidth + colGap) / (colWidth + colGap)));
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

        push: function (bricks, partial) {
            var i, len, minIndex, brick, pos, template;
            if (typeof bricks === 'string' || typeof bricks.length !== 'number') {
                bricks = [bricks];
            }
            for (i = 0, len = bricks.length ; i < len ; i += 1) {
                if (bricks[i].jquery) {
                    brick = bricks[i];
                }
                else {
                    if (bricks[i].type === 'composite') {
                        template = '';
                        $.each(bricks[i].component, $.proxy(function (index, item) {
                            template += this.tmpl(this.opt.template[item.type], {data: item});
                        }, this));
                        bricks[i].components = template;
                        brick = $(this.tmpl(this.opt.template['composite'], {data: bricks[i]}));
                        brick.find('.brick:last').addClass('last');
                    }
                    else {
                        brick = $(this.tmpl(typeof this.opt.template === 'string' ? this.opt.template : this.opt.template[bricks[i].type], {data: bricks[i]}));
                    }
                    brick.attr('data-type', bricks[i].type);
                    this.container.append(brick);
                }

                pos = this.opt.rule(brick.attr('data-type'));
                if (pos === 'left') {
                    minIndex = 0;
                }
                else if (pos === 'right') {
                    minIndex = this.columnsHeight.length - 1;
                }
                else {
                    minIndex = this.columnsHeight.indexOf(Math.min.apply(Math, this.columnsHeight));
                }

                if (this.opt.autoExpand) {
                    brick.css('width', this.columnStyle.width + 'px');
                }
                else {
                    this.columnStyle.width = this.opt.colWidth;
                }

                brick.css('left',(this.columnStyle.width + this.columnStyle.gap) * minIndex + 'px');
                brick.css('top', this.columnsHeight[minIndex] + 'px');
                brick.c = minIndex;
                this.columns[minIndex].push(brick);
                this.columnsHeight[minIndex] += brick.height() + this.opt.verticalGap;
                if (!partial) this.bricks.push(brick);
            }
            this.container.height(Math.max.apply(Math, this.columnsHeight)).width(this.columnStyle.count * (this.columnStyle.gap + this.columnStyle.width));
        },

        resize: function () {
            clearTimeout(this.timer);
            this.timer = setTimeout($.proxy(function () {
                var oldWidth = this.container.width(), newAvailableWidth;
                this.container.width('auto');
                newAvailableWidth = this.container.parent().width();
                this.container.width(oldWidth);
                if (this.columnStyle.availableWidth !== newAvailableWidth) {
                    this.columnStyle.availableWidth = newAvailableWidth;
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
                        this.reset();
                        this.push(bricksOld);
                    }
                }
            }, this), 100);
        },

        innerResize: function (e, d) {
            var i, j, k, x, column, target = $(e.target).closest('.brick')[0];
            for (i = 0 ; i < this.columns.length ; i += 1) {
                column = this.columns[i];
                x += column.length;
                for (j = 0 ; j < column.length ; j += 1) {
                    if (target === column[j][0]) {
                        this.columns[i] = column.slice(0, j);
                        this.columnsHeight[i] = 0;
                        for (k = 0 ; k < this.columns[i].length ; k += 1) {
                            this.columnsHeight[i] += this.columns[i][k].height() + this.opt.verticalGap;
                        }
                        if (d) {
                            for (x = 0 ; x < this.bricks.length ; x += 1) {
                                if (target === this.bricks[x][0]) {
                                    this.bricks.splice(x, 1);
                                    break;
                                }
                            }
                        }
                        this.push(column.slice(d ? j + 1 : j), true);
                        return;
                    }
                }
            }
        }

    });

});
