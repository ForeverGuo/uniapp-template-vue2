import Vue from 'vue'
import App from './App'
import store from '@/store/store'

import share from '@/utils/share.js'

import wxIsLogin from '@/components/wx_login/wx_login.js'

import uView from 'uview-ui'
Vue.use(uView)

var ss = "134"    

Vue.config.productionTip = false

Vue.mixin({
    mixins: [share, wxIsLogin]
})

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
