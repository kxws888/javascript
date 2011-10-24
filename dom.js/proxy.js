/**
 * Takes a function and returns a new one that will always have a particular context.
 *
 * Usage:
 * <pre>
 * var obj1 = {
 *     fn: function () {
 *         console.log(this);
 *     }
 * }
 * //execute obj1.fn in the window object context
 * proxy(obj1.fn, window)();
 * </pre>
 *
 * @param {Function} The function whose context will be changed.
 * @param {Object} The object to which the context (this) of the function should be set.
 * @return {Function} The new function whose context has been changed
 */
(function (window, document, undefined){
    this.proxy = function (fn, obj) {
        return function () {
            return fn.apply(obj, arguments);
        }
    }
})(this, this.document);
