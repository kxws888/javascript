define(['event', 'dom'], function (require) {
    var event = require('event');
    var dom = require('dom');
    event.add(dom.query('#btn')[0], 'click', function (e) {
        dom.query('#textbox')[0].value = '';
    })
})

