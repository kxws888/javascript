(function () {
    if (!localStorage.startup) {
        localStorage.startup = 'manual';// the startup mode of program [manual, automatic]
        localStorage.ui = 'simple';// the style of UI [simple, all]
        localStorage.skin = 'orange';// the skin of UI [orange]
        localStorage.hotKeySwitch = '0';//hotKey [1, 0]
        localStorage.hoverHotKey = '{"ctrlKey":true,"altKey":false,"shiftKey":false,"metaKey":false,"keyCode":112}';
        localStorage.dragHotKey = '{"ctrlKey":true,"altKey":false,"shiftKey":false,"metaKey":false,"keyCode":113}';
        localStorage.hoverCapture = '1';//if enable captrue word by mouse hover [1, 0]
        localStorage.dictsOrder = JSON.stringify(['powerword']);// dictionary order
        localStorage.dictsAvailable = JSON.stringify({'powerword': true});// a list of available dictionary
    }

    //toggle the of switcher dict by clicking the page button
    var status = localStorage.startup !== 'automatic' ? true : false, tab;

    var dictAPI = {
        powerword: 'http://dict-co.iciba.com/api/dictionary.php?w=',
        googledict: 'http://www.google.com/dictionary/json?callback=dict_api.callbacks.id100&sl=zh&tl=en&restrict=pr%2Cde&client=te&q='
    }

    chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
        if (!/^chrome/i.test(tab.url) && tab.status !== 'complete') {
            if (status) {
                chrome.tabs.executeScript(null, {file: "src/dict.js"});
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
        params.hoverCapture = localStorage.hoverCapture;

        if (localStorage.hotKeySwitch === '0') {
            hotKeys = null;
        }
        else {
            hotKeys = {
                hover: JSON.parse(localStorage.hoverHotKey),
                drag: JSON.parse(localStorage.dragHotKey)
            };
        }
        params.hotKey = hotKeys;

        dictsOrder = JSON.parse(localStorage['dictsOrder']);
        dictsAvailable = JSON.parse(localStorage['dictsAvailable']);
        for (i = 0, len = dictsOrder.length ; i < len ; i += 1) {
            if (dictsOrder[i] in dictsAvailable) {
                dicts[dicts.length] = dictsOrder[i];
            }
        }
        params.dicts = dicts;

        return params;
    }

    chrome.extension.onConnect.addListener(function(port) {
        if (port.name === 'query') {
            port.onMessage.addListener(simpleQuery);
        }
    });

    function simpleQuery(msg, port) {
        var xhr = new XMLHttpRequest(), xhr2 = new XMLHttpRequest(), dicts = JSON.parse(localStorage.dictsOrder), dict;
        dict = dicts.shift();
        xhr.open('GET', dictAPI[dict] + msg.w, true);
        xhr.onload = function (e) {
            var result;
            switch (dict) {
                case 'powerword':
                    result = powerword(e);
                break;
                case 'googledict':
                    result = googledict(e);
                break;
            }
            result.key = msg.w;
            port.postMessage(result);
        };
        xhr.onerror = function () {
            port.postMessage({key: msg.w, result: false});
        }
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

            json.sent = [];
            elems = xml.getElementsByTagName('sent');
            for (i = 0, len = elems.length ; i < len ; i += 1) {
                item = elems[i];
                json.sent.push({
                    orig: item.getElementsByTagName('orig')[0].firstChild.nodeValue,
                    trans: item.getElementsByTagName('trans')[0].firstChild.nodeValue
                });
            }
            json.result = true;
        }
        else {
            json.result = false;
        }
        return json;
    }

    function googledict() {
        a
    }

})();

