import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as d3 from "d3";
// 引入rem,当窗口缩小放大的时候 页面元素会等比例放大和缩小
import "@/common/js/rem";

Vue.config.productionTip = false;

Vue.prototype.$d3 = d3;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
