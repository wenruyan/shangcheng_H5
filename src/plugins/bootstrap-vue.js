import Vue from 'vue';
import { Dropdown, Tabs } from 'bootstrap-vue/es/components';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
const components = {
  Dropdown,
  Tabs
};
Object.keys(components).forEach(key => {
  Vue.use(components[key]);
  // console.log('key', components[key].name);
  // Vue.component(components[key].name, components[key]);
});
