(function () {
    if (!localStorage['startup']) {
        localStorage.startup = 'manual';//启动方式
        localStorage.language = 'zh';//temporary cannot achieve
        localStorage.skin = '1';// 皮肤
        localStorage.searchInputDisplay = 'block';// 搜寻框是否显示 默认是'' 当为 'none'的时候不显示
        localStorage.searchInputWidth = '210';//输入框长度 当iciba_param['searchInputDisplay'] !='none'的时候起作用
        localStorage.isCanDraw = '1';//是否能拖动 0表示不可以拖动 默认为1可拖动
        localStorage.defalutDwTop = '100';//默认定位的距离顶部的高度
        localStorage.defalutDwLeft ='100';//默认定位的距离左变的长度
        localStorage.selfDeter = '1';//是否自己划词自己 0 表示不可以
        localStorage.width = '325';// 宽度
        localStorage.height = '200';// 内容高度
        localStorage.isPopIcon = '0';//是否需要 小icon 需要为1 不需要为0
        localStorage.isPopStyle = '1';//小icon的 图标
        localStorage.isInputCan = '0';//是否能在文本域输入框内划词 默认不可以 只有'1'的时候才能起作用
        localStorage.dictsOrder = JSON.stringify(["Dict","Love","Fy","Tf","Dj","Enen","NetDict"]);//词典顺序
        localStorage.dictsAvailable = JSON.stringify({"Dict":true,"Love":true,"Fy":true,"Tf":true,"Dj":true,"Enen":true,"NetDict":true});//可用的词典
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
    var status = localStorage.startup !== 'automatic' ? true : false, tab;

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
                xhr.onload = function () {
                    port.postMessage({result: xhr.responseXML});
                };
                xhr.send(null);
            });
        }
    });

})();

