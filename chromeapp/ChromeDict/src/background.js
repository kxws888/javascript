(function () {
    if (!localStorage['startup']) {
        localStorage.startup = 'manual';// the startup mode of program [manual, automatic]
        localStorage.ui = 'simple';// the style of UI [simple, all]
        localStorage.skin = 'orange';// the skin of UI [orange]
        localStorage.dict = JSON.stringify(['powerword']);// a list of available dictionary [powerword]
        localStorage.assistKey = 'none';//assisted key [none, ctrl, alt, shift]
        localStorage.hoverCapture = 'on';//if enable captrue word by mouse hover [on, off]
    }

    function config() {
        var iciba_param = {}, dictsAvailable, dictsOrder, context = [], i, len;
        iciba_param['skin'] = localStorage.skin;
        iciba_param['searchInputDisplay'] = localStorage.searchInputDisplay;
        iciba_param['searchInputWidth'] = localStorage.searchInputWidth;
        iciba_param['isCanDraw'] = localStorage.isCanDraw;
        iciba_param['defalutDwTop'] = localStorage.defalutDwTop;
        iciba_param['defalutDwLeft'] = localStorage.defalutDwLeft;
        iciba_param['selfDeter'] = localStorage.selfDeter;
        iciba_param['width'] = localStorage.width;
        iciba_param['height'] = localStorage.height;
        iciba_param['isPopIcon'] = localStorage.isPopIcon;
        iciba_param['isPopStyle'] = localStorage.isPopStyle;
        iciba_param['isInputCan'] = localStorage.isInputCan;
        iciba_param['context'] = [];//词典功能

        dictsOrder = localStorage['dictsOrder'];
        dictsAvailable = localStorage['dictsAvailable'];
        if (dictsOrder && dictsAvailable) {
            dictsOrder = JSON.parse(dictsOrder);
            dictsAvailable = JSON.parse(dictsAvailable);
            for (i = 0, len = dictsOrder.length ; i < len ; i += 1) {
                if (dictsOrder[i] in dictsAvailable) {
                    context[context.length] = [dictsOrder[i], localStorage['icibaGo_' + key]];
                }
            }
        }
        else {
            dictsOrder = [['Dict',''],['Love',''],['Fy',''],['Tf',''],['Dj',''],['Enen','']];
        }
        iciba_param['context'] = context;

        return iciba_param;
    }

    //toggle the of switcher dict by clicking the page button
    var status = localStorage.startup === 'automatic' ? true : false, tab;

    function xml2json(xml) {
        var json = {}, root;
        xml.childNodes
        return json;
    }

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

    chrome.pageAction.onClicked.addListener(dictSwitch);

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

    chrome.extension.onConnect.addListener(function(port) {
        if (port.name === 'query') {
            port.onMessage.addListener(function(msg) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://dict-co.iciba.com/api/dictionary.php?w=' + msg.w, true);
                xhr.onload = function (e) {
                    var xml = xhr.responseXML, json = {}, elems, elem, i, len, item;console.log(xml)
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
                    }
                    json.key = msg.w;
                    json.result = true;
                    port.postMessage(json);
                };
                xhr.onerror = function () {
                    port.postMessage({key: msg.w, result: false});
                }
                xhr.send(null);
            });
        }
    });

})();

