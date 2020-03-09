<template>
  <div id="app">
    <div class="top-section"></div>
    <Scroll-Nav
      ref="scrollNav"
      :menu="navs"
      :height="52"
      :extraFixed="-24"
      relativeName="html">
      <div class="content1">导航1内容</div>
      <div class="content2">导航2内容</div>
      <div class="content3">导航3内容</div>
    </Scroll-Nav>
  </div>
</template>

<script>
import ScrollNav from './components/ScrollNav/src';

export default {
  name: 'App',
  components: {
    ScrollNav
  },
  data () {
    return {
      navs: [
        {
          label: '导航1',
          value: '.content1',
          checked: true
        },
        {
          label: '导航2',
          value: '.content2',
          checked: false
        },
        {
          label: '导航3',
          value: '.content3',
          checked: false
        }
      ]
    };
  }
}
</script>

<style lang="scss">
  body {
    margin: 0;
    padding-top: 24px; // 故意设置，让组件传输偏差值进行计算
  }
  #app {
    position: relative; // 故意把导航和导航内容的`offsetParent`变成`#app`
  }
  .top-section {
      height: 200px;
      background: #dbdbdb;
  }
  %content {
    margin-top: 16px;
    background: #dbdbdb;
    height: 600px;
  }
  .content1 {
    @extend %content;
  }
  .content2 {
    @extend %content;
  }
  .content3 {
    @extend %content;
  }
</style>