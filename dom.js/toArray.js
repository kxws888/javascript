/**
 * Turn an enumerated object to a native array object.
 *
 * Usage:
 * <pre>
 * //document.getElementsByTagName() function returns a live NodeList object which updates itself with the DOM tree automatically,
 * //sometimes this feature may cause unexpected problem, use toArray() to turn it to a 'static' array object
 * toArray(document.getElementsByTagName('div'));
 * </pre>
 *
 * @param {Object} An enumerated object
 * @return {Array} Native Array object contains the same element of original object
 */
(function (window, document, undefined){
    this.toArray = function (obj) {
        try {
            return Array.prototype.slice.call(obj, 0);
        }
        catch (e) {
            this.toArray = function(obj) {
                var ret = [], i, len;
                if (typeof obj.length === "number") {//ie bug string
                    for (i = 0, len = obj.length; i < len; i += 1) {
                        ret[ret.length] = obj[i];
                    }
                } else {
                    for (i = 0; obj[i]; i += 1) {
                        ret[ret.length] = obj[i];
                    }
                }

                return ret;
            };
            return this.toArray(obj);
        }
    }
})(this, this.document);

