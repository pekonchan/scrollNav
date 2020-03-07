<template>
    <div class="scroll-nav">
        <div class="nav-bar-wrap" :style="{height: navHeight, width: navWidth}">
           <ul
                class="nav-bar submodule"
                :class="{'is-fixed': navBarFixed}"
                :style="{
                    top: navTop,
                    right: navRight,
                    left: navLeft,
                    bottom: navBottom,
                    width: navBarFixed ? navFixedWidth : 'auto',
                    height: navBarFixed ? navFixedHeight : '100%',
                    'line-height': `${height - 2}px`
                }">
                <li
                    v-for="item in menu"
                    :key="item.value"
                    :class="{'is-active': item.checked}"
                    @click="selectNav(item)">
                    {{item.label}}
                </li>
            </ul>
       </div>
       <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'ScrollNav',
    props: {
        menu: {
            required: true,
            type: Array,
            default () {
                // 传值格式：{label: '', value: null, checked: false}
                // value为对应内容的元素标识（可类名id名等元素标识）
                return [];
            }
        },
        // 只能是px作为最终单位，因为要垂直居中，用到line-height，用于计算scrollDeviation
        height: {
            type: Number,
            default: 52
        },
        width: {
            type: [Number, String],
            default: 'auto'
        },
        relativeName: { // 滚动条所在区域的名字（可类名id名等元素标识）
            required: true,
            type: String,
            default: ''
        },
        // 对滚动条滚动的高度做运算的值，由于滚动区域的offsetParent可能跟导航栏的offsetParent不一样，会存在差值
        // 所以判断导航栏是否达到固定条件是，需要对滚动区域的scrollTop结合该值做运算
        extraFixed: {
            type: Number,
            default: 0
        },
        // 用来对滚动时哪个导航需要被激活，做额外的偏差值运算判断
        // 在不吸顶的情况下，导航指定的内容只要滚动到滚动容器顶部就算到了该内容了的导航了，即滚动了【内容的offsetTop】的距离
        // 但是吸顶之后，只要滚动到吸顶导航栏底部就算到了指定导航内容了，所以相当于只要滚动【内容的offsetTop - 吸顶导航栏的高度】的距离就会到达临界值
        // 转换成公式来理解，c代表导航内容的offsetTop，s代表滚动的距离，吸顶导航栏高度为h。只要滚动距离大于等于上面说的临界值，即肯定到达了对应导航。
        // 因此公式为： s >= c - h， 即 s + h >= c 时，到达条件成立，因此滚动容器的scrollTop都要加上h，才是拿来判断的值
        // 当然上面说的只是一般的情况，还有滚动容器不是导航对应内容的offsetParent的情况，则需要加减其他偏差值，如padding等，
        // 所以这里的extraScroll就是表示这些偏差值，一般情况是跟上面的extraFixed等值的，这里我没有沿用extraFixed是因为，
        // 提供更多可能性给用户，有些用户可能不恰好就是用临界情况来区分内容落到哪个导航上，所以提供该值，让可以根据实际情况进行传值。
        extraScroll: {
            type: Number,
            default: 0
        },
        // 点击导航栏的导航，跳转到对应内容，设置滚动容器的scrollTop时，一般是等于内容的offsetTop，
        // 但是你可基于offsetTop做额外的偏差值加减运算，达到你想要的效果。这个额外的偏差值，就是该值
        extraNav: {
            type: Number,
            default: 0
        },
        contentName: { // 内容部分的名字（可类名id名等元素标识）
            required: true,
            type: Array,
            default: () => []
        },
        needFixed: { // 是否需要固定导航栏（吸顶）
            type: Boolean,
            default: true
        },
        top: { // 固定之后的top值
            type: [Number, String],
            default: 0
        },
        right: { // 固定之后的right值
            type: [Number, String],
            default: 'auto'
        },
        left: { // 固定之后的left值
            type: [Number, String],
            default: 'auto'
        },
        bottom: { // 固定之后的bottom值
            type: [Number, String],
            default: 'auto'
        },
        fixedWidth: { // 导航栏固定后的宽度
            type: [Number, String],
            default: '100%'
        },
        fixedHeight: { // 导航栏固定后的高度
            type: [Number, String],
            default: 52
        }
    },
    data () {
        return {
            offsetTops: {
                navBar: 0
            },
            navBarFixed: false,
            scrollContainer: null
        };
    },
    computed: {
        navHeight () {
            return this.createValue(this.height);
        },
        navWidth () {
            return this.createValue(this.width);
        },
        navTop () {
            return this.createValue(this.top);
        },
        navLeft () {
            return this.createValue(this.left);
        },
        navBottom () {
            return this.createValue(this.bottom);
        },
        navRight () {
            return this.createValue(this.right);
        },
        navFixedWidth () {
            return this.createValue(this.fixedWidth);
        },
        navFixedHeight () {
            return this.createValue(this.fixedHeight);
        },
        // 根据是否需要导航栏固定的条件下，区分生成滚动导航的偏差值
        scrollDeviation () {
            return this.needFixed ? this.height + this.extraScroll : this.extraScroll;
        },
        // 监听滚动事件的元素对象
        scrollTarget () {
            return this.relativeName.toLowerCase() === 'html' ? window : this.scrollContainer;
        },
        // tst () {
        //     return this.$slot.default
        // }
    },
    methods: {
        createValue (value) {
            return typeof value === 'number' ? `${value}px` : value;
        },
        /**
         * 选择标题跳到对应内容
         */
        selectNav (nav) {
            this.resetNavSelect();
            nav.checked = true;
            this.scrollContainer.scrollTop = document.querySelector(nav.value).offsetTop - this.scrollDeviation;
        },
        resetNavSelect () {
            this.menu.forEach(item => {
                item.checked = false;
            });
        },
        /**
         * 监听页面滚动
         */
        handleScroll () {
            const top = this.scrollContainer.scrollTop;
            // 这是用来判断目前滚动在于哪个导航上的值，对滚动容器scrollTop做了偏差值处理
            const fixedBaseTop = top + this.scrollDeviation;
            const menuLength = this.menu.length;
            if (this.needFixed) {
                // 这是控制导航栏吸顶 - 吸顶
                if ((top + this.extraFixed) >= this.offsetTops.navBar) {
                    this.navBarFixed = true;
                }
                // 这是控制导航栏吸顶 - 取消吸顶
                if ((top + this.extraFixed) < this.offsetTops.navBar) {
                    this.navBarFixed = false;
                }
            }
            this.resetNavSelect();
            // 滚动条到达底部就选中最后一个导航
            if (top + this.scrollContainer.clientHeight >= this.scrollContainer.scrollHeight) {
                this.menu[menuLength - 1].checked = true;
                return;
            }
            // 以下都为依据滚动自动选择对应导航
            for (let i = 0; i < menuLength - 1; i++) {
                if (fixedBaseTop >= this.offsetTops[`content${i}`] && fixedBaseTop < this.offsetTops[`content${i + 1}`]) {
                    this.menu[i].checked = true;
                    return;
                }
            }
            if (fixedBaseTop >= this.offsetTops[`content${menuLength - 1}`]) {
                this.menu[menuLength - 1].checked = true;
                return;
            }
            this.menu[0].checked = true;
        },
        /**
         * 计算页面的各个offsetTop，主要供父组件使用，用于当父组件内容发生高度变化时，重新计算offsetTop值
         */
        calcTop (recalNav) {
            this.$nextTick(() => {
                recalNav && (this.offsetTops.navBar = document.querySelector('.scroll-nav .nav-bar-wrap').offsetTop);
                this.contentName.forEach((item, index) => {
                    this.offsetTops[`content${index}`] = document.querySelector(item).offsetTop;
                });
            });
        },
        hanldeResize () {
            this.calcTop(true);
        }
    },
    mounted () {
        this.hanldeResize();
        this.scrollContainer = document.querySelector(this.relativeName);
        this.scrollTarget.addEventListener('scroll', this.handleScroll);
        // 当浏览器大小发生变化时，重新计算各个offsetTop
        window.addEventListener('resize', this.hanldeResize);
    },
    beforeDestroy () {
        this.scrollTarget.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.hanldeResize);
    }
};
</script>

<style lang="scss">
@import 'index';
</style>
