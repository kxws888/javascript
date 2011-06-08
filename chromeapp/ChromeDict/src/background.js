(function () {
    if (!localStorage.skin) {
        localStorage.ui = 'simple';
        localStorage.skin = 'orange';
        localStorage.hotKeySwitch = '1';
        localStorage.hotKeyHover = '{"ctrlKey":false,"altKey":true,"shiftKey":false,"metaKey":false,"keyCode":112}';
        localStorage.hotKeyDrag = '{"ctrlKey":false,"altKey":true,"shiftKey":false,"metaKey":false,"keyCode":113}';
        localStorage.mainDict = 'powerword';
        localStorage.assistDict = 'dictcn';
        localStorage.hoverCapture = '1';
        localStorage.dragCapture = '0';
    }

    const DICT_API = {
        powerword: 'http://dict-co.iciba.com/api/dictionary.php?w=',
        dictcn: 'http://dict.cn/ws.php?utf8=true&q='
    };

    const DICT_QUERY = {
        powerword: Powerword,
        dictcn: Dictcn
    };

    var database, dbRequest = webkitIndexedDB.open('dict'), status, menuItemIdHover, menuItemIdDrag;

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
                var powerword, dictcn;
                powerword = database.createObjectStore('powerword', {keyPath: 'key'});
                dictcn = database.createObjectStore('dictcn', {keyPath: 'key'});
            };
        }
    };

    menuItemIdHover = chrome.contextMenus.create({
        title: '关闭取词',
        onclick: contextMenusHanlder
    });
    menuItemIdDrag = chrome.contextMenus.create({
        title: '关闭划词',
        onclick: contextMenusHanlder
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (!/^chrome/.test(tab.url) && tab.url.indexOf('https://chrome.google.com/webstore') === -1 && tab.status !== 'complete') {
            chrome.tabs.executeScript(null, {file: "src/dict.js"});
            chrome.pageAction.setIcon({
                tabId: tabId,
                path: chrome.extension.getURL('assets/normal.png')
            });
            chrome.pageAction.show(tabId);
            toggle({
                hoverCapture: localStorage.hoverCapture === '1' ? true : false,
                dragCapture: localStorage.dragCapture === '1' ? true : false
            }, tab);
        }
    });
//direct
    chrome.tabs.onSelectionChanged.addListener(function (tabId, selectInfo) {
        chrome.tabs.sendRequest(tabId, {cmd: 'contextMenus'}, function (response) {
            toggle(response);
        });
    });

    function contextMenusHanlder(info, tab) {
        var cmd = info.menuItemId === menuItemIdHover ? 'toggleHoverCapture' : 'toggleDragCapture';
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, {cmd: cmd}, function (response) {
                toggle(response, tab);
            });
        });
    }

    function toggle(response, tab) {
        var index = [], ico;
        if (response.hoverCapture) {
            chrome.contextMenus.update(menuItemIdHover, {
                title: '关闭取词'
            });
            index[index.length] = 'hover';
        }
        else {
            chrome.contextMenus.update(menuItemIdHover, {
                title: '开启取词'
            });
        }

        if (response.dragCapture) {
            chrome.contextMenus.update(menuItemIdDrag, {
                title: '关闭划词'
            });
            index[index.length] = 'drag';
        }
        else {
            chrome.contextMenus.update(menuItemIdDrag, {
                title: '开启划词'
            });
        }

        if (tab) {
            if (index.length === 2) {
                ico = 'assets/normal.png';
            }
            else if (index.length === 1) {
                ico = 'assets/' + index[0] + '.png';
            }
            else {
                ico = 'assets/off.png';
            }

            chrome.pageAction.setIcon({
                tabId: tab.id,
                path: chrome.extension.getURL(ico)
            });
        }
    }
