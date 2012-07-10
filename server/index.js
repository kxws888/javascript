var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;

var dependenceDetectReg = /define\('.+?'\s*,\s*(?:\[(.+?)\]\s*,\s*)function/m;
var modulesPath = ['/Users/viclm/Code/javascript/modules/'];

function compress(modules, debug) {
    var data = '', i = 0, len = modules.length, file, ast, dep, deps = [];
    for (; i < len ; i += 1) {
        modulesPath.forEach(function (value) {
            file = value + modules[i] + '.js';
            if (path.existsSync(file)) {
                ast = fs.readFileSync(file, 'utf-8');
                if ((dep = dependenceDetectReg.exec(ast)) && (dep = dep[1].trim())) {
                    deps = deps.concat(dep.replace(/['"]/g, '').split(/\s*,\s*/));
                }
                if (!debug) {
                    ast = jsp.parse(ast);
                    ast = pro.ast_mangle(ast);
                    ast = pro.ast_squeeze(ast);
                    ast = pro.gen_code(ast);
                }
                data += ast + ';';
            }
        });
    }
    if (deps.length) {
        var modules = [];
        deps.forEach(function (value) {
            if (modules.indexOf(value) === -1) {modules.push(value);}
        });
        return arguments.callee(modules, debug) + data;
    }
    else {
        return data;
    }
}

http.createServer(function (request, response) {
    var uri = url.parse(request.url);
    if (uri.pathname.indexOf('/scripts') === 0) {
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        response.end(fs.readFileSync('..' + uri.pathname.replace('scripts', 'modules'), 'utf-8'));
    }
    else if (uri.pathname === '/combo') {
        var modules = uri.query.split('&');
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        response.write(compress(modules));
        response.end();
    }
    else if (uri.pathname === '/combodev') {
        var modules = uri.query.split('&');
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        response.write(compress(modules, true));
        response.end();
    }
    else {
        response.end();
    }
}).listen(8080);
