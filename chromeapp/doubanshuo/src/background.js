'use strict';

oauth();

function Resource(args) {
    this.method = args.method || 'get';
    this.url = args.url || '';
    this.params = args.params //this.setParams(args.params);
    this.data = args.data || null;
    this.load = args.load || function () {};
    this.error = args.error || function () {};
}

Resource.prototype.setParams = function (params) {
    var obj = {}, key;
    for (key in params) {
	obj[key] = params[key];
    }
    return obj;
}

Resource.prototype.oauth = function () {
    var message, self = this;
    message = {
	method: self.method,
	action: self.url,
	parameters: {
	    oauth_consumer_key: window.localStorage.getItem('consumer_key'),
	    oauth_token: window.localStorage.getItem('access_token'),
	    oauth_signature_method: window.localStorage.getItem('signature_method'),
	    oauth_signature: '',
	    oauth_timestamp: '',
	    oauth_nonce: ''
	}
    }

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, {
	consumerSecret: window.localStorage.getItem('consumer_key_secret'),
	tokenSecret: window.localStorage.getItem('access_token_secret')
    });

    return OAuth.getAuthorizationHeader(message.action, message.parameters);
}

Resource.prototype.stringify = function (parameters) {
    var params = [];
    for(var p in parameters) {
	params.push(encodeURIComponent(p) + '=' + encodeURIComponent(parameters[p]));
    }
    return params.join('&');
},

Resource.prototype.request = function () {
    var xhr = new XMLHttpRequest(), self = this, data;
    //data = this.stringify(this.params);
    if (this.method.toLowerCase() === 'get' && this.data) {
	this.url += '?' + this.data;
    }
    xhr.onload = function (e) {
	if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
	    self.load.call(self, xhr.responseText, e);
	}
	else {
	    self.error.call(self, xhr, e);
	}
    }
    xhr.onerror = function (e) {
	self.error.call(self, e);
    }
    xhr.open(this.method, this.url, true);
    xhr.setRequestHeader('content-type', 'application/atom+xml');
    xhr.setRequestHeader('Authorization', this.oauth());
    xhr.send(this.data);
}


function Mail(args) {
    this.notification = webkitNotifications.createHTMLNotification('notification.html');
    this.mailList = [];

    var self = this;

    this.notification.ondisplay = function () {
	return self.nofify.apply(self, arguments);
    }

    chrome.extension.onConnect.addListener(function(port) {
	 if (port.name === 'dchat') {
	     port.onMessage.addListener(function(msg) {
		 switch (msg.cmd) {
		 case 'send':
		    self.send(msg, function (data, e) {console.log(data)
			if (data === 'ok') {
			    port.postMessage({result: true});
			}
			else if (data === 403){

			}
		    }, function (e) {
			port.postMessage({cmd: 'sended', result: false});
		    });
		 case 'receivestart':
		    self.timer = setInterval(function () {
			self.receive(function (data, e) {
			    data = JSON.parse(data).entry;
			    var i, len, key, people, mails = [];
			    for (i = 0, len = data.length ; i < len ; i += 1) {
				people = data[i].author.link[1]['@href'].match(/\/([^\/]+)\/?$/)[1];
				if (people === msg.people) {
				    mails[mails.length] = data[i].id['$t'];
				}
			    }
			    for (i = 0, len = mails.length ; i < len ; i += 1) {
				new Resource({
				    url: mails[i],
				    method: 'get',
				    data: 'alt=json',
				    load: function (data) {
					data = JSON.parse(data);
					var response = {}, str1, str2;
					response.cmd = 'received';
					response.people = data.author.link[1]['@href'].match(/\/([^\/]+)\/?$/)[1];
					response.timestamp = data.published['$t'];

					str1 = data.content['$t'].trim();console.log(data, str1)
					if (/说:[\r\n]+\|/m.test(str1)) {
					    str2 = /^([\s\S]+?[\r\n])?[\s\S]+?说:[\r\n]+\|/m.exec(str1)[1];
					    if (typeof str2 === 'undefined') {
						str2 = /^[\s\S]+[\r\n]\|.+?[\r\n]+([\s\S]+)$/m.exec(str1)[1];
					    }
					}
					else {
					    str2 = str1;
					}
					response.content = str2;
					port.postMessage(response);
				    }
				}).request();
			    }
			}, function (e) {
			    console.log(e)
			});
		    }, 30000);
		 }
	     });
	 }
     });
}

Mail.prototype.getMe = function (callback) {
    var self = this;
    new Resource({
	url: 'http://api.douban.com/people/%40me',
	method: 'get',
	data: 'alt=json',
	load: function (data, e) {
	    data = JSON.parse(data);
	    self.me = data['db:uid']['$t'];
	    callback(true);
	},
	error: function (e) {
	    chrome.tabs.create({url: 'pages/log.html'}, function (tab) {
		chrome.tabs.sendRequest(tab.id, e);
	    });
	}
    }).request();
}

Mail.prototype.send = function (msg, load, error) {
    var entry = '<?xml version="1.0" encoding="UTF-8"?>'
	+'<entry xmlns="http://www.w3.org/2005/Atom" xmlns:db="http://www.douban.com/xmlns/" xmlns:gd="http://schemas.google.com/g/2005" xmlns:opensearch="http://a9.com/-/spec/opensearchrss/1.0/">'
	+'<db:entity name="receiver">'
	    +'<uri>http://api.douban.com/people/' + msg.people + '</uri>'
	+'</db:entity>'
	+'<content>' + msg.content + '</content>'
	+'<title>通过豆聊发送的消息</title>'
	+'</entry>', self;

    new Resource({
	url: 'http://api.douban.com/doumails',
	method: 'post',
	data: entry,
	load: load,
	error: error
    }).request();
}

Mail.prototype.receive = function (load, error) {
    var self = this;
    new Resource({
	url: 'http://api.douban.com/doumail/inbox/unread',
	method: 'get',
	data: 'start-index=1&alt=json',
	load: load,
	error: error
    }).request();
}


Mail.prototype.receiveSuccess = function (data, e) {
    data = data.entry;
    console.log(data)
    if (data.length > 0) {
	var i, len, tmp;
	for (i = 0, len = data.length ; i < len ; i += 1) {
	    tmp = data[i];
	    this.mailList[this.mailList.length] = {
		title: tmp.title.$t,
		author: tmp.author.name.$t,
		link: tmp.link[1]['@href']
	    }
	}
	this.notification.show();
    }
}

Mail.prototype.nofify = function () {
    var docFrag = document.createDocumentFragment(), i, len, tmp, self = this, timer;
    for (i = 0, len = this.mailList.length ; i < len ; i += 1) {
	tmp = this.mailList[i];
	docFrag.appendChild(document.createElement('p').appendChild(document.createTextNode(tmp.title)));
    }
    timer = setInterval(function () {
	var page = chrome.extension.getViews({type:"notification"})[0];
	if (page) {
	    clearInterval(timer);
	    page.document.body.innerHTML = '';
	    page.document.body.appendChild(docFrag);
	    setTimeout(function () {
		self.notification.cancel();
	    }, 3000);
	}
    }, 0);
}

Mail.prototype.play = function () {
    var self = this;
    this.request();
}

var doumail = new Mail();
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.status !== 'complete' && tab.url.indexOf('www.douban.com/people/') > -1) {
	chrome.tabs.insertCSS(tabId, {file: 'pages/style/ui.css'});
	chrome.tabs.executeScript(tabId, {file: "src/contentscript.js"});
    }
});
