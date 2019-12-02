import Fly from 'flyio/dist/npm/fly';
import vue from '../main'
import store from '../store';
import _ from 'lodash';
import router from '../router';
import qs from 'qs';

const http = new Fly();

// 实例级配置

// if (process.env && process.env.NODE_ENV == 'production') {
//   http.config.baseURL = 'https://dietcoke.focus-base.com/api';
//   // http.config.baseURL = 'http://210.22.122.126:13000';
// } else {
//   http.config.baseURL = '/api';
// }
http.config.baseURL = '/api';
http.config.timeout = 1000000;
http.config.parseJson = false;
http.config.withCredentials = true;

// 添加请求拦截器
http.interceptors.request.use((request) => {
  // if (request.headers['Content-Type'].indexOf('multipart/form-data') < 0 && request.method == 'POST') {
  //   // 给所有请求添加自定义header
  //   request.headers['Content-Type'] = 'application/json;charset=UTF-8';
  //   let params = request.body;
  //   // params['companyCode'] = store.state.companyCode || undefined;
  //   request.body = params;
  // }
  !request.body && (request.body = {})
  let params = {};
  params.mid = 2510005310972000
  store.state.openid && (params.openid = store.state.openid)
  store.state.userId && (params.userId = store.state.userId)
  request.body = { // 接口调用传入的参数可以覆盖公共参数
    ...params,
    ...request.body
  }
  if (request.emulateJSON === false) {
    request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    request.body = qs.stringify(request.body)
  }
  console.log('request', request);
  // 打印出请求体
  // console.log('request', request);
  // if (request.method == 'POST') {
  // } else if (request.method == 'GET') {
  //     request.body['token'] = token;
  // }
  // 终止请求
  // var err=new Error("xxx")
  // err.request=request
  // return Promise.reject(new Error(""))

  // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  // if (request.url.indexOf('bpeClean') < 0) request.url += '/0vN4'
  return request;
});

http.interceptors.response.use(
  (response, promise) => {
    if (_.isString(response.data)) {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {

      }
    }
    // response.data = _.isString(response.data) ? JSON.parse(response.data) : response.data;
    let data = response.data;
    // console.log('response', data.rspCode);
    // switch (Number(data.rspCode)) {
    //     case 1: // 错误提示
    //         toast.clear(1);
    //         toast.show(data.rspMsg);
    //         return promise.reject(response);
    //     case 80001: // 未登录
    //         // toast.clear(800);
    //         // console.log('router http', router);
    //         // return;
    //         toast.clear(1);
    //         toast.show(data.rspMsg);
    //         // storage.remove('companyCode');
    //         storage.remove('loginInfo');
    //         storage.remove('openId');
    //         storage.remove('token');
    //         router.push({ name: 'acount-signin', query: { state: 3 } });
    //         return promise.reject(data);
    //     case 0: // 正常返回
    let specialCode = [1001, 1005]
    if (data.code && data.code != 200 && specialCode.indexOf(Number(data.code)) == -1) {
      vue.$dialog.toast({
        mes: '错误：' + data.msg,
        timeout: 1500,
        callback: () => {}
      });
      return promise.reject(data);
    } else if (Number(data.code) == 1005) {
      vue.$dialog.toast({
        mes: '登录失效，请重新登录',
        timeout: 1500,
        callback: () => {}
      });
      store.commit("updateUserId", '');
      store.commit("updateToken", '');
      router.push({ name: 'login-account' });
      return promise.reject(data);
    }
    return promise.resolve(data);
  }, (err, promise) => {
    console.log('interceptors err', err);
    if (err.status == 200) {
      return promise.resolve(err);
    }
    //  else if (err.status == 0) {
    //   return promise.reject(err);
    // }
    vue.$dialog.toast({
      mes: '服务器出错：' + err.message,
      timeout: 1500,
      callback: () => {}
    });
    return promise.reject(err);
  }
);

export default http;
