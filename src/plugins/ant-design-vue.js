import Vue from 'vue';
import { Steps } from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/lib/steps/style'
Vue.config.productionTip = false
const components = {
  Steps
};
Object.keys(components).forEach(key => {
  Vue.use(components[key]);
  // console.log('key', components[key].name);
  // Vue.component(components[key].name, components[key]);
});
