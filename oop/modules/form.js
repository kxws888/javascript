define('form', ['jquery'], function (require, exports) {
    /** @class */
    exports.Placeholder = Class(
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

});
