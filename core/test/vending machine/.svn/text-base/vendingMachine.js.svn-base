(function(){
	/**
	 * vending machine
	 */
	window.VendingMachine=$Class({
		_nAmount:0,
		
		_welMerchandiseContainer:'',
		_waMerchandise:'',
		_waCoinUnit:'',
		_welCoinIndicator:'',
		_welMessageBoard:'',
		_welReturnMoney:'',//new feature the 'return money' button
		
		/**
		 * constructor
		 * @param {Object} option HTML coder can change the id name if required
		 * 
		 * 
		 * @example new jindo.VendingMachine({
		 * 	container:'my_vending_machine',
		 * 	merchandise:'goods'
		 * })
		 */
		$init:function(option){
			var oThis=this;
			option=option?option:{};
			this._welMerchandiseContainer=$Element(option.merchandise||'merchandise');
			this._waMerchandise=$A(this._welMerchandiseContainer.child());
			this._waCoinUnit=$A($Element(option.coinUnit||'coinUnit').child());
			this._welCoinIndicator=$Element(option.coinIndicator||'coinIndicator');
			this._welMessageBoard=$Element(option.messageBoard||'messageBoard');
			this._welReturnMoney=$Element(option.returnMoney||'returnMoney');
			
			//add merchandise when window load
			this.addMerchandise();
			
			//add event listener
			this._waMerchandise.forEach(function(welElem){
				$Fn(oThis._buy,oThis).attach($$.getSingle('input',welElem.$value()),'click',false);
			})
			this._waCoinUnit.forEach(function(welElem){
				$Fn(oThis._addMoney,oThis).attach(welElem.$value(),'click',false);
			}) 
			$Fn(this._returnChange,this).attach(this._welReturnMoney.$value(),'click',false);
			$Fn(function(){
				if(this._nAmount>0){
					return 'Hey, there is still some money left ! Do you want to do charity ?';
				}
			},this).attach(window,'beforeunload');
		},
		/**
		 * pulic methord
		 * random arrange the order and quantity of merchandise, if the quantity of some merchandise is zero, mark the merchandise has sold out
		 */
		addMerchandise:function(){
			var oThis=this;
			this._waMerchandise.shuffle();
			this._welMerchandiseContainer.empty();
			this._waMerchandise.forEach(function(welElem){
				this._welMerchandiseContainer.append(welElem.$value());
			},this)
			this._waMerchandise.forEach(function(welElem){
				var elElem=welElem.$value();
				var nRan=Math.floor(Math.random()*4);
				$Element($$.getSingle('.quantity',elElem)).text(nRan);
				if(nRan===0){
					$Element($$.getSingle('input',elElem)).addClass('disable').text('Sell out');
				}
			})
		},
		/**
		 * handle the feature of add money, the 100 button can only be add twice at most until return change
		 */
		_addMoney:function(e){
			var elElem=e.currentElement;
			var welElem=$Element(elElem);
			var nMoney=parseInt(welElem.text());
			if(nMoney===100){
				elElem.number?elElem.number++:elElem.number=1;
				if(elElem.number>2){
					return;
				} else	if(elElem.number==2){
					welElem.addClass('disable');
				}					
			}
			this._nAmount+=nMoney;
			this._printAmount();
			this._printMessage('Add '+welElem.text());
			this._smartTip();
			this._welReturnMoney.removeClass('disable');
		},
		/**
		 * handle the feature of return change
		 * @param {String} sMsg if it is provided, print it. otherwise print the defalut message format.
		 * 
		 * There are two circumstances of returning change. 
		 * one is click the 'return money' button, and the other is return money automatically when there is not enough money left to buy something after last purchase
		 * provide a argument is just for the second situation
		 */
		_returnChange:function(sMsg){
			if(this._welReturnMoney.hasClass('disable')) return;
			sMsg&&(/string/i.test(sMsg.constructor))?this._printMessage(sMsg):this._printMessage('return change '+this._nAmount+' yuan');
			this._waCoinUnit.forEach(function(welElem){
				var elElem=welElem.$value();
				if(elElem.number){
					elElem.number=0;
					welElem.removeClass('disable');
				}
				$A.Continue;
			});
			this._welReturnMoney.addClass('disable');
			this._nAmount=0;
			this._smartTip();
			this._printAmount();
		},
		/**
		 * handle the feature of purchanse
		 * 
		 * if there is not enough money left to buy something after last purchase, return the change automatically
		 */
		_buy:function(e){
			var welElem=$Element(e.currentElement).parent(function(v){
				if(v.$value().nodeName==='LI') return true;
			})[0];
			var elElem=welElem.$value();
			var nQuantity=parseInt($Element($$.getSingle('.quantity',elElem)).text());
			var nPrice=parseInt($Element($$.getSingle('.price',elElem)).text());
			if(nQuantity<=0||this._nAmount<=0||nPrice>this._nAmount){
				return;
			}else{
				$Element($$.getSingle('.quantity',elElem)).text(--nQuantity);
				this._nAmount-=nPrice;
				if(nQuantity===0){
					$Element($$.getSingle('input',elElem)).addClass('disable').text('Sell out');
				}
				this._printAmount();
				
				if(this._smartTip()){
					this._printMessage('buy '+$Element($$.getSingle('.name',elElem)).text()+' successfully');
				}else if(this._nAmount===0){
					this._returnChange('buy '+$Element($$.getSingle('.name',elElem)).text()+' successfully. no money left');
				}else{
					this._returnChange('buy '+$Element($$.getSingle('.name',elElem)).text()+' successfully. return '+this._nAmount+' yuan');
				}
			}
		},
		/**
		 * show the operate message
		 * 
		 * adjust scrollbar to bottom automatically
		 * @param {String} sMsg message for print
		 */
		_printMessage:function(sMsg){
			this._welMessageBoard.append($('<li>'+ sMsg +'</li>')).hide().appear(1);
			var nWidthContainer=this._welMessageBoard.height();
			var waChildList=$A(this._welMessageBoard.child());
			var welFirstChild=this._welMessageBoard.first();
			var nWindthContent=welFirstChild.height()*waChildList.length();
			if(nWindthContent>nWidthContainer){
				this._welMessageBoard.$value().scrollTop=nWindthContent-nWidthContainer;
			}
		},
		/**
		 * update the remaining amount of money
		 */
		_printAmount:function(){
			this._welCoinIndicator.text(this._nAmount);
		},
		/**
		 * show dymanicly which merchandise can be bought with the current amount of money
		 * 
		 * toggle add a class using setInterval(), add a propery to the element to record the flick status, can easily clear the interval when not available
		 */
		_smartTip:function(){
			var oThis=this;
			var bAvailable=false;
			this._waMerchandise.forEach(function(welElem){
				var elElem=welElem.$value();
				welElem.removeClass('available');
				elElem.timer?clearInterval(elElem.timer):'';
				if(parseInt($Element($$.getSingle('.quantity',elElem)).text())>0){
					if(parseInt($Element($$.getSingle('.price',elElem)).text())<=this._nAmount){
						bAvailable=true;
						elElem.timer=setInterval(function(){
							welElem.toggleClass('available');
						},500);
					}
				}
			},oThis);
			return bAvailable;
		}
	})
})()


