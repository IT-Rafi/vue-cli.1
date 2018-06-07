import Vue from 'vue'
import App from './previousRanking.vue'
import utils from '../../common/js/utils.js'
Vue.use(utils)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})