<template>
  <div class="page login-sms-page">
    <yd-navbar title="登录" height="0.84rem">
      <div class="flex flex-cross-center" slot="left" @click="GO(-1)">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
      <!-- <router-link to="#" slot="right" style="color:#333333;font-size: 0.32rem;">
          注册
      </router-link>-->
    </yd-navbar>
    <div class="content">
      <img src="../../assets/img/fully_box_icon.png" alt class="logo" />
      <div class="input-form">
        <yd-cell-group>
          <yd-cell-item>
            <div class="input-wrap" slot="right">
              <yd-input
                slot="right"
                regex="mobile"
                type="tel"
                :show-error-icon="false"
                :show-success-icon="false"
                v-model="phone"
                max="11"
                placeholder="请输入手机号"
              ></yd-input>
            </div>
          </yd-cell-item>
          <yd-cell-item style="margin-top: 0.1rem;">
            <div class="input-wrap flex flex-main-justify flex-cross-center" slot="right">
              <input type="text" slot="right" v-model="code" placeholder="请输入验证码" />
              <yd-sendcode slot="right" v-model="canGetCode" @click.native="getCode" init-str="获取验证码"></yd-sendcode>
            </div>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <div class="btn-wrap">
        <yd-button
          size="large"
          type="primary"
          :disabled="!canLogin"
          :loading="loading"
          @click.native="goNext"
        >登录</yd-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: "",
      code: "",
      loading: false,
      canGetCode: false,
      phone: ""
    };
  },
  created() {},
  mounted() {
    this.time = 60;
    // this.getCode();
  },
  computed: {
    canLogin () {
      return this.phone.length == 11 && this.code.length >= 4
    }
  },
  watch: {
  },
  methods: {
    goNext() {
      this.$dialog.loading.open("正在登录……");
      let param = {
        phone: this.phone,
        vCode: this.code
      };
      this.$http
        .post("/Focus-BladeX-BootX/cuserinfo/phone/binding", param, { emulateJSON: false })
        .then(res => {
          console.log(res);
          this.$dialog.loading.close();
          this.$store.commit("updateUserId", res.data.userId || '');
          this.$dialog.toast({
            mes: "登录成功",
            timeout: 1500,
            callback: () => {
              this.PUSH({ path: "/index" });
            }
          });
        })
        .catch(err => {
          console.log("err", err);
          this.$dialog.loading.close();
        });
    },
    getCode() {
      if (!this.regMobile(this.phone)) {
        this.$dialog.toast({
          mes: "请输入正确的手机号",
          timeout: 1500,
          callback: () => {}
        });
        return false
      }
      this.$dialog.loading.open('发送中...');
      // this.canGetCode = false;
      // this.time = 60;
      let param = {
        phone: this.phone
      };
      this.$http
        .get("/Focus-BladeX-BootX/cuserinfo/getvcode", param)
        .then(res => {
          this.$dialog.loading.close();
          this.time = 60;
          this.canGetCode = true;
          console.log(res);
        })
        .catch(err => {
          this.$dialog.loading.close();
          console.log("err", err);
        });
    },
    sendCode1() {
      this.$dialog.loading.open('发送中...');
      setTimeout(() => {
        this.canGetCode = true;
        this.$dialog.loading.close();

        this.$dialog.toast({
          mes: '已发送',
          icon: 'success',
          timeout: 1500
        });
      }, 1000);
    }
  }
};
</script>

<style lang="scss">
.login-sms-page {
  width: 100%;
  .yd-navbar .yd-navbar-center .yd-navbar-center-title {
    font-size: 0.32rem!important;
    font-weight: 400!important;
  }
  .content {
    .logo {
      width: 1.42rem;
      height: 1.96rem;
      display: block;
      padding-top: 1.12rem;
      margin: 0 auto 1rem;
      box-sizing: content-box;
    }
    .input-wrap {
      width: 6.1rem;
      height: 0.88rem;
      margin: 0 auto;
      border-bottom: 1px solid #E1E1E1;
      padding-left: 0;
      .yd-input {
        border: none;
        padding-left: 0;
      }
      .yd-btn {
        width: 2rem;
        height: 0.74rem;
        line-height: 0.74rem;
        position: relative;
        border-radius: 1rem;
      }
      .yd-btn {
        color: #ffffff;
        background: #1391F9;
        span {
          font-size: 0.26rem!important;
        }
      }
      .yd-btn-disabled {
        color: #ffffff;
        background-color: #DCDCDC;
        font-size: 0.26rem;
      }
    }
    .btn-wrap {
      width: 6.1rem;
      height: 0.88rem;
      margin: 1rem auto 0;
      button {
        border-radius: 1rem;
        font-size: 0.32rem;
        background-color: #1391F9;
        &.yd-btn-disabled {
          opacity: 0.4;
          // background: #068DF9;
        }
      }
    }
  }
}
</style>
