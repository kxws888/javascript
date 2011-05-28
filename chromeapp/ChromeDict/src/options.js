(function () {
    var tab, mainview, dicts;
    function init() {
        mainview = document.getElementById('mainview');
        dicts = document.getElementById('dictSection');
        chrome.tabs.getCurrent(function (t) {
            tab = t;
        });

        uiEnhance();

        restoreOptions();
    }

    var checkSwitchEvent = document.createEvent('Event');
    checkSwitchEvent.initEvent('checkSwitch', true, true);

    function bindCheckSwitchEvent(e) {
        var target = e.target, next, parent;
        next = dom.Query.next(target);
        if (next) {
            if (target.querySelector('input').type === 'checkbox') {
                while (next) {
                    next.querySelector('input').disabled = !next.querySelector('input').disabled;
                    next = dom.Query.next(next);
                }

                return;
            }
            else {
                while (next) {
                    next.querySelector('input').disabled = false;
                    next = dom.Query.next(next);
                }
            }
        }

        parent = dom.Query.next(target.parentNode);
        if (parent) {
            while (parent) {
                next = dom.Query.next(parent.querySelector('label'));
                while (next) {
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
                while (next) {
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
            if (this.alt === '向上') {
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

    function uiEnhance() {
        var checkSwitchElements, dictsList, dictsArrow, nav, i, len, item, elements;
        checkSwitchElements = mainview.querySelectorAll('#assistKeySection label:first-child');
        for (i = 0, len = checkSwitchElements.length ; i < len ; i += 1) {
            item = checkSwitchElements[i];
            item.addEventListener('click', checkSwitchClickHanlder, false);
            item.addEventListener('checkSwitch', bindCheckSwitchEvent, false);
        }

        dictsList = dicts.querySelectorAll('li');
        for (i = 0, len = dictsList.length ; i < len ; i += 1) {
            dictsList[i].addEventListener('click', dictsHighlight, false);
        }

        dictsArrow = dicts.querySelectorAll('input[type=image]');
        for (i = 0, len = dictsArrow.length ; i < len ; i += 1) {
            dictsArrow[i].addEventListener('click', dictsRerange, false);
        }

        nav = document.getElementById('navbar-container').querySelectorAll('li');
        for (i = 0, len = nav.length ; i < len ; i += 1) {
            nav[i].addEventListener('click', navTab, false);
        }

        elements = mainview.querySelectorAll('label, input[type=image]');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            elements[i].addEventListener('click', saveOptions, false);
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
        var i, len, elements, dictsOrder = [], dictsAvailable = {}, ul;

        elements = mainview.querySelectorAll('input[type=radio], #hotCaptrueSection input');
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            item = elements[i];
            if (item.value === localStorage[item.name]) {
                item.checked = true;
                item.parentNode.dispatchEvent(checkSwitchEvent);
            }
            else {
                item.checked = false;
            }
        }

        elements = dicts.querySelectorAll('input[type=checkbox]');
        dictsAvailable = JSON.parse(localStorage['dictsAvailable']);
        for (i = 0, len = elements.length ; i < len ; i += 1) {
            item = elements[i];
            if (item.value in dictsAvailable) {
                item.checked = true;
            }
            else {
                item.checked = false;
                item.parentNode.dispatchEvent(checkSwitchEvent);
            }
        }

        dictsOrder = JSON.parse(localStorage['dictsOrder']);
        ul = dicts.querySelector('ul');
        for (i = 0, len = dictsOrder.length ; i < len ; i += 1) {
            ul.appendChild(document.getElementById(dictsOrder[i]));
        }
    }


    document.addEventListener('DOMContentLoaded', init, false);
})();
