/**
 * @fileOverview Jtop
 *
 * nj.Jtop
 *
 *   - nj.Jtop.Suggest
 *   - nj.Jtop.Panel
 *   - nj.Jtop.Slide
 *   - nj.Jtop.GameList
 *   - nj.Jtop.SearchResult
 *   - nj.Jtop.GameMenu
 *
 *   - nj.Jtop.LoginPanel
 *   - nj.Jtop.MyMenu
 *   - nj.Jtop.CharacterSearch
 *
 *   - SpotDeckIF
 *   - Jtmv
 */

/**
 * じっくりゲーム
 * nj.Jtop
 */
(function(namespace) {
	var pkg = $.verifyPackageName(namespace);
	pkg.container[pkg.name] = $Class({
	$init: function(oOpt) {
		var opt = this.opt = this._getOptions(oOpt);

		if (opt.login) this.cPanel = new nj.Jtop.LoginPanel(opt.login);

		if (opt.suggest) this.cSuggest = new nj.Jtop.Suggest(opt.suggest);
		if (opt.panel) this.cPanel = new nj.Jtop.Panel(opt.panel);
		if (opt.slide) this.cSlide = new nj.Jtop.Slide(opt.slide);
		if (opt.gameList) this.cGameList = new nj.Jtop.GameList(opt.gameList);
		if (opt.searchResult) this.cSearchResult = new nj.Jtop.SearchResult(opt.searchResult);

		this.initMisc();
	},
	_getOptions: function(args) {
		var options = {
			/*
			// じっくりTopの場合のoptions。
			suggest: {
				base: 'schArea',
				listMax: 5,
				searchType: 'local',
				searchData: ['Dragon Nest', 'Dro2', 'Dradra', 'R2', 'dd9', 'doppa-', 'モンハン', 'カナン', 'スペシャルフォース', 'draque']
			},
			panel: {
				panels: [
					{
						base: 'srvsLiArea',
						opener: 'div.headArea a'
					},
					{
						base: 'aboutCoreArea',
						opener: 'div.headArea a'
					}
				]
			},
			slide: {
				slides: [
					{
						base: 'wkRcmndArea',
						slide: '#wkRcmndLi ul'
					},
					{
						base: 'scrpArea',
						slide: '#scrpLi ul'
					},
					{
						base: 'side01Area',
						slide: '#movLi ul'
					}
				]
			},
			login: {
				base: 'loginPanel',
				id: 'strmemberid',
				pass: 'strpassword'
			}*/
		};
		if (typeof args == "undefined") args = {};
		for (var i in args) options[i] = args[i];
		return options;
	},

	/**
	 * Clear login inputs' background images.
	 */
	_clearLoginInput: function() {
		var elId = $(this.opt.login.id);
		if (elId && elId.value) elId.style.backgroundImage = 'none';

		var elPass = $(this.opt.login.pass);
		if (elPass && elPass.value) elPass.style.backgroundImage = 'none';
	},

	/**
	 * Miscellaneous init process.
	 */
	initMisc: function() {
		var oNav = $Agent().navigator();

		if (oNav.ie && (oNav.version == 6 || oNav.version == 7)) {
			var aElImg = $$('span.thms');
			$A(aElImg).forEach(function(v,i){
				$Fn(function(){
					if (v.parentNode.nodeName == 'A') {
						location.href = v.parentNode.href;
					}
				}).attach(v, 'click');

				$Fn(function(){
					v.style.cursor = 'pointer';
				}).attach(v, 'mouseover');

				$Fn(function(){
					v.style.cursor = 'default';
				}).attach(v, 'mouseout');

			});
		}
	}

	});
 })("nj.Jtop");



/**
 * ログインパネル。
 * nj.Jtop.LoginPanel
 */
(function(namespace) {
    var pkg = $.verifyPackageName(namespace);
    pkg.container[pkg.name] = $Class({

	$init : function(param){
	    this.baseID = 'userArea';
	    this.baseElm = $(this.baseID);
	    this.baseElmObj = $Element(this.baseElm);
	    this.loginPanelElm = $('loginPanel');
	    this.loginPanelElmObj = $Element(this.loginPanelElm);

		this.initialize();
	},
	initialize : function(){
		this._setEventLoginForm();
		this._checkInput();
		this._clearInputs();
	},
	_setEventLoginForm : function(){

        var idElm = $('strmemberid');
        var pwElm = $('strpassword');

	    $Fn(this._checkInput,this).attach(idElm,'keydown');
	    $Fn(this._checkInput,this).attach(pwElm,'keydown');

		$Fn(this._checkInputKeyUp,this).attach(idElm,'keyup');
	    $Fn(this._checkInputKeyUp,this).attach(pwElm,'keyup');

		$Fn(this._checkInputEmpty,this).attach(idElm,'blur');
        $Fn(this._checkInputEmpty,this).attach(pwElm,'blur');
	},

	_checkInputEmpty : function(e){
	    if(e){
			//entering
			var keyObj = e.key();
			var keyCode = keyObj.keyCode;

			var elm = e.element;
            if(elm.value == ''){
                if(elm.id == 'strmemberid'){
                         elm.style.backgroundImage = 'url(http://images.hangame.co.jp/hangame/htop/extraarea/txt_hgid.gif)';
                }else if(elm.id == 'strpassword'){
                         elm.style.backgroundImage = 'url(http://images.hangame.co.jp/hangame/htop/extraarea/txt_pw.gif)';

                }
            }
	    }
	},

	_checkInputKeyUp : function(e){
	    if(e){
			//entering
			var keyObj = e.key();
			var keyCode = keyObj.keyCode;

			var elm = e.element;
           if(elm.value != ''){
			   elm.style.backgroundImage='none';
	       }else{
               if(elm.id == 'strmemberid'){
				   elm.style.backgroundImage = 'url(http://images.hangame.co.jp/hangame/htop/extraarea/txt_hgid.gif)';
                } else if(elm.id == 'strpassword'){
                    elm.style.backgroundImage = 'url(http://images.hangame.co.jp/hangame/htop/extraarea/txt_pw.gif)';
                }
            }
	    }
	},

	_checkInput : function(e){
	    if(e != 'idsave' && e != undefined){
			//entering
			var keyObj = e.key();
			var keyCode = keyObj.keyCode;

			var elm = e.element;

			if(keyCode == 13){
				(elm.id == 'strmemberid')? $('strpassword').focus() : entersubmit();
			}
	    } else {
			var elm = $('strmemberid');
	    }

        if(elm.value != '' || e == 'idsave'){
			elm.style.backgroundImage='none';
	    }
	},
	_clearInputs: function() {
		var elId = $('strmemberid');
		var elPw = $('strpassword');
		if (elId.value) elId.style.backgroundImage = 'none';
		if (elPw.value) elPw.style.backgroundImage = 'none';
	}
	});
})("nj.Jtop.LoginPanel");



/**
 * サジェスト検索。
 * ローカルデータ内検索。Ajax, JSONP対応可。
 * nj.Jtop.Suggest
 */
