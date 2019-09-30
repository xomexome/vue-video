import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store"
import Toast from "./components/common/toast.js"
import promise from "es6-promise"
import VueLazyload from "vue-lazyload"
//根据屏幕适配font-size
import "./assets/js/rem"
//element-ui框架
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

promise.polyfill();
Vue.use(ElementUI)
Vue.use(Toast)
Vue.use(VueLazyload,{
    loading:'http://www.wclimb.site/images/imgLoading.svg'
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    //components: { App },
    //template: '<App/>'
    render: h => h(App)
})
