(function () {
    var container = document.querySelector('#profile .user-opt'), button,
	people, port, lock = false, lastTime = +new Date(),
	chatWindow, textbox, msgList;
    button = container.querySelector('a.mr5').cloneNode(false);
    button.innerHTML = '豆聊';
    button.style.marginLeft = '5px';
    container.insertBefore(button, document.getElementById('divac'));

    button.addEventListener('click', chatStart, false);



    function chatStart(e) {
	e.preventDefault();
	if (!chatWindow) {
	    chatWindow = createChatWindow();
	    textbox = chatWindow.querySelector('textarea');
	    msgList = chatWindow.querySelector('section>div');
	    textbox.addEventListener('keyup', send, false);
	    msgList.addEventListener('scroll', function () {
		this.scrollTop = this.scrollHeight;
	    }, false);

	    people = location.href.match(/\/([^\/]+)\/?$/)[1];
	    port = chrome.extension.connect({name: 'dchat'});
	    port.postMessage({cmd: 'receivestart', people: people});
	    port.onMessage.addListener(function (msg) {
		if (msg.cmd === 'sended') {
		    if (!msg.result) {
			var log = document.createElement('p');
			log.innerHTML = '发送失败';
			msgList.querySelector('div:last-of-type').appendChild(log);
			lock = false;
		    }
		}
		else if (msg.cmd === 'received') {
		    if (+new Date(msg.timestamp) > lastTime && people === msg.people) {
			var item = document.createElement('div');
			item.innerHTML = '<strong>' + document.querySelector('title').innerHTML.trim() + '说</strong>: ' + msg.content;
			msgList.appendChild(item);
			lock = false;
		    }
		}
	    });
	}
	else {
	    chatWindow.style.display = '';
	}
	chatWindow.querySelector('h1').innerHTML = document.querySelector('title').innerHTML.trim();
    }

    function chatStop() {
	chatWindow.style.display = 'none';
    }

    function createChatWindow() {
	var aside = document.createElement('aside');
	aside.id = 'dchat';
	aside.innerHTML = '<header><h1></h1><div><canvas width="10" height="10" id="min"></canvas><canvas width="10" height="10" id="popup"></canvas><canvas width="10" height="10" id="close"></canvas></div></header><section><div></div><div><form> <textarea id="" name="" rows="10" cols="30"></textarea></form></div></section>';
	aside.style.top = window.innerHeight - 255 + 'px';
	document.body.appendChild(aside);
	return aside;
    }

    function send(e) {
	if (e.keyCode === 13 && !lock) {
	    lock = true;
	    var item = document.createElement('div');
	    item.innerHTML = '<strong>我说</strong>: ' + this.value;
	    msgList.appendChild(item);
	    port.postMessage({cmd: 'send', content: this.value, people: people});
	    this.value = '';
	    lastTime = +new Date();
	    e.preventDefault();
	}
	else {
	    var log = document.createElement('p');
	    log.innerHTML = '别着急, 先等回复啊亲';
	    msgList.querySelector('div:last-of-type').appendChild(log);
	}
    }
})();
