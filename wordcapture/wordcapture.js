/**
 * Wordcapture
 * @version 20110523.1
 *
*/
function Wordcapture (args) {
    this.scope = args && args.scope || document.body;

    this.captureEvent = document.createEvent('MouseEvents');
    this.captureEvent.initEvent('capture', true, true);
    dom.Event.addEvent(this.scope, 'capture', dom.Tool.proxy(this.captureText, this));
}


Wordcapture.prototype.enable = function () {
    dom.Event.addEvent(this.scope, 'click', this.dblclickProxy = dom.Tool.proxy(this.dblclick, this));
    dom.Event.addEvent(this.scope, 'mousedown', this.dragStartProxy = dom.Tool.proxy(this.dragStart, this));
}

Wordcapture.prototype.disable = function () {
    dom.Event.removeEvent(this.scope, 'click', this.dblclickProxy);
    dom.Event.removeEvent(this.scope, 'mousedown', this.dragStartProxy);
}

Wordcapture.prototype.dblclick = function (e) {
    if (e.detail > 1) {
        e.target.dispatchEvent(this.captureEvent);
    }
}

Wordcapture.prototype.dragStart = function (e) {
    var event = dom.Event.fix(e);
    dom.Event.one(document, 'mouseup', dom.Tool.proxy(this.dragEnd, this));
    this.cursorPos = event.pageX;
}

Wordcapture.prototype.dragEnd = function (e) {
    var event = dom.Event.fix(e);
    if (this.cursorPos !== event.pageX) {
        e.target.dispatchEvent(this.captureEvent);
    }
}

Wordcapture.prototype.captureText = function () {
    this.text = window.getSelection().toString();
}




function Dict(args) {
    this.super.constructor.call(this, args);
    this.api = 'http://dict-co.iciba.com/api/dictionary.php';
}

dom.Tool.extend(Dict, Wordcapture);

Dict.prototype.captureText = function (e) {
    this.super.captureText();
    if (dom.Tool.trim(this.text).length > 0) {
        var xhr = dom.Ajax.createXMLHttpObject();
        xhr.open('GET', this.api + '?w=' + this.text, true);
        xhr.onreadystate = function (e) {
            if (dom.Ajax.httpSuccess(xhr)) {
                console.log(e.responseXML)
            }
        }
        xhr.send(null);
    }
}
