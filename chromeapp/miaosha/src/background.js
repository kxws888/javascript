(function () {
    const PRICE_REG = /\d+(,\d+)?(\.\d+)?/;
    var tabs = {}, notification, sound, counter = 0, active = false;

    notification = webkitNotifications.createNotification(
        '../assets/icon48.png',  // icon url - can be relative
        '秒杀成功!',  // notification title
        '给力有木有!'  // notification body text
    );

    notification.addEventListener('close', function () {
        sound.pause();
    }, false);

    sound = new Audio('../assets/1.mp3');
    sound.loop = 'loop';

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.insertCSS(tab.id, {file: 'pages/style/ui.css'});
        chrome.tabs.executeScript(tab.id, {file: "src/init.js"});
    });

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        var tabId = sender.tab.id;
        if ('success' in request) {
            mStop(tabId);
            notification.show();
            if (request.sound) {
                sound.play();
            }
        }
        else if ('abort' in request) {
            mStop(tabId);
        }
        else {
            if (!tabs[tabId]) {
                counter += 1;
            }
            tabs[tabId] = request;
            tabs[tabId].url = sender.tab.url;
            tabs[tabId].timer = setTimeout(function () {
                chrome.tabs.update(sender.tab.id, {url: sender.tab.url});
                if (!active) {
                    chrome.tabs.onUpdated.addListener(tabsUpdatedHanlder);
                    chrome.tabs.onRemoved.addListener(tabsRemovedHanlder);
                    active = true;
                }
            }, request.gap * 1000);
        }
    });

    function tabsUpdatedHanlder(tabId, changeInfo, tab) {
        if (tab.status !== 'complete' && tabs[tabId]) {
            if (tab.url !== tabs[tabId].url) {
                mStop(tabId);
            }
            else {
                chrome.tabs.insertCSS(tabId, {file: 'pages/style/ui.css'});
                chrome.tabs.executeScript(tabId, {file: 'src/controller.js'});
                chrome.tabs.executeScript(tabId, {code: tmpl('check', tabs[tabId])});
            }
        }
    }

    function tabsRemovedHanlder(tabId, removeInfo) {
        if (tabs[tabId]) {
            mStop(tabId);
        }
    }

    function mStop(tabId) {
        clearTimeout(tabs[tabId].timer);
        delete tabs[tabId];
        counter -= 1;
        if (counter === 0) {
            chrome.tabs.onUpdated.removeListener(tabsUpdatedHanlder);
            chrome.tabs.onRemoved.removeListener(tabsRemovedHanlder);
            active = false;
        }
    }

    function tmpl(id, data) {
        code = document.getElementById(id).innerHTML;
        return code.replace(/<%=([a-z]+)%>/img, function (str, p1, offset, s) {
            return data[p1]
        });
    }

    function contentScript(args) {
        return tmpl('check', args);
        return "var elem = document.querySelector('" + args.queryStr + "'); if (parseFloat(" + args.reg + ".exec(elem.innerHTML)[0].replace(',', ''), 10) < " + args.price + ") "
            + " {chrome.extension.sendRequest({success: true, sound: " + args.sound + "});var border = ['#f00', '#0f0', '#00f'], i = 0; setInterval(function () {elem.style.cssText = '-webkit-transition-property: -webkit-box-shadow; -webkit-transition-duration: 1s;';elem.style['-webkit-box-shadow']='0 0 5px 5px' + border[i = i++ > border.length ? 0 : i]}, 1000);} else "
            + " {chrome.extension.sendRequest({queryStr: '" + args.queryStr + "', reg:" + args.reg + ".toString(), price: " + args.price + ", gap:" + args.gap + ", sound: " + args.sound + "});}";
    }

})();