(function(namespace) {
	var pkg = $.verifyPackageName(namespace);
	pkg.container[pkg.name] = $Class({

	$init: function(oOpt) {
		this.opt = this._getOptions(oOpt);

		this._setElements();

		if (this.opt.searchType == 'local') {
			this.bLocalSearch = true;
			this.waSearchData = $A(this.opt.searchData);
		}

		this._addEvents();
	},
	_getOptions: function(args) {
		var options = {
			suggestOnCookie: 'SUGGESTON',
			searchType: 'local', // [local, jsonp, ajax]
			searchData: '',
			searchDefault: '検索してネ',
			listMax: 5,
			base: 'schArea',
			input: {
				node: 'schAreaInput',
				editClass: 'edit',
				defaultClass: 'dflt'
			},
			switcher: {
				node: 'ul.incSchSwtch',
				opener: 'li.open',
				closer: 'li.close'
			},
			result: {
				node: 'div.incSch',
				list: 'li a',
				onClass: 'on',
				onOff: 'p a',
				selectClass: 'slct'
			}
		};
		if (typeof args == "undefined") args = {};
		for (var i in args) options[i] = args[i];
		return options;
	},

	/**
	 * エレメントセット。
	 */
	_setElements: function() {
		this.elBase = $(this.opt.base);

		this.elInput = $(this.opt.input.node);
		this.welInput = $Element(this.elInput);
		if (this.elInput.value) {
			if (this.elInput.value != this.opt.searchDefault) {
				this.welInput.removeClass(this.opt.input.defaultClass);
				this.welInput.addClass(this.opt.input.editClass);
			}
		} else {
			this.elInput.value = this.opt.searchDefault;
		}

		var elResultBox = $$.getSingle(this.opt.result.node, this.elBase);
		this.welResultBox = $Element(elResultBox);

		var aElList = $$(this.opt.result.list, elResultBox);
		this.waWelList = $A([]);
		for (var i in aElList) this.waWelList.push($Element(aElList[i]));

		this._setSuggestOnOff();
	},

	/**
	 * サジェスト検索のON/OFF設定。Cookie読み込み。
	 */
	_setSuggestOnOff: function() {
		var aElOnOff = $$(this.opt.result.onOff, this.welResultBox.$value());
		this.welOn = $Element(aElOnOff[0]);
		this.welOff = $Element(aElOnOff[1]);

		var sCookie = $Cookie().get(this.opt.suggestOnCookie);
		var sClass = this.opt.result.selectClass;

		if (!sCookie || sCookie == '1') {
			this.bSuggestOn = true;
			var sValue = '0';
			var elSwitch = this.welOff.$value();
			this.welOn.addClass(sClass);
			this.welOff.removeClass(sClass);
		} else {
			this.bSuggestOn = false;
			var sValue = '1';
			var elSwitch = this.welOn.$value();
			this.welOn.removeClass(sClass);
			this.welOff.addClass(sClass);
		}

		$Fn(function(){
			this.switchSuggest(sValue);
		}, this).attach(elSwitch, 'click');
	},

	/**
	 * ON/OFFスイッチクリック時。ページリロード。
	 * @param {String} sValue
	 */
	switchSuggest: function(sValue) {
		$Cookie().set(this.opt.suggestOnCookie, sValue);
		location.reload();
	},

	/**
	 * イベント設定。
	 */
	_addEvents: function() {
		// 入力。
		$Fn(this.handleKey, this).attach(this.elInput, 'keyup');
		$Fn(this.initInput, this).attach(this.elInput, 'focus');
		$Fn(this.initInput, this).attach(this.elInput, 'blur');
		$Fn(this.initInput, this).attach(this.elInput, 'click');

		// 候補リスト。
		this.waWelList.forEach(function(v, i){
			$Fn(function(e) {this.pickKeyword(e, i);}, this).attach(v.$value(), 'click');
			v.hide();
		}, this);

		// 開閉ボタン。
		var elSwitcher = $$.getSingle(this.opt.switcher.node, this.elBase);
		var elOpener = $$.getSingle(this.opt.switcher.opener, elSwitcher);
		var elCloser = $$.getSingle(this.opt.switcher.closer, elSwitcher);
		this.welOpener = $Element(elOpener);
		this.welCloser = $Element(elCloser);
		$Fn(this.open, this).attach(elOpener, 'click');
		$Fn(this.close, this).attach(elCloser, 'click');

		// 画面クリック。eは渡さない。
		$Fn(function(e){this.closeAndStopSuggest();}, this).attach(document, 'click');
	},

	/**
	 * キーボード入力ハンドラー。
	 * @param {Event} e
	 */
	handleKey: function(e) {
		if (!e || !this.bSuggestOn) return;

		var oKey = e.key();
		if (!oKey.keyCode || oKey.enter) {
			return;
		}

		if (oKey.up) {
			this._arrowControl('up');
		} else if (oKey.down) {
			this._arrowControl('down');
		} else {
			this._startSuggest();
		}
	},

	/**
	 * Input初期化。サジェスト検索開始の判定。
	 * @param {Event} e
	 */
	initInput: function(e) {
		if (!e) return;
		e.stop();

		if (e.type == 'focus') {
			// Clear default message.
			if (this.bSuggestOn) this._startSuggest();

			if (this.elInput.value == this.opt.searchDefault) {
				this.elInput.value = '';
			}

			this.welInput.removeClass(this.opt.input.defaultClass);
			this.welInput.addClass(this.opt.input.editClass);
		} else if (e.type == 'blur') {
			// Default input value.
			if (this.bSuggestOn) this.closeAndStopSuggest();

			if (this.elInput.value) {
				this.welInput.removeClass(this.opt.input.defaultClass);
				this.welInput.addClass(this.opt.input.editClass);
			} else {
				this.elInput.value = this.opt.searchDefault;
				this.welInput.removeClass(this.opt.input.editClass);
				this.welInput.addClass(this.opt.input.defaultClass);
			}
		}
	},

	/**
	 * サジェスト検索の開始。
	 * @param {Event} e
	 */
	_startSuggest: function(e) {
		if (this.bSuggesting) return;
		this.bSuggesting = true;

		var fInterval = $Fn(this.checkInput, this).bind();
		this.nInterval = setInterval(fInterval, 500);
	},

	/*
	 * サジェスト検索の停止。
	 */
	_stopSuggest: function() {
		if (this.nInterval && this.bSuggesting) {
			this.bSuggesting = false;
			clearInterval(this.nInterval);
		}
	},

	/*
	 * 入力文字のチェック。
	 */
	checkInput: function() {
		var sKey = this.elInput.value;
		if (!sKey) {
			this.sKeyNow = '';
			this.close();
			return;
		}

		if (sKey == this.sKeyNow) return;
		this.sKeyNow = sKey;

		this._search();
	},

	/*
	 * 検索。[local|ajax|jsonp]
	 */
	_search: function() {
		if (this.bLocalSearch) {
			this.waResult = this._getMatched(this.sKeyNow);
			this._updateResult();
		} else if (this.bAjaxSearch) {

		} else if (this.bJsonpSearch) {

		}
	},

	/**
	 * ゲームリストからキーワードを前方一致検索。
	 * @param {String} sKey
	 * @return マッチした文字列の配列オブジェクト。
	 */
	_getMatched: function(sKey) {
		var re = new RegExp('^' + sKey, 'i');
		var fFilter = function(v, i) {
			return v.match(re) ? true : false;
		};

		var waMatched = this.waSearchData.filter(fFilter);
		var waSelected = waMatched.slice(0, this.opt.listMax);
		return waSelected;
	},

	/**
	 * 候補リストの描画。
	 */
	_updateResult: function() {
		if (this.waResult.length() < 1) {
			this.close();
			return;
		}

		this.waWelList.forEach(function(v, i){
			var sTitle = this.waResult.$value()[i];
			if (!sTitle) {
				v.hide();
				return;
			}

			var sHighlight = sTitle.slice(0, this.sKeyNow.length);
			var sRest = sTitle.slice(this.sKeyNow.length, sTitle.length);

			v.html('<span>' + sHighlight + '</span>' + sRest)
				.css('display', 'block');
		}, this);

		this.open();
	},

	/**
	 * 候補からの選択。
	 * @param {Event} e
	 * @param {Number} nIndex
	 */
	pickKeyword: function(e, nIndex) {
		if (e) e.stop();

		if (this.waResult.length() < 1) return;
		var sPicked = this.waResult.$value()[nIndex];

		this.elInput.value = sPicked;

		// Declared in HTML.
		searchFunction('all');
	},

	/**
	 * 候補リストを開く。
	 * @param {Event} e
	 */
	open: function(e) {
		if (e) e.stop();

		this._resetIndex();

		this.welResultBox.show();
		this.welOpener.hide();
		this.welCloser.show();
	},

	/**
	 * 候補リストを閉じる。
	 * @param {Event} e
	 */
	close: function(e) {
		if (e) e.stop();
		if (this._isClosed()) return;

		this._resetIndex();

		var fHideResult = $Fn(function() {this.welResultBox.hide();}, this).bind();
		setTimeout(fHideResult, 200);
		//this.welResultBox.hide();

		this.welCloser.hide();
		this.welOpener.show();

		this.elInput.focus();
	},

	/**
	 * Inputチェックを停止して候補リストを閉じる
	 * @param {Event} e
	 */
	closeAndStopSuggest: function(e) {
		this._stopSuggest();
		this.close(e);
	},

	/**
	 * 上下キーコントロール。
	 * Index:
	 * -1: input form
	 * i (> 0, < max) : result[i]
	 * @param {String} sKey
	 */
	_arrowControl: function(sArrow) {
		if (this._isClosed()) return;

		var DOWN = 1, UP = -1;
		var INPUT = -1;

		var nDir = sArrow == 'down' ? DOWN : UP;
		var nSize = this.waResult.length();
		var nMax = nSize - 1;
		var nNow = this.nResultIndex;
		var nNext = 0;

		if (nNow == INPUT && nDir == UP) {
			nNext = nMax;
		} else if (nNow == nMax && nDir == DOWN) {
			nNext = INPUT;
		} else {
			nNext = nNow + nDir;
		}
		this.nResultIndex = nNext;

		if (nNow != INPUT) {
			var welListPrev = this.waWelList.$value()[nNow];
			welListPrev.removeClass(this.opt.result.onClass);
		}

		if (nNext == INPUT) {
			this._startSuggest();
			this.elInput.value = this.sKeyNow;
		} else {
			this._stopSuggest();
			this.elInput.value = this.waResult.$value()[nNext];

			var welList = this.waWelList.$value()[nNext];
			welList.addClass(this.opt.result.onClass);
		}
	},

	/**
	 * 候補リスト選択中インデックスの解除。
	 */
	_resetIndex: function() {
		this.nResultIndex = -1;
		this.waWelList.forEach(function(v, i){
			v.removeClass(this.opt.result.onClass);
		}, this);
	},

	/**
	 * 候補リストが閉じているかのチェック。
	 */
	_isClosed: function() {
		var sDisplay = this.welResultBox.css('display');
		return sDisplay == 'none' ? true : false;
	}
	});
 })("nj.Jtop.Suggest.bak");
