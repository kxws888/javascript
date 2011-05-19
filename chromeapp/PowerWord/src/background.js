(function () {
    chrome.tabs.onUpdated.addListener(function(tabID) {
        chrome.pageAction.show(tabID);
    });

    chrome.pageAction.onClicked.addListener(function(tab) {
        chrome.tabs.executeScript(null, {file: "src/contentscript.js"});
    });
})();

