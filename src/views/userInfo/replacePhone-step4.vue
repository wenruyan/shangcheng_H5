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
<div class="title">输入验证码</div>
<div class="title-2 pd-wrap">验证码已发送至{{$store.state.inputPhone}}</div>
<div class="input-form">
<yd-cell-group>
<yd-cell-item>
<yd-input slot="right" regex="mobile" autofocus="autofocus" :show-error-icon="false" :show-success-icon="false" v-model="smsCode" max="11" placeholder="请输入验证码"></yd-input>
</yd-cell-item>
</yd-cell-group>
</div>
<div class="pd-wrap other-menu flex flex-main-justify">
<span class="f-color" @click="getCode" v-if="canGetCode">重新获取验证码</span>
<span v-else>{{time}}s后重新发送</span>
</div>
</div>
</div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: "",
      smsCode: "",
      loading: false,
      canGetCode: false,
      time: 0
    };
  },
  created() {},
  mounted() {
    this.time = 60;
    // this.getCode();
  },
  computed: {},
  watch: {
    smsCode() {
      // console.log(this.smsCode)
      if (this.smsCode.length == 4) {
        this.goNext();
      }
    },
    time() {
      if (this.time > 0) {
        setTimeout(() => {
          this.time--;
        }, 1000);
      } else {
        this.canGetCode = true;
      }
    }
  },
  methods: {
    goNext() {
      this.$dialog.loading.open("正在验证……");
      let param = {
        newPhone: this.$store.state.inputPhone,
        userId: this.$store.state.userId,
        vCode: this.smsCode
      };
      this.$http
        .post("/focus.changePhone", param)
        .then(res => {
          console.log(res);
          console.log(JSON.parse(res));
          if (JSON.parse(res).success == false) {
            this.loading = false;
            this.$dialog.toast({
              mes: "验证码填写错误",
              timeout: 1500,
              callback: () => {
                this.$dialog.loading.close();
              }
            });
          } else if (JSON.parse(res).message == "新手机号已注册") {
            this.loading = false;
            this.$dialog.toast({
              mes: "新手机号已被注册",
              timeout: 1500,
              callback: () => {
                // this.GO(-1);
              }
            });
          } else {
            this.loading = false;
            this.$dialog.toast({
              mes: "手机号码修改成功",
              timeout: 1500,
              callback: () => {
                this.$dialog.loading.close();
                this.PUSH({ path: "/login-account" });
              }
            });
          }
        })
        .catch(err => {
          console.log("err", err);
        });
    },
    getCode() {
      this.canGetCode = false;
      this.time = 60;
      let param = {
        phone: this.$store.state.inputPhone,
        isRegister: "changePhone"
      };
      this.$http
        .post("/focus.getPhoneVcode", param)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log("err", err);
        });
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
      padding: 0.36rem 0.4rem 0.3rem;
    }
    .title-2 {
      font-size: 0.26rem;
      color: #666666;
      margin-bottom: 0.76rem;
    }
    .other-menu {
      margin-top: 0.4rem;
      font-size: 0.26rem;
      color: #999999;
    }
  }
}
</style>