/*============================================================================================================================*/
/*=================================================== Liu Ming Begin =========================================================*/
/*============================================================================================================================*/
(function(namespace){
	var pkg = $.verifyPackageName(namespace);
	pkg.container[pkg.name] = $Class({
		result : 0,
		current : 0,
		oldValue : '',
		timer : null,
		
		//Constant for function _showTips
		DELETE : 1,
		RETAIN : 2,
		UPDATE : 3,
		
		//fix ie onpropertychange bug
		isInput : false,
		
		$init:function(args){
			this.options = this._getOptions(args);
			this.elContainer = $$.getSingle(this.options.base);
			
			this.elInput = $$.getSingle(this.options.input.node, this.elContainer);
			this.elInput.value = this.options.searchDefault;
			$Fn(this._inputFocus, this).attach(this.elInput, 'focus', false);
			$Fn(this._inputBlur, this).attach(this.elInput, 'blur', false);
			
			var switcher = this.options.switcher;
			this.elSwitcher = $$.getSingle(switcher.node, this.elContainer);
			this.elPanalSwitchOpener = $$.getSingle(switcher.opener, this.elSwitcher);
			this.elPanalSwitchCloser = $$.getSingle(switcher.closer, this.elSwitcher);
			$Fn(this._panalSwitch, this).attach(this.elPanalSwitchOpener, 'click', false);
			$Fn(this._panalSwitch, this).attach(this.elPanalSwitchCloser, 'click', false);
			
			var result = this.options.result;
			this.elResultPanal = $$.getSingle(result.node, this.elContainer);
			this.aFeatureSwitcher = $$(result.onOff, this.elResultPanal);
			this.elFeatureSwitchOpener = this.aFeatureSwitcher[0];
			this.elFeatureSwitchCloser = this.aFeatureSwitcher[1];
			$Fn(this._featureSwitch, this).attach(this.elFeatureSwitchOpener, 'click', false);
			$Fn(this._featureSwitch, this).attach(this.elFeatureSwitchCloser, 'click', false);
			
			var cookie = new $Cookie();
			var suggest = cookie.get(this.options.suggestOnCookie);
			if (suggest === null || suggest === '1') {
				this.enable();
			}
			else if (suggest === '0') {
				this.disable();
			}
		},
		/**
		 * enable the feature of autocomplete
		 */
		enable : function(){
			var cookie = new $Cookie();
			cookie.set(this.options.suggestOnCookie, '1');
			
			this.elTips = this.elInput.cloneNode(false);
			this.elTips.style.cssText = 'color:#bfbfbf;position:absolute;left:4px;z-index:0';
			this.elTips.value = '';
			this.elInput.style.cssText = 'z-index:10;background:transparent;position:absolute';
			$$.getSingle('.formArea p', this.elContainer).appendChild(this.elTips);
			this.elPanalSwitchOpener.style.cssText = 'z-index:20';
			this.elPanalSwitchCloser.style.cssText = 'z-index:20';
			
			this.aListenerList = [];
			var oThis = this;
			if (this.elInput.addEventListener) {
				this.aListenerList.push({
					node : oThis.elInput,
					type : 'input',
					listener: $Fn(oThis._inputHandler, oThis).attach(oThis.elInput, 'input', false)
				});
			}
			else if (this.elInput.attachEvent) {
				this.aListenerList.push({
					node : oThis.elInput,
					type : 'propertychange',
					listener : $Fn(function(o){
						if (o._event.propertyName === 'value' && this.isInput) {
							oThis._inputHandler();
						}
					}, oThis).attach(oThis.elInput, 'propertychange', false)
				});
			}
			
			this.aListenerList.push({
				node : oThis.elInput,
				type : 'keydown',
				listener : $Fn(oThis._selectResult, oThis).attach(oThis.elInput, 'keydown', false)
			});
			
			this.aListenerList.push({
				node : document,
				type : 'click',
				listener : $Fn(function(evt){
					$Element(this.elPanalSwitchCloser).fireEvent('click');
				}, oThis).attach(document, 'click', false)
			});
			
			this.aResultList = [];
			var elUl = $$.getSingle('ul', this.elResultPanal);
			elUl.innerHTML = '';
			for (var i = 0 ; i < this.options.listMax ; i++){
				var elLi = $('<li>');
				var elA = $('<a>');
				this.aResultList.push(elA);
				elLi.appendChild(elA);
				elUl.appendChild(elLi);
				$Fn(this._submit, this).attach(elA, 'click', false);
			}
			
			$Element(this.elFeatureSwitchOpener).fireEvent('click');
		},
		/**
		 * disable the feature of autocomplete
		 */
		disable : function(){
			var cookie = new $Cookie();
			cookie.set(this.options.suggestOnCookie, '0');
			
			if (this.elTips) {
				this.elInput.style.cssText = '';
				$$.getSingle('.formArea p', this.elContainer).removeChild(this.elTips);
				this.elPanalSwitchOpener.style.cssText = '';
				this.elPanalSwitchCloser.style.cssText = '';
				
				
				for (var i = 0, len = this.aListenerList.length; i < len; i++) {
					var temp = this.aListenerList[i];
					temp.listener.detach(temp.node, temp.type);
				}
				this.aListenerList = [];
				this._showTips(this.DELETE);
			}
			$$.getSingle('ul', this.elResultPanal).innerHTML = '';
			$Element(this.elFeatureSwitchCloser).fireEvent('click');
		},
		/**
		 * handle arguments
		 * @param {Object} args
		 */
		_getOptions: function(args) {
			var options = {
				suggestOnCookie: 'SUGGESTON',
				searchType: 'local', // [local, jsonp, ajax]
				searchData: '',
				searchDefault: '検索してネ',
				listMax: 5,
				base: '#schArea',
				input: {
					node: '#schAreaInput',
					editClass: 'edit',
					defaultClass: 'dflt'
				},
				switcher: {
					node: 'ul.incSchSwtch',
					opener: 'li.open',
					closer: 'li.close'
				},
				result: {
					node: 'div.incSch',
					list: 'li a',
					onClass: 'on',
					onOff: 'p a',
					selectClass: 'slct'
				},
				ajaxSearchApi : 'ajax.php',
				searchServer : 'search.php'
			};
			if (typeof args == "undefined") {
				args = {};
			}
			for (var i in args) {
				options[i] = args[i];
			}
			return options;
		},
		/**
		 * delete default value of input box when focus
		 */
		_inputFocus : function(){
			if (this.elInput.value === this.options.searchDefault){
				this.elInput.value = '';
			}
		},
		/**
		 * set defalut value of input box when blur
		 */
		_inputBlur : function(){
			if (this.elInput.value === ''){
				this.elInput.value = this.options.searchDefault;
			}
		},
		/**
		 * toggle the visibility of result panal
		 * @param {Object} evt event object
		 */
		_panalSwitch : function(evt){
			var welSwitcher = $Element(evt.currentElement);
			if (welSwitcher.hasClass('open')) {
				this.elPanalSwitchOpener.style.display = 'none';
				this.elPanalSwitchCloser.style.display = 'block';
				this.elResultPanal.style.display = 'block';
			}
			else if (welSwitcher.hasClass('close')){
				this.elPanalSwitchOpener.style.display = 'block';
				this.elPanalSwitchCloser.style.display = 'none';
				this.elResultPanal.style.display = 'none';
			}
			evt.stop();
		},
		/**
		 * toggle the feature of autucomplete
		 * @param {Object} evt event object
		 */
		_featureSwitch : function(evt){
			var elNode = evt.currentElement;
			if (elNode.className === ''){
				var txt = elNode.innerHTML;
				if (txt === 'ON') {
					this.elFeatureSwitchCloser.className = '';
					this.enable();
				}
				else if (txt === 'OFF') {
					this.elFeatureSwitchOpener.className = '';
					this.disable();
				}
				elNode.className = this.options.result.selectClass;
			}
			evt.stop();
		},
		/**
		 * check every input for handling
		 */
		_inputHandler : function(){
			var sInputValue = this.elInput.value;
			var sInputTips = this.elTips.value;
			if (sInputTips.indexOf(sInputValue) === 0) {
				this._showTips(this.RERAIN);
			}
			else {
				this._showTips(this.DELETE);
			}
			
			if (sInputValue !== '' && sInputValue.length < 10) {
				this._getResult(sInputValue);
			}
			else {
				this.elResultPanal.style.display = 'none';
				this._showTips(this.DELETE);
			}
		},
		/**
		 * fetch the tips list, three ways for use : local, ajax, jsonp
		 * @param {String} sReq
		 */
		_getResult : function(sReq){
			if (this.timer !== null) {
				return;
			}
			var oThis = this;
			var result = [];
			var complete = false;
			
			this.timer = setTimeout(function () {
				oThis.timer = null;
				sReq = oThis.elInput.value;
				if (sReq) {
					setTimeout(function(){
						if (!complete) {
							oThis._showResult(result);
						}
					}, 200);
					
					switch (oThis.options.searchType) {
					case 'local' :
						var localData = oThis.options.searchData;
						for (var i = 0, len = localData.length ; i < len ; i++){
							var reg = new RegExp('^' + sReq + '.*');
							var data = localData[i];
							if (reg.test(data)) {
								result.push(data);
							}
							if (result.length === oThis.options.listMax) {
								break;
							}
						}
						complete = true;
						oThis._showResult(result);
						break;
					case 'ajax' :
						var ajax = new $Ajax(oThis.options.ajaxSearchApi + '?query=' + sReq + '&max=' + oThis.options.listMax,{
							method : 'get',
							onload : function(data){
								result = data.json();
								complete = true;
								oThis._showResult(result);
							}
						});
						ajax.request();
						break;
					case 'jsonp' :
						var script = document.createElement("script");
						script.type = "text/javascript";
						script.src = oThis.options.ajaxSearchApi + '?callback=lmJsonpCallback&qu=' + sReq;
						function jsonpCallback(data){
							data = data[1];
							for (var i = 0 ; i < oThis.options.listMax && i < data.length ; i++){
								result.push(data[i][0]);
							}
							complete = true;
							oThis._showResult(result);
						}
						window.lmJsonpCallback = jsonpCallback;
						document.getElementsByTagName("head")[0].appendChild(script);
						break;
					}
				}				
			}, 250);
		},
		/**
		 * show the tips list
		 * @param {Array} data
		 */
		_showResult : function(data){
			var len = data.length;
			var sInputValue = this.elInput.value;
			
			for (var i = 0 ; i < this.options.listMax ; i++){
				this.aResultList[i].innerHTML = '';
				var field = data[i];
				if (field) {
					if (field.indexOf(sInputValue) === 0) {
						var front = field.slice(0, sInputValue.length);
						var back = field.slice(sInputValue.length);
						var span = $('<span>');
						span.style.color = '#ff0000';
						span.innerHTML = front;
						this.aResultList[i].appendChild(span);
						this.aResultList[i].appendChild(document.createTextNode(back));
					}
					else {
						this.aResultList[i].innerHTML = field;
					}
					this.aResultList[i].style.display = 'block';
				}
				else {
					this.aResultList[i].style.display = 'none';
				}
			}
					
			this.result = len;
			
			if (len > 0) {
				$Element(this.elPanalSwitchOpener).fireEvent('click');
				if (this.current > 0) {
					this.aResultList[this.current - 1].className = '';
					this.current = 0;
				}
				if (data[0].indexOf(sInputValue) === 0) {
					this._showTips(this.UPDATE, data[0]);
				}
			}
			else {
				$Element(this.elPanalSwitchCloser).fireEvent('click');
				this._showTips(this.DELETE);
			}
		},
		/**
		 * choose the right word from tips list by mouse or keyboard
		 * @param {Object} evt
		 */
		_selectResult : function (evt) {
			this.isInput = true;
			if (this.result > 0) {
				var nTo;
				var keyCode = evt.key().keyCode;
				if (keyCode === 40) {
					//down arrow
					if (this.current > 0) {
						nTo = this.current + 1;
					}
					else {
						nTo = 1;
					}
					this.isInput = false;
				}
				else if (keyCode === 38) {
					if (this.current > 0) {
						nTo = this.current - 1;
					}
					else {
						nTo = this.result;
					}
					this.isInput = false;
					evt.stop();//fix chrome bug
				}
				else {
					if (keyCode === 9) {
						this._applyTips(evt);
						evt.stop();
					}
					return;
				}
				
				if (this.current > 0) {
					this.aResultList[this.current - 1].className = '';
				}
				else {
					this.oldValue = this.elInput.value;
				}
				
				if (nTo < 1 || nTo > this.result) {
					this.current = 0;
					this.elInput.value = this.oldValue;
				}
				else {
					this.current = nTo;
					this.elInput.value = $Element(this.aResultList[nTo - 1]).text();
					this.aResultList[nTo - 1].className = this.options.result.onClass;
				}
				this._showTips(this.DELETE);
				
			}
		},
		/**
		 * show autocomplete word when available
		 * @param {Number} nAction select the appropriate operation, three options are available: DELETE, RETAIN, UPDATE 
		 * @param {String} sNew when select UPDATE, need to provide new word
		 */
		_showTips : function(nAction, sNew){
			switch (nAction){
			case (1) :
				this.elTips.value = '';
				break;
			case (2) :
				break;
			case (3) : 
				this.elTips.value = sNew;
			}
		},
		/**
		 * apply autocomplete word by pressing "Tab" key
		 */
		_applyTips : function(){
			var sInputTips = this.elTips.value;
			if (sInputTips) {
				this.elInput.value = sInputTips;
				this._showTips(this.DELETE);
				this._getResult(sInputTips);
				this.elInput.focus();
			}
		},
		/**
		 * submit query string to server
		 * @param {Object} evt event object
		 */
		_submit : function(evt){
			var elNode = evt.currentElement;
			var query = this.elInput.value;
			if (query !== '') {
				location.href = this.options.searchServer + '?query=' + query;
			}
			evt.stop();
		}
	});
})('nj.Jtop.Suggest');
/*============================================================================================================================*/
/*=================================================== Liu Ming End ===========================================================*/
/*============================================================================================================================*/

