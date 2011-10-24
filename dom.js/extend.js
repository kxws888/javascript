/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass() { }
 * ParentClass.prototype.foo = function() { }
 *
 * function ChildClass() {}
 * extend(ChildClass, ParentClass);
 *
 * var child = new ChildClass();
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.$super.foo.call(this);
 *   // other code
 * };
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 * @author google closure library
 * @see http://code.google.com/p/closure-library/source/browse/trunk/closure/goog/base.js
 */
(function (window, document, undefined){
    this.extend = function (childCtor, parentCtor) {
        function tempCtor() {};
        tempCtor.prototype = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.$super = parentCtor.prototype;
        childCtor.prototype.constructor = childCtor;
    }
})(this, this.document);
