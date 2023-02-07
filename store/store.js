import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from './cart.js'
import moduleUser from './user.js'

Vue.use(Vuex);

export default new Vuex.Store({
   modules:{
    moduleCart,
	 m_user: moduleUser,
   }
})