/**
 * 開閉パネル。複数パネル対応。
 * nj.Jtop.Panel
 */
(function(namespace) {
	var pkg = $.verifyPackageName(namespace);
	pkg.container[pkg.name] = $Class({

	aOPanel: [],

	$init: function(oOpt) {
		this.opt = this._getOptions(oOpt);

		this._setElements();

		this._addEvents();
	},

	_getOptions: function(args) {
		var options = {
			openClass: 'open',
			closeClass: 'close',
			panels: [
				{
					base: '',
					opener: 'div.headArea a'
				}
			]
		};
		if (typeof args == "undefined") args = {};
		for (var i in args) options[i] = args[i];
		return options;
	},

	/**
	 * パネルの初期化。
	 * ページロード時に、開いているパネルを閉じる。
	 */
	_setElements: function() {
		$A(this.opt.panels).forEach(function(v, i) {
			var elBase = $(v.base);
			var welBase = $Element(elBase);

			var elOpener = $$.getSingle(v.opener, elBase);
			var welOpener = $Element(elOpener);

			welBase
				.removeClass(this.opt.openClass)
				.addClass(this.opt.closeClass);

			this.aOPanel.push({
				welBase: welBase,
				welOpener: welOpener
			});
		}, this);
	},

	/**
	 * イベント設定。
	 */
	_addEvents: function() {
		$A(this.aOPanel).forEach(function(v, i) {
			var elOpener = v.welOpener.$value();
			$Fn(function(e){
				this.toggle(i, e);
			}, this).attach(elOpener, 'click');
		}, this);
	},

	/**
	 * パネルの開閉。
	 * @param {Number} nIndex
	 * @param {Event} e
	 */
	toggle: function(nIndex, e) {
		if (e) e.stop();

		var sRemove, sAdd;
		var welBase = this.aOPanel[nIndex].welBase;
		var sClass = welBase.className();
		var bOpen = sClass.match(this.opt.openClass);

		if (bOpen) {
			sRemove = this.opt.openClass;
			sAdd = this.opt.closeClass;
		} else {
			sRemove = this.opt.closeClass;
			sAdd = this.opt.openClass;
		}

		welBase
			.removeClass(sRemove)
			.addClass(sAdd);

		if (!bOpen && welBase.$value().id == 'srvsLiArea'){
			var nTop = Math.floor(welBase.offset().top);
			var nT = 0;

			var nTimer = setInterval($Fn(function(){
				var nScrollTop = document.body.scrollTop  || document.documentElement.scrollTop;
				var nNext = nScrollTop + Math.pow(nT, 1.5);
				if (nNext > nTop) {
					nNext = nTop;
					clearInterval(nTimer);
				}
				scrollTo(0, nNext);
				nT++;
			}, this).bind(), 10);
		}
	}
	});
 })("nj.Jtop.Panel");


/**
 * スライド切替。複数スライド対応。
 * nj.Jtop.Slide
 */
