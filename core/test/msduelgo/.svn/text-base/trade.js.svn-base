(function (namespace) {
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
	 * Base class for this program
	 * @param {String} sId Id of container of this program
	 */
	var Trade = $.verifyPackageName(namespace);
	Trade.container[Trade.name] = $Class({
		_nStep : 1,
		_nACounter : 0,
		_nBCounter : 0,
		_sItemkind : 'A',
		_aDataSubmit : [],
		
		$init : function () {
			this.options = this._initOptions(arguments[0]);
            var elContainer = $(this.options.id);

			
			this.aStepImg = $$('.navArea img', elContainer);
			this.elText1 = $$.getSingle('.step1Tit', elContainer);
			this.elText2 = $$.getSingle('.mind', elContainer);
			
			this.elKindSelector = $$.getSingle('#easyItemArea select[name=selectType]', elContainer);
			this.oPopupLayer = new PopupLayer($('popupLayer'), '');
			this.elPure = $('pureSelecterProvideJS');
			this.elCool = $('coolSelecterProvideJS');
			this.waPureItems = $A($$('li', this.elPure)).map(function (elValue) {
				return new MainAvatar(elValue, 'A', this.oPopupLayer, this.elKindSelector);
			}, this);
			this.waCoolItems = $A($$('li', this.elCool)).map(function (elValue) {
				return new MainAvatar(elValue, 'B', this.oPopupLayer, this.elKindSelector);
			}, this);
			this.elPrev = $$('#easyItemArea .btn a', elContainer)[0];
			this.elNext = $$('#easyItemArea .btn a', elContainer)[1];

			var oThis = this;
			$Fn(function () {
				this._setKind(this.elKindSelector.value);
			}, this).attach(this.elKindSelector, 'change', false);
			this.waPureItems.forEach(function (oValue) {
				oValue.enable();
				oValue.addEvent(oThis._select, oThis);
			});
			this.waCoolItems.forEach(function (oValue) {
				oValue.enable();
				oValue.addEvent(oThis._select, oThis);
			});
			$Fn(this._prev, this).attach(this.elPrev, 'click', false);
			$Fn(this._next, this).attach(this.elNext, 'click', false);
			
			this._setKind('A');
			
		}, 
		_initOptions : function(args){
            var options = {
				id : 'lmTrade'
            };
            if (typeof args == "undefined") args = {};
            for (var i in args) {
				if (options[i] !== "undefined") {
					options[i] = args[i];
				}
			}
            return options;
        },
		//toggle kind of cool and pure
		_setKind : function (sKind) {
			if (sKind === 'A') {
				this._sItemkind = sKind;
				$Element(this.elPure).show('');
				$Element(this.elCool).hide();
			} else if (sKind === 'B') {
				this._sItemkind = sKind;
				$Element(this.elPure).hide();
				$Element(this.elCool).show('');
			}
		}, 
		//user add a dress, increase the counter, otherwise, reduse the counter
		_select : function (bAction) {
			if (bAction && (this._sItemkind === 'A')) {
				this._nACounter ++;
			} else if (!bAction && (this._sItemkind === 'A')) {
				this._nACounter --;
			} else if (bAction && (this._sItemkind === 'B')) {
				this._nBCounter ++;
			} else if (!bAction && (this._sItemkind === 'B')) {
				this._nBCounter --;
			}
		}, 
		//function for rollbacking the step
		_prev : function (e) {
			if (this._nStep === 2) {
				this._setKind(this._sItemkind);
				this._nStep = 1;
				this._setStepImg(2);
				$Element(this.elText1).show('block');
				$Element(this.elText2).show('block');
				$Element(this.elKindSelector).show('block');
				if (this._sItemkind === 'A') {
					this.waPureItems.forEach(function (oValue) {
						oValue.enable();
					}, this);
				} else {
					this.waCoolItems.forEach(function (oValue) {
						oValue.enable();
					}, this);
				}
			}
			e.stop();
		}, 
		//function for advancing the step
		_next : function (e) {
			if (this._nStep === 1) {
				if (this._sItemkind === 'A' && this._nACounter === 10) {
					this._nStep = 2;
					this._setStepImg(1);
					$Element(this.elText1).hide();
					$Element(this.elText2).hide();
					$Element(this.elKindSelector).hide();
					this._aDataSubmit = [];
					this.waPureItems.forEach(function (oValue) {
						this._aDataSubmit.push(oValue.get().uaicode);
						oValue.disable();
					}, this);
				} else if (this._sItemkind === 'B' && this._nBCounter === 10) {
					this._nStep = 2;
					this._setStepImg(1);
					$Element(this.elText1).hide();
					$Element(this.elText2).hide();
					$Element(this.elKindSelector).hide();
					this._aDataSubmit = [];
					this.waCoolItems.forEach(function (oValue) {
						this._aDataSubmit.push(oValue.get().uaicode);
						oValue.disable();
					}, this);
				} else {
					var oAlertBox = new lm.Dialog({type:1,content:'There is still empty position!'})
				}
			} else if (this._nStep === 2) {
				var oConfirmBox = new lm.Dialog({type:2,content:'Are you sure to exchange these stuff?'})
				oConfirmBox.addEvent(function (sType) {
					if (sType === 'Y') {
						this._nStep = 3;
						this._setStepImg(2);
						var data = {
							id : '',
							data : this._aDataSubmit
						};
						//ajax submit data ...................
					} else if (sType === 'N') {
						return;
					}
				}, this);
			}
			e.stop();
		}, 
		//function for handling the step image
		_setStepImg : function (nStep) {
			var elImgOld = this.aStepImg[nStep - 1];
			var sSrcOld = elImgOld.src.replace(/(?:_on\.gif)$/, '.gif');
			elImgOld.src = sSrcOld;
			
			var elImgNew = this.aStepImg[this._nStep - 1];
			var sSrcNew = elImgNew.src.replace(/(?:\.gif)$/, '_on.gif');
			elImgNew.src = sSrcNew;
			
			switch (this._nStep) {
			case 1 :
				$$.getSingle('img', this.elPrev).src = 'http://images.hangame.co.jp/hangame/event/100617_msduelgo/btn_return.gif';
				$$.getSingle('img', this.elNext).src = 'http://images.hangame.co.jp/hangame/event/100617_msduelgo/btn_enter.gif';
				break;
			case 2 :
				$$.getSingle('img', this.elPrev).src = 'http://images.hangame.co.jp/hangame/event/100617_msduelgo/btn_modify.gif';
				$$.getSingle('img', this.elNext).src = 'http://images.hangame.co.jp/hangame/event/100617_msduelgo/btn_exchange.gif';
				break;
			}
		}
	});	
	
	
	/**
	 * Abstract class for single dress
	 * @param {HTMLElement} elNode DOM element container of the class
	 * @param {String} sKind Kind from <select> element in main panal
	 */
	var Avatar = $Class({
		_sItemkind : 'A', 
		//a function interface for asynchronous call
		_fCallback : null, 
		
		sex : '', 
		itemname : '',
		buystatus : '',
		isnew : '',
		itemcode : '',
		pos : '',
		uaicode : '',
		
		$init : function (elNode, sKind) {
			this.elContainer = elNode;
			this.elButton = $$.getSingle('.itemSelect a', this.elContainer);
			this.elImage = $$.getSingle('.avatarItem img',  this.elContainer);
			this._sItemkind = sKind;
			this._listener = [];
		},
		//export data in json format for transmission
		get : function () {
			return $Json('{sex:"' + this.sex + 
			'",itemname:"' + this.itemname + 
			'",buystatus:"' + this.buystatus + 
			'",isnew:"' + this.isnew + 
			'",itemcode:"' + this.itemcode + 
			'",pos:"' + this.pos + 
			'",uaicode:"' + this.uaicode + 
			'"}').$value();
		},
		//import data in json format to modify class member property
		set : function (args) {
			if (args === undefined) {
				this.sex = this.itemname = this.buystatus = this.isnew = this.itemcode = this.pos = this.uaicode = '';
			}
			for (var key in args) {
				if (this[key] !== undefined && args.hasOwnProperty(key)) {
					this[key] = args[key];
				}
			}
		},
		//make data modification reflectting to DOM
		fill : function () {
			$$.getSingle('.itemInfo h4', this.elContainer).innerHTML = this.itemname;
			
			if (this.itemcode === '' && this._sItemkind === 'A') {
				this.elImage.src = 'http://images.hangame.co.jp/hangame/event/100617_msduelgo/img_pic_temp.gif';
			} else if (this.itemcode === '' && this._sItemkind === 'B') {
				this.elImage.src = 'http://images.hangame.co.jp/hangame/shop/itemtrade/my-trade/no_avata_cool.gif';
			} else if (this.itemcode !== '' && this._sItemkind === 'A') {
				this.elImage.src = 'http://imagestest.hangame.co.jp/_images/itemshop/disp/' + this.itemcode.toLowerCase() + '.gif';
			} else if (this.itemcode !== '' && this._sItemkind === 'B') {
				this.elImage.src = 'http://alpha-avaimg.hangame.co.jp/gdisp/h/' + this.itemcode.toLowerCase().slice(2) + '.gif';
			}
		},
		//bind the asynchronous event interface
		addEvent : function (fCallback, oThis) {
			this._fCallback = function () {
				var args = Array.prototype.slice.call(arguments);
				fCallback.apply(oThis, args);
			};
		},
		//Abstract function for attach event listener and other operation
		enable : function () {},
		//Abstract function for detach event listener and other operation
		disable : function () {}
	});
	/**
	 * Class for main panal dress placeholder, entend from Avatar
	 * @param {HTMLElement} elNode Inherited property
	 * @param {String} sKind Inherited property
	 * @param {Object} oPopup Pop layer
	 * @param {HTMLElement} elSelector This property is just for fixing the bug of <select> element covering pop layer
	 */
	var MainAvatar = $Class({
		oPopopLayer : null,
		
		$init : function (elNode, sKind, oPopup, elSelector) {
			this.$super.$init(elNode, sKind);
			this.oPopopLayer = oPopup;
			this.elSelector = elSelector;
		},
		//function for selecting a dress
		_select : function () {
			if (this.uaicode) {
				return;
			}
			this.elSelector.style.display = 'none';
			this.oPopopLayer.open(this._sItemkind);
			this.oPopopLayer.addEvent(function (data) {
				if (!data) {
					this.elSelector.style.display = '';
					return;
				}
				var elImage = $$.getSingle('img', this.elButton);
				var sSrc = elImage.src.replace(/(?:_select\.gif)$/, '_clear.gif');
				elImage.src = sSrc;
				this.set(data);
				this.fill();
				this._fCallback(true);
				this.oPopopLayer.close();
				this.elSelector.style.display = '';
			}, this);
			
		},
		//function for canceling a dress
		_cancel : function () {
			if (!this.uaicode) {
				this._select();
				return;
			}
			var elImage = $$.getSingle('img', this.elButton);
			var sSrc = elImage.src.replace(/(?:_clear\.gif)$/, '_select.gif');
			elImage.src = sSrc;
			this.oPopopLayer.restore(this.uaicode, this._sItemkind);
			this.set();
			this.fill();
			this._fCallback(false);
		},
		//attach necessary event listener
		enable : function () {
			this.disable();
			$Element(this.elButton).show('');
			var oThis = this;
			this._listener.push({
				node : oThis.elContainer,
				event : 'click',
				fn : $Fn(oThis._select, oThis).attach(oThis.elContainer, 'click', false)
			});
			this._listener.push({
				node : oThis.elButton,
				event : 'click',
				fn : $Fn(function (e) {
					this._cancel();
					e.stop();
				}, oThis).attach(oThis.elButton, 'click', false)
			});
		},
		//detach event listener and hide the button
		disable : function () {
			$Element(this.elButton).hide();
			for (var i = 0, len = this._listener.length;i < len; i++) {
				var oEventListener = this._listener[i];
				oEventListener.fn.detach(oEventListener.node, oEventListener.event);
			}
			this._listener = [];
		}
	}).extend(Avatar);
	/**
	 * Class for pop panal dress placeholder, entend from Avatar
	 * @param {HTMLElement} elNode Inherited property
	 * @param {String} sKind Inherited property
	 */
	var SecondAvatar = $Class({
		
		$init : function (elNode, sKind) {
			this.$super.$init(elNode, sKind);
			//this property is parentNode of button for dymanic add/remove button
			this.elButtonContainer = $$.getSingle('.itemSelect', this.elContainer);
			//this property is parentNode of image for dymanic add/remove image
			this.elImageContainer = $$.getSingle('.avatarImg', this.elContainer);
		},
		//when click event occurs, transfer data to the object(in this scenario, it is the pop layer) where is invoked
		_select : function () {
			this._fCallback(this.get());
		},
		//expand the method of parent class
		fill : function (sItemkind) {
			this._sItemkind = sItemkind;
			$$.getSingle('.itemInfo h4', this.elContainer).innerHTML = this.itemname;
			if (this.itemcode === '') {
				this.elImageContainer.innerHTML = '';
				this.elImage = null;
			}
			else {
				if (this.elImage === null) {
					this.elImage = $('<img>');
					this.elImageContainer.appendChild(this.elImage);
				}
				if (this._sItemkind === 'A') {
					this.elContainer.className = 'item';
					this.elImage.src = 'http://imagestest.hangame.co.jp/_images/itemshop/disp/' + this.itemcode.toLowerCase() + '.gif';
				}
				else if (this._sItemkind === 'B') {
					this.elContainer.className = 'itemCool';
					this.elImage.src = 'http://alpha-avaimg.hangame.co.jp/gdisp/h/' + this.itemcode.toLowerCase().slice(2) + '.gif';
				}
			}
			
		},
		//attach necesary event listener and restore the button
		enable : function () {
			this.disable();
			$Element(this.elContainer).removeClass('on');
			if (this.elButton === null) {
				this.elButton = $('<a href="#"><img src="http://images.hangame.co.jp/hangame/event/100617_msduelgo/btn_select2.gif"></a>');
				this.elButtonContainer.innerHTML = '';
				this.elButtonContainer.appendChild(this.elButton);
			}
			var oThis = this;
			this._listener.push({
				node : oThis.elContainer,
				event : 'click',
				fn : $Fn(oThis._select, oThis).attach(oThis.elContainer, 'click', false)
			});
			this._listener.push({
				node : oThis.elButton,
				event : 'click',
				fn : $Fn(function (e) {
					oThis._select();
					e.stop();
				}, oThis).attach(oThis.elButton, 'click', false)
			});
		},
		//detach event listener and replace the button with reminder text, here the reminder text is 'Selected', if need japanese, modify the encoding format
		disable : function (sType) {
			for (var i = 0, len = this._listener.length;i < len;i ++) {
				var oEventListener = this._listener[i];
				oEventListener.fn.detach(oEventListener.node, oEventListener.event);
			}
			this._listener = [];
			
			if (sType === 'selected') {
				$Element(this.elContainer).addClass('on');
				this.elButtonContainer.innerHTML = '<strong>Selected<strong>';
				this.elButton = null;
			} else if (sType === 'none') {
				$Element(this.elContainer).removeClass('on');
				this.elButtonContainer.innerHTML = '';
				this.elButton = null;
			}
		}
	}).extend(Avatar);
	/**
	 * Class for pop layer for selecting dress
	 * @param {HTMLElement} elNode DOM element container of the class
	 * @param {String} sKind Kind from <select> element in main panal
	 */
	var PopupLayer = $Class({
		//total pages
		_nPage : 1,
		//current page
		_nCurrentPage : 1,
		_sItemkind : '',
		//store the a search of data
		_oData: [],
		_fCallback : '',
		//store the dress selected
		_aSelected : {},
		
		$init : function (elNode, sKind) {	
			this.elContainer = elNode;
			this._sItemkind = sKind;
			this._aSelected.A = [];
			this._aSelected.B = [];
			var oThis =  this;
			this.elClose = $$.getSingle('.close', this.elContainer);
			var elSearch = $$.getSingle('.itemSearch', this.elContainer);
			this.oTextSearch = new TextSearch(elSearch, this._sItemkind);
			this.oTypeSearch = new TypeSearch(elSearch, this._sItemkind);
			this.oTextSearch.addEvent(this._assemble, this);
			this.oTypeSearch.addEvent(this._assemble, this);
			
			this.waExhibitItems = $A($$('.exhibit li', this.elContainer)).map(function (elNode) {
				return new SecondAvatar(elNode, oThis._sItemkind);
			});
			this.elPage = $$.getSingle('.pageNavi', this.elContainer);
			this.elPageFirst = $$.getSingle('.first', this.elPage);
			this.elPagePrev = $$.getSingle('.prev', this.elPage);
			this.elPageNext = $$.getSingle('.next', this.elPage);
			this.elPageLast = $$.getSingle('.last', this.elPage);
			
			$Fn(function (e) {
				oThis.close();
				e.stop();
			}).attach(this.elClose, 'click', false);
			
			this.waExhibitItems.forEach(function (oValue) {
				oValue.addEvent(this._fetch, this);
			}, this);
			
			$Fn(this._pageNav, this).attach(this.elPageFirst, 'click', false);
			$Fn(this._pageNav, this).attach(this.elPagePrev, 'click', false);
			$Fn(this._pageNav, this).attach(this.elPageNext, 'click', false);
			$Fn(this._pageNav, this).attach(this.elPageLast, 'click', false);
			
			$Fn(this._positionCenter,this).attach(window,'resize',false);
		},
		//function for assembling data from search result, it clear old data, create the page number and fill the first page
		_assemble : function (data) {
			this._oData = data;
			var len = this._oData.length;
			this._nPage = len % 10 === 0 ? len / 10 : Math.floor(len / 10) + 1;
			
			$A($$('li', this.elPage)).forEach(function (elNode) {
				if (elNode.className === '' || elNode.className === 'now') {
					elNode.parentNode.removeChild(elNode);
				}
			});
			var elPagePrev = $$.getSingle('.prev', this.elPage);
			for (var i = this._nPage ; i >= 1 ; i --) {
				var li = $('<li><a>' + i + '</a></li>');
				li.style.cursor = 'pointer';
				$Fn(this._pageNav, this).attach(li, 'click', false);
				$Element(elPagePrev).after(li);
			}
			
			this._fill(1);
		},
		//function for fill the data to DOM in specified page 
		_fill : function (page) {
			for (var i = 0, len = this.waExhibitItems.length();i < len;i ++) {
				var item = this.waExhibitItems.$value()[i];
				var data = this._oData[i + (page - 1) * 10];
				if (data) {
					item.set(data);
					item.fill(this._sItemkind);
					item.enable();
					if (this._aSelected[this._sItemkind][data.uaicode]) {
						item.disable('selected');
					}
				} else {
					item.set();
					item.fill(this._sItemkind);
					item.disable('none');
				}
			}
			var aPageList = $$('li', this.elPage);
			$A(aPageList).forEach(function (elNode) {
				var welNode = $Element(elNode);
				if (welNode.hasClass('now')) {
					welNode.removeClass('now');
				}
			});
			$Element(aPageList[page + 1]).addClass('now');
			this._setNav();
		},
		//handle  page navigation
		_pageNav : function (e) {
			var welNode = $Element(e.currentElement);
			switch (welNode.className()) {
			case 'first' :
				this._nCurrentPage = 1;
				this._fill(this._nCurrentPage);
				break;
			case 'prev' :
				this._nCurrentPage --;
				if (this._nCurrentPage < 1) {
					this._nCurrentPage = 1;
					e.stop();
					return false;
				}
				this._fill(this._nCurrentPage);
				break;
			case 'next' :
				this._nCurrentPage ++;
				if (this._nCurrentPage > this._nPage) {
					this._nCurrentPage = this._nPage;
					e.stop();
					return false;
				}
				this._fill(this._nCurrentPage);
				break;
			case 'last' :
				this._nCurrentPage = this._nPage;
				this._fill(this._nCurrentPage);
				break;
			default :
				this._nCurrentPage = parseInt(welNode.text(), 10);
				this._fill(this._nCurrentPage);
				break;
			}
			e.stop();
		},
		//function for ajust the navigation button of page
		_setNav : function () {
			if (this._nPage === 1) {
				this._setNavImage($$.getSingle('img', this.elPageFirst), false);
				this._setNavImage($$.getSingle('img', this.elPagePrev), false);
				this._setNavImage($$.getSingle('img', this.elPageNext), false);
				this._setNavImage($$.getSingle('img', this.elPageLast), false);
			} else {
				if (this._nCurrentPage === 1) {
					this._setNavImage($$.getSingle('img', this.elPageFirst), false);
					this._setNavImage($$.getSingle('img', this.elPagePrev), false);
					this._setNavImage($$.getSingle('img', this.elPageNext), true);
					this._setNavImage($$.getSingle('img', this.elPageLast), true);
				} else if (this._nCurrentPage === this._nPage) {
					this._setNavImage($$.getSingle('img', this.elPageFirst), true);
					this._setNavImage($$.getSingle('img', this.elPagePrev), true);
					this._setNavImage($$.getSingle('img', this.elPageNext), false);
					this._setNavImage($$.getSingle('img', this.elPageLast), false);
				} else {
					this._setNavImage($$.getSingle('img', this.elPageFirst), true);
					this._setNavImage($$.getSingle('img', this.elPagePrev), true);
					this._setNavImage($$.getSingle('img', this.elPageNext), true);
					this._setNavImage($$.getSingle('img', this.elPageLast), true);
				}
			}
		},
		//ajust the image of navagation button
		_setNavImage : function (elNode, bAction) {
			var sSrc = elNode.src;
			if (bAction) {
				var reg = /on\.gif$/;
				if (reg.test(sSrc)) {
					return;
				}
				elNode.src = sSrc.replace(/\.gif$/, 'on.gif');
			} else {
				elNode.src = sSrc.replace(/on\.gif$/, '.gif');
			}
		},
		//user select a dress, mark it selected, transfer the data of dress to main panal dress plassholder for further processing
		_fetch : function (data) {
			this._aSelected[this._sItemkind][data.uaicode] = true;
			this._fCallback(data);
		},
		//user cacel a dress in main panal, mark it selectable
		restore : function (sUaicode, sItemkind) {
			this._aSelected[sItemkind][sUaicode] = false;
		},
		//open the pop layer for selecting dress
		open : function (sKind) {
			var welNode = $Element(this.elContainer);
			welNode.show('block');
			this._positionCenter();
			
			this._fill(this._nCurrentPage);
			if (sKind !== this._sItemkind) {
				this._sItemkind = sKind;
				this.oTypeSearch.setItemkind(this._sItemkind);
				this.oTextSearch.setItemkind(this._sItemkind);
				this.oTypeSearch.search();
			}
		},
		//close the pop layer
		close : function () {
			$Element(this.elContainer).hide();
			this._fCallback();
		},
		//function for position the layer center
		_positionCenter : function(){
			var welNode = $Element(this.elContainer);
			if (welNode.css('display') === 'none') {
				return;
			}
			var left = ($Document(document).clientSize().width - welNode.width()) / 2 + scrollX() + 'px';
			var top = ($Document(document).clientSize().height - welNode.height()) / 2 + scrollY() + 'px';
			welNode.css({
				position : 'absolute',
				top : top,
				left : left
			});
		},
		addEvent : function (fCallback, oThis) {
			this._fCallback = function (args) {
				fCallback.call(oThis, args);
			};
		}
	});	
	
	/**
	 * Abstract Search Class
	 * @param {HTMLElement} elNode DOM element container of the class
	 * @param {String} sKind Kind from <select> element in main panal
	 */
	var Search = $Class({
		_sItemkind : '',
		_oAjax : null,
		_fCallback : null,
		
		$init : function (elNode, sKind) {
			this.elContainer = elNode;
			this._sItemkind = sKind;
			
			//hash table for storing unique dress searched
			this._aEntityHash = [];
			//hash table for storing every single search condition and result
			this._oSearchHash =  {};
		},
		//set this._sItemkind
		setItemkind : function (sItemkind) {
			this._sItemkind = sItemkind;
		},
		//get the data from DOM Element
		_fetch : function (sKind) {},
		//cache the data searched, avoid request server with same data repeatly
		_cache : function (sQuery, aItems) {
			if (aItems === undefined) {
				if (this._oSearchHash[sQuery]) {
					var aTemp = [];
					for (var i = 0, len = this._oSearchHash[sQuery].length;i < len;i ++) {
						aTemp.push(this._aEntityHash[this._oSearchHash[sQuery][i]]);
					}
					return aTemp;
				} else {
					return false;
				}
			} else {
				this._oSearchHash[sQuery] = [];
				for (var j = 0, jLen = aItems.length;j < jLen;j ++) {
					if (this._aEntityHash[aItems[j].uaicode] === undefined) {
						this._aEntityHash[aItems[j].uaicode] = aItems[j];
					}
					this._oSearchHash[sQuery].push(aItems[j].uaicode);
				}
			}
		},
		//Abstract function for search
		search : function (sKind) {},
		addEvent : function (fCallback, oThis) {
			this._fCallback = function (args) {
				fCallback.call(oThis, args);
			};
		}
	});
	/**
	 * Class for text search, entend from Search
	 * @param {HTMLElement} elNode Inherited property
	 * @param {String} sKind Inherited property
	 */
	var TextSearch = $Class({
		_sItemname : '',
		
		$init : function (elNode, sKind) {
			this.$super.$init(elNode, sKind);
			
			this.elInputBox = $$.getSingle('input', this.elContainer);
			this.elButton = $$.getSingle('a', this.elContainer);
			
			$Fn(function (e) {
				this.search(this._sItemkind);
				e.stop();
				return false;
			}, this).attach(this.elButton, 'click', false);
		},
		_fetch : function (sKind) {
			this._sItemname = this.elInputBox.value;
		},
		search : function (sKind) {
			this._fetch();
			var sQuery = 'itemkind=' + this._sItemkind + '&itemname=' + this._sItemname;
			if (this._cache(sQuery)) {
				return this._fCallback(this._cache(sQuery));
			}
			if (this._oAjax) {
				this._oAjax.abort();
				this._oAjax = null;
			}
			var oThis = this;
			this._oAjax = new $Ajax('bagsearch.php?' + sQuery, {
				onload : function (data) {
					var items = data.json().items;
					oThis._cache(sQuery, items);
					oThis._fCallback(items);
					this._oAjax = null;
				}
			});
			this._oAjax.request();
		}
	}).extend(Search);
	/**
	 * Class for type search, entend from Search
	 * @param {HTMLElement} elNode Inherited property
	 * @param {String} sKind Inherited property
	 */
	var TypeSearch = $Class({
		_sCasetype : '',
		_sBagcat : '',
		
		$init : function (elNode, sKind) {
			this.$super.$init(elNode, sKind);
			
			this.elSelect1 = $('select1');
			this.elSelect2 = $('select2');
			this.elSelect3 = $('select3');
			
			$Fn(function (e) {
				this.search(this._sItemkind);
			}, this).attach(this.elSelect1, 'change', false);
			$Fn(function (e) {
				this.search(this._sItemkind);
			}, this).attach(this.elSelect2, 'change', false);
			$Fn(function (e) {
				this.search(this._sItemkind);
			}, this).attach(this.elSelect3, 'change', false);
			
			if (this._sItemkind === "A") {
				$Element(this.elSelect3).hide();
				$Element(this.elSelect2).show('inline');
			} else if (this._sItemkind === "B") {
				$Element(this.elSelect2).hide();
				$Element(this.elSelect3).show('inline');
			}
		},
		_fetch : function () {
			var sSelect1 = this.elSelect1.value;
			if (this._sItemkind === "A") {
				sSelect2 = this.elSelect2.value;
				$Element(this.elSelect3).hide();
				$Element(this.elSelect2).show('inline');
			} else if (this._sItemkind === "B") {
				sSelect2 = this.elSelect3.value;
				$Element(this.elSelect2).hide();
				$Element(this.elSelect3).show('inline');
			}
			
			this._sCasetype = sSelect1;
			this._sBagcat = sSelect2;
		},
		search : function () {
			this._fetch();
			var sQuery = '';
			if (this._sItemkind === 'A') {
				sQuery = 'itemkind=' + this._sItemkind + '&casetype=' + this._sCasetype;
			} else {
				sQuery = 'itemkind=' + this._sItemkind + '&casetype=' + this._sCasetype + '&bagcat=' + this._sBagcat;
			}
			if (this._cache(sQuery)) {
				return this._fCallback(this._cache(sQuery));
			}
			if (this._oAjax) {
				this._oAjax.abort();
				this._oAjax = null;
			}
			var oThis = this;
			this._oAjax = new $Ajax('bagsearch.php?' + sQuery, {
				onload : function (data) {
					var items = data.json().items;
					oThis._cache(sQuery, items);
					oThis._fCallback(items);
					this._oAjax = null;
				}
			});
			this._oAjax.request();
		}
	}).extend(Search);
	
})('lm.Trade');