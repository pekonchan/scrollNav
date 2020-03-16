# vue-scroll-nav

## 描述
此为`vue.js`版滚动导航组件，实现
- 滚动时，根据滚动距离判断当前内容所属哪个导航
- 点击导航，页面滚动到内容对应位置
- 可控制导航栏是否吸附固定，如吸顶效果，即滚动一定距离后，导航栏固定起来，不会被滚动出可视区域
- 可用在页面任何位置上，不一定是顶部导航这种简单应用哦，可以复杂型应用
- 在浏览器支持下，可以采用`position: sticky`方式实现固定

此处举一个稍微复杂点的情况：
![image](https://user-gold-cdn.xitu.io/2020/3/9/170bec2989d85e98?w=1180&h=847&f=gif&s=751545)

具体深度解释该组件的一个开发思路，可看此文章[滚动导航+吸顶合并方案（含stikcy详解）](https://juejin.im/post/5e66152be51d4527235b7067)

## 安装
** 该插件不包含`vue.js`的引入，请你自行引入`vue.js` **

`<script>`方式直接引入`lib/vue-scroll-nav.umd.min.js`，如：
```
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="node_modules/vue-scroll-nav/lib/vue-scroll-nav.umd.min.js"></script>
```
这样就可以在`Vue`应用里直接使用`<Scroll-Nav>`标签了。

npm方式：
```
npm i vue-scroll-nav
```
引入该插件之后，得注册组件
```js
import Vue from 'vue';
import scrollNav from 'vue-scroll-nav';

Vue.use(scrollNav);
```

## 使用介绍
这是一个简单的使用情况
```
<Scroll-Nav
    ref="scrollNav"
    :menu="[
        { label: '导航1', checked: true },
        { label: '导航2' },
        { label: '导航3' }
    ]"
    :height="52"
    relativeName="html">
    <div>导航1内容</div>
    <div>导航2内容</div>
    <div>导航3内容</div>
</Scroll-Nav>
```
导航栏的选项就是`menu`属性的数组选项，导航栏的高度为`52px`，引发滚动的容器是`html`（即滚动条在`html`上），导航选项对应的内容就是里面的三个`div`。
上面就实现了，当滚动条进行滚动时，会根据滚动的距离，判断导航栏是否被固定住，以及当前滚动的位置对应哪个导航选项的内容；点击导航选项也会跳转到对应内容开头处。

## Props
插件提供了足够的属性，让你针对不同的复杂情况来自定义它的行为。
- `menu`：必填。导航栏选项，值为数组，元素固定格式为`{label: 'xxx', checked: false}`，`label`为导航的名字，`checked`是来控制导航被选中样式的
- `height`：导航栏的高度，一般是指未固定前的高度，值为`Number` or `String`类型，传入数字类型时，默认为`px`默认值为`52px`。
- `width`：导航栏的宽度，一般是指未固定前的宽度，值为`Number` or `String`类型，传入数字类型时，默认为`px`；默认值为`100%`。
- `fixedHeight`：导航栏的高度，指固定之后的高度，值为`Number` or `String`类型，传入数字类型时，默认为`px`。导航栏固定后的高度默认按照设置了的`height`属性
- `fixedHeight`：导航栏的宽度，指固定之后的宽度，值为`Number` or `String`类型，传入数字类型时，默认为`px`。导航栏固定后的宽度默认按照设置了的`width`属性
- `relativeName`：滚动条所在元素的名字（可类名id名元素名等元素标识），如果是在`html`上，请直接传`'html'`，值为`String`类型，默认值为`html`
- `extraFixed`：对滚动条滚动的高度做运算的值，由于滚动区域的offsetParent可能跟导航栏的offsetParent不一样，会存在差值，所以判断导航栏是否达到固定条件是，需要对滚动区域的scrollTop结合该值做运算，值为`Number`类型，默认值是`0`。该属性可能不好理解，可看开头说的文章，了解具体情况。
- `extraScroll`：用来对滚动时哪个导航需要被激活，做额外的偏差值运算判断，在不吸顶的情况下，导航指定的内容只要滚动到滚动容器顶部就算到了该内容了的导航了，即滚动了【内容的offsetTop】的距离，但是吸顶之后，只要滚动到吸顶导航栏底部就算到了指定导航内容了，所以相当于只要滚动【内容的offsetTop - 吸顶导航栏的高度】的距离就会到达临界值。转换成公式来理解，c代表导航内容的offsetTop，s代表滚动的距离，吸顶导航栏高度为h。只要滚动距离大于等于上面说的临界值，即肯定到达了对应导航。因此公式为： s >= c - h， 即 s + h >= c 时，到达条件成立，因此滚动容器的scrollTop都要加上h，才是拿来判断的值。当然上面说的只是一般的情况，还有滚动容器不是导航对应内容的offsetParent的情况，则需要加减【其他偏差值】，如padding等，所以这里的extraScroll就是表示这些【其他偏差值】，一般情况是跟上面的extraFixed等值的，这里我没有沿用extraFixed是因为，提供更多可能性给用户，有些用户可能不恰好就是用临界情况来区分内容落到哪个导航上，所以提供该值，让可以根据实际情况进行传值。但是不设置该值时，会默认沿用extraFixed的值。了解具体情况。
- `needFixed`：是否需要固定导航栏，如吸顶情况。值为`Boolean`类型，默认是`true`。
- `top`：导航栏固定之后的top值，值为`Number`,`String`类型，默认是`0`。
- `right`：导航栏固定之后的top值，值为`Number`,`String`类型，默认是`auto`。
- `left`：导航栏固定之后的top值，值为`Number`,`String`类型，默认是`auto`。
- `bottom`：导航栏固定之后的top值，值为`Number`,`String`类型，默认是`auto`。
- `color`：导航栏被选中的颜色，包括文字颜色和`border-bottom`颜色。值为`String`类型，默认是`#387af6`。
- `useSticky`：在浏览器支持的情况下，是否采用`position:sticky`的方式实现导航栏固定。值为`Boolean`类型，默认是`true`。提供该值，主要是考虑到，如果页面的结构十分复杂，层级很多，有些情况下是无法使用`sticky`或者说不方便计算实现`sticky`的阈值时，就关闭该实现方式吧。
- `stickyTop`：在实现`sticky`方式下，导航栏固定之后的top值，值为`Number`,`String`类型，如果不设置该值，默认跟随`top`值。
- `stickyLeft`：在实现`sticky`方式下，导航栏固定之后的left值，值为`Number`,`String`类型，如果不设置该值，默认跟随`left`值。
- `stickyRight`：在实现`sticky`方式下，导航栏固定之后的right值，值为`Number`,`String`类型，如果不设置该值，默认跟随`right`值。
- `stickyBottom`：在实现`sticky`方式下，导航栏固定之后的bottom值，值为`Number`,`String`类型，如果不设置该值，默认跟随`bottom`值。

## Method

### calcTop
该组件暴露出一个名为`calcTop`的方法。主要是用来当页面内容发生变化，可能会引起各项内容的宽高发生变化，导致实际获取的导航栏和导航内容宽高发生变化，进而引起`offsetTop`的变化。

该组件在不支持`sticky`的浏览器里，会采用传统的监听`scroll`事件，利用滚动距离和各项内容的`offsetTop`进行比较判断。

因为，当你的内容发生变化后（如发送请求加载数据，改变浏览器页面大小等），你需要手动调用`calcTop`方法，及时更新最新的`offsetTop`值。
```
this.$refs.scrollNav.calcTop();
```
默认是只会计算导航所对应内容的`offsetTop`，如果你需要计算导航栏的话，那么要传`true`
```
this.$refs.scrollNav.calcTop(true);
```

### isSupportSticky
该方法可以告诉你，浏览器支持`position: sticky`的情况，返回值为浏览器支持的`sticky`值，即有前缀还是没前缀，抑或返回`''`，如果返回空字符串，那么就是代表浏览器不支持`sticky`

## Support us
该组件或许还存在不足之处，或者你的使用场景更广阔，如果你有兴趣的话，可以一起努力完善这个组件。期待你的加入

[github](https://github.com/pekonchan/scrollNav)

有问题，也欢迎提出。