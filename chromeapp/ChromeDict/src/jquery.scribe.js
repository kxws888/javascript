/**
 * scribe is a jQuery plugin for autocomplete
*/
(function ($) {
    $.fn.scribe = function (args) {
        return this.each(function () {
            var total = 0, current = 0, timer, tips, self, result, opt, DELETE = 1, RETAIN = 2, UPDATE = 3, isInput = true;

            self = $(this);
            opt = $.extend($.fn.scribe.defaults, args);

            /**
             * show autocomplete word when available
             * @param {Number} nAction select the appropriate operation, three options are available: DELETE, RETAIN, UPDATE 
             * @param {String} sNew when select UPDATE, need to provide new word
*/
            function showTips(action, newValue) {
                switch (action) {
                    case (1) :
                        tips.val('');
                    break;
                    case (2) :
                        break;
                    case (3) : 
                        tips.val(newValue);
                }
            }
            /**
             * apply autocomplete word by pressing "Tab" key
*/
            function applyTips() {
                var tipsValue = tips.val();
                if (tipsValue) {
                    self.val(tipsValue);
                    showTips(DELETE);
                    getResult(tipsValue);
                    self.focus();
                }
            }
            /**
             * choose the right word from tips list by mouse or keyboard
             * @param {Object} evt
*/
            function selectResult(e) {
                if (total > 0) {
                    var list = result.find('li'), nTo;
                    if (e.type === 'mouseover') {
                        nTo = list.index($(this)) + 1;
                    }
                    else if (e.type === 'mouseout') {
                        nTo = 0;
                    }
                    else if (e.type === 'keydown') {
                        isInput = true;
                        var keyCode = e.which;
                        if (keyCode === 40) {
                            //down arrow
                            nTo = current + 1;
                            if (nTo > total) {
                                nTo = 0;
                            }
                        }
                        else if (keyCode === 38) {
                            nTo = current - 1;
                            if (nTo < 0) {
                                nTo = total;
                            }
                        }
                        else {
                            if (keyCode === 9) {
                                applyTips(e);
                                e.preventDefault();
                            }
                            return;
                        }
                        isInput = false;
                        e.preventDefault();
                    }

                    if (current > 0) {
                        list.eq(current - 1).removeClass(opt.highlightClass);
                    }

                    if (current === 0) {
                        this.$old = self.val();
                    }

                    if (nTo === 0) {
                        self.val(this.$old);
                    }

                    if (nTo > 0 && nTo <= total) {
                        list.eq(nTo - 1).addClass(opt.highlightClass);
                        self.val(list.eq(nTo - 1).text());
                    }

                    current = nTo;
                    showTips(DELETE);
                }
            }
            /**
             * show the tips list
             * @param {Array} data
*/
            function showResult(data) {
                total = data.length;
                var inputValue = self.val(), list = $('li', result);

                for (var i = 0 ; i < opt.max ; i += 1) {
                    var item = list.eq(i), field = data[i];
                    item.html('');
                    if (field) {
                        if (field.indexOf(inputValue) === 0) {
                            var front = field.slice(0, inputValue.length), back = field.slice(inputValue.length);
                            $('<span>').css('color', '#000').html(front).appendTo(item);
                            item.append(back);
                        }
                        else {
                            item.html(field);
                        }
                        item.show();
                    }
                    else {
                        item.hide();
                    }
                }

                if (total > 0) {
                    result.show();
                    if (current > 0) {
                        list[current - 1].removeClass(opt.highlightClass);
                        current = 0;
                    }
                    showTips(UPDATE, data[0]);
                }
                else {
                    result.hide();
                    showTips(DELETE);
                }
            }
            /**
             * fetch the tips list, three ways for use : local, ajax, jsonp
             * @param {String} sReq
*/
            function getResult() {
                if (timer) {
                    return;
                }
                var result = [], complete = false;

                timer = setTimeout(function () {
                    timer = null;
                    var request = self.val(), query;

                    if (request) {
                        setTimeout(function () {
                            if (!complete) {
                                showResult(result);
                            }
                        }, 240);

                        switch (opt.type) {
                            case 'local' :
                                var localData = opt.data;
                            for (var i = 0, len = localData.length ; i < len ; i += 1) {
                                var data = localData[i];
                                if (data.indexOf(request) === 0) {
                                    result.push(data);
                                }
                                if (result.length === opt.max) {
                                    break;
                                }
                            }
                            complete = true;
                            showResult(result);
                            break;
                            case 'ajax' :
                                query = opt.query.split('&');
                            for (var i = 0, len = query.length ; i < len ; i += 1) {
                                query[i] = query[i].replace(/\?/, function () {
                                    if (i === 0) {
                                        return request;
                                    }
                                    else if (i === 1){
                                        return opt.max;
                                    }
                                });
                            }
                            query = query.join('&');
                            $.ajax({
                                url : opt.data,
                                data : query,
                                dataType : 'json',
                                success : function (data) {
                                    complete = true;
                                    showResult(data);
                                }
                            });
                            break;
                            case 'jsonp' :
                                query = opt.query[0] + '=' + request;
                            if (opt.query[1]) {
                                query = opt.query[0] + '=' + request + '&' + opt.query[1] + '=' + opt.max;
                            }
                            $.ajax({
                                url : opt.data,
                                data : query,
                                dataType : 'jsonp',
                                success : function (data) {
                                    data = data.s;
                                    for (var i = 0 ; i < opt.max && i < data.length ; i += 1) {
                                        result.push(data[i]);
                                    }
                                    complete = true;
                                    showResult(result);
                                }
                            });
                            break;
                        }
                    }				
                }, 250);
            }

            /**
             * check every input for handling
*/
            function inputHandler() {
                var i = self.val(), t = tips.val();
                if (i.indexOf(t) === 0) {
                    showTips(RETAIN);
                }
                else {
                    showTips(DELETE);
                }

                if (i !== '' && i.length < 10) {
                    getResult();
                }
                else {
                    result.hide();
                    showTips(DELETE);
                }
            }

            function init() {
                tips = self.clone();
                tips.css({
                    color : '#bfbfbf',
                    position : 'absolute',
                    zIndex : '0'
                });
                tips.val('');

                self.css({
                    position : 'absolute',
                    background : 'url(isn_not_a_real_image.gif)  transparent',
                    zIndex : '10'
                });

                self.before(tips);

                if (self[0].addEventListener) {
                    self[0].addEventListener('input', inputHandler, false);
                }
                else if (self[0].attachEvent) {
                    self[0].attachEvent('onpropertychange', function (e) {
                        if (e.propertyName === 'value' && isInput) {
                            inputHandler();
                        }
                    });
                }

                self.keydown(selectResult);

                var pos = self.position(), height = self.height();

                result = $('<ul>').css({
                    position : 'absolute',
                    zIndex : '10',
                    top : pos.top + height,
                    left : pos.left,
                    listStyleType : 'none',
                    margin : '0',
                    padding : '0',
                    color : '#808080'
                }).addClass(opt.resultClass);
                for (var i = 0 ; i < opt.max ; i += 1) {
                    $('<li>').mouseover(selectResult).mouseout(selectResult).appendTo(result);
                }
                //self.after(result);
                document.querySelector('section')
            }

            init();
        });
    };

    $.fn.scribe.defaults = {
        type : 'ajax', // [local, jsonp, ajax]
        data : 'ajax.php',
        //data : 'http://suggestion.baidu.com/su?p=3&cb=?',
        query : 'query=?&max=?',
        max : 5,
        resultClass : '',
        highlightClass : 'highlight'
    };

})(jQuery);
