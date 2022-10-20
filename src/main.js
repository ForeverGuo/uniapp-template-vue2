import Vue from "vue";
import App from "./App";
import storage from "@/tools/storage.js";

Vue.config.productionTip = false;
App.mpType = "app";


// 本地缓存
Vue.prototype.$storage = storage;

const app = new Vue({
	...App,
});
app.$mount();
