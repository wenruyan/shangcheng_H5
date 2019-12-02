<template>
  <div class="login-account-page">
    <yd-navbar title="" height="0.84rem">
        <!-- <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
          <i class="fa fa-close" style="color: #999999;font-size:0.28rem;padding-right: 0.5rem;"></i>
        </div> -->
        <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </div>
        <router-link to="/register?history=-2" slot="right" style="color:#333333;font-size: 0.32rem;">
          注册
        </router-link>
    </yd-navbar>
    <div class="content">
      <div class="title">登录</div>
      <div class="input-form">
        <yd-cell-group>
          <yd-cell-item>
            <yd-input slot="right" regex="mobile" type="tel" :show-error-icon="false" :show-success-icon="false" v-model="phone" max="11" placeholder="请输入手机号"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <yd-input slot="right" type="password" v-model="password" placeholder="请输入登录密码"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <div class="pd-wrap" :data-in="canLogin">
        <yd-button size="large" type="primary" v-if="canLogin" :loading="loading" @click.native="goNext">登录</yd-button>
        <yd-button size="large" type="disabled" disabled v-else>登录</yd-button>
      </div>
      <div class="pd-wrap other-menu flex flex-main-justify">
        <router-link to="/login-sms-step1">使用验证码登录</router-link>
        <router-link to="/forget-password-step1">忘记密码</router-link>
      </div>
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
      password: "",
      loading: false
    };
  },
  created() {},
  computed: {
    canLogin() {
      return Boolean(this.regMobile(this.phone) && this.password);
    }
  },
  mounted() {
    window.onpopstate = () => {
      if (sessionStorage.getItem("from")) {
        sessionStorage.setItem("from", "");
        // this.$store.commit("updateUserId", "");
        // this.$store.commit("updateToken", "");
        this.REPLACE("/index");
      }
    };
  },
  methods: {
    login() {
      this.changeStatusColor("ligth", "#ff76aa");
    },
    goNext() {
      let param = {
        phone: this.phone,
        loginType: "0",
        loginpwd: this.password
      };
      this.$http
        .post("/focus.appLogin", param)
        .then(res => {
          console.log(res);
          if (res.msg == "登录失败: phone 不存在") {
            this.loading = false;
            this.$dialog.toast({
              mes: "该手机未注册",
              timeout: 1500,
              callback: () => {
                // this.GO(-1);
              }
            });
          } else if (res.msg == "登录失败: phone or loginpwd is Incorrect") {
            this.loading = false;
            this.$dialog.toast({
              mes: "手机号或密码错误",
              timeout: 1500,
              callback: () => {
                // this.GO(-1);
              }
            });
          } else if (res.msg == "登录失败: 用户没有设置密码") {
            this.loading = false;
            this.$dialog.toast({
              mes: "用户没有设置密码",
              timeout: 1500,
              callback: () => {
                // this.GO(-1);
              }
            });
          } else if (res.code == 200) {
            this.loading = false;
            this.$dialog.toast({
              mes: "登录成功",
              timeout: 1500,
              callback: () => {
                this.GO(-1);
                // this.REPLACE({
                //   path: "/index"
                //   // query: {
                //   //   id: item.goodsId
                //   // }
                // });
              }
            });
            this.$store.commit(
              "updateUserId",
              res.program_user_info_id.toString()
            );
            this.$store.commit("updateToken", res.token);
            this.$http
              .post("/focus.mallPageData", { userId: this.$store.state.userId })
              .then(res => {
                console.log("res", res);
                this.$store.commit("mallPageData", res);
              })
              .catch(err => {
                console.log("err", err);
              });
          } else {
            this.loading = false;
            this.$dialog.toast({
              mes: "登录失败",
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
};
</script>

<style lang="scss">
.login-account-page {
  width: 100%;
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
      margin-top: 3.8rem;
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
