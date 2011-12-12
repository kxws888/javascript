String.prototype.times = function(n) { 
    return Array.prototype.join.call({length:n+1}, this); 
};

YUI.add('syntax-highlighter', function(Y) {

    Y.namespace('SH');

    Y.SH.javascript = function javascript(selector) {
        var nodeList = Y.all(selector), indent = '    ';
		nodeList.each(function (node) {
		var code = node.getContent();
        code = code.replace(/^\s+?(\S+?)/gm, '$1');//trim leading blank
        code = code.split(/(?:\n)|(?:<br>)/);
        //format indent
		for (var i = 0, len = code.length, depth = 0 ; i < len ; i += 1) {
            tmp = code[i];
            if (/}/.test(tmp)) {
                depth -= 1;
            }

            tmp = indent.times(depth) + tmp;

            if (/{/.test(tmp)) {
                depth += 1;
            }
            code[i] = tmp;
        }
        code = code.join('\n');

        code = code.replace(/('|").+?\1/gm, '<span style="color: #3366CC">$&</span>').replace(/\/.+?\/(?=\.|(?:\s*?\)))/gm, '<span style="color: #3366CC">$&</span>');
        //highlight keyword
        code = code.replace(/\bfunction|var|new|try|catch|for|if|while|true|false\b/gm, '<span style="color: #003366; font-weight: bold;">$&</span>');//highlight keyword
        code = code.replace(/\bMath|Array|String|Function|Object\b/gm, '<span style="color: #003366; font-weight: bold;">$&</span>');//highlight internal Class
        code = code.replace(/\/{2}.*?\n/gm, function (str) {
            str = str.replace('</span>', '').replace(/<span.+?>/, '');
            return '<span style="color: #009900; font-style: italic;">' + str + '</span>'
        });//highlight comment
        code = code.split('\n').join('<br/>').replace(/\s{4}/mg, '&nbsp;&nbsp;&nbsp;&nbsp;');//replace symbol with html equivalent
		node.setContent(code);
		});

    };

}, '1.0.0', {
    requires: ['node']
});
