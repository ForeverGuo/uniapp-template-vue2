/*
 * @Description:
 * @Version:
 * @Author: grant
 * @LastEditors: Do not edit
 */
import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common
  },
  strict: process.env.NODE_ENV !== 'production' // 线上环境关掉
})
