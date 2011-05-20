(function () {
    var icibaUiForm, dictList, tab;
    function init() {
        icibaUiForm = document.getElementById('icibaUiForm');
        dictList = document.getElementById('sdContentW');
        chrome.tabs.getCurrent(function (t) {
            tab = t;
        });

        if (localStorage['iciba[]']) {
            restoreOptions();
        }
    }
    // Saves options to localStorage.
    function saveOptions() {
        var i, len, elements, item, status, dicts = {};

        elements = icibaUiForm.querySelectorAll('input[type=radio]:checked, input[type=text]');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            item = elements[i];
            localStorage[item.name] = item.value;
        }

        elements = dictList.querySelectorAll('input[type=checkbox]:checked');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            item = elements[i];
            dicts[item.value] = true;
        }

        localStorage[item.name] = JSON.stringify(dicts);
    }

    // Restores select box state to saved value from localStorage.
    function restoreOptions() {
        var i, len, elements, status, dicts;

        elements = icibaUiForm.querySelectorAll('input[type=radio], input[type=text]');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            item = elements[i];
            if (item.type === 'text') {
                item.value = localStorage[item.name];
                continue;
            }
            else if (item.value === localStorage[item.name]) {
                item.checked = true;
            }
            else {
                item.checked = false;
            }
        }

        elements = dictList.querySelectorAll('input[type=checkbox]');
        dicts = JSON.parse(localStorage[elements[0].name]);
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            item = elements[i];
            if (item.value in dicts) {
                item.checked = true;
            }
            else {
                item.checked = false;
            }
        }

    }


    document.addEventListener('DOMContentLoaded', init, false);
    chrome.tabs.onRemoved.addListener(function(tabId) {
        if (tabId === tab.id) {
            saveOptions();
        }
    });
})();
