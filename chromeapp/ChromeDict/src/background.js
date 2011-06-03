(function () {
    if (!localStorage.skin) {
        localStorage.ui = 'simple';
        localStorage.skin = 'orange';
        localStorage.hotKeySwitch = '0';
        localStorage.hotKeyHover = '{"ctrlKey":true,"altKey":false,"shiftKey":false,"metaKey":false,"keyCode":112}';
        localStorage.hotKeyDrag = '{"ctrlKey":true,"altKey":false,"shiftKey":false,"metaKey":false,"keyCode":113}';
        localStorage.mainDict = 'powerword';
        localStorage.assistDict = 'dictcn';
        localStorage.hoverCapture = '1';
        localStorage.dragCapture = '1';
    }

    const DICT_API = {
        powerword: 'http://dict-co.iciba.com/api/dictionary.php?w=',
        dictcn: 'http://dict.cn/ws.php?utf8=true&q='
    };

    var status, menuItemIdHover, menuItemIdDrag;

    menuItemIdHover = chrome.contextMenus.create({
        title: '关闭取词',
        onclick: contextMenusHanlder
    });
    menuItemIdDrag = chrome.contextMenus.create({
        title: '关闭划词',
        onclick: contextMenusHanlder
    });

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (!/^chrome/i.test(tab.url) && tab.status !== 'complete') {
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
            var configs = getConfig();
            sendResponse(configs);
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
                case 'query':
                    simpleQuery(msg, port);
                    break;
                case 'setCaptureMode':
                    setCaptureMode(msg, port);
                }
            });
        }
    });

    function setCaptureMode(msg, port) {
        localStorage.hoverCapture = msg.hoverCapture ? '1' : '0';
        localStorage.dragCapture = msg.dragCapture ? '1' : '0';
    };

    function simpleQuery(msg, port) {
        var mainDict = localStorage.mainDict, assistDict = localStorage.assistDict, mainAjax, assistAjax, complete = false;
        mainAjax = ajax({
            url: DICT_API[mainDict],
            word: msg.w,
            load: function (e) {
                var res;
                switch (mainDict) {
                case 'powerword':
                    res = powerword(e);
                    break;
                case 'dictcn':
                    res = dictcn(e);
                    break;
                }

                if (res.result) {
                    res.key = msg.w;
                    complete = true;
                    port.postMessage(res);
                }
            }
        });
        if (assistDict) {
            assistAjax = ajax({
                url: DICT_API[assistDict],
                word: msg.w,
                load: function (e) {
                    if (!complete) {
                        var res;
                        switch (assistDict) {
                        case 'powerword':
                            res = powerword(e);
                            break;
                        case 'dictcn':
                            res = dictcn(e);
                            break;
                        }

                        if (res.result) {
                            res.key = msg.w;console.log(res)
                            port.postMessage(res);
                        }
                        else {
                            res.key = msg.w;
                            port.postMessage(res);
                        }
                    }
                },
                error: function (e) {
                    if (!complete) {
                        port.postMessage({key: msg.w, result:false});
                    }
                }
            });
        }
    }

    function ajax(args) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', args.url + args.word, true);
        xhr.onload = args.load;
        xhr.onerror = args.error;
        xhr.send(null);
    }

    function powerword(e) {
        var xml = e.target.responseXML, json = {}, elems, elem, i, len, item;
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

        if (xml && json.tt.length > 0) {
            json.result = true;
        }
        else {
            json.result = false;
        }

        return json;
    }

    function dictcn(e) {
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

        if (xml && json.tt.length > 0) {
            json.result = true;
        }
        else {
            json.result = false;
        }

        return json;
    }

})();

