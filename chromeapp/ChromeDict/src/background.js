(function () {
    if (!localStorage.skin) {
        localStorage.ui = 'simple';// the style of UI [simple, all]
        localStorage.skin = 'orange';// the skin of UI [orange]
        localStorage.hotKeySwitch = '0';//hotKey [1, 0]
        localStorage.hotKeyHover = '{"ctrlKey":true,"altKey":false,"shiftKey":false,"metaKey":false,"keyCode":112}';
        localStorage.hotKeyDrag = '{"ctrlKey":true,"altKey":false,"shiftKey":false,"metaKey":false,"keyCode":113}';
        localStorage.mainDict = 'powerword';// dictionary order
        localStorage.assistDict = 'dictcn';// a list of available dictionary
    }

    const DICT_API = {
        powerword: 'http://dict-co.iciba.com/api/dictionary.php?w=',
        dictcn: 'http://dict.cn/ws.php?utf8=true&q='
    };

    var status;

    chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
        if (!/^chrome/i.test(tab.url) && tab.status !== 'complete') {
            if (true) {
                //chrome.tabs.executeScript(null, {file: "src/dict.js"});
            }
            else {
                chrome.pageAction.setIcon({
                    tabId: tab.id,
                    path: chrome.extension.getURL('assets/icon16_grey.png')
                });
            }
            chrome.pageAction.show(tabID);
        }
    });

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
    }

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.cmd === 'config') {
            sendResponse(getConfig());
        }
    });

    function getConfig() {
        var params = {}, hotKeys = {}, dictsAvailable, dictsOrder, dicts = [], i, len;
        params.ui = localStorage.ui;
        params.skin = localStorage.skin;
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
        if (port.name === 'query') {
            port.onMessage.addListener(simpleQuery);
        }
    });

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
                            res.key = msg.w;
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
        var xml = e.target.responseXML, json = {}, elems, elem, i, len, item;
        if (xml) {
            elem = xml.getElementsByTagName('pron')[0];
            json.ps = elem ? elem.firstChild.nodeValue : '';

            json.tt = [];
            elem = xml.getElementsByTagName('def')[0];
            if (elem) {
                elems = elem.firstChild.nodeValue.split(' ');
            }
            for (i = 0, len = elems.length ; i < len ; i += 1) {
                item = elems[i];
                json.tt.push({
                    pos: '',
                    acceptation: item
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

})();
