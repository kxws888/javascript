chrome.extension.sendRequest({cmd: 'getPop'}, function(response) {
    document.title = response.name;
    var dchat = new DChat({people: response.people, name: response.name, icon: response.icon, me: response.me, ui: 'simple'}), msgList, div, i;
    dchat.start();
    msgList = dchat.chatWindow.querySelector('section>div');
	for (i = 0 ; i < response.history.length ; i += 1) {
		div = document.createElement('div');
		if (response.history[i].people === 'me') {
			div.innerHTML = '<img src="' + response.me.icon + '"><p>' + response.history[i].content + '</p>';
			div.className = 'right';
		}
		else {
			div.innerHTML = '<img src="' + response.icon + '"><p>' + response.history[i].content + '</p>';
			div.className = 'left';
		}
		msgList.appendChild(div);
	}
	msgList.parentNode.style.height = window.innerHeight * 0.96 + 'px';
	window.onresize = function () {
		msgList.parentNode.style.height = window.innerHeight * 0.96 + 'px';
	}
});
/*
response = {
	people: 1,
	name: 'viclm',
	icon: 'http://img3.douban.com/icon/u52626025-7.jpg',

	history: '<div class="left"><img src="http://img3.douban.com/icon/u52626025-7.jpg" ><p>发个豆油发而过后爱迪发个豆油发而过后爱迪生发个豆油发而过后爱迪生发个豆油发而过后爱迪生发个豆油发而过后爱迪生发个豆油发而过后爱迪生发个豆油发而过后爱迪生发个豆油发而过后爱迪生发个豆油发而过后爱迪生发个豆油发而过后爱迪生发个豆油发而过后爱迪生发个豆油发而过后爱迪生生</p></div><div class="right"><img src="http://img3.douban.com/icon/u52626025-7.jpg" ><p>发个豆油发而过后爱迪生</p></div><div class="left"><img src="http://img3.douban.com/icon/u52626025-7.jpg" ><p>发个豆油发而过后爱迪生</p></div><div class="left"><img src="http://img3.douban.com/icon/u52626025-7.jpg" ><p>发个豆油发而过后爱迪生</p></div>'
}
document.title = response.name;
    var dchat = new DChat({people: response.people, name: response.name, ui: 'simple'});
    dchat.start();
    dchat.chatWindow.querySelector('section>div').innerHTML = response.history;
	*/
