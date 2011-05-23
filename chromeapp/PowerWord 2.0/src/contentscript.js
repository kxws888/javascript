(function () {
    var contentscript = document.createElement('script');
    contentscript.type = 'text/javascript';
    contentscript.src = chrome.extension.getURL('src/ui.js');
    contentscript.charset = 'UTF-8';
    document.body.appendChild(contentscript);
})();
