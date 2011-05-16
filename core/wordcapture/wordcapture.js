/**
 * Wordcapture
 * This is a highly extensible scrollbar versus regular scrollbar.
 * @author viclm
 * @version 0.1 20110509
 * @license New BSD License
*/

'use strict';

Class('Wordcapture', {

    init: function (args) {
        this.area = args && args.area || document.body;
        this.isHover = args && args.isHover || true;

        if (this.hover) {
            dom.addEvent(this.area, 'mousemove', dom.proxy(this.hover, this));
        }
    },

    hover: function (e) {
        var target = e.target;
    },

    text: function (elem) {
        
    }
});



