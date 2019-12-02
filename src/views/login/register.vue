<template>
  <div class="register-page">
    <yd-navbar title="" height="0.84rem">
        <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </div>
        <div @click="GO(-1)" slot="right" style="color:#333333;font-size: 0.32rem;">
          登录
        </div>
    </yd-navbar>
    <div class="content">
      <div class="title">注册</div>
      <div class="input-form">
        <yd-cell-group>
          <yd-cell-item>
            <yd-input slot="right" regex="mobile" :show-error-icon="false" :show-success-icon="false" v-model="phone" max="11" placeholder="请输入手机号"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <yd-input slot="right" :show-error-icon="false" :show-success-icon="false" v-model="smsCode" placeholder="请输入验证码"></yd-input>
            <div class="code-wrap" slot="right">
              <yd-sendcode
                v-model="canGetCode"
                init-str="短信验证码"
                run-str="{%s}s"
                reset-str="重新获取"
                @click.native="getCode"
                type="warning"
              ></yd-sendcode>
            </div>
          </yd-cell-item>
          <yd-cell-item>
            <yd-input slot="right" type="password" v-model="password" placeholder="请输入密码" :on-focus="phoneFocus" :on-blur="phoneBlur"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <yd-input slot="right" type="password" v-model="password2" placeholder="请再次输入密码"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <div class="pd-wrap" :data-in="canLogin">
        <yd-button size="large" type="primary" v-if="canLogin" :loading="loading" @click.native="goNext">注册</yd-button>
        <yd-button size="large" type="disabled" disabled v-else>注册</yd-button>
      </div>
      <!-- <div class="pd-wrap other-menu flex flex-main-justify">
        <router-link to="/login-sms-step1">使用验证码登录</router-link>
        <router-link to="/forget-password-step1">忘记密码</router-link>
      </div> -->
      <div class="bottom-tips t-c" @click="PUSH({path: '/protocol'})">
        <p>新用户首次登录或注册赞积分将视为已阅读并同意</p>
        <p class="f-color">《用户使用条款和隐私说明》</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: "",
      phone: "",
      smsCode: "",
      password: "",
      password2: "",
      loading: false,
      canGetCode: false,
      time: 0
    };
  },
  mounted() {},
  created() {},
  computed: {
    canLogin() {
      return Boolean(
        this.regMobile(this.phone) &&
          this.password &&
          this.password == this.password2 &&
          this.smsCode
      );
    }
  },
  watch: {
    // phone: function(value, old) {
    //   console.log(value);
    //   // console.log(old)
    //   if (/^1\d{10}$/.test(value)) {
    //     setTimeout(() => {
    //       this.loading = false;
    //       this.$dialog.toast({
    //         mes: "手机号格式错误",
    //         timeout: 1500
    //         // callback: () => {
    //         //   this.GO(this.$route.query.history);
    //         // }
    //       });
    //     }, 1000);
    //   }
    // },
    time() {
      if (this.time > 0) {
        setTimeout(() => {
          this.time--;
        }, 1000);
      } else {
        this.canGetCode = false;
      }
    }
  },
  methods: {
    phoneFocus() {
      console.log(1111111);
      console.log(this.password);
      // if(!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,}$/.test(
      //     console.log(false)
      //   )){

      //   }
    },
    phoneBlur() {
      if (this.password != "") {
        if (!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(this.password)) {
          setTimeout(() => {
            this.loading = false;
            this.$dialog.toast({
              mes: "密码长度8~16位,至少一个数字,一个字母",
              timeout: 1500
              // callback: () => {
              //   this.GO(this.$route.query.history);
              // }
            });
          }, 1000);
        }
      }
    },
    login() {
      this.changeStatusColor("ligth", "#ff76aa");
    },
    goNext() {
      this.loading = true;
      if (!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(this.password)) {
        setTimeout(() => {
          this.loading = false;
          this.$dialog.toast({
            mes: "密码长度8~16位,至少一个数字,一个字母",
            timeout: 1500
            // callback: () => {
            //   this.GO(this.$route.query.history);
            // }
          });
        }, 1000);
      } else {
        let param = {
          phone: this.phone,
          vCode: this.smsCode,
          loginpwd: this.password,
          cloginpwd: this.password2
        };
        this.$http
          .post("/focus.appRegister", param)
          .then(res => {
            if (res.msg == "注册失败: phone 已经注册") {
              setTimeout(() => {
                this.loading = false;
                this.$dialog.toast({
                  mes: "注册成功失败,手机号已被注册",
                  timeout: 1500
                  // callback: () => {
                  //   this.GO(this.$route.query.history);
                  // }
                });
              }, 1000);
            } else if (res.msg == "注册失败: 验证码不匹配") {
              setTimeout(() => {
                this.loading = false;
                this.$dialog.toast({
                  mes: "验证码填写错误",
                  timeout: 1500
                  // callback: () => {
                  //   this.GO(this.$route.query.history);
                  // }
                });
              }, 1000);
            } else {
              setTimeout(() => {
                this.loading = false;
                this.$dialog.toast({
                  mes: "注册成功",
                  timeout: 1500,
                  callback: () => {
                    // this.$store.commit('updateInputPhone',this.phone )
                    // this.GO(this.$route.query.history);
                    // this.REPLACE({ path: "/login-account" });
                    this.REPLACE({ path: "/index" });
                  }
                });
              }, 1000);
              this.$store.commit(
                "updateUserId",
                res.program_user_info_id.toString()
              );
              this.$store.commit("updateToken", res.token);
            }
          })
          .catch(err => {
            console.log("err", err);
          });
      }
    },
    getCode() {
      if (this.phone == "") {
        setTimeout(() => {
          this.loading = false;
          this.$dialog.toast({
            mes: "请输入手机号",
            timeout: 1500
            // callback: () => {
            //   this.GO(this.$route.query.history);
            // }
          });
        }, 1000);
      } else if (!this.regMobile(this.phone)) {
        setTimeout(() => {
          this.loading = false;
          this.$dialog.toast({
            mes: "手机号码格式错误，请修改或者重新输入",
            timeout: 1500
            // callback: () => {
            //   this.GO(this.$route.query.history);
            // }
          });
        }, 1000);
      } else {
        this.canGetCode = true;
        this.time = 60;
        let param = {
          phone: this.phone,
          isRegister: "true"
        };
        this.$http
          .post("/focus.getPhoneVcode", param)
          .then(res => {
            console.log("res", res);
            if (res.message == "用户已注册") {
              this.canGetCode = false;
              setTimeout(() => {
                this.loading = false;
                this.$dialog.toast({
                  mes: "手机已注册",
                  timeout: 1500,
                  callback: () => {}
                });
              }, 1500);
            } else if (res.message == "请稍后重试") {
              this.$dialog.toast({
                mes: "请稍后重试!",
                timeout: 1500,
                callback: () => {}
              });
            } else if (res.message == "今天短信次数已达上限，请明天再试") {
              this.$dialog.toast({
                mes: "今天短信次数已达上限，请明天再试!",
                timeout: 1500,
                callback: () => {}
              });
            }
          })
          .catch(err => {
            console.log("err", err);
          });
      }
    }
  }
};
</script>

<style lang="scss">
.register-page {
  width: 100%;
  .content {
    .title {
      font-size: 0.54rem;
      font-weight: bold;
      box-sizing: border-box;
      padding: 0.36rem 0.4rem 0.7rem;
    }
    .yd-btn-block {
      margin-top: 1rem;
    }
    .other-menu {
      margin-top: 0.33rem;
      font-size: 0.28rem;
    }
    .bottom-tips {
      margin-top: 2.6rem;
      font-size: 0.3rem;
      transform: scale(0.67);
      transform-origin: bottom;
      color: #999999;
      p:last-child {
        margin-top: 0.2rem;
      }
    }
    .code-wrap {
      width: 1.7rem;
      height: 100%;
      line-height: 1.2rem;
      position: relative;
      border-bottom: 1px solid #f4f4f4;
      button {
        background-color: #ffffff;
        color: #4189ff;
        font-size: 0.3rem;
        width: 1.3rem;
        &.yd-btn-disabled {
          color: #999999;
        }
      }
      &:after {
        content: "";
        width: 1px;
        height: 0.66rem;
        position: absolute;
        top: 0.24rem;
        left: 0;
        background-color: #e6e6e6;
      }
    }
  }
}
</style>
