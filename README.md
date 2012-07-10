Javascript Tookit
==================================================

oop.js
--------------------------------------

* extend extend(childctr, parentctr)

  继承
  ```
  function A() {
    this.a = 'a';
  }
  function B() {}
  extend(B, A)
  ```
* mixin mixin(childctr, interface*)

  聚合
  ```
  var A = {
    a: 'a'
  }
  function B() {}
  mixin(B, A)
  ```
* class class([parentctr], [interface*], prop)
  
  Class-style继承
  ```
  function A() {
    this.a = 'a';
  }
  class(A, {
    init: function () {}
  })
  ```

waterfall.js
--------------------------------------
瀑布流实现，参数支持CSS3 Column

参数说明
* colWidth<'auto'>:列宽度
* colCount<'auto'>:列数
* colGap<10>:列间距
* verticalGap<10>:垂直块间距
* autoExpand<true>:自动扩展列宽度以充满容器
* container<'body'>:容器
* template<{}>:如果数据单元包含type属性，可以为每一种类型指定不同的模板，type为键值。如果只有一种type类型，直接指定字符串模板，无需构造哈希对象
* rule<function (t) {}>:根据type进行特殊排列, 根据type判断返回'left'/'right'可以使对应的类型块一直放在最左边/最右边

实例
```
new waterfall({
    colWidth: 234,
    colGap: 12,
    verticalGap: 15,
    autoExpand: false,
    template: {
      image: '<img src="<%=data.pic%>">',
      text: '<p><%=data.text%></p>'
    },
    rule: function (t) {
      if (t === 'image') {
        return 'right';
    }
});
```