(function(namespace) {
	var pkg = $.verifyPackageName(namespace);
	pkg.container[pkg.name] = $Class({

	aOSlide: [],

	$init: function(oOpt) {
		this.opt = this._getOptions(oOpt);

		this._setElements();

		this._addEvents();
	},

	_getOptions: function(args) {
		var options = {
			head: {
				node: 'div.headArea',
				btnArea: {
					node: 'div.btnArea',
					btn: 'ul li a img',
					num: 'span.num',
					sum: 'span.sum',
					off: '_off'
				}
			},
			slides: [
				{
					base: 'wkRcmndArea',
					slide: '#wkRcmndLi ul'
				}
			]
		};
		if (typeof args == "undefined") args = {};
		for (var i in args) options[i] = args[i];
		return options;
	},

	/**
	 * エレメントのセット。
	 */
	_setElements: function() {
		$A(this.opt.slides).forEach(function(v, i) {
			var elBase = $(v.base);
			var elSlide = $$.getSingle(v.slide, elBase);

			var aElSingle = $$('li', elSlide);
			var nLength = aElSingle.length;
			var nWidth = $Element(aElSingle[0]).width();
			var nTotalW = nWidth * nLength;
			$Element(elSlide).css('width', nTotalW + 'px');

			var elBtnArea = $$.getSingle(this.opt.head.btnArea.node, elBase);
			var elNum = $$.getSingle(this.opt.head.btnArea.num, elBtnArea);
			var elSum = $$.getSingle(this.opt.head.btnArea.sum, elBtnArea);
			$Element(elSum).text(nLength + '');

			var aBtn = $$(this.opt.head.btnArea.btn, elBtnArea);
			var elPrev = aBtn[0], elNext = aBtn[1];

			if (nLength < 2) {
				var rx = new RegExp('(\.[^\.]+)$');
				elNext.src = elNext.src.replace(rx, this.opt.head.btnArea.off + '$1');
			}

			this.aOSlide.push({
				welSlide: $Element(elSlide),
				nLength: nLength,
				nWidth: nWidth,
				elPrev: elPrev,
				elNext: elNext,
				welNum: $Element(elNum),
				nIndex: 0
			});
		}, this);
	},

	/**
	 * イベント設定。
	 */
	_addEvents: function() {
		$A(this.aOSlide).forEach(function(v, i) {
			$Fn(function(e){this.slideTo(v, 'prev', e);}, this).attach(v.elPrev, 'click');
			$Fn(function(e){this.slideTo(v, 'next', e);}, this).attach(v.elNext, 'click');
		}, this);
	},

	/**
	 * 次を表示。
	 * @param {Object} oSlide
	 * @param {Bool} sDir
	 * @param {Event} e
	 */
	slideTo: function(oSlide, sDir, e) {
		if (e) e.stop();

		var nDir = sDir == 'next' ? 1 : -1;
		var nNextIndex = oSlide.nIndex + nDir;

		if (nNextIndex < 0 || nNextIndex >= oSlide.nLength) return;

		var nOffset = - nDir * oSlide.nWidth;
		var sFrom = oSlide.welSlide.css('marginLeft');
		var nFrom = parseInt(sFrom.replace('px', ''));
		var nTo = nFrom + nOffset;

		var sSuffix = this.opt.head.btnArea.off;
		var rx = new RegExp('(\.[^\.]+)$');

		if (nDir == 1 && nNextIndex == oSlide.nLength - 1 || nDir == -1 && nNextIndex == 0) {
			var elBtn = nDir == 1 ? oSlide.elNext : oSlide.elPrev;
			elBtn.src = elBtn.src.replace(rx, sSuffix + '$1');

			if (oSlide.nLength < 3) {
				var elBtnOther = nDir == -1 ? oSlide.elNext : oSlide.elPrev;
				elBtnOther.src = elBtnOther.src.replace(sSuffix, '');
			}
		} else {
			oSlide.elPrev.src = oSlide.elPrev.src.replace(sSuffix, '');
			oSlide.elNext.src = oSlide.elNext.src.replace(sSuffix, '');
		}

		oSlide.welSlide.css('marginLeft', nTo + 'px');
		oSlide.welNum.text((nNextIndex+ 1) + '');
		oSlide.nIndex += nDir;
	}

	});
 })("nj.Jtop.Slide");


/**
 * ジャンルTop ゲームリスト。
 * nj.Jtop.GameList
 */
(function(namespace) {
	var pkg = $.verifyPackageName(namespace);
	pkg.container[pkg.name] = $Class({

	aOTabs: [],

	$init: function(oOpt) {
		this.opt = this._getOptions(oOpt);
		this.elBase = $(this.opt.base);

		this._setElements();

		this._addEvent();
	},
	_getOptions: function(args) {
		var options = {
				base: 'liArea',
				tabs: ['liArea01','liArea02', 'liArea03'],
				switchBtn: 'div.nav p.btn img',
				onClass: '_on',
				textClass: 'txt',
				imageClass: 'img',
				box: 'li a',
				tip: 'span.detl',
				hideClass: 'hide',
				note: 'ul.note'
		};
		if (typeof args == "undefined") args = {};
		for (var i in args) options[i] = args[i];
		return options;
	},

	/**
	 * エレメントのセット。
	 */
	_setElements: function() {
		$A(this.opt.tabs).forEach(function(v, i) {
			var welBase = $Element(v);

			this.aOTabs.push({
				welBase: welBase
			});
		}, this);
	},

	/**
	 * イベント設定。
	 */
	_addEvent: function() {
		this.elBtn = $$.getSingle(this.opt.switchBtn, this.elBase);
		$Fn(this.switchType, this).attach(this.elBtn, 'click');

		$A(this.aOTabs).forEach(function(oTab, i){
			oTab.aElBox = $$(this.opt.box, oTab.welBase.$value());
			oTab.aElTip = $$(this.opt.tip, oTab.welBase.$value());

			$A(oTab.aElBox).forEach(function(elImg, j){
				$Fn(function(e){this.showTip(oTab, j, e);}, this).attach(elImg, 'mouseover');
				$Fn(function(e){this.hideTip(oTab, j, e);}, this).attach(elImg, 'mouseout');
			},this);
		}, this);

		this.welNote = $Element($$.getSingle(this.opt.note, this.elBase));
	},

	/**
	 * テキスト、画像表示の切替。
	 * @param {Event} e
	 */
	switchType: function(e) {
		if (e) e.stop();

		var rx = new RegExp('(\.[^\.]+)$');
		var sSuffix = this.opt.onClass;

		if (this.elBtn.src.match(sSuffix)) {
			var sAdd = this.opt.imageClass;
			var sRemove = this.opt.textClass;
			this.elBtn.src = this.elBtn.src.replace(sSuffix, '');
			this.welNote.show();
		} else {
			var sAdd = this.opt.textClass;
			var sRemove = this.opt.imageClass;
			this.elBtn.src = this.elBtn.src.replace(rx, sSuffix + '$1');
			this.welNote.hide();
		}

		$A(this.aOTabs).forEach(function(v, i){
			v.welBase.addClass(sAdd);
			v.welBase.removeClass(sRemove);
		}, this);
	},

	/**
	 * ゲーム説明表示。
	 * @param {Event} e
	 */
	showTip: function(oTab, i, e) {
		var elTip = oTab.aElTip[i];
		$Element(elTip).removeClass(this.opt.hideClass);
	},

	/**
	 * ゲーム説明非表示。
	 * @param {Event} e
	 */
	hideTip: function(oTab, i, e) {
		var elTip = oTab.aElTip[i];
		$Element(elTip).addClass(this.opt.hideClass);
	}

	});
 })("nj.Jtop.GameList");


/**
 * 検索結果ページ。
 * nj.Jtop.SearchResult
 */
(function(namespace) {
	var pkg = $.verifyPackageName(namespace);
	pkg.container[pkg.name] = $Class({

	$init: function(oOpt) {
		this.opt = this._getOptions(oOpt);

		this.elBase = $(this.opt.base);
		this.welBase = $Element(this.elBase);
		this.welArea = $Element(this.opt.area);

		this._addEvent();
	},
	_getOptions: function(args) {
		var options = {
			base: 'resltArea',
			area: 'resltLi',
			switchBtn: 'div.headArea ul img',
			onClass: '_on',
			hideClass: 'hide'
		};
		if (typeof args == "undefined") args = {};
		for (var i in args) options[i] = args[i];
		return options;
	},

	/**
	 * イベント設定。
	 */
	_addEvent: function() {
		var aElBtn = $$(this.opt.switchBtn, this.elBase);
		this.elBtnText = aElBtn[0];
		this.elBtnImage = aElBtn[1];

		$Fn(function(e){
			this.switchType(true, e);
		}, this).attach(this.elBtnText, 'click');

		$Fn(function(e){
			this.switchType(false, e);
		}, this).attach(this.elBtnImage, 'click');
	},

	/**
	 * テキスト、画像表示の切替。
	 * @param {Bool} bTextOnly
	 * @param {Event} e
	 */
	switchType: function(bTextOnly, e) {
		if (e) e.stop();

		var sCurrent = this.welArea.className();
		if ((bTextOnly && sCurrent.match(this.opt.hideClass)) ||
		   (!bTextOnly && !sCurrent.match(this.opt.hideClass))) return;

		var rx = new RegExp('(\.[^\.]+)$');
		var sSuffix = this.opt.onClass;

		if (bTextOnly) {
			this.welArea.addClass(this.opt.hideClass);
			this.elBtnText.src = this.elBtnText.src.replace(rx, sSuffix + '$1');
			this.elBtnImage.src = this.elBtnImage.src.replace(sSuffix, '');
		} else {
			this.welArea.removeClass(this.opt.hideClass);
			this.elBtnImage.src = this.elBtnImage.src.replace(rx, sSuffix + '$1');
			this.elBtnText.src = this.elBtnText.src.replace(sSuffix, '');
		}
	}


	});
 })("nj.Jtop.SearchResult");


/**
 * ログインパネル内マイメニュー。
 * nj.Jtop.MyMenu
 */
nj.contentsMasterCallback = function(oData) {
	if (gcMyMenu) gcMyMenu.setContentsData(oData);
};

