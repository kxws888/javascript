(function ($) {
    var animate = $.fn.animate;
    $.fn.animate = function (prop, speed, easing, callback) {
        if (typeof this[0].style['-webkit-transition'] === 'string') {
            var options;
            if (typeof arguments[1] === 'object') {
                options = $.extend({
                
                }, arguments[1]);
            }
            this.each(function () {
                
            });     
        }
        else {
            animate.apply(this, arguments);    
        }
            
        return this;
    }

})(jQuery)
