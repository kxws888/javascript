/**
 * slider
 * @author ST13652 Liu Ming
 * @version nhst20101122
 * @description The jQuery slider plugin makes selected elements(form elements are recommend) into sliders.
 * The handle can be moved with the mouse or the arrow keys(developing).
 * There are various options such as max, min, step. 
 * options.callback is a function called when handle is moved, it contains a argument refers to the current value of slider, the this keyword in callback refers to the DOM element invoking slider.
 * options.mode indicates the mode of slider, 'basic' is used to fix the lack of HTML5 input range type implementation in IE and firefox, the style can not be changed, 'advance' is used to custom the style of slider in all browser.
 */
jQuery.fn.slider = (function ($) {
	function atomSlider(args) {
		//direction indicates the direction of slider, 1 for horizontal, 0 for vertical 
		var input = args.input, track = args.track, handle = args.handle, direction = args.direction, property, max, min, step, distance, current, unit, mousePos, trackPos, callback;
		
		max = !!args.max ? +args.max : 100;
		min = !!args.min ? +args.min : 0;
		step = !!args.step ? +args.step : 1;
		if (direction === 1) {
			distance = track.width() - handle.width();
			property = 'left';
			trackPos = track.offset().left;
		}
		else {
			distance = track.height() - handle.height();
			property = 'top';
			trackPos = track.offset().top;
		}
		callback = args.callback ?  args.callback : function () {};
		current = distance / 2;
		unit = distance * step / (max - min);
		handle.css(property, current + 'px');
		input.val(Math.floor(current / distance * (max - min) / step) * step + min);
		function moveCursor(offset) {
			current += offset;
			
			if (current < 0) {
				current = 0;
			}
			if (current > distance) {
				current = distance;
			}
			handle.css(property, current + 'px');
			input.val(Math.floor(current / distance * (max - min) / step) * step + min);
			callback();
		}
		
		function mousemoveHandler(e) {
			var pos, offset;
			if (direction === 1) {
				pos = e.pageX;
			}
			else {
				pos = e.pageY;
			}
			offset = pos - mousePos;

			if (Math.abs(offset) >= unit) {
				mousePos = pos;
				moveCursor(offset);
			}
			e.preventDefault();
			return false;
		}


		//initialize parameters necessary when mousedown event trigegrs
		handle.mousedown(function (e) {
			//get current handle position relate to document for compute the distance of handle dragged later
			if (direction === 1) {
				mousePos = e.pageX;
			}
			else {
				mousePos = e.pageY;
			}
			handle.data('dragReady', true);
			$(document).mousemove(mousemoveHandler);
			e.preventDefault();
			return false;
		});
		//when mouseup event triggers, drag ends
		$(document).mouseup(function () {
			if (handle.data('dragReady')) {
				$(document).unbind('mousemove', mousemoveHandler);
				handle.data('dragReady', false);
			}
		});
		
		//hander mouse wheel event, firefox is a little different
		if ($.browser.mozilla) {
			track[0].addEventListener('DOMMouseScroll', function (e) {
				var offset = e.detail > 0 ? 1 : -1;
				offset *= step / max * distance;
				moveCursor(offset);
				
				e.preventDefault();
				return false;
			}, false);
		}
		else {
			track[0].onmousewheel = function (e) {
				e = e || window.event;
				var offset = e.wheelDelta > 0 ? -1 : 1;
				offset *= step / max * distance;
				moveCursor(offset);
				
				if (e.preventDefault) {
					e.preventDefault();
				}
				else if (e.returnValue) {
					e.returnValue = false;
				}
				return false;
			};
		}

        handle.click(function (e) {
            e.stopPropagation();
        });
		
		track.click(function (e) {
			var pos, offset, trackPos;
			if (direction === 1) {
				pos = e.pageX;
                trackPos = $(e.target).offset().left;
			}
			else {
				pos = e.pageY;
                trackPos = $(e.target).offset().top;
			}
			offset = pos - trackPos - current;
			if (Math.abs(offset) >= unit) {
				moveCursor(offset);
			}
		});
		
		
	}
	
	
	function iSlider(args) {
		var oThis = this;
		if (args.mode === 'basic') {
			this.each(function () {
				if (this.type === 'range') {
					return oThis;
				}
				
				var self = $(this), handle, track, path, sPosition, opt;
				
				opt = $.extend(iSlider.defaults, args);
				
				self.css({
					display : 'none'
				});
				
				sPosition = self.css('position');
				if (sPosition === 'static') {
					sPosition = 'relative'; 
				}
				track = $('<div>').css({
					width : self.width(),
					height : self.height(),
					margin : self.css('margin'),
					position : sPosition,
					display : 'inline-block'
				}).insertBefore(self);
				
				handle = $('<div>').css({
					position : 'absolute',
					top : '0',
					height : self.height(),
					width : '10px',
					background : '#000',
					zIndex : '10'
				}).appendTo(track);
				
				path = $('<div>').css({
					height : '2px',
					background : '#000',
					position : 'relative',
					top : (self.height() - 2) / 2
				}).appendTo(track);
				
				atomSlider({
					track : track,
					handle : handle,
					input : self,
					max : self.attr('max'),
					min : self.attr('min'),
					step : self.attr('step'),
					direction : 1,
					callback : function () {
						opt.callback.call(self[0]);
					}
				});
				
			});
		}
		else {
			this.each(function () {
				var self = $(this), handle, track, path, opt;
				
				opt = $.extend(iSlider.defaults, args);
				
				self.css({
					display : 'none'
				});
				
				track = $('<div>').addClass(opt.trackClass).insertBefore(self);
				
				handle = $('<div>').addClass(opt.handleClass).appendTo(track);
				
				path = $('<div>').addClass(opt.pathClass).appendTo(track);
				
				atomSlider({
					track : track,
					handle : handle,
					input : self,
					max : opt.max,
					min : opt.min,
					step : opt.step,
					direction : opt.direction,
					callback : function () {
						opt.callback.call(self[0]);
					}
				});
				
			});
		}
		return this;
	}
	
	iSlider.defaults = {
		mode : 'basic',
		handleClass : '',
		trackClass : '',
		pathClass : '',
		direction : 1,
		max : 100,
		min : 0,
		step : 1,
		callback : function () {}
	};
	
	return iSlider;
	
})(jQuery);

