import Vue from 'vue'
import Router from 'vue-router'
import mixins from '../mixins/index'
import store from '../store/'
// import Commodity from './commodity'

Vue.use(Router)

let routeList = [{
  path: '/',
  name: '/',
  // component: () => import('../views/login.vue'),
  redirect: {
    name: 'index'
  },
  meta: {
    title: '首页',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/index',
  name: 'index',
  component: () => import('../views/index.vue'),
  meta: {
    title: '首页',
    showTabbar: true,
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/mine',
  name: 'mine',
  component: () => import('../views/mine.vue'),
  meta: {
    title: '个人中心',
    showTabbar: true,
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/order-list',
  name: 'order-list',
  component: () => import('../views/order-list.vue'),
  meta: {
    title: '我的订单',
    keepAlive: true, // 此组件需要被缓存
    isBack: false // 用于判断上一个页面是哪个
  }
},
{
  path: '/order-detail',
  name: 'order-detail',
  component: () => import('../views/order-detail.vue'),
  meta: {
    title: '订单详情',
    keepAlive: false, // 此组件需要被缓存
    isBack: false // 用于判断上一个页面是哪个
  }
},
{
  path: '/card',
  name: 'card',
  component: () => import('../views/my-card.vue'),
  meta: {
    title: '我的卡券',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/card/detail',
  name: 'card-detail',
  component: () => import('../views/card-detail.vue'),
  meta: {
    title: '详情',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/card/recharge',
  name: 'card-recharge',
  component: () => import('../views/card-recharge.vue'),
  meta: {
    title: '卡券充值',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/search',
  name: 'search',
  component: () => import('../views/search.vue'),
  meta: {
    title: '搜索',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/commodity',
  name: 'commodity',
  component: () => import('../views/commodity.vue'),
  meta: {
    title: '商城',
    keepAlive: true, // 此组件需要被缓存
    isBack: false // 用于判断上一个页面是哪个
  }
},
{
  path: '/commodity/detail',
  name: 'commodity-detail',
  component: () => import('../views/commodity-detail.vue'),
  meta: {
    title: '商品详情',
    keepAlive: false, // 此组件需要被缓存
    isBack: false // 用于判断上一个页面是哪个
  }
},
{
  path: '/submit-order',
  name: 'submit-order',
  component: () => import('../views/submit-order.vue'),
  meta: {
    title: '提交订单',
    keepAlive: false // 此组件不需要被缓存
  }
},
{
  path: '/merch-bill',
  name: 'merch-bill',
  component: () => import('../views/merch-bill.vue'),
  meta: {
    title: '商品清单',
    keepAlive: false // 此组件不需要被缓存
  }
},
{
  path: '/order-tracking',
  name: 'order-tracking',
  component: () => import('../views/order-tracking.vue'),
  meta: {
    title: '订单跟踪',
    keepAlive: false // 此组件不需要被缓存
  }
},
{
  path: '/address-list',
  name: 'address-list',
  component: () => import('../views/address-list.vue'),
  meta: {
    title: '收货地址',
    keepAlive: false // 此组件不需要被缓存
  }
},
{
  path: '/address-add',
  name: 'address-add',
  component: () => import('../views/address-add.vue'),
  meta: {
    title: '添加收货地址',
    keepAlive: false // 此组件不需要被缓存
  }
},
{
  path: '/userInfo',
  name: 'userInfo',
  component: () => import('../views/userInfo/userInfo.vue'),
  meta: {
    title: '个人信息',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/nickname',
  name: 'userInfo-nickname',
  component: () => import('../views/userInfo/nickname.vue'),
  meta: {
    title: '昵称',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/replace-phone-step1',
  name: 'replace-phone-step1',
  component: () => import('../views/userInfo/replacePhone-step1.vue'),
  meta: {
    title: '更换手机号',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/replace-phone-step2',
  name: 'replace-phone-step2',
  component: () => import('../views/userInfo/replacePhone-step2.vue'),
  meta: {
    title: '更换手机号',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/replace-phone-step3',
  name: 'replace-phone-step3',
  component: () => import('../views/userInfo/replacePhone-step3.vue'),
  meta: {
    title: '更换手机号',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/replace-phone-step4',
  name: 'replace-phone-step4',
  component: () => import('../views/userInfo/replacePhone-step4.vue'),
  meta: {
    title: '更换手机号',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/amend-password',
  name: 'amend-password',
  component: () => import('../views/userInfo/amendPassword.vue'),
  meta: {
    title: '修改密码',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/amend-password-step1',
  name: 'amend-password-step1',
  component: () => import('../views/userInfo/amendPassword-step1.vue'),
  meta: {
    title: '修改密码',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/amend-password-step2',
  name: 'amend-password-step2',
  component: () => import('../views/userInfo/amendPassword-step2.vue'),
  meta: {
    title: '修改密码',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/amend-password-step3',
  name: 'amend-password-step3',
  component: () => import('../views/userInfo/amendPassword-step3.vue'),
  meta: {
    title: '修改密码',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/main',
  name: 'main',
  component: () => import('../views/main.vue'),
  meta: {
    title: '测试',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/register',
  name: 'register',
  component: () => import('../views/login/register.vue'),
  meta: {
    title: '注册',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/login-account',
  name: 'login-account',
  component: () => import('../views/login/login-account.vue'),
  meta: {
    title: '登录',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/login-sms',
  name: 'login-sms',
  component: () => import('../views/login/login-sms.vue'),
  meta: {
    title: '登录',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/login-sms-step1',
  name: 'login-sms-step1',
  component: () => import('../views/login/login-sms-step1.vue'),
  meta: {
    title: '登录',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/login-sms-step2',
  name: 'login-sms-step2',
  component: () => import('../views/login/login-sms-step2.vue'),
  meta: {
    title: '登录',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/forget-password-step1',
  name: 'forget-password-step1',
  component: () => import('../views/login/forgetPassword-step1.vue'),
  meta: {
    title: '忘记密码',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/forget-password-step2',
  name: 'forget-password-step2',
  component: () => import('../views/login/forgetPassword-step2.vue'),
  meta: {
    title: '忘记密码',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/forget-password-step3',
  name: 'forget-password-step3',
  component: () => import('../views/login/forgetPassword-step3.vue'),
  meta: {
    title: '忘记密码',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/soccer-exchange',
  name: 'soccer-exchange',
  component: () => import('../views/soccer-exchange.vue'),
  meta: {
    title: '积分兑换',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/soccer-detail',
  name: 'soccer-detail',
  component: () => import('../views/soccer-detail.vue'),
  meta: {
    title: '积分明细',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/logistic-info',
  name: 'logistic-info',
  component: () => import('../views/logistic-info.vue'),
  meta: {
    title: '物流信息',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/collection',
  name: 'collection',
  component: () => import('../views/collection.vue'),
  meta: {
    title: '我的收藏',
    keepAlive: false, // 此组件需要被缓存
    isBack: false // 用于判断上一个页面是哪个
  }
},
{
  path: '/about-us',
  name: 'about-us',
  component: () => import('../views/about-us.vue'),
  meta: {
    title: '关于我们',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/contact-us',
  name: 'contact-us',
  component: () => import('../views/contact-us.vue'),
  meta: {
    title: '联系我们',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/protocol',
  name: 'protocol',
  component: () => import('../views/protocol.vue'),
  meta: {
    title: '用户...隐私说明',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/network',
  name: 'network',
  component: () => import('../views/no-network.vue'),
  meta: {
    title: '无网络',
    keepAlive: false // 此组件需要被缓存
  }
},
{
  path: '/category',
  name: 'category',
  component: () => import('../views/category.vue'),
  meta: {
    showTabbar: true,
    title: '分类'
  }
},
{
  path: '/shopping-cart',
  name: 'shopping-cart',
  component: () => import('../views/shopping-cart.vue'),
  meta: {
    showTabbar: true,
    title: '购物车'
  }
}
]

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routeList
})

// 钩子
router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from)
  // let changeStatusBarColor = ['index', 'mine']
  // if (changeStatusBarColor.indexOf(to.name) > -1) {
  //   if (to.name == changeStatusBarColor[0]) {
  //     mixins.methods.changeStatusColor('light', '#325AF7')
  //   } else if (to.name == changeStatusBarColor[1]) {
  //     mixins.methods.changeStatusColor('light', '#3F73FF')
  //   }
  // } else {
  //   mixins.methods.changeStatusColor('dark', '#FFFFFF')
  // }
  // let noAuthPage = ['login']
  // if (noAuthPage.indexOf(to.name) == -1) {
  //   if (!store.state.userInfo.id) {
  //     next({ name: 'login', replace: true })
  //   }
  // }
  if (window.api) {
    let connectionType = window.api.connectionType;
    if (connectionType == 'none' && from.path != '/network') {
      next({
        path: '/network'
      })
      return
    }
  }
  if (to.name == 'index' && !from.name && window.navigator.userAgent.indexOf('FocusApp') > -1) {
    // 首次进入首页时，同时是在app中, apiready执行后再进入页面   改变statusbar颜色，获取系统，判断微信是否安装
    window.apiready = () => {
      if (!localStorage.getItem("hideGuide")) {
        store.commit("updateHideTabbar", false);
        mixins.methods.changeStatusColor("dark", "#FFFFFF");
      } else {
        mixins.methods.changeStatusColor("light", "#3b62ff");
      }
      // 用户系统android/ios
      let systemType = window.api.systemType;
      store.commit("updateSystemInfo", {
        systemType: systemType
      });
      let wx = window.api.require("wx");
      wx.isInstalled(function(ret, err) {
        if (ret.installed) {
          store.commit("updateHasAppStatus", {
            ...store.state.hasApp,
            wechat: true
          });
        } else {
          store.commit("updateHasAppStatus", {
            ...store.state.hasApp,
            wechat: false
          });
        }
      });
      next();
    };
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  // const reloadIntercepter = (to, from) => {
  // if (from.name == "index" && to.name == "commodity-detail") {
  //   let isRefresh = sessionStorage.get('isRefresh');
  //   if (isRefresh == "0") {
  //     sessionStorage.setItem('isRefresh', null);
  //     window.location.reload()
  //   } else {
  //     sessionStorage.set('isRefresh', 0);
  //   }
  // } else if (from.name == "commodity-detail" && to.name == "index") {
  //   sessionStorage.set('isRefresh', 0);
  // }
  // }
  console.log('Route afterEach')
  let changeStatusBarColor = ['index', 'mine', 'card-detail', 'contact-us', 'card-recharge']
  if (changeStatusBarColor.indexOf(to.name) > -1) {
    if (to.name == changeStatusBarColor[0]) {
      mixins.methods.changeStatusColor('light', '#3b62ff')
    } else if (to.name == changeStatusBarColor[1]) {
      mixins.methods.changeStatusColor('light', '#3F73FF')
    } else if (to.name == changeStatusBarColor[2]) {
      mixins.methods.changeStatusColor('light', '#4189FF')
    } else if (to.name == changeStatusBarColor[3]) {
      mixins.methods.changeStatusColor('light', '#4189FF')
    } else if (to.name == changeStatusBarColor[4]) {
      mixins.methods.changeStatusColor('light', '#4189FF')
    }
  } else {
    mixins.methods.changeStatusColor('dark', '#FFFFFF')
  }

  mixins.methods.cancleCustomBackKey()
  // 每次路由跳转均将安卓返回键设为默认事件
  window.onKeyBackEvent = () => {
    console.log(mixins.methods.GO, window.customKeyBackEvent)
    // mixins.methods.GO(-1)
    router.isBack = true
    router.go(-1)
  }
});

export default router
