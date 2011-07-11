(function ($) {
    'use strict';
    /** @class */
    $.Class("hg.Tabs",
        /** @lends Tabs.prototype */
        {
        /**
        * hg.Slideshow is abstract class for slideshow, inherit it if you want a slideshow on webpage
        *
        * @author nhnst liuming
        * @version 20110706.3
        * @constructs
        * @requires jQuery
        * @param {Number} [gap=5000] The rate of slideshow plays
        * @param {length} length The number of slides
        * @param {Boolean} [loop=true] Indicate whether the slideshow plays loop
        * @param {Integer} [step=1] The step of slideshow moves
        */
        init: function (args) {
            args = args || {};

            var widget = $(args.widget).eq(0);
            this.nav = widget.find(args.nav);
            this.panel = widget.find(args.panel);
            this.event = args.event || 'click';

            this.index = 0;

            this.nav.each($.proxy(function (i, v) {
                $(v).bind(this.event, {index: i}, $.proxy(this.toggle, this));
            }, this));
        },
        /**
        * reset the slideshow
        * @public
        */
        toggle: function (e) {
            var from = this.index, to = e.data.index;
            if (from !== to) {
                this.panel.eq(from).hide();
                this.panel.eq(to).show();
                this.nav.eq(from).removeClass('active');
                this.nav.eq(to).addClass('active');
                this.index = to;
            }
            e.preventDefault();
            return false;
        }
    });

})(jQuery);

/******************************************************************************************************************************************************************
*******************************************************************************************************************************************************************
************************************************************************ DIVISION *********************************************************************************
*******************************************************************************************************************************************************************
******************************************************************************************************************************************************************/
(function ($) {

})(jQuery);
