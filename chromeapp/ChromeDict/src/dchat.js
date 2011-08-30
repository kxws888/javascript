(function (window, undefined) {
	
	function DChat(args) {
		this.people = args.people;
		this.name = args.name;

		this.chatWindow = null;
		this.port = null;

		this.lock = false;
	}

	DChat.prototype.proxy: function (fn, obj) {
        return function () {
            return fn.apply(obj, arguments);
        }
    };

	DChat.prototype.start = function () {
		var self = this;
		this.chatWindow = createChatWindow();

        this.port = chrome.extension.connect({name: 'dchat'});
        this.port.postMessage({cmd: 'receivestart', people: self.people});
        this.port.onMessage.addListener(function (msg) {
            if (msg.cmd === 'sended') {
                if (!msg.result) {
                    var captcha = self.addContent('<p>发送太快了亲，输入验证码</p><img src="' + msg.msg.captcha.string + '">');
                    msgRequreToken = msg.msg;
					msgRequreToken.captcha.dom = captcha;
                    self.lock = false;
					self.inputLock(false);
                }
            }
            else if (msg.cmd === 'received') {
                if (self.people === msg.people) {
                    self.addContent('<strong>' + self.name + '说</strong>: ' + msg.content);
                    self.lock = false;
					self.inputLock(false);
                }
            }
        });
	};

	DChat.prototype.stop = function (e) {
		if (e.target.className === '+') {
			this.port.postMessage({cmd: 'pop', people: people, name: chatWindow.querySelector('h1').innerHTML, history: msgList.innerHTML});
		}
		document.body.removeChild(this.chatWindow);
		this.port.disconnect();
		this.port = null;
		e.stopPropagation();
	};

	DChat.prototype.inputLock = function inputLock(status) {
		this.textbox.disabled = status;
		this.textbox.style.backgroundColor = status ? '#ddd' : '#fff';
		this.textbox.value = status ? '先等回复啊亲' : '';
	};

	DChat.prototype.createUI = function () {
        var aside = document.createElement('aside'), metaBtn;
        aside.id = 'dchat';
        aside.innerHTML = '<header><h1></h1><div><img class="-" /><img class="+" /><img class="x" /></div></header><section><div></div><div><form> <textarea id="" name="" rows="10" cols="30"></textarea></form></div></section>';
        document.body.appendChild(aside);
        aside.querySelector('h1').innerHTML = this.name;
        aside.querySelector('header').addEventListener('click', function () {
            var section = this.nextSibling;
            if (getComputedStyle(section, null).getPropertyValue('display') === 'block') {
                section.style.display = 'none';
            }
            else {
                section.style.display = 'block';
            }
        }, false);
		metaBtn = aside.querySelectorAll('header img');
		metaBtn[0].src = this.drawMin();
		metaBtn[1].src = this.drawPop();
		metaBtn[2].src = this.drawClose();
		metaBtn[1].addEventListener('click', this.proxy(this.stop, this), false);
		metaBtn[2].addEventListener('click', this.proxy(this.stop, this), false);
		this.msgList = aside.querySelector('section>div');
		this.textbox = aside.querySelector('textarea');
		this.textbox.addEventListener('keyup', this.proxy(this.send, this), false);
        return aside;
    };

	DChat.prototype.drawMin = function () {
        var canvas = document.createElement('canvas'), ctx;
        canvas.width = 100;
        canvas.height = 100;
        canvas.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#0C7823';
        ctx.beginPath();
        ctx.moveTo(5,85);
        ctx.lineTo(95, 85);
        ctx.stroke();
        return canvas.toDataURL();
    };

	DChat.prototype.drawPop = function () {
		var canvas = document.createElement('canvas'), ctx;
		canvas.width = 100;
		canvas.height = 100;
		canvas.style.backgroundColor = 'rgba(0, 0, 0, 1)';
		ctx = canvas.getContext('2d');
		ctx.strokeStyle = '#0C7823';
		ctx.fillStyle = '#0C7823';
		ctx.beginPath();
		ctx.moveTo(95, 5);
		ctx.lineTo(45, 5);
		ctx.lineTo(95, 55);
		ctx.closePath();
		ctx.fill();
		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.moveTo(75, 25);
		ctx.lineTo(5, 95);
		ctx.stroke();
		return canvas.toDataURL();
	};

	DChat.prototype.drawClose = function () {
        var canvas = document.createElement('canvas'), ctx;
        canvas.width = 100;
        canvas.height = 100;
        canvas.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#0C7823';
        ctx.beginPath();
        ctx.moveTo(5,5);
        ctx.lineTo(95, 95);
        ctx.moveTo(95, 5);
        ctx.lineTo(5, 95);
        ctx.stroke();
        return canvas.toDataURL();
    };

})(this);

(function (undefined) {
if (location.href.indexOf('http') === 0) {
	var container = document.querySelector('#profile .user-opt'), button, dchat;

    button = container.querySelector('a.mr5').cloneNode(false);
    button.innerHTML = '豆聊';
    button.style.marginLeft = '5px';
    container.insertBefore(button, document.getElementById('divac'));
    button.addEventListener('click', function (e) {
		if (dchat === undefined) {
			dchat = new DChat({
				people: location.href.match(/\/([^\/]+)\/?$/)[1],
				name: document.title.innerHTML.trim()
			});
		}

		if (!dchat.port) {
			dchat.start();
		}

		e.preventDefault();
	}, false);

}
})();

