import ScrollNav from './src';

ScrollNav.install = (Vue) => {
    Vue.component(ScrollNav.name, ScrollNav);
};

if (window && window.Vue) {
    ScrollNav.install(window.Vue);
}

export default ScrollNav