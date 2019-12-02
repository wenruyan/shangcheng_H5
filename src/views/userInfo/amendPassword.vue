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
      <div class="title">修改密码</div>
      <div class="input-form">
        <yd-cell-group>
          <yd-cell-item>
            <yd-input slot="right" type="password" v-model="password" placeholder="请输入旧密码"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <yd-input slot="right" type="password" v-model="password1" placeholder="请输入新密码" :on-blur="phoneBlur"></yd-input>
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
        <span @click="REPLACE({path: '/amend-password-step1'})">使用手机验证码修改</span>
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
      password1: "",
      password2: "",
      loading: false
    };
  },
  created() {},
  computed: {
    canLogin() {
      return Boolean(this.password && this.password1 == this.password2);
    }
  },
  methods: {
    phoneBlur() {
      if (this.password != "") {
        if (!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(this.password1)) {
          setTimeout(() => {
            this.loading = false;
            this.$dialog.toast({
              mes: "密码长度8~16位,至少一个数字,一个字母",
              timeout: 1500
              // callback: () => {
              //   this.GO(this.$route.query.history);
              // }
            });
          }, 800);
        }
      }
    },
    goNext() {
      this.loading = true;
      if (!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)\S{8,16}$/.test(this.password2)) {
        setTimeout(() => {
          this.loading = false;
          this.$dialog.toast({
            mes: "密码长度8~16位,至少一个数字,一个字母",
            timeout: 1000
            // callback: () => {
            //   this.GO(this.$route.query.history);
            // }
          });
        }, 1000);
      } else {
        let param = {
          oldPassword: this.password,
          newPassword: this.password2,
          userId: this.$store.state.userId
        };
        this.$http
          .post("/focus.changePasswordByOldPwd", param)
          .then(res => {
            console.log(res);
            console.log(JSON.parse(res));
            if (JSON.parse(res).success == false) {
              setTimeout(() => {
                this.loading = false;
                this.$dialog.toast({
                  mes: "原密码输入错误",
                  timeout: 1000,
                  callback: () => {
                    // this.GO(-3);
                  }
                });
              }, 1000);
            } else {
              setTimeout(() => {
                this.loading = false;
                this.$dialog.toast({
                  mes: "密码设置成功",
                  timeout: 1000,
                  callback: () => {
                    sessionStorage.setItem('from', 'amendPSD');
                    this.PUSH({
                      path: "/login-account"
                    });
                  }
                });
              }, 1000);
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
