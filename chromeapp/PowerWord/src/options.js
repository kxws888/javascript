(function () {
    var icibaUiForm, dictList;
    //options = ['launch', 'language', 'cstyle', 'searchInputDisplay', 'searchInputWidth', 'isDw', 'defalutDwTop', 'defalutDwLeft'];
    //options += ['selfDeter', 'oObjWidth', 'oObjHeight', 'isPopIcon', 'isPopStyle', 'isInputCan'];
    //options += ['iciba[]', 'icibaGo_Dict', 'icibaGo_Love', 'icibaGo_Fy', 'icibaGo_Tf', 'icibaGo_Dj', 'icibaGo_Enen', 'icibaGo_NetDict'];
    function init() {
        icibaUiForm = document.getElementById('icibaUiForm');
        dictList = document.getElementById('sdContentW');saveOptions()
        icibaUiForm.addEventListener('submit', saveOptions, false);
        //restoreOptions();
    }
    // Saves options to localStorage.
    function saveOptions(e) {
        var i, len, elements, item, status, dicts = [], dict;

        elements = icibaUiForm.querySelectorAll('input[type=radio]:not([name^=iciba]), input[type=text]');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            item = elements[i];
            localStorage[item.name] = item.value;
        }

        elements = dictList.querySelectorAll('tr');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            item = elements[i];
            dict = [];
            dict[dict.length] = item.querySelector('input').value;
            dict[dict.length] = item.querySelector('input[type=radio]:checked').value;
            dicts[dicts.length] = dict;
        }

        localStorage[item.querySelector('input').name.slice(0, -2)] = JSON.stringify(dicts);

        // Update status to let user know options were saved.
        status = document.getElementById("status");
        status.innerHTML = "Options Saved.";
        setTimeout(function() {
            status.innerHTML = "";
        }, 750);
        e.preventDefault();
        return false;
    }

    // Restores select box state to saved value from localStorage.
    function restoreOptions() {
        var i, len, elements, status;

        elements = icibaUiForm.querySelectorAll('[type=radio], [type=text]');
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

    }

    function handleCheckbox(checkbox, value) {
        if (value) {
        
        }
        else {
        
        }
    }

    document.addEventListener('DOMContentLoaded', init, false);
})();
