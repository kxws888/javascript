(function(namespace){
	/**
	 * Necessary function  not included in jindo2.1.2.2
	 * Determin how far horizontally or vertically the browser is scrolled
	 */
	function scrollX() {
		var de = document.documentElement;
		return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft;
	}
	function scrollY() {
		var de = document.documentElement;
		return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop;
	}
	
	/**
	 * Class for pop box, this is just for alert box, actually, the pop layer of selecting dress should inherit from it
	 * @param {String} sId DOM id
	 * @param {String} sMessage Reminder message
	 * @param {Number} nStype type of pop box
	 */
	var Dialog = $.verifyPackageName(namespace);
	Dialog.container[Dialog.name] = $Class({
		fCallback : null,
		
//		$static : {
//			nCounter : 0
//		},
		
		$init : function () {
			Dialog.nCounter += 1;
			this.elContainer = $('<div>');
			this.elInnerContainer = $('<div>');
			this.elHeader = $('<h3>');
			this.elMessage = $('<p>');
			this.elConfirmButton = $('<input type="button" value="OK"/>');
			this.elCancelButton = $('<input type="button" value="Cancel"/>');
			
			this.elContainer.id = 'lm_dialog_' + Dialog.nCounter;
			$Element(this.elContainer).css({
				position : 'absolute',
				width : '350px',
				borderRadius : '5px',
				backgroundColor : 'rgba(0,0,0,.5)',
				overflow : 'hidden',
				zIndex : 100
			});
			if (/MSIE/.test(window.navigator.userAgent)) {
				$Element(this.elContainer).css({
					backgroundColor : '#000',
					filter : 'Alpha(opacity=80)',
				});
			}
			$Element(this.elInnerContainer).css({
				backgroundColor : '#ffffff',
				textAlign : 'right',
				margin : '8px'
			});
			$Element(this.elHeader).css({
				backgroundColor : '#ffffcc',
				height : '20px',
				lineHeight : '20px',
				textAlign : 'center',
				borderBottom : '1px solid #757575'
			});
			$Element(this.elMessage).css({
				padding : '10px 20px',
				textAlign : 'left'
			});
			$Element(this.elConfirmButton).css({
				marginBottom : '8px',
				marginRight : '8px',
				width : '60px',
				border : '1px solid #757575',
				backgroundColor : '#ffffcc',
				fontSize : '10px'
			});
			$Element(this.elCancelButton).css({
				marginBottom : '8px',
				marginRight : '8px',
				width : '60px',
				border : '1px solid #757575',
				backgroundColor : '#ffffcc',
				fontSize : '10px'
			});
			
			this.elInnerContainer.appendChild(this.elHeader);
			this.elInnerContainer.appendChild(this.elMessage);
			this.elInnerContainer.appendChild(this.elConfirmButton);
			this.elInnerContainer.appendChild(this.elCancelButton);
			this.elContainer.appendChild(this.elInnerContainer);
			document.body.appendChild(this.elContainer);
			
			$Fn(this.close, this).attach(this.elCancelButton, 'click', false);
			$Fn(this._drag, this).attach(this.elContainer, 'mousedown', false);
			$Fn(this._shake, this).attach(document, 'click', false);
			$Fn(this.close, this).attach(this.elConfirmButton, 'click', false);
				
			this.options = this._initOptions(arguments[0]);
			
			this.elHeader.innerHTML = this.options.header;
			this.elMessage.innerHTML = this.options.content;
			if (this.options.type === 1) {
				this.elConfirmButton.style.display = 'none';
				this.elCancelButton.value = 'Close';
			} else if (this.options.type === 2) {
				this.elConfirmButton.style.display = '';
				this.elCancelButton.value = 'Cancel';
			}
			
			this.open();
		},
		_initOptions : function(args){
            var options = {
				type : 1,
				header : 'Dialog',
				content : ''
            };
            if (typeof args == "undefined") args = {};
            for (var i in args) {
				if (options[i] !== "undefined") {
					options[i] = args[i];
				}
			}			
			return options;
        },
		//open the box
		open : function () {
			var welNode = $Element(this.elContainer);
			var width = welNode.width();
			var height = welNode.height();
			var left = ($Document(document).clientSize().width - width) / 2 + scrollX() + 'px';
			var top = ($Document(document).clientSize().height - height) / 2 + scrollY() + 'px';
			welNode.css({
				top: top,
				left: left
			});
			this._animate(this.elContainer, 'height', 0, height, 10);
			this._setBackGround();
		},
		//close the box
		close : function (e) {
			var welNode = $Element(this.elContainer);
			var height = welNode.height();
			var oThis = this;
			this._animate(this.elContainer, 'height', height ,0 , 10, function(){
				welNode.css('height', height + 'px');
				document.body.removeChild(oThis.elContainer)
			});
			var elNode = e.currentElement;
			if (elNode.value === 'OK') {
				this.fCallback('Y');
			} else if (elNode.value === 'Cancel') {
				this.fCallback('N');
			}
			
			Dialog.nCounter -= 1;
			this._setBackGround();
		},
		_setBackGround : function(){
			if (Dialog.nCounter === 1) {
				var elBg = $('<div>');
				elBg.id = 'lm_bg';
				$Element(elBg).css({
					width : '100%',
					height : '100%',
					position : 'fixed',
					zIndex : '50',
					backgroundColor : '#000',
					position : 'fixed',
					left : '0',
					top : '0'
				});
				document.body.appendChild(elBg);
				this._animate(elBg, 'opacity', 0, 0.5, 0.05);
			} else if (Dialog.nCounter === 0) {
				var elBgBak = $('lm_bg');
				this._animate(elBgBak, 'opacity', 0.5, 0, 0.05, function(){
					document.body.removeChild(elBgBak);
				});
			} else {
				return;
			}
		},
		//function for draging
		_drag : function (e) {
			$Element(this.elContainer).css('cursor', 'move');
			var nMouseLeft = e.pos().pageX;
			var nMouseTop = e.pos().pageY;
			var move = $Fn(function (e) {
				var left = parseInt($Element(this.elContainer).css('left'), 10) + e.pos().pageX - nMouseLeft + 'px';
				var top = parseInt($Element(this.elContainer).css('top'), 10) + e.pos().pageY - nMouseTop + 'px';
				$Element(this.elContainer).css({
					top : top,
					left : left
				});
				nMouseLeft = e.pos().pageX;
				nMouseTop = e.pos().pageY;
			}, this).attach(document, 'mousemove', false);
			$Fn(function () {
				if (move) {
					move.detach(document, 'mousemove');
					move = null;
					$Element(this.elContainer).css('cursor', '');
				}
			}, this).attach(document, 'mouseup', false);
		},
		//when the box is poped,user click anywhere but the 'close' button, it will shake
		_shake : function (e) {
			if ($Element(e.element).isChildOf(this.elContainer) || $Element(e.element).isEqual(this.elContainer)) {
				return;
			}
			var welNode = $Element(this.elContainer);
			var nLeft = parseInt(welNode.css('left'), 10);
			var oThis = this;
			this._animate(this.elContainer, 'left', nLeft, nLeft - 10, 2, function () {
				oThis._animate(oThis.elContainer, 'left', nLeft - 10, nLeft + 10, 2, function () {
					oThis._animate(oThis.elContainer, 'left', nLeft + 10, nLeft, 2);
				});
			});
		},
		//function for animation
		_animate : function (elNode, sPro, nFrom, nTo, nStep, fCallback) {
			if (/MSIE/.test(window.navigator.userAgent) && sPro === 'opacity') {
				elNode.style.visibility = 'hidden';
				elNode.style.filter = 'Alpha(opacity=' + Math.abs(nTo * 100) + ')';
				elNode.style.visibility = '';
				return;
			}
			var welNode = $Element(elNode);
			if (nFrom > nTo) {
				nFrom = -nFrom;
				nTo = -nTo;
			}
			var nDuration = nTo - nFrom;
			var oThis = this;
			(function () {
				if (nFrom > nTo) {
					if (sPro === 'opacity') {
						welNode.css(sPro, Math.abs(nTo));
					}
					else {
						welNode.css(sPro, Math.abs(nTo) + 'px');
					}
					if (fCallback) {
						fCallback();
					}
					return;
				}
				if (sPro === 'opacity') {
					welNode.css(sPro, Math.abs(nFrom += nStep));
				}
				else {
					welNode.css(sPro, Math.abs(nFrom += nStep) + 'px');
				}
				setTimeout(arguments.callee, 0);
			})();
		},
		addEvent : function (fCallback, oThis) {
			this.fCallback = function () {
				var args = Array.prototype.slice.call(arguments);
				fCallback.apply(oThis, args);
			};
		}
	});
	Dialog.nCounter = 0;
})('lm.Dialog')
