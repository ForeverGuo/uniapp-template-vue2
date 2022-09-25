import * as types from '../mutation-types'

const state = {
	userInfo: {	},
}
const actions = {}
const getters = {
	userInfo: state => state.userInfo,
}
const mutations = {
	[types.SETUSERINFO](state, data) {
    console.log(state, data)
  }
}

export default {
	state,
	actions,
	getters,
	mutations
}
