<template>
  <div class="login-account-page">
    <yd-navbar title="" height="0.84rem">
        <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
          <yd-navbar-back-icon></yd-navbar-back-icon>
        </div>
        <router-link to="#" slot="right" style="color:#333333;font-size: 0.32rem;">
          <!-- 注册 -->
        </router-link>
    </yd-navbar>
    <div class="content">
      <div class="title">设置密码</div>
      <div class="input-form">
        <yd-cell-group>
          <yd-cell-item>
            <yd-input slot="right" type="password" v-model="password" placeholder="请输入新密码"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <yd-input slot="right" type="password" v-model="password2" placeholder="请再次输入新密码"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <div class="pd-wrap" :data-in="canLogin">
        <yd-button size="large" type="primary" v-if="canLogin" @click.native="goNext" :loading="loading">确定</yd-button>
        <yd-button size="large" type="disabled" disabled v-else>确定</yd-button>
      </div>
      <div class="pd-wrap other-menu flex flex-main-justify">
        <!-- <router-link to="/login-sms-step1">使用验证码登录</router-link>
        <router-link to="/forget-password-step1">忘记密码</router-link> -->
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
      password2: "",
      loading: false
    };
  },
  created() {},
  computed: {
    canLogin() {
      return Boolean(
        this.password && this.password2 && this.password == this.password2
      );
    }
  },
  methods: {
    goNext() {
      this.loading = true;
      let param = {
        phone: this.$store.state.inputPhone,
        newPassword: this.password2
      };
      this.$http
        .post("/focus.updatePassword", param)
        .then(res => {
          console.log(res);
          this.loading = false;
          this.$dialog.toast({
            mes: "密码设置成功",
            timeout: 1500,
            callback: () => {
              // sessionStorage.setItem('from', 'amendPSD');
              this.GO(-3);
            }
          });
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
      margin-top: 4.2rem;
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
