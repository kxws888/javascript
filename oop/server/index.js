var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;

http.createServer(function (request, response) {
    var uri = url.parse(request.url);
    if (uri.pathname === '/combo') {
        var modules = uri.query.split('&'), data = '';
        for (var i = 0, len = modules.length, file, ast ; i < len ; i += 1) {
            file = '../modules/' + modules[i] + '.js';
            if (path.existsSync(file)) {
                ast = jsp.parse(fs.readFileSync(file).toString());
                ast = pro.ast_mangle(ast);
                ast = pro.ast_squeeze(ast);
                ast = pro.gen_code(ast);
                data += ast + ';';
            }
        }
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        response.write(data);
        response.end();
    }
    else {
        response.end();
    }
}).listen(8080);
