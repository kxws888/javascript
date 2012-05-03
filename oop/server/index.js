var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var qs = require('querystring');

http.createServer(function (request, response) {
    var uri = url.parse(request.url);
    if (uri.pathname === '/combo') {
        var modules = uri.query.split('&'), data = '';
        for (var i = 0, len = modules.length, file ; i < len ; i += 1) {
            file = 'modules/' + modules[i] + '.js';
            if (path.existsSync(file)) {
                data += fs.readFileSync(file);
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
