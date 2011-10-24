/**
 * Removes whitespace from both ends of the string.
 *
 * Usage:
 * <pre>
 * trim("  hello, how are you?  ");
 * //will output
 * "hello, how are you?"
 * </pre>
 *
 * @param {String} The string to trim.
 * @return {String} The string stripped of whitespace from both ends.
 */
(function (window, document, undefined){
    this.trim = function (str) {
        if (str.trim) {
            return str.trim();
        }
        else {
            return str.replace(/^\s+|\s+$/, '');
        }
    }
})(this, this.document);
