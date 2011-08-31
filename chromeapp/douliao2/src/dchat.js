(function (window, undefined) {

    function DChat(args) {
        //this.people = args.people;
        //this.name = args.name;
        //this.ui = args.ui || 'full';

        this.chatWindow = null;
        this.port = null;

        this.isLock = false;
        this.msgRequreToken = null;

        this.friendList = document.querySelector('section');
        this.msgList = document.querySelector('div.msgList');
        this.textbox = document.querySelector('div.inputBox');

        var self = this;

        chrome.extension.sendRequest({cmd: "getFriendList"}, function(response) {
            self.setFriendList(response);
        });
    }

    DChat.prototype.proxy = function (fn, obj) {
        return function () {
            return fn.apply(obj, arguments);
        }
    };

    DChat.prototype.setFriendList = function (data) {
        var div, key;
        for (key in data) {
            div = document.createElement('div');
            div.id = key;
            div.rel = data[key].icon;
            div.innerHTML = '<h3>' + data[key].name + '</h3><p>' + data[key].sign + '</p>';
            this.friendList.appendChild(div);
        }
    };

    DChat.prototype.start = function () {
        var self = this;
        this.chatWindow = this.createUI();

        this.port = chrome.extension.connect({name: 'dchat'});
        this.port.postMessage({cmd: 'receivestart', people: self.people});
        this.port.onMessage.addListener(function (msg) {
            if (msg.cmd === 'sended') {
                if (!msg.result) {
                    var captcha = self.addContent('<p>发送太快了亲，输入验证码</p><img src="' + msg.msg.captcha.string + '">');
                    self.msgRequreToken = msg.msg;
                    self.msgRequreToken.captcha.dom = captcha;
                    self.lock(false);
                }
            }
            else if (msg.cmd === 'received') {
                if (self.people === msg.people) {
                    self.addContent('<strong>' + self.name + '说</strong>: ' + msg.content);
                    self.lock(false);
                }
            }
        });
    };

    DChat.prototype.stop = function (e) {
        var self = this;
        if (e.target.className === '+') {
            this.port.postMessage({cmd: 'pop', people: self.people, name: self.name, history: self.msgList.innerHTML});
        }
        document.body.removeChild(this.chatWindow);
        this.port.disconnect();
        this.port = null;
        e.stopPropagation();
    };

    DChat.prototype.send = function (e) {
        var value = e.target.value, self = this;
        if (e.keyCode === 13 && !e.shiftKey && !this.isLock && value.trim() !== '') {
            if (this.msgRequreToken) {
                var self = this;
                this.port.postMessage({
                    cmd: 'send',
                    content: self.msgRequreToken.content,
                    people: self.msgRequreToken.people,
                    captcha: {
                        token: self.msgRequreToken.captcha.token,
                        string: value
                    }
                });
                this.msgList.removeChild(this.msgRequreToken.captcha.dom);
                this.msgRequreToken = null;
            }
            else {
                this.addContent('<strong>我说</strong>: ' + value);
                this.port.postMessage({cmd: 'send', content: value, people: self.people});
            }

            e.target.value = '';
            this.lock(true);
            e.preventDefault();
            return false;
        }
    };

    DChat.prototype.addContent = function (html) {
        var div = document.createElement('div'), scrollHeight = this.msgList.scrollHeight;
        div.innerHTML = html;
        this.msgList.appendChild(div);
        if (div.getElementsByTagName('img').length > 0) {
            scrollHeight += 41;
        }
        this.msgList.scrollTop = scrollHeight;
        return div;
    };

    DChat.prototype.lock = function inputLock(status) {
        this.textbox.disabled = status;
        this.textbox.style.backgroundColor = status ? '#ddd' : '#fff';
        this.textbox.value = status ? '先等回复啊亲' : '';
        this.isLock = status;
    };

    DChat.prototype.createUI = function () {
        var aside = document.createElement('aside'), metaBtn, html = '';
        aside.id = 'dchat';
        if (this.ui === 'full') {
            html += '<header><h1>' + this.name + '</h1><div><img class="-" /><img class="+" /><img class="x" /></div></header>';
        }
        html += '<section><div></div><div><textarea></textarea></div></section>'
        aside.innerHTML = html;
        document.body.appendChild(aside);
        if (this.ui === 'full') {
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
        }
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

    window.DChat = DChat;

})(this);


new DChat();
