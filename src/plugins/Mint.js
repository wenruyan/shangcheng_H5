import Vue from 'vue';
import { CellSwipe } from 'mint-ui';
import 'mint-ui/lib/style.css'
const components = {
  CellSwipe
};
Object.keys(components).forEach(key => {
  // Vue.use(components[key]);
  // console.log('key', components[key].name);
  Vue.component(components[key].name, components[key]);
});
