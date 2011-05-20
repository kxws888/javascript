var iciba_param = {};

chrome.extension.sendRequest({action: 'config'}, function (response) {
    localStorage['iciba_param'] = response;
    chrome.extension.sendRequest({action: 'init ui'});
});

