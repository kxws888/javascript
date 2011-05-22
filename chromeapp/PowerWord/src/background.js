(function () {
    if (!localStorage['startup']) {
        localStorage.startup = 'manual';
        localStorage.cstyle = '1';
        localStorage.searchInputDisplay = 'block';
        localStorage.searchInputWidth = '210';
        localStorage.isDw = '1';
        localStorage.selfDeter = '1';
        localStorage.oObjWidth = '325';
        localStorage.oObjHeight = '200';
        localStorage.isPopIcon = '0';
        localStorage.dictsOrder = JSON.stringify(["Dict","Love","Fy","Tf","Dj","Enen","NetDict"]);
        localStorage.dictsAvailable = JSON.stringify({"Dict":true,"Love":true,"Fy":true,"Tf":true,"Dj":true,"Enen":true,"NetDict":true});
    }
    function config() {
        var iciba_param = {}, dictsAvailable, dictsOrder, i, len;
        iciba_param['pid']= '0';  //统计id
        iciba_param['skin'] = localStorage.cstyle;// 皮肤
        iciba_param['searchInputDisplay'] = localStorage.searchInputDisplay;// 搜寻框是否显示 默认是'' 当为 'none'的时候不显示
        iciba_param['searchInputWidth'] = parseInt(localStorage.searchInputWidth, 10);////输入框长度 当iciba_param['searchInputDisplay'] !='none'的时候起作用 
        iciba_param['isCanDraw'] = localStorage.isDw;//是否能拖动 0表示不可以拖动 默认为1可拖动 
        iciba_param['selfDeter'] = localStorage.selfDeter;//是否自己划词自己 0 表示不可以
        iciba_param['width'] = localStorage.oObjWidth; // 宽度
        iciba_param['height'] = localStorage.oObjHeight; // 内容高度
        iciba_param['isPopIcon'] = localStorage.isPopIcon;//是否需要 小icon 需要为1 不需要为0
        iciba_param['context'] = [];//词典功能

        dictsOrder = localStorage['dictsOrder'];
        dictsAvailable = localStorage['dictsAvailable'];
        if (dictsOrder && dictsAvailable) {
            dictsOrder = JSON.parse(dictsOrder);
            dictsAvailable = JSON.parse(dictsAvailable);
            for (i = 0, len = dictsOrder.length ; i < len ; i += 1) {
                if (dictsOrder[i] in dictsAvailable) {
                    dictsOrder[i] = [dictsOrder[i], localStorage['icibaGo_' + key]];
                }
            }
        }
        else {
            dictsOrder = [['Dict',''],['Love',''],['Fy',''],['Tf',''],['Dj',''],['Enen','']];
        }
        iciba_param['context'] = dictsOrder;

        return iciba_param;
    }

    //switch feature developing
    var status = false;;
    function manualExecuteScript(tab) {
        if (status) {
            return;
        }
        chrome.pageAction.setIcon({
            tabId: tab.id,
            path: chrome.extension.getURL('assets/icon16.png')
        });
        chrome.tabs.executeScript(null, {file: "src/iciba_param.js"});
        status = true;
    }

    chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab) {
        if (!/^chrome/i.test(tab.url) && tab.status === 'complete') {
            if (!localStorage.startup || localStorage.startup === 'manual') {
                status = false;
                chrome.pageAction.onClicked.addListener(manualExecuteScript);
                chrome.pageAction.setIcon({
                    tabId: tabID,
                    path: chrome.extension.getURL('assets/icon16_grey.png')
                });
            }
            else {
                chrome.pageAction.onClicked.removeListener(manualExecuteScript);
                chrome.tabs.executeScript(null, {file: "src/iciba_param.js"});
            }
            chrome.pageAction.show(tabID);
        }
    });

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.action === 'config') {
            sendResponse(JSON.stringify(config()));
        }
        else if (request.action === 'init ui') {
            chrome.tabs.executeScript(null, {file: "src/contentscript.js"});
        }
    });
})();

