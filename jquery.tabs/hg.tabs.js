(function ($) {
    'use strict';
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

})(jQuery);
