import Vue from 'vue';
import http from './http';
import router from '../router';
import store from '../store';
import dayJs from 'dayjs';
import _ from 'lodash';

window.$http = Vue.prototype.$http = http;
window.$store = Vue.prototype.$store = store;
window.$router = router;
window.moment = Vue.prototype.moment = dayJs;
window._ = Vue.prototype._ = _;
