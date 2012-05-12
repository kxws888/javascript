/**
 * Perform an asynchronous HTTP (Ajax) request.
 *
 * Usage:
 * <pre>
 * ajax('get', 'someurl.php', 'a=1&b=2', 2000, function () {
 *    //execute when request success
 * }, function () {
 *    //execute when request fails
 * })
 * </pre>
 *
 * @param {String} method The type of request to make ("POST" or "GET").
 * @param {String} url A string containing the URL to which the request is sent.
 * @param {String|Object} data Data to be sent to the server. It is converted to a query string, if not already a string.
 * @param {Number} timeout Set a timeout (in milliseconds) for the request.
 * @param {Function} success A function to be called if the request loads successfully
 * @param {Function} error A function to be called if the request fails.
 */
(function (window, document, undefined){
	this.ajax = function (method, url, data, timeout, success, error) {
		var client = createXMLHttpObject(), data, isTimeout = false, self = this;
		method = method.toLowerCase();
		if (typeof data === 'object') {
			data = stringify(data);
		}
		if (method === 'get' && data) {
			url += '?' + data;
			data = null;
		}
		client.onreadystatechange = function () {
			if (client.readyState === 4) {
				if (!isTimeout && ((client.status >= 200 && client.status < 300) || client.status == 304)) {
					success(client);
				}
				else {
					error(client);
				}
			}
		};
		client.open(method, url, true);
		method === 'post' && client.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		client.setRequestHeader('ajax', 'true');
		client.send(data);
		setTimeout(function () {isTimeout = true;}, timeout);
	};

	function createXMLHttpObject() {
        var XMLHttpFactories = [
            function () {return new XMLHttpRequest()},
            function () {return new ActiveXObject("Msxml2.XMLHTTP")},
            function () {return new ActiveXObject("Msxml3.XMLHTTP")},
            function () {return new ActiveXObject("Microsoft.XMLHTTP")}
        ];

        var xmlhttp = false, i, len;
        for (i = 0, len = XMLHttpFactories.length ; i < len ; i += 1) {
            try {
                xmlhttp = XMLHttpFactories[i]();
            }
            catch (e) {
                continue;
            }
            break;
        }

        createXMLHttpObject = XMLHttpFactories[i];
        return xmlhttp;
    }

	function stringify(parameters) {
        var params = [], p;
        for(p in parameters) {
            params.push(encodeURIComponent(p) + '=' + encodeURIComponent(parameters[p]));
        }
        return params.join('&');
    }
})(this, this.document);