(function(namespace) {
    var pkg = $.verifyPackageName(namespace);
    pkg.container[pkg.name] = $Class({
	real: true,
	myMenuId : 'myMenuTab',
	hstryId : 'playHstryTab',
	classNames : {
		myMenu : 'tabOn_myMenuTab',
		hstry : 'tabOn_playHstryTab',
		open : 'ulOpen',
		close : 'ulClose'
	},
	url : {
		thumb : 'http://images.hangame.co.jp/_images/toppage/gicon_',
		ment : 'http://images.hangame.co.jp/hangame/htop/extraarea/icn_mainte.gif',
		ok : 'http://images.hangame.co.jp/hangame/htop/extraarea/icn_governing.gif',
		add : 'http://images.hangame.co.jp/hangame/htop/extraarea/icn_plus.gif',
		del : 'http://images.hangame.co.jp/hangame/htop/extraarea/icn_delete.gif'
	},
	msg : {
		del : ['マイメニューから削除しました。'],
		add : ['マイメニューに登録しました。','これ以上登録できません。','すでに登録されています。','登録が失敗しました。','登録が失敗しました。'],
		emptyMyMenu : 'サービスが未登録です。<br /><br />【マイメニューとは？】<br />よく利用するサービスのショートカットです♪<br />各サービスにある「マイメニューに追加」ボタンを押して登録してね。'
	},
	iconPathHash: {
		'new':'http://images.hangame.co.jp/hangame/htop/icn_new.gif'
		,'event':'http://images.hangame.co.jp/hangame/htop/icn_event.gif'
		,'update':'http://images.hangame.co.jp/hangame/htop/icn_update.gif'
		,'test':'http://images.hangame.co.jp/hangame/htop/icn_test.gif'
	},

	$init : function(){
		this.opt = this._getOptionSet( arguments[0] );

	    this.baseID = 'usersLinks';
	    this.baseElm = $(this.baseID);
	    this.baseElmObj = $Element(this.baseElm);
	    this.baseElmObj.show();

	    this.ocElm = cssquery.getSingle('H2',this.baseElm);
	    this.myMenuElm = $(this.myMenuId);
	    this.myMenuTabElm = cssquery.getSingle('H3', this.myMenuElm);
	    this.hstryElm = $(this.hstryId);
	    this.hstryTabElm = cssquery.getSingle('H3', this.hstryElm);

	    this.dispFlg;
	    this.getDataFlg = false;
	    this.emptyMyMenuFlg = false;
        this.initFlg = false;

		this.initialize();
	},
	_getOptionSet : function(argu) {
		var option = {

		};
		if (typeof argu == "undefined") argu = new Object;
		for(var x in argu) option[x] = argu[x];
		return option;
	},
	initialize : function(){
        if(this.initFlg) return;
        this.initFlg = true;

	    this._jsonpRequest(this.opt.jsonpUrl);
	    this._attachEvent();
	},
	_jsonpRequest : function(jsonp){
	    this.ajax = new $Ajax(jsonp,{
			type : 'jsonp',
			jsonp_charset : "shift_jis"
	    });
	    this.ajax.request();
	},
	_swfRequest : function(url,param,type,id){
	    var _this = this;
	    this.ajax = new $Ajax(url,{
		    method : 'post',
		    type : 'flash',
		    onload : function(res){
			    _this._callback(res,type,id);
		    },
		    onerror : function(){
				_this._swfRequestError();
		    },
            _respHeaders : {'charset':'shift_jis'}
	    });

	    try{
			this.ajax.request(param);
	    }catch(e){
			_this._swfRequestError();
	    }
	},
	_attachEvent : function(){
		$Fn(this.openMyMenuEv,this).attach(this.myMenuTabElm,'click');
		$Fn(this.openHstryEv,this).attach(this.hstryTabElm,'click');
	},
	setContentsData : function(data){
		if (!data) {
			return;
		}
		this.contentsData = data;
		//this.changeDispEv();
        this._dataRequest('open');
	},
	_changeDisp : function(type){
		// マイメニューの表示切り替え
	    switch(type){
		case 'open':
		    if(this.getDataFlg){
				this.baseElmObj.className(this.classNames.hstry + ' ' + this.classNames.open);
		    }else{
				this._dataRequest('open');
		    }
		    break;
		case 'close':
		    this.baseElmObj.className(this.classNames.close);
		    break;
	    }

	    this.dispFlg = type;
	},
	openMyMenuEv : function(){
		// マイメニュー表示
		this.baseElmObj.removeClass(this.classNames.hstry);
		this.baseElmObj.addClass(this.classNames.myMenu);
	},
	openHstryEv : function(){
		// プレイ履歴表示
		this.baseElmObj.removeClass(this.classNames.myMenu);
		this.baseElmObj.addClass(this.classNames.hstry);
	},
	_dataRequest : function(type, itemid, e){
		// Ajaxデータリクエスト
	    if(e) $Event(e).stop();


		if (type == 'open') {
			var api = this.opt.api + 'openMymenu';
			if (this.real) {
				this._swfRequest(api, null, type);
				return;
			}
			this._callback({
				"status":"0",
				"mymenu":"SAME2,BBY",
				"myplayhist":"BBY,PUBSTO"
			}, type);
		} else if (type == 'del') {
			this.deleteItem = e.element.parentNode;

			var api = this.opt.api + 'delMymenu&gid=' + itemid;
			if (this.real) {
				this._swfRequest(api,null,type,itemid);
				return;
			}
			this._callback({
				"status":"0"
			}, type);
		} else if (type == 'add') {
			this.addItem = e.element.parentNode;

			var api = this.opt.api + 'addMymenu&gid=' + itemid;
			if (this.real) {
				this._swfRequest(api,null,type,itemid);
				return;
			}
			this._callback({
				"status":"0"
			}, type);
		}
	},
	_callback : function(data, type, id){
		data = eval('('+data.text()+')');

		// Ajaxレスポンス処理
		if (type == 'open') {
			this.getDataFlg = true;
			this._drawItems(data);
			this._changeDisp('open');
		} else if (type == 'del') {
			this._deleteItem(data,id);
		} else if (type == 'add') {
			this._addItem(data,id);
		}
		//this.communicating = false;
	},
	_drawItems : function(res){
		// マイメニュー、プレイ履歴の描画
		if (res.status != 0) {
		     return;
		}
		this.myMenuList = $A(res.mymenu.split(","));
		this._drawMyMenu(this.myMenuList);
		this.hstryList = $A(res.myplayhist.split(","));
		this._drawHstry(this.hstryList);
	},
	_drawMyMenu : function(list){
		// マイメニューの描画
	    var UL = cssquery.getSingle('UL',this.myMenuElm);
	    var ULElm = $Element(UL);

	    if(list.length() < 1 || list.$value()[0] == ''){
			this._showMyMenuEmptyMsg();
			return;
	    }

	    var _this = this;

		list.forEach(function(v,i){
			_this._drawItem(v, ULElm);
		});
	},
	_drawItem : function(id, ULElm) {
		// マイメニューの１アイテムの描画
			var liElm = $Element('<LI>');
			var item = this.contentsData[id];

			if(!item){
			    var endGameFlg = true;
			    var item = {};
			    //item.contid = v;
			    item.name = '終了したゲームです';
			}

			if(!endGameFlg){
			    var link = '<a href="' + item.url + '">' + item.name + '</a>';
			}else{
			    var link = item.name;
			}
			liElm.html(link);

			var btn = $('<IMG>');
			var btnElm = $Element(btn).attr({
				src : this.url.del,
				alt : '削除',
				tabindex : '0'
			});

			$Fn(function(e){
				this._dataRequest('del', id, e);
			}, this).attach(btn, 'click');
			liElm.append(btnElm);
			ULElm.append(liElm);
	},
	_drawHstry : function(list){
		// プレイ履歴の描画
	    var UL = cssquery.getSingle('UL',this.hstryElm);
	    var ULElm = $Element(UL);
	    var _this = this;
	    var innerUL = '';

            if(list.length() == 1 && list._array[0] == ''){
              innerUL = '<p class="noPlayHistory">プレイ履歴がありません。</p>';
              ULElm.html(innerUL);
              return
            }

		list.forEach(function(v,i){
			var liElm = $Element('<LI>');

			var item = _this.contentsData[v];
			var endGameFlg = false;
			if(!item){
			    endGameFlg = true;
			    var item = {};
			    item.contid = v;
			    item.name = 'サービス終了';
                var thumb = '<img class="thm" alt="サービス終了" src="http://images.hangame.co.jp/_images/toppage/gicon_closed.gif"/>';
			}else{
              	var thumb = '<img class="thm" alt="" src="' + _this.url.thumb + item.contid.toLowerCase() + '.gif"/>';
            }

			if(!endGameFlg){
			    var ment = '<img class="stt" alt="" src="'
					 + (item.ment == 'Y' ? _this.url.ment : _this.url.ok) + '"/>';
			    innerUL = '<a href="' + item.url + '">' + thumb + ment;
			}else{
			    var ment = '';
			    innerUL = thumb + ment;
			}
		     var icon;
		     (item.icon)? icon = item.icon : icon = 'NONE';
		     icon = (icon != 'NONE')? icon.toLowerCase() : null;
		     if(icon){
			    innerUL += '<img alt="' + icon.toUpperCase() + '" src="' + _this.iconPathHash[icon] + '" class="stt"/>';
		     }
		     innerUL += '<br/><span>' + item.name + '</span>';
		     if(!endGameFlg) innerUL += '</a>';
			liElm.html(innerUL);
			if(!endGameFlg){
				var btn = $('<IMG>');
				var btnElm = $Element(btn);
				btnElm.attr({
					src : _this.url.add,
					title : 'マイメニューに追加',
					alt : '+',
					tabindex : '0'
				});
				btnElm.className('add');

				$Fn(function(e){
					_this._dataRequest('add', item.contid, e);
				}, this).attach(btn, 'click');
			    if(_this.myMenuList.has(item.contid)) {
				btnElm.hide();
			    }
			    liElm.append(btnElm);
			}else{
			    var btn = $('<IMG>');
			    var btnElm = $Element(btn);
			    btnElm.hide();
			    btnElm.className('add');
			    liElm.append(btnElm);
			}
			ULElm.append(liElm);
		});
	},
	_deleteItem : function(res,id){
		// マイメニュー項目の削除
		if (res.status != 0) {
			return;
		}

		var elm = $Element(this.deleteItem);
		var msg = $('<EM>');

		$Element(msg).text(this.msg.del[res.status]);
		elm.append(msg);
		var _this = this;
		_this._showAddBtn(id);
		$Fn(function(){
			elm.css('visibility', 'hidden');
			elm.leave();
			var LI = $$('LI',_this.myMenuElm);
			if (LI.length < 1) {
				_this._showMyMenuEmptyMsg();
			}
		}).delay(3);
	},
	_showAddBtn : function (id) {
		var index = this.hstryList.indexOf(id);
                if(index < 0) return;
		var img = $$('img.add', this.hstryElm);
                if(img[index].src)$Element(img[index]).show();
	},
	_addItem : function(res,id){
		// マイメニュー項目の追加
                /*switch(res.statsu){
                     case 1:

                }
		if (res.status != 0 && res.status != 1) {
		     return;
		}*/

		var elm = $Element(this.addItem);

		var msg = $('<EM>');
		var msgEl = $Element(msg);
		msgEl.text(this.msg.add[res.status]);
		elm.append(msg);

		$Fn(function(){
                     msgEl.css('visibility', 'hidden');
		     msgEl.leave();
                     //msg.parentNode.removeChild(msg);
		}).delay(3);

		var UL = cssquery.getSingle('UL',this.myMenuElm);
		var ULElm = $Element(UL);
		var _this = this;

       		if(res.status != 0) return;

		var addBtn = $$('img.add', this.addItem)[0];
		$Element(addBtn).hide();

		if(this.emptyMyMenuFlg) {
			this._removeMyMenuEmptyMsg();
		}

		_this._drawItem(id, ULElm);
	},
	_showMyMenuEmptyMsg : function () {
		this.emptyMyMenuFlg = true;
		var pElm = $Element($('<P>'));
		pElm.html(this.msg.emptyMyMenu);
		$Element(this.myMenuElm).append(pElm);
	},
	_removeMyMenuEmptyMsg : function () {
		var P = cssquery.getSingle('P',this.myMenuElm);
		$Element(P).leave();
		this.emptyMyMenuFlg = false;
	},
	_swfRequestError : function(){
		//
	}
    });
})( "nj.Jtop.MyMenu" );


