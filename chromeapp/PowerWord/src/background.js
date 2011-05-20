(function () {
    function config() {
        var iciba_param = {}, dicts = [], iciba, key;
        iciba_param['pid']= '0';  //统计id
        iciba_param['skin'] = localStorage.cstyle || 1;// 皮肤
        iciba_param['searchInputDisplay'] = localStorage.searchInputDisplay || 'block';// 搜寻框是否显示 默认是'' 当为 'none'的时候不显示
        iciba_param['searchInputWidth'] = parseInt(localStorage.searchInputWidth, 10) || 210;////输入框长度 当iciba_param['searchInputDisplay'] !='none'的时候起作用 
        iciba_param['isCanDraw'] = localStorage.isDw || '1';//是否能拖动 0表示不可以拖动 默认为1可拖动 
        iciba_param['selfDeter'] = localStorage.selfDeter || '1';//是否自己划词自己 0 表示不可以
        iciba_param['width'] = localStorage.oObjWidth || '325'; // 宽度
        iciba_param['height'] = localStorage.oObjHeight || '200'; // 内容高度
        iciba_param['isPopIcon'] = localStorage.isPopIcon || '0';//是否需要 小icon 需要为1 不需要为0
        iciba_param['context'] = [];//词典功能

        dicts = [];
        if (localStorage['iciba[]']) {
            iciba = JSON.parse(localStorage['iciba[]']);
            for (key in iciba) {
                dicts[dicts.length] = [key, localStorage['icibaGo_' + key]];
            }
        }
        else {
            dicts = [['Dict',''],['Love',''],['Fy',''],['Tf',''],['Dj',''],['Enen','']];
        }
        iciba_param['context'] = dicts;

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
            if (!localStorage.launch || localStorage.launch === 'manual') {
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

