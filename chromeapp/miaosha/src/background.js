(function () {
    localStorage.quarry = JSON.stringify({
        amazon: 'b.priceLarge'
    });
    const PRICE_REG = /\d+(,\d+)?(\.\d+)?/, QUARRY_REG = /http:\/\/(?:www\.)?([a-z]+)\./i;
    var tabs = {}, notification, sound, counter = 0, active = false, quarrys = JSON.parse(localStorage.quarry);

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
        var q = QUARRY_REG.exec(tab.url)[1], data = quarrys[q];
        if (data) {
            //chrome.tabs.executeScript(tab.id, {code: tmpl('config', {queryStr: data, priceReg: PRICE_REG.toString()})});
            
        }
        else {
            //chrome.tabs.executeScript(tab.id, {file: "src/pick.js"});
        }
        chrome.tabs.executeScript(tab.id, {file: "src/init.js"});
    });

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if ('success' in request) {
            delete tabs[sender.tab.id];
            counter -= 1;
            if (counter === 0) {
                chrome.tabs.onUpdated.removeListener(autoFresh);
                active = false;
            }
            notification.show();
            if (request.sound) {
                sound.play();
            }
        }
        else if ('abort' in request) {
            clearTimeout(tabs[sender.tab.id].timer);
            delete tabs[sender.tab.id];
            counter -= 1;
            if (counter === 0) {
                chrome.tabs.onUpdated.removeListener(autoFresh);
                active = false;
            }
        }
        else {
            if (!tabs[sender.tab.id]) {
                counter += 1;
            }
            tabs[sender.tab.id] = request;
            tabs[sender.tab.id].timer = setTimeout(function () {
                chrome.tabs.update(sender.tab.id, {url: sender.tab.url});
                if (!active) {
                    chrome.tabs.onUpdated.addListener(autoFresh);
                    active = true;
                }
            }, request.gap * 1000);
        }
    });

    function autoFresh(tabId, changeInfo, tab) {
        if (tab.status === 'complete' && tabs[tabId]) {
            //chrome.tabs.insertCSS(tabId, {file: 'pages/style/ui.css'});
            chrome.tabs.executeScript(tabId, {file: 'src/controller.js'});
            chrome.tabs.executeScript(tabId, {code: tmpl('check', tabs[tabId])});
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
