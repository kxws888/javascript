(function () {
    'use strict';
    var document = window.document;
    function inherits(childCtor, parentCtor) {
        function tempCtor() {};
        tempCtor.prototype = parentCtor.prototype;
        childCtor.$super = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.constructor = childCtor;
    };    

    function CursorArt(num, len) {
        var self = this;
        this.maxNumber = num || 4;
        this.maxLength = len || 10;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
        this.canvas.style.cssText = 'position: fixed; z-index: -1; left: 0; top: 0';
        this.canvas.addEventListener('mousemove', function (e) {
            return self.ready.call(self, e);
        });

        document.body.appendChild(this.canvas);
    }

    CursorArt.prototype.tail = function () {
        
    };

    CursorArt.prototype.draw = function () {
        
    };

    CursorArt.prototype.ready = function (e) {
        var pageX, pageY, num, len;
        pageX = e.pageX;
        pageY = e.pageY;
        num = Math.round(random() * this.maxNumber);
        len = Math.round(random() * this.maxLength);
        this.draw(); 
    };

    window['CursorArt'] = CursorArt;
})();