/**
 * キャラクター検索: じっくりTop
 * nj.Jtop.CharacterSearch
 */
(function(namespace) {
	var pkg = $.verifyPackageName(namespace);
	pkg.container[pkg.name] = $Class({
	$init: function(oOpt) {
		this.opt = this._getOptions(oOpt);

		this.welBase = $Element(this.opt.base);
		this.welMask = $Element(this.opt.mask);

		this._addEvent();
	},
	_getOptions: function(args) {
		var options = {
			base: 'sdjs_charSch_layer_f',
			mask: 'sdjs_charSch_mask',
			opener: '#menuArea li.char a',
			area: ['contentsArea','footerArea']
		};
		if (typeof args == "undefined") args = {};
		for (var i in args) options[i] = args[i];
		return options;
	},

	/**
	 * イベント設定。
	 */
	_addEvent: function() {
		var elOpener = $$.getSingle(this.opt.opener);
		$Fn(this.open, this).attach(elOpener, 'click');

		$Fn(this.close, this).attach(this.welMask.$value(), 'click');
	},

	/**
	 * レイヤーを表示。
	 * @param {Event} e
	 */
	open: function(e) {
		if (e) e.stop();

		var nH = 0;
		$A(this.opt.area).forEach(function(v, i){
			nH += $Element(v).height();
		}, this);

		this.welBase.show();
		this.welMask.css('height', nH + 'px').show();
	},

	/**
	 * レイヤーを非表示。
	 * @param {Event} e
	 */
	close: function(e) {
		if (e) e.stop();

		this.welBase.hide();
		this.welMask.hide();
	}

	});
 })("nj.Jtop.CharacterSearch");


/**
 * じっくりゲームメニュー
 * nj.Jtop.GameMenu
 */
(function(namespace) {
	var pkg = $.verifyPackageName(namespace);
	pkg.container[pkg.name] = $Class({
	$init: function(oOpt) {
		this.opt = this._getOptions(oOpt);

		this.elBase = $(this.opt.base);
		this.elPanels = $$.getSingle(this.opt.panels, this.elBase);
		this.elSlide = $$.getSingle(this.opt.slide, this.elBase);

		this._addEvent();
	},
	_getOptions: function(args) {
		var options = {
			base: 'menuArea',
			panels: 'ul.gnr',
			pane: 'li.pane a',
			openClass: 'open',
			slide: 'div.usfl',
			handle: 'p.btn a',
			slideIn: 'div.section',
			nSlideLeft: 485,
			nCloseLeft: 495,
			nOpenLeft: 322,
			hideSuffix: 'hide',
			showSuffix: 'show',
			onSuffix: '_on'
		};
		if (typeof args == "undefined") args = {};
		for (var i in args) options[i] = args[i];
		return options;
	},

	/**
	 * Events.
	 */
	_addEvent: function() {
		// Panel events.
		var aElPane = $$(this.opt.pane, this.elPanels);
		$A(aElPane).forEach(function(v, i){
			var welPane = $Element(v);
			$Fn(function(){
				welPane.addClass(this.opt.openClass);
			}, this).attach(v, 'mouseover');

			$Fn(function(){
				welPane.removeClass(this.opt.openClass);
			}, this).attach(v, 'mouseout');
		}, this);


		// Slide event.
		this.bOpen = false;
		this.elHandle = $$.getSingle(this.opt.handle, this.elSlide);
		this.elSlideIn = $$.getSingle(this.opt.slideIn, this.elSlide);
		$Fn(this.toggle, this).attach(this.elHandle, 'click');

//		$Fn(this.open, this).attach(this.elSlideIn, 'mouseenter');
//		$Fn(this.close, this).attach(this.elSlideIn, 'mouseleave');

		this.elHandleImg = $$.getSingle('img', this.elHandle);

		this.fx = new nj.fx(this.elSlide);
	},

	/**
	 * Toggle the slide. Used for click event.
	 * @param {Event} e
	 */
	toggle: function(e) {
		if (e) e.stop();

		var nTo = this.bOpen ? this.opt.nCloseLeft : this.opt.nOpenLeft;

		this.fx.tween({sec: 0.3,
			left: {to: nTo, ease:'easeOutExpo'},
			axis: 'center'
		});

		var elImg = this.elHandleImg;
		var sHide = this.opt.hideSuffix;
		var sShow = this.opt.showSuffix;

		if (this.bOpen) {
			elImg.src = elImg.src.replace(sHide, sShow);
		} else {
			elImg.src = elImg.src.replace(sShow, sHide);
		}

		this.bOpen = this.bOpen ? false : true;
	},

	/**
	 * Open the slide.
	 * @param {Event} e
	 */
	open: function(e) {
		if (e) e.stop();
/*		if (this.bSliding) return;

		var nTo = this.opt.nSlideLeft;
		this.bSliding = true;

		var _this = this;

		this.fx.tween({sec: 0.3,
			left: {to: nTo, ease:'easeOutExpo'},
			axis: 'center',
			onComplete: function(){
				_this.bSliding = false;
				_this.bOpen = true;

				if (_this.bQueue) {
					_this.close();
				}
				_this.bQueue = false;

			}
		});
*/
		var elImg = this.elHandleImg;
//		var sHide = this.opt.hideSuffix;
//		var sShow = this.opt.showSuffix;

		var rx = new RegExp('(\.[^\.]+)$');
		elImg.src = elImg.src.replace(rx, this.opt.onSuffix + '$1');
	},

	/**
	 * Close the slide.
	 * @param {Event} e
	 */
	close: function(e) {
		if (e) e.stop();
/*		if (this.bSliding) {
			this.bQueue = true;
			return;
		}

		var nTo = this.opt.nCloseLeft;
		this.bSliding = true;

		var _this = this;

		this.fx.tween({sec: 0.3,
			left: {to: nTo, ease:'easeOutExpo'},
			axis: 'center',
			onComplete: function(){
				_this.bSliding = false;
				_this.bOpen = false;
			}
		});
*/
		var elImg = this.elHandleImg;
//		var sHide = this.opt.hideSuffix;
//		var sShow = this.opt.showSuffix;

		elImg.src = elImg.src.replace(this.opt.onSuffix, '');
	}

	});
 })("nj.Jtop.GameMenu");


