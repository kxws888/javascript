(function () {
    'use strict';

    var background = chrome.extension.getBackgroundPage(), database, count = 0, end = false, scrollbar = null, timeline, list, detail, time = +new Date(), TWEET_LIST_LENGTH = 20;

    document.addEventListener('DOMContentLoaded', init, false);

    function init() {

        timeline = document.getElementById('timeline');
        list = timeline.querySelector('ul');
        detail = timeline.querySelector('div.detail');

        webkitIndexedDB.open('douban').onsuccess = function(e) {
            database = e.target.result;
            getTweet(scrollbarAction);
        };
    }

    function getTweet(callback, limit) {
        var transaction, objectStoreMiniblog, objectStoreContacts, index, keyRange;
        limit = limit || TWEET_LIST_LENGTH;
        transaction = database.transaction(['miniblog', 'contacts'], webkitIDBTransaction.READ_ONLY);
        transaction.oncomplete = function (e) {
            var indicator = localStorage.getItem('unread'), left;
            if (indicator) {
                left = parseInt(indicator, 10) - TWEET_LIST_LENGTH + limit;
                localStorage.setItem('unread', left > 0 ? left : null);
                chrome.browserAction.setBadgeText({text: left > 0 ? left : ''});
            }

            if (limit > 0) {
                background.getContactsTweet(count, TWEET_LIST_LENGTH, function (rowsAffected) {
                    if (rowsAffected !== TWEET_LIST_LENGTH) {
                        end = true;
                    }
                    getTweet(callback, limit);
                    return;
                })
            }
            callback();
        }
        objectStoreMiniblog = transaction.objectStore('miniblog');
        objectStoreContacts = transaction.objectStore('contacts');
        index = objectStoreMiniblog.index('timestamp');
        keyRange = webkitIDBKeyRange.upperBound(time, true);
        index.openCursor(keyRange, webkitIDBCursor.PREV).onsuccess = function (e) {
            var cursor = e.target.result, tmp, t1, t2;
            if (cursor) {
                count += 1;
                limit -= 1;
                tmp = cursor.value;
                t1 = +new Date() - tmp.timestamp;
                if (t2 = Math.floor(t1 / 86400000)) {
                    t2 += '天前';
                }
                else if (t2 = Math.floor(t1 / 3600000)) {
                    t2 += '小时前';
                }
                else if (t2 = Math.floor(t1 / 60000)) {
                    t2 += '分钟前';
                }
                else if (t2 = Math.floor(t1 / 1000)) {
                    t2 = '刚刚';
                }
                tmp.time = t2;
                time = tmp.timestamp;
                objectStoreContacts.get(tmp.author).onsuccess = function (e) {
                    var entry = e.target.result, key, li;
                    for (key in entry) {
                        tmp[key] = entry[key];
                    }

                    li = document.createElement('li');
                    li.innerHTML = dom.Tool.tmpl('timelineEntry', tmp);
                    list.appendChild(li);
                    tweetAction(li);
                };

                if (limit !== 0) {
                    cursor.continue();
                }
            }
        };
    }

    function tweetAction(node) {
        node.addEventListener('click', function () {
            var article = this.querySelector('article').cloneNode(true), detail, detailBlock;
            detail = this.parentNode.parentNode.parentNode.querySelector('div.detail');
            detail.querySelector('article').innerHTML = article.innerHTML;
            detail.style.top = '50px';
        }, false);
    }

    function detailAction() {
        this.detail.querySelector('a.close').addEventListener('click', dom.proxy(function (e) {
            this.detail.style.top = '400px';
            e.preventDefault();
        }, this), false);
    }

    function scrollbarAction() {
        scrollbar = new Scrollbar({
            content: '#timeline div.list',
            mode: 'always',
            callback: function (pos) {
                if (pos === 100 && !end) {
                    getTweet(scrollbarAction);
                }
            }
        });

        scrollbarAction = function () {
            scrollbar.adjustHandleSize();
        }
    }
})();
