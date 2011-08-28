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
    xhr.open(this.method, this.url, true)
    xhr.setRequestHeader('content-type', 'application/atom+xml');
    xhr.setRequestHeader('Authorization', this.oauth());
    xhr.send(this.data);
}




function Mail(args) {

    var self = this;

    this.peopleInfo = {};
	this.peopleNum = 0;
    this.filterRegTest = /:[\r\n]+\|/m;
    this.filterRegFront = /^([\s\S]+?[\r\n])?[^\r\n]+?:[\r\n]+\|/m;
    this.filterRegBack = /^[\s\S]+[\r\n]\|.+?[\r\n]+([\s\S]+)$/m;

	this.timer = null;
    this.sound = document.getElementById('alert');
    this.unread = [];

    chrome.extension.onConnect.addListener(function(port) {
        if (port.name === 'dchat') {
            port.onMessage.addListener(function(msg) {
                switch (msg.cmd) {
				case 'send':
					self.send(
						msg,
						function (data, e) {console.log(data)
							if (data === 'ok') {
								port.postMessage({cmd: 'sended', result: true});
							}
						},
						function (e) {console.log(e)
							if (e.status === 403) {
								port.postMessage({
									cmd: 'sended',
									result: false,
									msg:{
										content: msg.content,
										people: msg.people,
										captcha: {
											token: /=(.+?)&amp;/.exec(e.responseText)[1],
											string: /captcha_url=(.+)$/.exec(e.responseText)[1]
										}
									}
								});
							}
						});
					break;
				case 'receivestart':
					if (typeof self.peopleInfo[msg.people] === 'undefined') {
						self.peopleNum += 1;
					}
					self.peopleInfo[msg.people] = port;
					if (self.peopleNum > 0 && self.timer === null) {
						self.receiveStart(port);
					}
					break;
				}
            });

            port.onDisconnect.addListener(function (port) {
                if (port.name === 'dchat') {
                    delete self.peopleInfo[port.tab.url.match(/\/([^\/]+)\/?$/)[1]];
                    self.peopleNum -= 1;
                    console.log(self.peopleInfo, self.peopleNum)
                    if (self.peopleNum === 0) {
                        clearInterval(self.timer);
                        self.timer = null;
                    }
                }
            });
        }
    });


    chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
        if (request.cmd === 'getUnread') {
            sendResponse({unread: self.unread});
        }
        else if (request.cmd === 'showUnread') {
            self.setUnread(request.people);
            chrome.tabs.update(self.peopleInfo[request.people].tab.id, {selected: true});
        }
    });

    chrome.tabs.onSelectionChanged.addListener(function (tabId, object) {
        if (self.peopleNum === 0) {return;}
        for (var key in self.peopleInfo) {
            if (tabId === self.peopleInfo[key].tab.id) {
                self.setUnread(key);
            }
        }
    });

    chrome.windows.onFocusChanged.addListener(function (windowId) {
        if (windowId === -1) {return;}
        chrome.tabs.getSelected(windowId, function (tab) {
            for (var key in self.peopleInfo) {
                if (tab.id === self.peopleInfo[key].tab.id) {
                    self.setUnread(key);
                }
            }
        });
    });
}

Mail.prototype.send = function (msg, load, error) {
    var entry = '<?xml version="1.0" encoding="UTF-8"?>'
    +'<entry xmlns="http://www.w3.org/2005/Atom" xmlns:db="http://www.douban.com/xmlns/" xmlns:gd="http://schemas.google.com/g/2005" xmlns:opensearch="http://a9.com/-/spec/opensearchrss/1.0/">'
        +'<db:entity name="receiver">'
    +'<uri>http://api.douban.com/people/' + msg.people + '</uri>'
        +'</db:entity>'
    +'<content>' + msg.content + '</content>'
    +'<title>通过豆聊发送的消息</title>'
    +(msg.captcha ? ('<db:attribute name="captcha_token">' + msg.captcha.token + '</db:attribute><db:attribute name="captcha_string">' + msg.captcha.string + '</db:attribute>') : '')
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


Mail.prototype.receiveStart = function () {
    var self = this;
    function receive() {
        self.receive(function (data, e) {
            var i, len, key, people, mails = [];
            data = JSON.parse(data).entry;
            for (i = 0, len = data.length ; i < len ; i += 1) {
                people = data[i].author.link[1]['@href'].match(/\/([^\/]+)\/?$/)[1];
                if (people in self.peopleInfo) {
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

                        str1 = data.content['$t'].trim();
                        if (self.filterRegTest.test(str1)) {
                            str2 = self.filterRegFront.exec(str1)[1];
                            if (typeof str2 === 'undefined') {
                                str2 = self.filterRegBack.exec(str1)[1];
                                if (typeof str2 === 'undefined') {
                                    str2 = '';
                                }
                            }
                        }
                        else {
                            str2 = str1;
                        }
                        response.content = str2;console.log(str1, '++++', str2)
                        self.peopleInfo[response.people].postMessage(response);
                        self.sound.play();
                        chrome.windows.getAll(function (wins) {
                            for (var i = 0, len = wins.length ; i < len ; i += 1) {
                                if (wins[i].focused) {
                                    chrome.tabs.getSelected(wins[i].id, function (tab) {
                                        if (self.peopleInfo[response.people].tab.id !== tab.id) {
                                            self.nofifyPop(data.author.name['$t'], str2);
                                            self.setUnread(response.people, data.author.link[2]['@href']);
                                        }
                                    });
                                }
                                else {
                                    self.nofifyPop(data.author.name['$t'], str2);
                                    self.setUnread(response.people, data.author.link[2]['@href']);
                                }
                            }
                        });
                    }
                }).request();
            }
        }, function (e) {
            console.log(e)
        });
    }

    receive();
    self.timer = setInterval(receive, 30000);
}

Mail.prototype.nofifyPop = function (name, content) {
    var notification = webkitNotifications.createNotification('../assets/icon16.png', name + '说', content);
    notification.show();
    setTimeout(function () {
        notification.cancel();
    }, 3000);
}

Mail.prototype.setUnread = function (people, icon) {
    if (typeof icon === 'undefined') {
        var i = 0;
        while (i < this.unread.length) {
            if (this.unread[i].people === people) {
                this.unread.splice(i, 1);
            }
            else {
                i += 1;
            }
        }
    }
    else {
        this.unread[this.unread.length] = {people: people, icon: icon};
    }
    var num = this.unread.length;
    chrome.browserAction.setBadgeText({text: num > 0 ? num.toString() : ''});
    chrome.browserAction.setPopup({popup: num > 0 ? '../pages/popup.html' : ''});
}

Mail.prototype.notifyBadge = function () {
    var num = this.unread.length;
    chrome.browserAction.setBadgeText({text: num > 0 ? num.toString() : ''});
    chrome.browserAction.setPopup({popup: num > 0 ? '../pages/popup.html' : ''});
}


var doumail = new Mail();
/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.status !== 'complete' && tab.url.indexOf('www.douban.com/people/') > -1) {
        //chrome.tabs.insertCSS(tabId, {file: 'pages/style/ui.css'});
        //chrome.tabs.executeScript(tabId, {file: "src/contentscript.js"});
        //chrome.pageAction.show(tab.id);
    }
});
*/
