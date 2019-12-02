import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store/'
import mixins from './mixins/'
import './utils/libs/fastclick-1.0.6.js';
import './utils/index'

/* plugins */
import './plugins/YDUI'
import './plugins/Mint'
// import './plugins/Mescroll'
// import './plugins/element'
// import './plugins/bootstrap-vue'
// import './plugins/vue-ins-progress-bar'
// import './plugins/vue-quill-editor'
// import './plugins/ant-design-vue'

/* fa-fontIcon */
import './assets/scss/font-awesome-4.7.0/scss/font-awesome.scss'

/* customer SCSS */
import './assets/scss/base.scss'

/* debug console */
if (process.env && process.env.NODE_ENV != 'production') {
  let VConsole = require('vconsole/dist/vconsole.min.js')
  let vConsole = new VConsole()
  console.log('vConsole:', vConsole)
}

/* cancel click delay in mobile device */
window.FastClick.attach(document.body);

Vue.config.productionTip = false

Vue.mixin(mixins)

let userId = localStorage.getItem('userId')
let openid = localStorage.getItem('openid')
userId && store.commit('updateUserId', userId)
openid && store.commit('updateOpenid', openid)

let vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
export default vue
