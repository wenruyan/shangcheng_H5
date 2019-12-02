import store from '../store/index'
import vue from '../main'
const mixin = {
  data() {
    return {

    }
  },
  computed: {
    test1: () => 123,
    isLogin: () => {
      return !!store.state.openid && !!store.state.userId && !!store.state.phone
    },
    hasCompany: () => {
      return !!store.state.companyInfo.companyNo
    },
    userInfo: () => {
      return store.state.userInfo
    }
  },
  methods: {
    /**
     * 格式化时间
     * @param {string|number|object|Array} dateTime - 时间，可以是一个字符串、时间戳、表示时间的对象、Date对象或者******表示时间的数组
     * @param {string} [fmt] - 格式
     * @returns {string} 返回格式化后的日期时间，默认格式：2018年1月11日 15:00
     * @see [momentjs]{@tutorial http://momentjs.cn/}
     */
    formatDate(dateTime, fmt = 'YYYY年M月DD日 HH:mm:ss') {
      if (!dateTime) {
        return ''
      }
      return dateTime
    },
    PUSH(data) {
      vue.$router.push(data)
    },
    REPLACE(data) {
      vue.$router.replace(data);
    },
    GO(data) {
      vue.$router.isBack = true
      vue.$router.go(data)
    },
    loginOut() {
      localStorage.removeItem('userInfo')
      this.REPLACE({
        name: 'login'
      })
    },
    typeStringToArry(string) {
      // 将两头有[]的字符串转为数组
      if (string && typeof string == 'string' && string.substr(0, 1) == '[' && string.substr(string.length - 1, 1) == ']') {
        if (string.substr(1, string.length - 2) != '') {
          string = string.substr(1, string.length - 2).split(',').map((item) => {
            if ((item.substr(0, 1) == "'" && item.substr(item.length - 1, 1) == "'") || (item.substr(0, 1) == '"' && item.substr(item.length - 1, 1) == '"')) {
              return item.substr(1, item.length - 2)
            }
            return item
          })
        } else {
          string = []
        }
        return string
      } else if (typeof string == 'object' && string != null) {
        return string
      }
      return []
    },
    decodeURL(url) {
      return decodeURIComponent(url)
    },
    encodeURL(url) {
      return encodeURIComponent(url)
    },
    getUrlFileName(fileUrl) {
      let str = fileUrl;
      str = str.substring(str.lastIndexOf("/") + 1);
      str = str.substring(0, str.lastIndexOf("."));
      return str;
    },
    changeStatusColor(val1, val2) {
      if (window.api) {
        if (val2) {
          window.api.sendEvent({
            name: 'changeStatusBarColor',
            extra: {
              color: val1, // light/dark
              bgColor: val2
            }
          });
        } else if (val1) {
          if (['dark', 'light'].indexOf(val1) > -1) {
            window.api.sendEvent({
              name: 'changeStatusBarColor',
              extra: {
                color: val1
              }
            });
          } else {
            window.api.sendEvent({
              name: 'changeStatusBarColor',
              extra: {
                bgColor: val1
              }
            });
          }
        }
      } else {
        console.log('app未初始化完成')
        return false
      }
    },
    changeNumUnit(num) {
      // 将数字转换为万单位
      if (num > 9999) {
        num = Math.round(num / 10000) + '万';
      }
      return num
    },
    // 手机号校验
    regMobile(mobile) {
      let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      return reg.test(mobile)
    },
    regHttp(str) {
      return str.substr(0, 4) == 'http'
    },
    /**
     * 将一串字符中的一部分加密成*号
     * @param {*} num 待加密字符
     * @param {*} startL  前面显示的明文长度
     * @param {*} endL  后面显示的明文长度
     */
    hideNumber(num, startL, endL) {
      num = num.toString()
      if (startL + endL > num.length) {
        return num
      } else if (startL + endL == num.length) {
        let s = ''
        for (let i = 0; i < num.length; i++) {
          s += '*'
        }
        return s
      } else {
        let s = ''
        let sS = num.substr(0, startL)
        let eS = num.substr(-endL, endL)
        for (let i = 0; i < num.length - startL - endL; i++) {
          s += '*'
        }
        return sS + s + eS
      }
    },
    hidePhone(num) { // 用hideNumber方法处理手机号
      return this.hideNumber(num || '', 3, 4)
    },
    // 三位分节法
    formatNum(str) {
      let newStr = "";
      let count = 0;
      for (let i = str.length - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0) {
          newStr = str.charAt(i) + "," + newStr;
        } else {
          newStr = str.charAt(i) + newStr;
        }
        count++;
      }
      return newStr
    },
    toMiniProgram(info = {}, cb) { // 跳转到小程序
      // let that = this;
      if (window.api) {
        let wx = window.api.require("wx");
        wx.isInstalled(function (ret, err) {
          if (ret.installed) {
            wx.launchMiniProgram({
              miniProgramType: "release", // test：开发版 preview：体验版 release：正式版
              userName: "gh_6d4938e83d8e",
              path: "/pages/index/index",
              ...info
            },
            function (ret, err) {
              cb && cb(ret, err)
              if (ret.eventType == "back") {
                // that.$dialog.toast({
                //   mes: "步数更新成功",
                //   timeout: 1500
                // });
              } else {
                // alert(err.code);
              }
            }
            );
          } else {
            alert("当前设备未安装微信客户端");
          }
        });
      } else {
        this.$dialog.toast({
          mes: "请在APP中打开",
          timeout: 1500,
          callback: () => {}
        });
      }
    },
    customBackKey(cb) {
      window.customKeyBackEvent = true
      window.onCustomKeyBackEvent = () => {
        cb()
      }
    },
    cancleCustomBackKey() {
      window.customKeyBackEvent = false
      window.onCustomKeyBackEvent = () => {
        // cb()
      }
    },
    replaceData(data) { // 斜杠转成-
      return data.replace(/\//g, '-')
    },
    toThirdPath(url) {
      url && (window.location.href = url)
    },
    // 支付
    pay(param, cb) {
      this.$http
        .post("/Focus-BladeX-BootX/wxpay/pay", param, { emulateJSON: false })
        .then(res => {
          console.log(res, "支付");
          if (res.code == 200) {
            let data = res.data;
            if (data.isCash) {
              // 调起微信支付
              window.WeixinJSBridge.invoke(
                "getBrandWCPayRequest", {
                  appId: data.orderResult.appId, // 公众号名称，由商户传入
                  timeStamp: data.orderResult.timeStamp, // 时间戳，自1970年以来的秒数
                  nonceStr: data.orderResult.nonceStr, // 随机串
                  package: data.orderResult.packageValue,
                  signType: data.orderResult.signType, // 微信签名方式：
                  paySign: data.orderResult.paySign // 微信签名
                },
                response => {
                  cb && cb(data, response);
                  this.$http
                    .post("/Focus-BladeX-BootX/wxpay/order", {
                      orderId: data.orderId
                    }, { emulateJSON: false }).then(res => {
                      console.log(res, '支付结果');
                      this.REPLACE({
                        path: "/order-detail",
                        query: { orderId: data.id }
                      });
                    })
                }
              );
            } else {
              this.REPLACE({
                path: "/order-detail",
                query: { orderId: data.id }
              });
            }
          } else {
            this.$dialog.toast({
              mes: "支付失败",
              timeout: 1500
            });
          }
        });
    },
    checkLogin () {
      return new Promise((resolve, reject) => {
        if (this.isLogin) {
          resolve()
        } else {
          this.$dialog.confirm({
            title: "提示",
            mes: "您还未登录，请先登录",
            opts: [
              {
                txt: "登录",
                color: true,
                callback: () => {
                  this.$emit("selectSku", {
                    hideType: '10'
                  });
                  this.PUSH({ path: "/login-sms" });
                }
              },
              {
                txt: "取消",
                color: false,
                callback: () => {

                }
              }
            ]
          });
          reject(new Error('未登录'))
        }
      })
    }
  }
}
export default mixin