/**
 * スポットデッキ: レイヤー表示。
 * SpotDeckIF
 */
var SpotDeckIF=$Class({
	$init : function(){
		var options = this.opt = this._getOptionSet( arguments[0] );
		this._base = $( options.id );

		if ( !this._base ) return;

		//default type
		this.type = 'image';

		this.aClass = this.opt.aClass;
		this.bodyElm = $Element(document.body);
		this.loadFnAry = new Array();
		this._addEvent();

	},
	_getOptionSet : function(argu) {
		var option = {};
		if (typeof argu == "undefined") argu = new Object;
		for(var x in argu) {
				option[x] = argu[x];
		}
		return option;
	},
	_addEvent : function(){
		$Fn(this.disp,this).attach($$('#' + this.opt.id + ' .' + this.opt.className),"click");
		$Fn(this.close,this).attach($('sdjs_layClose'),"click");
	},
	disp : function(e){
		e.stop();
		//var rel = e.currentElement.rel;
		var rel = e.currentElement.getAttribute('rel');
		if(!rel) return;
		var json = $Json(rel).$value().data[0];

		this._makeLayerHTML(json);
	},
	_getLayerHTML : function(){
		var layer = $(this.opt.layerId);
		document.body.removeChild(layer);
		return layer;
	},
	_makeLayerHTML : function(json){
		if(!json) return;

		if(json.type)this.type = json.type;

		var layer = $(this.opt.layerId);

		if(json.title)$Element($$('#'+this.opt.layerId + ' .sdjs_title')[0]).html(json.title);
		if(json.no)$Element($$('#'+this.opt.layerId + ' .sdjs_no')[0]).html(json.no);
		if(json.caption) $Element($$('#'+this.opt.layerId + ' .sdjs_caption')[0]).html(json.caption);

		if (this.type == 'image') {
			this.imgTagAry = $$('#' + this.opt.layerId + ' .sdjs_image');
			if(this.imgTagAry.length == 0) return;
			var loadingTagAry = $$('#' + this.opt.layerId + ' .sdjs_loading');
			var image = json.image;

			if (typeof image != 'object')image = [image];

			for (var i = 1; i <= image.length; i++) {
				this.loadFnAry[i - 1] = $Fn(function(e){
					this._imgLoaded(e);
				}, this).attach(this.imgTagAry[i - 1], "load");
				this.imgTagAry[i - 1].src = image[i - 1];
			}
		}

		if(this.type == 'flash'){
			var sp = new SwfPutter({src:json.swf, w:json.w, h:json.h});
			if(json.addVars) sp.addVars(json.addVars);
			sp.put('sdjs_movie');
		}

		this._disp();
	},
	_imgLoaded : function(e){
		var num = (e.currentElement.parentNode.className).replace('sdjs_image','');
		this.loadFnAry[num-1].detach(this.imgTagAry[num - 1], "load");
		$Element(e.currentElement.nextSibling).hide();
	},
	_disp : function(){
		var layerElem = $Element(this.opt.layerId);
		layerElem.css({"zIndex":"99999","position":"absolute"});
		this._setElmCenter($(this.opt.layerId));

		layerElem.show();

		this._mask();

		$A($$('select')).forEach(function(v,i){
			$Element(v).hide();
		})
	},
	_mask : function(){
		var mask = $("<div>");
		mask.id = 'sdjs_mask';

		var maskElem = $Element(mask);
		maskElem.css({"position":"absolute","left":"0px","top":"0px","width":"100%","height":(this._getPageSize()[1]+0)+"px","zIndex":"99997"})
		$Element(document.body).append(mask);

		var maskResize = function(){
			$Element(mask).css("width","100%");
			$Element(mask).css("height",(this._getPageSize()[1]+0)+"px");
			this._setElmCenter($(this.opt.layerId));
		};

		this.resizeFn = $Fn(maskResize, this).attach(window, "resize");
		$Fn(this._maskClick, this).attach(maskElem, "click");
	},
	_maskClick : function(){
		this.close();
	},
	close : function(){
		var maskObj = $('sdjs_mask');

		if(maskObj) maskObj.parentNode.removeChild(maskObj);

		$Element(this.opt.layerId).hide();
		this._clearLayer();

		if(this.resizeFn)this.resizeFn.detach(window, "resize");

		$A($$('select')).forEach(function(v,i){
			$Element(v).show();
		})
	},
	_clearLayer : function(){

		if($$('#'+this.opt.layerId + ' .sdjs_title')[0])$Element($$('#'+this.opt.layerId + ' .sdjs_title')[0]).html('');
		if($$('#'+this.opt.layerId + ' .sdjs_no')[0]) $Element($$('#'+this.opt.layerId + ' .sdjs_no')[0]).html('');
		if($$('#'+this.opt.layerId + ' .sdjs_caption')[0]) $Element($$('#'+this.opt.layerId + ' .sdjs_caption')[0]).html('');

		$A($$('#'+this.opt.layerId + ' .sdjs_image')).forEach(function(v,i){
			v.src = '';
		})

		$A($$('#'+this.opt.layerId + ' .sdjs_loading')).forEach(function(v,i){
			$Element(v).show();
		})

		if(this.type == 'flash') $Element('sdjs_movie').html('');

	},
	_setElmCenter : function(elm){
		elm = $Element(elm);

		var wSize = this._getWindowSize();
		var pSize = this._getPageSize();
		var cSizeObj = this._getContentSize(elm);

		var st = document.documentElement.scrollTop || document.body.scrollTop;
		var sl = document.documentElement.scrollLeft || document.body.scrollLeft;
		elm.css({left:'0px',top:'0px'});
		elm.css({left:parseInt(pSize["2"]/2-cSizeObj["w"]/2 + sl)+"px",top:parseInt(pSize["3"]/2-cSizeObj["h"]/2 + st) + "px"});
	},
	_getPageSize : function(){

		var xScroll,yScroll;

		if(document.compatMode && document.compatMode != "BackCompat"){
			//Standard
			xScroll = document.documentElement.scrollWidth;
			yScroll = document.documentElement.scrollHeight;
		}else{
			//Quirks
			xScroll = document.body.scrollWidth;
			yScroll = document.body.scrollHeight;
		}

		var windowWidth, windowHeight;
		if (self.innerHeight) {
			windowWidth = self.innerWidth;
			windowHeight = self.innerHeight;
		} else if (document.compatMode && document.compatMode != "BackCompat") {
			windowWidth = document.documentElement.clientWidth;
			windowHeight = document.documentElement.clientHeight;
		} else{
			windowWidth = document.body.clientWidth;
			windowHeight = document.body.clientHeight;
		}

		var pageHeight = Math.max(windowHeight,yScroll);
		var pageWidth = Math.max(windowWidth,xScroll);

		arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight)
		return arrayPageSize;
	},
	_getContentSize : function(elm){

		elm = $Element(elm);

		if(elm.css('display') == 'none'){
			elm.css('visibility','hidden');
			elm.show();
			var hideFlg = true;
		}

		var w = elm.width();
		var h = elm.height();
		if(hideFlg){
			elm.hide();
			elm.css('visibility','visible');
		}

		return {w:w, h:h};
	},
	_getWindowSize : function(){
		var wSize = new Object();
		if($Agent().navigator().ie) {
			wSize.w = document.documentElement.clientWidth;
			wSize.h = document.documentElement.clientHeight;
		} else {
			wSize.w = window.innerWidth;
			wSize.h = window.innerHeight;
		}

		return wSize;
	}
});


/**
 * JTMV JDAP data collection via Flash.
 */
var Jtmv = $Class({
	bJtmvReady: false,
	sClickUrl: '',
	nIndex: 0,

	$init: function(oOpt) {
		this.opt = oOpt;
		$A($$(oOpt.btns)).forEach(function(v, i){
			$Fn(function(){this.impCount(i);}, this).attach(v, 'click');
		}, this);

		$A($$(oOpt.thumbs)).forEach(function(v, i){
			$Fn(function(){this.clickCount(i);}, this).attach(v, 'click');
		}, this);
	},
	impCountInit: function() {
		this.elSwf = $(this.opt.swfId);
		var sUrl = this.opt.url[0].imp;
		this._sendToUrl(sUrl);
	},
	impCount: function(nBtnIndex) {
		if (nBtnIndex == 0) {
			if (this.nIndex < 1) return;
			this.nIndex--;
		} else {
			if (this.nIndex >= this.opt.url.length - 1) return;
			this.nIndex++;
		}
		var sUrl = this.opt.url[this.nIndex].imp;
		this._sendToUrl(sUrl);
	},
	clickCount: function(nIndex) {
		var sUrl = this.opt.url[nIndex].click;
		if (this.bJtmvReady) {
			this._sendToUrl(sUrl);
		} else {
			this.sClickUrl = sUrl;
		}
	},
	_sendToUrl: function(sUrl) {
		if (!sUrl || !this.elSwf) return;
		this.elSwf.AS_sendToURL(sUrl);
	}
});


