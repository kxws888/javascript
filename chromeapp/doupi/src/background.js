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

    var dbRequest = webkitIndexedDB.open('douban'), database;

    dbRequest.onerror = function(e) {
        console.log('indexdb open error');
    };

    dbRequest.onsuccess = function(e) {
        database = e.target.result;
        if (database.version != '1.0') {
            var request = database.setVersion("1.0");

            request.onerror = function (event) {
                console.log('setVersion error');
            };

            request.onsuccess = function (e) {
                var miniblog, contacts;
                miniblog = database.createObjectStore('miniblog', {keyPath: 'id'});
                miniblog.createIndex("timestamp", "timestamp");
                //objectStore.createIndex("email", "email", { unique: true });
                contacts = database.createObjectStore('contacts', {keyPath: 'uid'});
            };
        }
    };

    function clearupDB() {
        var transaction, objectStore, keyRange, bak = [];

        transaction = database.transaction(['miniblog'], webkitIDBTransaction.READ_WRITE);
        objectStore = transaction.objectStore('miniblog');
        keyRange = webkitIDBKeyRange.upperBound(+new Date() - 86400000);
        objectStore.openCursor(keyRange, webkitIDBCursor.PREV).onsuccess = function (e) {
            var cursor = e.target.result;
            if (cursor) {
                bak[bak.length] = cursor.value;
                cursor.continue();
            }
            objectStore.clear();
            updateDB(bak, null, false);
        };
    }

    function updateDB(data, callback, isUpdateContacts) {
        var transaction, objectStore, i, request, entry, res, rowsAffected = 0;

        transaction = database.transaction(['miniblog', 'contacts'], webkitIDBTransaction.READ_WRITE);
        transaction.oncomplete = function (e) {
            if (typeof callback === 'function') {
                callback(rowsAffected)
            }
        };

        transaction.onerror = function(event) {
            console.log("transaction error");
        };

        objectStore = transaction.objectStore('miniblog');
        try {
            for (i = data.length - 1 ; i > -1 ; i -= 1) {
                entry = data[i], res = {};
                res.id = entry.id['$t'];
                res.author = entry.author.uri['$t'].replace('http://api.douban.com/people/', '');
                res.content = entry.content['$t'];
                res.timestamp = +new Date(entry.published['$t']);

                var request = objectStore.add(res);
                (function () {
                    var en = entry;
                    request.addEventListener('success', function (e) {
                        rowsAffected += 1;
                        if (isUpdateContacts) {
                            var objectStore = transaction.objectStore('contacts');
                            res = {};
                            res.uid = en.author.uri['$t'].replace('http://api.douban.com/people/', '');
                            res.name = en.author.name['$t'];
                            res.url = en.author.link[1]['@href'];
                            res.ico = en.author.link[2]['@href'];

                            request = objectStore.put(res);
                            request.onsuccess = function () {};
                            request.onerror = function (e) {
                                console.log('update contacts error');
                            };
                        }
                    }, false);
                })();
                request.onerror = function (e) {
                    e.stopPropagation();
                };
            }
        }
        catch (e) {
            //webkitIDBDatabaseException.SERIAL_ERR
            if (e.code === 7) {
                clearupDB();
            }
        }
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
                    updateDB(data.entry, function (rowsAffected) {
                        if (rowsAffected > 0) {
                            var unread = parseInt(localStorage.getItem('unread') || 0, 10) + rowsAffected, keyRange;
                            localStorage.setItem('unread', unread);
                            chrome.browserAction.setBadgeText({text: unread.toString()});

                            if (rowsAffected === limit) {
                                //recursion
                            }
                        }
                    }, true);
                }
                else {
                    updateDB(data.entry, function (e) {
                        
                    }, false);
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
