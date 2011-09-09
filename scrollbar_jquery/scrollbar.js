/**
 * Scrollbar
 * A scrollbar implement by javascrit replace regular scrollbar of browser
 * @author ST_13652 Liu Ming
*/
(function ($) {
    $.extend($.fn, {
        scrollbar : function (args) {
            args = args || {};
            var opt = {
                content : args.content || '.content',
                scrollbar : args.scrollbar || '#scrollbar',
                slider : args.slider || '.slider',
                slidershadow : args.slidershadow || '.slider_shadow',
                sliderup : args.sliderup || '.slider_up',
                sliderdown : args.sliderdown || '.slider_down',
                direction : args.direction || 'vertical',
                dynamicDataInterface : args.dynamicDataInterface || function () {},//the interface for loading data dynamically
                page : args.page || 5
            };
            // 5 is max
            if (opt.page > 5) {
                opt.page = 5;
            }

            var contentContainer = $(opt.content, this);
            var contentBody = $(':first-child', contentContainer);
            var scrollbar = $(opt.scrollbar, this);
            var slider = $(opt.slider, scrollbar);
            var slidershadow = $(opt.slidershadow, scrollbar);
            var sliderup = $(opt.sliderup, slider);
            var sliderdown = $(opt.sliderdown, slider);
            var contentContainerSize = 0, contentBodySize = 0, scrollbarSize = 0, sliderSize = 0;
            var property = '';
            var contentOffset = 0, sliderOffset = 0, slidershadowOffset = 0, cursorOffset = 0;
            var dymanicLoadQueue = [];

            opt.dynamicDataInterface(function () {
                if (opt.direction === 'horizontal') {
                    contentContainerSize = contentContainer.width();
                    contentBodySize = contentBody.width();
                    scrollbarSize = contentContainerSize / 5 * opt.page;
                    scrollbar.width(scrollbarSize);
                    sliderSize = bar.width();
                    property = 'left';
                }
                else {
                    contentContainerSize = contentContainer.height();
                    contentBodySize = contentBody.height();
                    scrollbarSize = contentContainerSize / 5 * opt.page;
                    scrollbar.height(scrollbarSize);
                    sliderSize = slider.height();
                    property = 'top';
                }
                contentBodySize = contentBodySize * opt.page - contentContainerSize;
                scrollbarSize -= sliderSize;

                var unit = scrollbarSize / opt.page / 2;
                for (var i = 1, len = opt.page ; i < len ; i++) {
                    dymanicLoadQueue[i-1] = unit * i;
                }
            }, this);

            setStyle();

            //initialize parameters necessary when mousedown event trigegrs
            slider.mousedown(function (e) {
                //get current cursor position relate to document for compute the distance of cursor dragged later
                if (opt.direction === 'horizontal') {
                    cursorOffset = e.pageX;
                }
                else {
                    cursorOffset = e.pageY;
                }
                //mark the status of mousedown, the drag behavior will only work when it is true
                this.$ondrag = true;
                //mark the status of drag, the click event will only be triggered when it is true, it is for the situation when drag the slider bar holding the arrow button
                this.$draged = false;
                return false;
            });
            //when mouseup event triggers, drag ends
            $(document).mouseup(function () {
                slider.get(0).$ondrag = false;
                //hide the slider shadow when mouseup event triggers only if the shadow was made by draging
                if (!slidershadow.$onclick) {
                    slidershadow.hide();
                }
            });
            //drag
            $(document).mousemove(function (e) {
                if (slider.get(0).$ondrag) {
                    slider.get(0).$draged = true;
                    var currentOffset = 0;
                    if (opt.direction === 'horizontal') {
                        currentOffset = e.pageX;
                    }
                    else {
                        currentOffset = e.pageY;
                    }

                    var offset = currentOffset - cursorOffset;
                    cursorOffset = currentOffset;
                    //drag slider when slider and slider shaow are not in the same place, the distance needed move of slider and slider shaow are different
                    var shadowoffset = offset + sliderOffset - slidershadowOffset;

                    scroll(offset, shadowoffset);
                    scrollBar(false);
                    scrollShadow(true);
                    scrollContent(true);

                    return false;
                }
            });
            //hander mouse wheel event, firefox is a little different
            if ($.browser.mozilla) {
                contentContainer.get(0).addEventListener('DOMMouseScroll', function (e) {
                    var offset = e.detail > 0 ? 1 : -1;
                    offset *= scrollbarSize / 50;
                    scroll(offset, offset);
                    scrollContent(false);
                    scrollShadow(false);
                    scrollBar(false);
                    e.preventDefault();
                    return false;
                }, false);
            }
            else {
                contentContainer.get(0).onmousewheel = function (e) {
                    e = e || window.event;
                    var offset = e.wheelDelta > 0 ? -1 : 1;
                    offset *= scrollbarSize / 50;
                    scroll(offset, offset);
                    scrollContent(false);
                    scrollShadow(false);
                    scrollBar(false);
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    else if (e.returnValue) {
                        e.returnValue = false;
                    }
                    return false;
                };
            }

            //this is for identification the two different arrow
            sliderup.get(0).$prev = true;
            //click the arrow
            sliderup.click(clickHandler);
            sliderdown.click(clickHandler);

            //when mouseout event triggers, sync the position of slider and shadow
            slider.mouseout(function () {
                if (slidershadow.$onclick) {
                    sliderOffset = slidershadowOffset;
                    scrollBar(true, function () {
                        slidershadow.$onclick = false;
                        slidershadow.hide();
                    });
                }

            })

            function clickHandler (e) {
                if (!slider.get(0).$draged) {
                    var offset = scrollbarSize / 10;
                    if (this.$prev) {
                        offset = -offset;
                    }
                    slidershadow.$onclick = true;
                    scroll(0, offset);
                    scrollContent(true);
                    scrollShadow(true);
                }
                e.preventDefault();
                return false;
            }
            //set style necessary in case of lack of css
            function setStyle () {
                var contentPosition = contentBody.css('position');
                if (contentPosition !== 'relative' && contentPosition !== 'absolute') {
                    contentBody.css('position', 'relative');
                }
                if (slider !== 'absolute') {
                    slider.css('position', 'absolute');
                }
                if (slidershadow !== 'absolute') {
                    slidershadow.css('position', 'absolute');
                }
                slidershadow.hide();
            }

            //when slider position changes, update parameters
            function scroll (offset, shadowoffset) {
                sliderOffset += offset;
                slidershadowOffset += shadowoffset;

                if (sliderOffset < 0) {
                    sliderOffset = 0;
                }
                else if (sliderOffset > scrollbarSize) {
                    sliderOffset = scrollbarSize;
                }

                if (slidershadowOffset < 0) {
                    slidershadowOffset = 0;
                }
                else if (slidershadowOffset > scrollbarSize) {
                    slidershadowOffset = scrollbarSize;
                }
                //load data dymanically
                if (dymanicLoadQueue[0] && slidershadowOffset >= dymanicLoadQueue[0]) {
                    opt.dynamicDataInterface();
                    dymanicLoadQueue = dymanicLoadQueue.slice(1);
                }
            }
            //change the postion of slider
            //param anim is a bool for animation switch
            //param callback is a function triggers when animation ends
            //parama are same in scrollShadow,scrollContent 
            function scrollBar (anim, callback) {
                if (!anim) {
                    slider.css(property, sliderOffset);
                }
                else {
                    callback = callback || function(){};
                    var obj = {};
                    obj[property] = sliderOffset;
                    slider.animate(obj, 200, callback);
                }
            }
            //change the postion of slider shadow,the timer is used for performance optimization
            function scrollShadow (anim, callback) {
                if (!anim) {
                    slidershadow.css(property, slidershadowOffset);
                }
                else if (!scrollShadow.$timer) {
                    callback = callback || function(){};
                    scrollShadow.$timer = setTimeout(function () {
                        slidershadow.show();
                        var obj = {};
                        obj[property] = slidershadowOffset;
                        slidershadow.stop();
                        slidershadow.animate(obj, 200, callback);
                        scrollShadow.$timer = null;
                    }, 250);
                }
            }
            scrollShadow.$timer = null;
            //change the postion of content, the timer is used for performance optimization
            function scrollContent (anim) {
                if (!anim) {
                    var ratio = slidershadowOffset / scrollbarSize;
                    contentOffset = -contentBodySize * ratio;
                    contentBody.css(property, contentOffset);
                    return;
                }
                if (!scrollContent.$timer) {
                    scrollContent.$timer = setTimeout(function () {
                        var ratio = slidershadowOffset / scrollbarSize;
                        contentOffset = -contentBodySize * ratio;
                        var obj = {};
                        obj[property] = contentOffset;
                        contentBody.stop();
                        contentBody.animate(obj, 250);
                        scrollContent.$timer = null;
                    }, 250);
                }
            }
            scrollContent.$timer = null;

        }
    })
})(jQuery)
