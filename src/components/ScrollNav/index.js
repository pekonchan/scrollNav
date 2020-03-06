import ScrollNav from './src';

const install = (Vue) => {
    Vue.component(ScrollNav.name, ScrollNav);
    if (window && window.Vue) {
        window.Vue.component(ScrollNav.name, ScrollNav);
    }
};

export {
    install
}