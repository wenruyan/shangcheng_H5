import Vue from 'vue'
import Vuex from 'vuex'
import $http from '../utils/http'
import vue from '../main'
Vue.use(Vuex)

function getEnv (resolve, commit) {
  window.wx && window.wx.miniProgram.getEnv((res) => {
    if (res.miniprogram) {
      // alert("在小程序里");
      commit('updateRuntimeEnv', 'wxmp')
    } else {
      commit('updateRuntimeEnv', 'wxbrowser')
      // alert("不在小程序里");
    }
  })
  resolve()
}
export default new Vuex.Store({
  state: {
    // userId: '2530820875551232',
    // token: '123456',
    userId: '',
    token: '',
    phone: '',
    userInfo: {
      username: 'zht',
      company_no: ''
    },
    systemInfo: {},
    tabbarRoute: ['/index', '/mine'],
    inputPhone: '',
    transitionName: 'slide-left',
    defaultAddress: {},
    choosedAddress: {},
    buyGoodsInfo: {},
    mallPageData: {},
    hideTabbar: true,
    hasApp: {
      wechat: false
    },
    runtimeEnv: '', // 普通浏览器browser, 微信浏览器wxbrowser，微信小程序wxmp
    openid: '',
    cartCount: 0, // 购物车商品数量
    companyInfo: {
      companyNo: ''
    },
    searchPlaceholder: '',
    merchBillData: []
  },
  mutations: {
    updateMerchBillData(state, change) {
      state.merchBillData = change || [];
    },
    updateBugGoodsInfo(state, change) {
      state.buyGoodsInfo = change || {};
    },
    updateChoosedAddress(state, change) {
      state.choosedAddress = change || {};
    },
    updateDefaultAddress(state, change) {
      state.defaultAddress = change || {};
    },
    updateToken(state, change) {
      state.token = change || '';
      localStorage.setItem('token', state.token)
    },
    updateUserId(state, change) {
      state.userId = change || '';
      localStorage.setItem('userId', state.userId)
    },
    updateUserInfo(state, change) {
      state.userInfo = change || {};
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    },
    updateSystemInfo(state, change) {
      state.systemInfo = {
        ...state.systemInfo,
        ...change
      };
    },
    updateInputPhone(state, change) {
      state.inputPhone = change || '';
    },
    updatePhone(state, change) {
      state.phone = change || '';
    },
    updateTransitionName(state, change) {
      state.transitionName = change || 'slide-left';
    },
    mallPageData(state, change) {
      state.mallPageData = change || {};
      sessionStorage.setItem('mallPageData', JSON.stringify(state.mallPageData))
    },
    updateHideTabbar(state, change) {
      state.hideTabbar = change || false;
    },
    updateHasAppStatus(state, change) {
      state.hasApp = change || false;
    },
    updateRuntimeEnv(state, change) {
      state.runtimeEnv = change || '';
    },
    updateOpenid(state, change) {
      state.openid = change || '';
      localStorage.setItem('openid', state.openid)
    },
    updateCartCount(state, change) { // 直接设置购物车数量
      state.cartCount = change || 0;
    },
    increaseCartCount(state, change = 1) { // 购物车数量增加, 可以传入数量，不传+1
      state.cartCount += change
    },
    decreaseCartCount(state, change = 1) { // 购物车数量减少, 可以传入数量，不传-1
      if (state.cartCount < 1) {
        state.cartCount = 0
      } else {
        state.cartCount -= change
      }
    },
    updateSearchPlaceholder(state, change) { // 购物车数量增加
      state.searchPlaceholder = change || ''
    }
  },
  actions: {
    getRuntimeEnv ({ commit }) { // 获取当前运行环境: 普通浏览器browser, 微信浏览器wxbrowser，微信小程序wxmp
      return new Promise((resolve, reject) => {
        var ua = navigator.userAgent.toLowerCase();
        // ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          // JSBridge加载完成时获取运行环境
          if (window.WeixinJSBridge) {
            getEnv(resolve, commit)
          } else {
            document.addEventListener("WeixinJSBridgeReady", () => {
              getEnv(resolve, commit)
            })
          }
        } else {
          commit('updateRuntimeEnv', 'browser')
          // alert('不在微信里');
          resolve()
        }
      })
    },
    getOpenid ({ commit, state }) { // 获取openId，步骤：先授权，再将code交给后台换取
      return new Promise((resolve, reject) => {
        if (state.runtimeEnv == 'wxbrowser') {
          if (state.openid) {
            resolve()
          } else { // openid不存在，需要授权获取
            if (vue.$route.query.code) { // 存在code，说明是授权返回
              console.log('授权成功')
              $http
                .get("/Focus-BladeX-BootX/wechatuserinfo/wxOfficialAccounts", {
                  code: vue.$route.query.code,
                  wxType: "10"
                  // mid: '2510005310999000' // 测试公众号
                })
                .then(res => {
                  // 拿openid
                  commit("updateOpenid", res.data.openId || 'oUBgh1ExtY17y14yF_UJp4EeQHC0');
                  resolve()
                });
            } else { // 此时不存在code，需要跳转授权
              let wxAuthUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize' // 默认授权地址
              // if (info.serverEnv == 'uat' || info.serverEnv == 'sit')
              if (process.env && process.env.NODE_ENV != 'production') {
                wxAuthUrl = 'http://erikdeleye.focus-base.com/get-weixin-code.html'
              }
              window.location.href =
                wxAuthUrl + "?appid=" +
                // info.appId +
                // "wx24eaa80f0d8a4bd0" + // 测试公众号
                "wxad793ae28ac228a1" + // 乐业卡公众号
                "&redirect_uri=" +
                encodeURIComponent(window.location.origin + "/index") +
                "&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
            }
          }
        } else {
          // if (state.openid) {
          //   resolve()
          // } else {

          // }
          // alert('请在微信中打开')
          resolve()
        }
      })
    },
    getUserInfo ({ commit, state }) { // 获取个人信息
      if (!state.openid && !state.userId) return false
      return new Promise((resolve, reject) => {
        $http
          .post("/Focus-BladeX-BootX/cuserinfo/login", {}, { emulateJSON: false })
          .then(res => {
            if (res.code == "200" && res.data) {
              commit("updateUserInfo", res.data || {});
              commit("updatePhone", res.data.phone || '');
              commit("updateUserId", res.data.id || '');
              commit("updateCartCount", res.data.shoppingCartCount || '');
              resolve()
            } else {
              reject(res.msg)
            }
          })
          .catch((err) => {
            reject(err)
          });
      })
    }
  }
})
