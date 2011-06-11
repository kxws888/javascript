(function () {
    var tabs = {}, notification, sound, counter = 0, active = false;

    notification = webkitNotifications.createNotification(
        '../assets/icon48.png',  // icon url - can be relative
        '秒杀成功!',  // notification title
        '给力有木有!'  // notification body text
    );


    notification.onclose = function () {
        sound.pause();
    };

    sound = new Audio('../assets/1.mp3');
    sound.loop = 'loop';

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.executeScript(tab.id, {file: "src/init.js"});
    });

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        tabs[sender.tab.id] = request;
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
            tabs[sender.tab.id] = null;
        }
        else {
            setTimeout(function () {
                if (tabs[sender.tab.id]) {
                    counter += 1;
                    chrome.tabs.update(sender.tab.id, {url: sender.tab.url});
                    if (!active) {
                        chrome.tabs.onUpdated.addListener(autoFresh);
                    }
                    active = true;
                }
            }, request.gap * 1000);
        }
    });

    function autoFresh(tabId, changeInfo, tab) {
        if (tab.status === 'complete' && tabs[tabId]) {
            //chrome.tabs.insertCSS(tabId, {file: 'pages/style/ui.css'});
            chrome.tabs.executeScript(tabId, {file: 'src/controller.js'});
            chrome.tabs.executeScript(tabId, {code: contentScript(tabs[tabId])});
        }
    }

    function contentScript(args) {
        return "var elem = document.querySelector('" + args.queryStr + "'); if (parseFloat(" + args.reg + ".exec(elem.innerHTML)[0].replace(',', ''), 10) < " + args.price + ") "
            + " {chrome.extension.sendRequest({success: true, sound: " + args.sound + "});var border = ['#f00', '#0f0', '#00f'], i = 0; setInterval(function () {elem.style.cssText = '-webkit-transition-property: -webkit-box-shadow; -webkit-transition-duration: 1s;';elem.style['-webkit-box-shadow']='0 0 5px 5px' + border[i = i++ > border.length ? 0 : i]}, 1000);} else "
            + " {chrome.extension.sendRequest({queryStr: '" + args.queryStr + "', reg:" + args.reg + ".toString(), price: " + args.price + ", gap:" + args.gap + ", sound: " + args.sound + "});}";
    }

})();
