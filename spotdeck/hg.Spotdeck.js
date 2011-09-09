(function ($) {
	$.Class("hg.Spotdeck", {
		init : function (args) {
            this.list = null;
            this.slideshowClass = 'slideshow';
            this.slideClass = 'slide';
            this.controlClass = 'control';
            this.closeClass = 'close';
            this.maskClass = 'mask';

            $.extend(this, args);

            this.list = $(this.list);
            this.list.each(function (index) {
                $(this).data('index', index);
            });
            this.unit = this.list.first().width() || 120;
            this.left = this.list.offset().left + this.unit / 2;
            this.top = this.list.offset().top + this.unit / 2;

            var self = this;
            this.list.click(function () {
                if (typeof self.slideshow === 'undefined') {
                    self.slideshow = self.createSlideshow(self.list.clone(), self.slideshowClass, self.slideClass, self.controlClass, self.closeClass);
                    self.lightbox = new Lightbox({
                        box: self.slideshow,
                        maskClass: self.maskClass,
                        draggable: true
                    });
                    $('div.close', self.slideshow).click(function () {
                        self.lightbox.hide([self.left + self.unit * (self.slideshowPlayer.count - 1), self.top]);
                    });
                    self.slideshowPlayer = new Slideshow({
                        slideshow: self.slideshow,
                        slides: 'div.slide img',
                        control: 'div.control',
                        controls: 'div.control img',
                        controlClass: 'con',
                        length: 6,
                        limit: 5,
                        controlUnit: 120
                    });
                }
                var index = $(this).data('index') + 1;
                self.lightbox.show();
                self.slideshowPlayer.goto(index);
            });
		},

        createSlideshow : function (slides, slideshowClass, slideClass, controlClass, closeClass) {
            var slideshow, slide, control, close, i = 0, len = slides.length, item;
            slideshow = $('<div>').addClass(slideshowClass);
            slide = $('<div>').addClass(slideClass);
            control = $('<div>').addClass(controlClass);
            for (; i < len ; i += 1 ) {
                item = slides.eq(i);
                control.append(item.clone());
                item.attr('src', item.attr('src').replace(/_thumb/, ''));
                slide.append(item);
            }
            slideshow.append(slide);
            slideshow.append(control);
            close = $('<div>X</div>').addClass(closeClass);
            slideshow.append(close);
            return slideshow;
        }
    });
})(jQuery);
