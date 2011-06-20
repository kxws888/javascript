'use strict';
var config = {
    tweetGap: 36000
}

function setConfig(args) {
    var configs = ['tweetGap'], i = 0, len = configs.length;
    for (; i < len ; i += 1) {
        config[configs[i]] = args[configs[i]];
    }
}

Class('Resource', {

    init: function (args) {
        this.method = args.method || 'get';
        this.url = args.url || '';
        this.params = this.setParams(args.params);
        this.load = args.load || function () {};
        this.error = args.error || function () {};
    },

    setParams: function (params) {
        var obj = {}, key;
        for (key in params) {
            obj[key] = params[key];
        }
        return obj;
    },

    oauth: function () {
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
    },

    stringify: function (parameters) {
        var params = [];
        for(var p in parameters) {
            params.push(encodeURIComponent(p) + '=' + encodeURIComponent(parameters[p]));
        }
        return params.join('&');
    },

    request: function () {
        var xhr = new XMLHttpRequest(), self = this, data;
        data = this.stringify(this.params);
        if (this.method.toLowerCase() === 'get') {
            this.url += '?' + data;
        }
        xhr.onload = function (e) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                self.load.call(self, JSON.parse(xhr.responseText), e);
            }
            else {
                self.error.call(self, xhr, e);
            }
        }
        xhr.onerror = function (e) {
            self.error.call(self, xhr, e);
        }
        xhr.open(this.method, this.url, true);
        xhr.setRequestHeader('content-type', 'application/atom+xml');
        xhr.setRequestHeader('Authorization', this.oauth());
        xhr.send(data);
    }
});



(function () {

    if (!localStorage.getItem('unread')) {
        localStorage.setItem('unread', 0);
    }

    var database = openDatabase('douban', '1.0', 'douban DB', 2 * 1024 * 1024);

    database.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS contacts (uid primary key, name, url, ico)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS miniblog (id primary key, authorId references contacts(uid) on delete cascade deferrable initially deferred, content, timestamp, unread)');
    });

    function dbErrorHanlder(e) {
        if (e.code === 4) {
            tx.executeSql('delete from miniblog');
        }
    }

    function updateDB(data, callback) {
        var e1 = [], e2 = [];
        e1[e1.length] = data.author.uri['$t'].replace('http://api.douban.com/people/', '');
        e1[e1.length] = data.author.name['$t'];
        e1[e1.length] = data.author.link[1]['@href'];
        e1[e1.length] = data.author.link[2]['@href'];

        e2[e2.length] = data.id['$t'];
        e2[e2.length] = e1[0];
        e2[e2.length] = data.content['$t'];
        e2[e2.length] = data.published['$t'];
        e2[e2.length] = 1;

        database.transaction(function (tx) {
            tx.executeSql('select * from contacts where uid=?', [e1[0]], function (tx, set) {
                if (set.rows.length > 0) {
                    e1.push(e1.shift());
                    tx.executeSql('update contacts set name=?, url=?, ico=? where uid=?', e1);
                }
                else {
                    tx.executeSql('insert into contacts (uid, name, url, ico) values (?,?,?,?)', e1);
                }
            });
            tx.executeSql('insert or ignore into miniblog values (?,?,?,?,?)', e2, function (tx, set) {
                callback(set.rowsAffected);
            });
        }, dbErrorHanlder);
    }

    function getContactsTweet(offset, limit, callback) {
        var req;
        req = new Resource({
            url: 'http://api.douban.com/people/%40me/miniblog/contacts',
            method: 'get',
            params: {
                'alt': 'json',
                'start-index': offset,
                'max-results': limit
            },
            load: load,
            error: error
        });
        req.request();

        function load(data, e) {
            if (data.entry.length > 0) {
                if (offset === 1) {
                    var next, i, len, counter = 0;
                    next = parseInt(data['openSearch:itemsPerPage']['$t'], 10) + parseInt(data['openSearch:startIndex']['$t'], 10);
                    for (i = 0, len = data.entry.length ; i < len ; i += 1) {
                        updateDB(data.entry[i], function (rowsAffected) {
                            if (rowsAffected > 0) {
                                var unread = parseInt(localStorage.getItem('unread') || 0, 10) + rowsAffected;
                                localStorage.setItem('unread', unread);
                                chrome.browserAction.setBadgeText({text: unread.toString()});

                                counter += 1;
                                if (counter === len) {
                                    database.transaction(function (tx) {
                                        tx.executeSql('select count(*) from miniblog', [], function (tx, set) {
                                            if (set.rows.length > len) {
                                                self.getContactsTweet(next, limit);
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
                else {
                    for (i = 0, len = data.entry.length ; i < len ; i += 1) {
                        updateDB(data.entry[i], function (rowsAffected) {
                            counter += 1;
                            if (counter === len) {
                                callback(len);
                            }
                        })
                    }
                }
            }
        };

        function error(xhr, e) {
            console.log(arguments)
        };
    }

    window['getContactsTweet'] = getContactsTweet;

})();

oauth(function () {

    (function autoplay() {
        getContactsTweet(1, 10);
        setTimeout(autoplay, config.tweetGap);
    })();
});
/**
 *
 *
 *
 *
 */

Class('Mail', Resource, {

    init: function (args) {
        this.notification = webkitNotifications.createHTMLNotification('notification.html');
        this.mailList = [];

        var self = this;

        this.notification.ondisplay = function () {
            return self.nofify.apply(self, arguments);
        }
    },

    load: function (data, e) {
        data = data.entry;
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
    },

    nofify: function () {
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
    },

    play: function () {
        var self = this;
        this.request();
    }
});
