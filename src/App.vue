<template>
  <div id="app">
    <div class="top-section"></div>
    <Scroll-Nav
      ref="scrollNav"
      :menu="navs"
      :height="52"
      :extraFixed="-24"
      relativeName="html">
      <div class="content">导航1内容</div>
      <div class="content">导航2内容</div>
      <div class="content">导航3内容</div>
      <div class="content">导航4内容</div>
    </Scroll-Nav>
  </div>
</template>

<script>
import ScrollNav from '../packages';

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
          checked: true
        },
        {
          label: '导航2'
        },
        {
          label: '导航3'
        },
        {
          label: '导航4'
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
    background-color: #f5f6fa;
  }
  #app {
    position: relative; // 故意把导航和导航内容的`offsetParent`变成`#app`
  }
  %block {
    border-radius: 5px;
    box-shadow: 0 1px 8px 4px rgba(0, 0, 0, 0.02);
    background: #ffffff;
  }
  .top-section {
    margin-bottom: 16px;
    height: 200px;
    @extend %block;
  }
  .content {
    margin-top: 16px;
    height: 600px;
    @extend %block;
  }
</style>