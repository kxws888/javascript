(function ($) {
	/**
    * Class
    * @Author NHN Japan RIA
    * @name jQuery.Class
    * @param {String} nameSpace {Object} method {Boolean} extend
    */
    jQuery.extend({
        Class: function(ns,obj,extend) {
            var typeClass = function(){
                var _this = this;
                var a = [];
                while (typeof _this.$super != "undefined") {
                    var $super = _this.$super;
                    _this.$super = new Object;
                    for (var x in $super) {
                        _this.$super[x] = $super[x];
                    }
                    _this.$super.$this = this;
                    if (typeof _this.$super.init == "function") a[a.length] = _this;
                    _this = _this.$super;
                }
                for (var i = a.length - 1; i > -1; i--) a[i].$super.init.apply(a[i].$super, arguments);
                if (this.init instanceof Function) this.init.apply(this, arguments);
            }
            typeClass.prototype = obj;
            typeClass.prototype.constructor = typeClass;
            typeClass._extend = jQuery.Class._extend;

            if(extend) return typeClass;

            var pkg = jQuery.Class._verifyNameSpace(ns);
            pkg.container[pkg.name] = typeClass;
            //pkg.container[pkg.name].name = pkg.name;
        }
    });

    jQuery.extend(jQuery.Class,{
        _verifyNameSpace: function(ns){
            if(ns=="")return null;
            var names=ns.split(".");
            var componentName="",parent=window;
            if(names.length==1){
                componentName=names.pop()
            }else{
                for(var i=0,length=names.length;i<length;i++){
                    var n=names[i];
                    if(i==names.length-1){
                        componentName=n;
                        break
                    }
                    if(parent[n]==undefined)parent[n]={};
                    parent=parent[n]
                }
            }
            return{container:parent,name:componentName}
        },
        _extend: function (superClass) {
            this.prototype.$super = new Object;
            var superFunc = function (m, superClass, func) {
                if (m != 'constructor' && func.toString().indexOf("$super") > -1) {
                    var funcArg = func.toString().replace(/function\s*\(([^\)]*)[\w\W]*/g, "$1").split(",");
                    var funcStr = func.toString().replace(/function\s*\(.*\)\s*\{/, "").replace(/this\.\$super/g, "this.$super.$super");
                    funcStr = funcStr.substr(0, funcStr.length - 1);
                    func = superClass[m] = new Function(funcArg, funcStr);
                }
                return function () {
                    var f = this.$this[m];
                    var t = this.$this;
                    var r = (t[m] = func).apply(t, arguments);
                    t[m] = f;
                    return r;
                };
            };
            for (var x in superClass.prototype) {
                if (typeof this.prototype[x] == "undefined" && x != "init") this.prototype[x] = superClass.prototype[x];
                if (typeof superClass.prototype[x] == "function") {
                    this.prototype.$super[x] = superFunc(x, superClass, superClass.prototype[x]);
                } else {
                    this.prototype.$super[x] = superClass.prototype[x];
                }
            }
            for (var x in superClass) {
                if (x == "prototype") continue;
                this[x] = superClass[x];
            }
            return this;
        },
        extend: function(superClass,ns,obj){
            var pkg = jQuery.Class._verifyNameSpace(ns)
            pkg.container[pkg.name] = jQuery.Class(ns,obj,true)._extend(superClass);
            //pkg.container[pkg.name].name = pkg.name;
        }
    });
})(jQuery);
