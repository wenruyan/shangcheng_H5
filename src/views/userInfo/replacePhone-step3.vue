<template>
  <div class="login-sms-page">
    <yd-navbar title="" height="0.84rem">
        <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </div>
        <router-link to="#" slot="right" style="color:#333333;font-size: 0.32rem;">
          <!-- 注册 -->
        </router-link>
    </yd-navbar>
    <div class="content">
      <div class="title">手机号</div>
      <div class="input-form">
        <yd-cell-group>
          <yd-cell-item>
            <yd-input slot="right" regex="mobile" :show-error-icon="false" :show-success-icon="false" v-model="phone" max="11" placeholder="请输入新手机"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <div class="pd-wrap" :data-in="canLogin">
        <yd-button size="large" type="primary" v-if="canLogin" :loading="loading" @click.native="goNext">获取验证码</yd-button>
        <yd-button size="large" type="disabled" disabled v-else>获取验证码</yd-button>
      </div>
      <div class="pd-wrap other-menu flex flex-main-justify">
        <!-- <span @click="GO(-1)">使用密码登录</span> -->
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
      password: "",
      loading: false
    };
  },
  created() {},
  mounted() {
    console.log(this.$store.state.inputPhone, 'yyyyy')
    console.log(this.phone, 'ttt')
  },
  computed: {
    canLogin() {
      return this.regMobile(this.phone);
    }
  },
  methods: {
    goNext() {
      if (!this.loading) {
        if (this.$store.state.inputPhone == this.phone) {
          this.$dialog.toast({
            mes: "输入的手机号码是当前登录账户,请重新输入!",
            timeout: 1500,
            callback: () => {}
          });
        } else {
          this.loading = true;
          let param = {
            phone: this.phone,
            isRegister: "changePhone"
          };
          this.$http
            .post("/focus.getPhoneVcode", param)
            .then(res => {
              console.log(res);
              if (res.message == "新手机号已注册") {
                this.loading = false;
                this.$dialog.toast({
                  mes: "该手机号已注册!",
                  timeout: 1500,
                  callback: () => {}
                });
              } else if (res.message == "请稍后重试") {
                this.$dialog.toast({
                  mes: "请稍后重试!",
                  timeout: 1500,
                  callback: () => {}
                });
              } else {
                this.$store.commit("updateInputPhone", this.phone);
                this.PUSH({ path: "/replace-phone-step4" });
              }
            })
            .catch(err => {
              console.log("err", err);
            });
        }
      }

      // if (!this.loading) {
      //   this.$store.commit('updateInputPhone', this.phone)
      //   this.loading = true
      //   setTimeout(() => {
      //     this.loading = false
      //     this.PUSH({ path: '/replace-phone-step4' })
      //   }, 2000)
      // }
    }
  }
};
</script>

<style lang="scss">
.login-sms-page {
  .content {
    .title {
      font-size: 0.54rem;
      font-weight: bold;
      box-sizing: border-box;
      padding: 0.36rem 0.4rem 1.3rem;
    }
    .yd-btn-block {
      margin-top: 1rem;
    }
    .other-menu {
      margin-top: 0.33rem;
      font-size: 0.28rem;
    }
    .bottom-tips {
      margin-top: 5.4rem;
      font-size: 0.3rem;
      transform: scale(0.67);
      transform-origin: bottom;
      color: #999999;
      p:last-child {
        margin-top: 0.2rem;
      }
    }
  }
}
</style>