/*
    chrome.pageAction.onClicked.addListener(dictSwitch);

    function dictSwitch() {
        if (!status) {
            chrome.tabs.executeScript(null, {file: "src/dict.js"});
            chrome.pageAction.onClicked.removeListener(dictSwitch);
            chrome.pageAction.onClicked.addListener(function (tab) {
                status = !status;
                chrome.pageAction.setIcon({
                    tabId: tab.id,
                    path: chrome.extension.getURL(status ? 'assets/icon16.png' : 'assets/icon16_grey.png')
                });
                chrome.extension.sendRequest({cmd: status});
            });
        }
    }*/

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.cmd === 'config') {
            sendResponse(getConfig());
        }
        else if ('hoverCapture' in request) {
            toggle(request, sender.tab);
        }
    });

    function getConfig() {
        var params = {}, hotKeys = {}, dictsAvailable, dictsOrder, dicts = [], i, len;
        params.ui = localStorage.ui;
        params.skin = localStorage.skin;
        params.hoverCapture = localStorage.hoverCapture === '1' ? true : false;
        params.dragCapture = localStorage.dragCapture === '1' ? true : false;
        //params.hoverCapture = localStorage.hoverCapture;

        if (localStorage.hotKeySwitch === '0') {
            hotKeys = null;
        }
        else {
            hotKeys = {
                hover: JSON.parse(localStorage.hotKeyHover),
                drag: JSON.parse(localStorage.hotKeyDrag)
            };
        }
        params.hotKey = hotKeys;/*

        dictsOrder = JSON.parse(localStorage['dictsOrder']);
        dictsAvailable = JSON.parse(localStorage['dictsAvailable']);
        for (i = 0, len = dictsOrder.length ; i < len ; i += 1) {
            if (dictsOrder[i] in dictsAvailable) {
                dicts[dicts.length] = dictsOrder[i];
            }
        }
        params.dicts = dicts;*/

        return params;
    }

    chrome.extension.onConnect.addListener(function(port) {
        if (port.name === 'dict') {
            port.onMessage.addListener(function (msg, port) {
                switch (msg.cmd) {
                case 'setCaptureMode':
                    setCaptureMode(msg, port);
                    break;
                case 'query':
                    simpleQuery(msg, port);
                    break;
                }
            });
        }
    });

    function setCaptureMode(msg, port) {
        localStorage.hoverCapture = msg.hoverCapture ? '1' : '0';
        localStorage.dragCapture = msg.dragCapture ? '1' : '0';
    };

    function simpleQuery(msg, port) {
        var mainDict = localStorage.mainDict, assistDict = localStorage.assistDict, assistRes, status = 'init';
        new DICT_QUERY[mainDict]({
            word: msg.w,
            load: function (json) {
                status = 'complete';
                port.postMessage(json);
            },
            error: function (word) {
                status = 'error';
                if (typeof assistRes !== 'undefined') {
                    port.postMessage(assistRes);
                }
            }
        }).query();

        new DICT_QUERY[assistDict]({
            word: msg.w,
            load: function (json) {
                if (status === 'error') {
                    port.postMessage(json);
                }
                assistRes = json;
            },
            error: function (word) {
                if (status === 'error') {
                    port.postMessage({key: msg.w});
                }
                assistRes = {key: msg.w};
            }
        }).query();
    }

    /*
    * Query
    */

    function Query(args) {
        args = args || {};
        this.word = args.word;
        this.load = args.load;
        this.error = args.error;
    }

    Query.prototype.query = function () {
        var objectStore = database.transaction([this.model], webkitIDBTransaction.READ).objectStore(this.model), request;
        request = objectStore.get(this.word);
        request.addEventListener('success', dom.Tool.proxy(function (e) {
            if (typeof e.target.result === 'undefined') {
                this.ajax();
            }
            else {
                this.load(e.target.result);
            }
        }, this), false);
        request.addEventListener('error', dom.Tool.proxy(this.ajax, this), false);
    };

    Query.prototype.updateDB = function (data) {
        var objectStore = database.transaction([this.model], webkitIDBTransaction.WRITE).objectStore(this.model), request;
        request = objectStore.add(data);
    };

    Query.prototype.ajax = function (word) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', this.api + this.word, true);
        xhr.addEventListener('load', dom.Tool.proxy(this.ajaxLoad, this), false);
        xhr.addEventListener('error', dom.Tool.proxy(this.ajaxError, this), false);
        xhr.send(null);
    };

    Query.prototype.ajaxLoad = function (e) {
        //override
    };

    Query.prototype.ajaxError = function (e) {
        this.error(this.word);
    };




    function Powerword(args) {

        this.api = DICT_API.powerword;
        this.model = 'powerword';

        this.super.constructor.call(this, args);
    }

    dom.Tool.extend(Powerword, Query);

    Powerword.prototype.ajaxLoad = function (e) {
        var xml = e.target.responseXML, json = {}, elems, elem, i, len, item;
        json.key = this.word;
        if (xml) {
            elems = xml.getElementsByTagName('ps')[0];
            json.ps = elems ? elems.firstChild.nodeValue : '';

            json.tt = [];
            elems = xml.getElementsByTagName('acceptation');
            for (i = 0, len = elems.length ; i < len ; i += 1) {
                item = elems[i];
                elem = item.previousSibling;
                json.tt.push({
                    pos: (elem.tagName.toLowerCase() === 'pos' || elem.tagName.toLowerCase() === 'fe') ? elem.firstChild.nodeValue : '',
                    acceptation: item.firstChild.nodeValue
                });
            }
        }

        if (json.tt && json.tt.length > 0) {
            this.load(json);
            this.updateDB(json);
        }
        else {
            this.ajaxError();
        }
    };


    function Dictcn(args) {

        this.api = DICT_API.dictcn;
        this.model = 'dictcn';
        this.super.constructor.call(this, args);
    }

    dom.Tool.extend(Dictcn, Query);

    Dictcn.prototype.ajaxLoad = function (e) {
        var xml = e.target.responseText, json = {}, elems, elem, i, len, item, parser, reg = /[a-z]\..+?(?=[a-z]\.|$)/gm;
        if (xml) {
            parser = new DOMParser();
            xml = parser.parseFromString(xml,"text/xml");
            elem = xml.getElementsByTagName('pron')[0];
            json.ps = elem ? elem.firstChild.nodeValue : '';

            json.tt = [];
            elem = xml.getElementsByTagName('def')[0];
            if (elem) {
                elem = elem.firstChild.nodeValue;
                elems = elem.match(reg);
                if (elems) {
                    for (i = 0, len = elems.length ; i < len ; i += 1) {
                        item = elems[i];
                        json.tt.push({
                            pos: '',
                            acceptation: elems[i]
                        });
                    }
                }
            }
        }

        if (json.tt && json.tt.length > 0) {
            json.key = this.word;
            this.load(json);
            this.updateDB(json);
        }
        else {
            this.ajaxError();
        }
    };

})();
