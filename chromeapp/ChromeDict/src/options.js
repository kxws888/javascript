(function () {
    var tab, mainview, dicts, checkSwitchEvent;
    function init() {
        mainview = document.getElementById('mainview');
        dicts = document.getElementById('dictSection');
        chrome.tabs.getCurrent(function (t) {
            tab = t;
        });

        uiEnhance();

        restoreOptions();
    }

    function uiEnhance() {
        var elements, elem, i, len;
        //navtab
        elements = document.getElementById('navbar-container').querySelectorAll('li');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elements[i].addEventListener('click', navTab, false);
        }
        //save options
        elements = mainview.querySelectorAll('label, input[type=image]');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elements[i].addEventListener('click', saveOptions, false);
        }
        //check switch
        elements = mainview.querySelectorAll('#hotKeySection label:first-child');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elem = elements[i];
            elem.addEventListener('click', checkSwitchClickHanlder, false);
            elem.addEventListener('checkSwitch', bindCheckSwitchEvent, false);
        }
        //hot key
        elements = mainview.querySelectorAll('#hotKeySection input[type=text]');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elem = elements[i];
            elem.addEventListener('keyup', setHotKey, false);
            elem.addEventListener('keydown', function (e) {
                e.preventDefault();
            }, false);
        }
        //highlight dict list
        elements = dicts.querySelectorAll('li');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elements[i].addEventListener('click', dictsHighlight, false);
        }
        //rerange dict list
        elements = dicts.querySelectorAll('input[type=image]');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elements[i].addEventListener('click', dictsRerange, false);
        }
    }

    function navTab() {
        if (navTab.last !== this.id) {
            document.getElementById(this.id.slice(0, -3)).style.display = '';
            this.className = 'selected';
            document.getElementById(navTab.last.slice(0, -3)).style.display = 'none';
            document.getElementById(navTab.last).className = '';
            navTab.last = this.id;
        }
    }
    navTab.last = 'browserPageNav';

    checkSwitchEvent = document.createEvent('Event');
    checkSwitchEvent.initEvent('checkSwitch', true, true);

    function bindCheckSwitchEvent(e) {
        var target = e.target, next, parent;
        next = dom.Query.next(target);
        if (next) {
            if (target.querySelector('input').type === 'checkbox') {
                while (next && next.tagName === 'LABEL') {
                    next.querySelector('input').disabled = !next.querySelector('input').disabled;
                    next = dom.Query.next(next);
                }

                return;
            }
            else {
                while (next && next.tagName === 'LABEL') {
                    next.querySelector('input').disabled = false;
                    next = dom.Query.next(next);
                }
            }
        }

        parent = dom.Query.next(target.parentNode);
        if (parent) {
            while (parent) {
                next = dom.Query.next(parent.querySelector('label'));
                while (next && next.tagName === 'LABEL') {
                    next.querySelector('input').disabled = true;
                    next = dom.Query.next(next);
                }
                parent = dom.Query.next(parent);
            }
        }
        else {
            parent = dom.Query.prev(target.parentNode);
            while (parent) {
                next = dom.Query.next(parent.querySelector('label'));
                while (next && next.tagName === 'LABEL') {
                    next.querySelector('input').disabled = true;
                    next = dom.Query.next(next);
                }
                parent = dom.Query.prev(parent);
            }
        }
    }

    function checkSwitchClickHanlder(e) {
        //fix label tansform event to inner input
        if (e.target.nodeName.toLowerCase() === 'input') {
            this.dispatchEvent(checkSwitchEvent);
        }
    }

    // Saves options to localStorage.
    function saveOptions(e) {
        var input = e.target, i, len, elements, item, dictsOrder = [], dictsAvailable = {};

        if (input.tagName.toLowerCase() === 'input') {
            if (input.name === 'dict[]') {
                elements = dicts.querySelectorAll('input[type=checkbox]');
                for (i = 0, len = elements.length ; i < len ; i += 1) {
                    item = elements[i];
                    if (item.checked) {
                        dictsAvailable[item.value] = true;
                    }
                }
                localStorage['dictsAvailable'] = JSON.stringify(dictsAvailable);
            }
            else if (input.name === 'dictsRerange') {
                elements = dicts.querySelectorAll('input[type=checkbox]');
                for (i = 0, len = elements.length ; i < len ; i += 1) {
                    item = elements[i];
                    dictsOrder[dictsOrder.length] = item.value;
                }
                localStorage['dictsOrder'] = JSON.stringify(dictsOrder);
            }
            else {
                localStorage[input.name] = input.value;
            }

            elements = dicts.querySelectorAll('input[type=checkbox]');
            for (i = 0, len = elements.length ; i < len ; i += 1) {
                item = elements[i];
                dictsOrder[dictsOrder.length] = item.value;
                if (item.checked) {
                    dictsAvailable[item.value] = true;
                }
            }
        }
    }

    // Restores select box state to saved value from localStorage.
    function restoreOptions() {
        var i, len, elements, elem, dictsOrder = [], dictsAvailable = {};

        elements = mainview.querySelectorAll('input[type=radio], #hotCaptrueSection input');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elem = elements[i];
            if (elem.value === localStorage[elem.name]) {
                elem.checked = true;
                elem.parentNode.dispatchEvent(checkSwitchEvent);
            }
            else {
                elem.checked = false;
            }
        }

        //hot key
        elements = mainview.querySelectorAll('#hotKeySection input[type=text]');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elem = elements[i];
            setHotKey.call(elem, JSON.parse(localStorage[elem.name]));
        }

        elements = dicts.querySelectorAll('input[type=checkbox]');
        dictsAvailable = JSON.parse(localStorage['dictsAvailable']);
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elem = elements[i];
            if (elem.value in dictsAvailable) {
                elem.checked = true;
            }
            else {
                elem.checked = false;
                elem.parentNode.dispatchEvent(checkSwitchEvent);
            }
        }

        dictsOrder = JSON.parse(localStorage['dictsOrder']);
        elem = dicts.querySelector('ul');
        for (i = 0, len = dictsOrder.length ; i < len ; i += 1) {
            elem.appendChild(document.getElementById(dictsOrder[i]));
        }
    }

    function setHotKey(e) {
        var keyCode = e.keyCode, key, hotKeys = {}, i, value = '';

        if (keyCode === 8) {
            value = '';
            hotKeys = {};
        }

        if (64 < keyCode && keyCode < 91 || 111 < keyCode && keyCode < 124 || 47 < keyCode && keyCode < 58) {
            hotKeys.ctrlKey = e.ctrlKey;
            hotKeys.altKey = e.altKey;
            hotKeys.shiftKey = e.shiftKey;
            hotKeys.metaKey = e.metaKey;

            for (i in hotKeys) {
                if (hotKeys[i]) {
                    switch (i) {
                        case 'ctrlKey':
                            key = 'CTRL';
                        break;
                        case 'altKey':
                            key = 'ALT';
                        break;
                        case 'shiftKey':
                            key = 'SHIFT';
                        break;
                        case 'metaKey':
                            key = 'META';
                        break;
                    }
                    value += '+' + key;
                }
            }

            if (111 < keyCode && keyCode < 124) {
                key = 'F' + (keyCode - 111);
            }
            else {
                key = String.fromCharCode(keyCode);
            }
            value += '+' + key;
            value = value.substring(1);
            this.value = value;
            hotKeys.keyCode = keyCode;
            localStorage[this.name] = JSON.stringify(hotKeys);
        }
    }

    //highlight dict <li> when clicked
    function dictsHighlight() {
        if (!dictsHighlight.last || dictsHighlight.last !== this.id) {
            this.className = 'selected';
            dictsHighlight.last && (document.getElementById(dictsHighlight.last).className = '');
            dictsHighlight.last = this.id;
        }
    }

    //rerange dicts list by clicking arrow
    function dictsRerange() {
        if (dictsHighlight.last) {
            var highlight = document.getElementById(dictsHighlight.last), parent = highlight.parentNode, relate;
            if (this.alt === 'up') {
                relate = dom.Query.prev(highlight);
                if (relate) {
                    parent.insertBefore(highlight, relate);
                }
            }
            else {
                relate = dom.Query.next(highlight);
                if (relate) {
                    parent.insertBefore(relate, highlight);
                }
            }
        }
    }

    document.addEventListener('DOMContentLoaded', init, false);
})();
