String.prototype.times = function(n) { 
    return Array.prototype.join.call({length:n+1}, this); 
}; 

jQuery.fn.highlight = (function ($) {
    function javascript() {
        var self = $(this), code = self.html(), depth = 0, i, len, tmp,
                    indent = '    ';
        //code = code.replace(/\n/, ' ').replace(/(;|{|})/gm, '$1\n').replace(/(\([^)]*?);\n|;\n([^(]*?\))/gm, '$1;$2');//format newline
        code = code.replace(/^\s+?(\S+?)/gm, '$1');//trim leading blank
        code = code.split(/(?:\n)|(?:<br>)/);
        //format indent
        for (i = 0, len = code.length ; i < len ; i += 1) {
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
        console.log(code)
        
        
        code = code.replace(/('|").+?\1/gm, '<span style="color: #3366CC">$&</span>').replace(/\/.+?\/(?=\.|(?:\s*?\)))/gm, '<span style="color: #3366CC">$&</span>');
        //highlight keyword
        code = code.replace(/\bfunction|var|new|try|catch|for|if|while|true|false\b/gm, '<span style="color: #003366; font-weight: bold;">$&</span>');//highlight keyword
        code = code.replace(/\bMath|Array|String|Function|Object\b/gm, '<span style="color: #003366; font-weight: bold;">$&</span>');//highlight internal Class
        code = code.replace(/\/{2}.*?\n/gm, function (str) {
            str = str.replace('</span>', '').replace(/<span.+?>/, '');
            return '<span style="color: #009900; font-style: italic;">' + str + '</span>'
        });//highlight comment
        code = code.split('\n').join('<br/>').replace(/\s{4}/mg, '&nbsp;&nbsp;&nbsp;&nbsp;');//replace symbol with html equivalent

        self.html(code);

    }

    function highlight(lang) {
        lang = lang || 'javascript';
        return this.each(eval(lang));
    }

    return highlight;
})(jQuery)
